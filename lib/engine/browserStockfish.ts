import { Chess } from 'chess.js';
import { ChessEngine, EngineEvalResult, EngineProgress } from './types';
import { GameDerivedStats, MoveAnalysis, CriticalMoment } from '../chessMetrics/types';
import { evalToWinPct, calculateWinPctLost, getJudgment, calculateAccuracy } from '../chessMetrics/math';
import { saveLibraryGames } from '../gameLibrary';

export class BrowserStockfishEngine implements ChessEngine {
  private worker: Worker | null = null;
  private ready: boolean = false;
  private currentSeq: number = 0;
  private activeResolver: {
    seq: number;
    resolve: (res: EngineEvalResult) => void;
  } | null = null;
  private currentEval: Partial<EngineEvalResult> = {};
  private isSearching: boolean = false;

  async init(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (this.worker && this.ready) return true;

    const startWorker = (path: string): Promise<boolean> => {
      return new Promise((resolve) => {
        try {
          const w = new Worker(path);
          let resolved = false;

          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              try {
                w.terminate();
              } catch {}
              resolve(false);
            }
          }, 2500);

          w.onmessage = (e: MessageEvent) => {
            const line = typeof e.data === 'string' ? e.data : '';

            if (line.includes('uciok')) {
              w.postMessage('isready');
            } else if (line.includes('readyok')) {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeout);
                this.worker = w;
                this.ready = true;
                w.onmessage = (ev: MessageEvent) => {
                  const l = typeof ev.data === 'string' ? ev.data : '';
                  if (l.startsWith('info') && l.includes('score')) {
                    this.handleInfoLine(l);
                  } else if (l.startsWith('bestmove')) {
                    this.handleBestMoveLine(l);
                  }
                };
                resolve(true);
              }
            }
          };

          w.onerror = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              try {
                w.terminate();
              } catch {}
              resolve(false);
            }
          };

          w.postMessage('uci');
        } catch {
          resolve(false);
        }
      });
    };

    const wasmSupported =
      typeof WebAssembly === 'object' &&
      typeof WebAssembly.validate === 'function' &&
      WebAssembly.validate(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      );

    if (wasmSupported) {
      const ok = await startWorker('/stockfish/stockfish.wasm.js');
      if (ok) return true;
    }

    const fallbackOk = await startWorker('/stockfish/stockfish.js');
    return fallbackOk;
  }

  private handleInfoLine(line: string) {
    if (!this.isSearching) return;
    const cpMatch = line.match(/\bscore cp (-?\d+)\b/);
    const mateMatch = line.match(/\bscore mate (-?\d+)\b/);
    const depthMatch = line.match(/\bdepth (\d+)\b/);
    const nodesMatch = line.match(/\bnodes (\d+)\b/);

    if (cpMatch) {
      this.currentEval.cp = parseInt(cpMatch[1], 10);
      delete this.currentEval.mate;
    } else if (mateMatch) {
      this.currentEval.mate = parseInt(mateMatch[1], 10);
      delete this.currentEval.cp;
    }

    if (depthMatch) {
      this.currentEval.depth = parseInt(depthMatch[1], 10);
    }
    if (nodesMatch) {
      this.currentEval.nodes = parseInt(nodesMatch[1], 10);
    }
  }

  private handleBestMoveLine(line: string) {
    this.isSearching = false;
    const parts = line.split(/\s+/);
    const uci = parts[1];

    if (this.activeResolver) {
      const { resolve } = this.activeResolver;
      this.activeResolver = null;
      resolve({
        cp: this.currentEval.cp,
        mate: this.currentEval.mate,
        depth: this.currentEval.depth || 0,
        nodes: this.currentEval.nodes || 0,
        bestMove: uci !== '(none)' ? uci : undefined,
      });
    }
  }

  async evaluatePosition(fen: string, nodes: number): Promise<EngineEvalResult> {
    if (!this.worker || !this.ready) {
      const ok = await this.init();
      if (!ok) throw new Error('Failed to initialize Stockfish worker');
    }

    const seq = ++this.currentSeq;

    // If a search is already active, stop it and drain the terminating bestmove
    if (this.isSearching) {
      await new Promise<void>((drainResolve) => {
        if (!this.worker) return drainResolve();
        const prevResolver = this.activeResolver;
        this.activeResolver = {
          seq: -1,
          resolve: () => {
            if (prevResolver) {
              try {
                prevResolver.resolve({ cp: 0, depth: 0, nodes: 0 });
              } catch {}
            }
            drainResolve();
          },
        };
        this.worker.postMessage('stop');
      });
    }

    return new Promise((resolve) => {
      this.isSearching = true;
      this.currentEval = { nodes: 0, depth: 0 };

      const searchTimer = setTimeout(() => {
        if (this.activeResolver?.seq === seq) {
          const { resolve: res } = this.activeResolver;
          const snapshot: EngineEvalResult = {
            cp: this.currentEval.cp || 0,
            mate: this.currentEval.mate,
            depth: this.currentEval.depth || 1,
            nodes: this.currentEval.nodes || 0,
            bestMove: undefined,
          };
          // Answer the caller, but leave isSearching set and ask the worker to
          // stop. The abandoned search is still streaming info lines; keeping
          // the searching flag makes the next evaluatePosition drain its
          // terminating bestmove first, so stale scores can't bleed into the
          // following position's result.
          this.activeResolver = null;
          this.worker?.postMessage('stop');
          res(snapshot);
        }
      }, 5000);

      this.activeResolver = {
        seq,
        resolve: (val) => {
          clearTimeout(searchTimer);
          resolve(val);
        },
      };

      this.worker?.postMessage(`position fen ${fen}`);
      this.worker?.postMessage(`go nodes ${nodes}`);
    });
  }

  terminate() {
    if (this.worker) {
      try {
        this.worker.postMessage('quit');
        this.worker.terminate();
      } catch {}
      this.worker = null;
    }
    this.ready = false;
    this.isSearching = false;
    this.activeResolver = null;
  }

  isReady(): boolean {
    return this.ready;
  }
}

/**
 * Maximum number of games analyzed per batch on low-end / mobile clients.
 * Exported so the UI can state the real cap instead of hardcoding its own number.
 */
export const MOBILE_GAME_BATCH_CAP = 5;

/**
 * Checks if the current client is on a mobile device or low-core machine
 */
export function isMobileOrLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
  return isMobileUserAgent || cores < 4 || memory < 4;
}

/**
 * Analyzes unanalyzed games using two-pass fixed nodes Stockfish:
 * Pass 1: 80k nodes sweep (40k on low-end/mobile)
 * Pass 2: 300k nodes refinement on >15% swing candidates (150k on low-end/mobile)
 * Checkpoints per game to localStorage.
 */
export async function analyzeUnanalyzedGames(
  games: GameDerivedStats[],
  targetUsername: string,
  options: {
    engine?: ChessEngine;
    onProgress?: (p: EngineProgress) => void;
    /**
     * Fired after each game is enriched and checkpointed, so the dashboard can
     * update live instead of waiting for the whole batch to finish.
     */
    onGameAnalyzed?: (games: GameDerivedStats[]) => void;
    allowAllOnMobile?: boolean;
    signal?: AbortSignal;
  } = {}
): Promise<GameDerivedStats[]> {
  const engine = options.engine || new BrowserStockfishEngine();
  await engine.init();

  const isLowEnd = isMobileOrLowEndDevice();
  // Low-end mobile phones throttle to a small batch per run
  const maxToAnalyze = isLowEnd && !options.allowAllOnMobile ? MOBILE_GAME_BATCH_CAP : games.length;
  const pass1Nodes = isLowEnd ? 40000 : 80000;
  const pass2Nodes = isLowEnd ? 150000 : 300000;

  const unanalyzedIndices: number[] = [];
  games.forEach((g, idx) => {
    if (idx < maxToAnalyze && g.evalSource === 'none') {
      unanalyzedIndices.push(idx);
    }
  });

  if (unanalyzedIndices.length === 0) {
    return games;
  }

  const updatedGames = [...games];
  let totalNodesEvaluated = 0;

  for (let u = 0; u < unanalyzedIndices.length; u++) {
    if (options.signal?.aborted) break;

    const gameIdx = unanalyzedIndices[u];
    const game = updatedGames[gameIdx];

    // Resuming an interrupted sweep needs no separate checkpoint store: a
    // finished game is written straight into the library below, and comes back
    // with evalSource 'local', so it is never in unanalyzedIndices again.

    // Replay moves to extract the FEN before and after each ply.
    // fenBefore is the position the player faced, and is what critical moments
    // and their setup steppers must carry so the blunder can be re-trained.
    const chess = new Chess();
    const positions: { fen: string; fenBefore: string; ply: number; san: string }[] = [];

    for (const m of game.moves) {
      const fenBefore = chess.fen();
      try {
        chess.move(m.san);
        positions.push({ fen: chess.fen(), fenBefore, ply: m.ply, san: m.san });
      } catch {
        break;
      }
    }

    const fenBeforeByPly: Record<number, string> = {};
    for (const p of positions) {
      fenBeforeByPly[p.ply] = p.fenBefore;
    }

    const openingPly = game.openingPly || 16;
    const evalsByPly: Record<number, { cp?: number; mate?: number }> = {};
    const candidatesForPass2: number[] = [];

    // --- PASS 1: Sweep with fixed nodes (skipping opening plies) ---
    for (let p = 0; p < positions.length; p++) {
      if (options.signal?.aborted) break;
      const pos = positions[p];

      options.onProgress?.({
        status: 'running',
        currentGame: u + 1,
        totalGames: unanalyzedIndices.length,
        currentPly: p + 1,
        totalPliesInGame: positions.length,
        pass: 1,
        totalNodesEvaluated,
      });

      // Skip theory moves before opening.ply
      if (pos.ply <= openingPly) {
        continue;
      }

      try {
        const res = await engine.evaluatePosition(pos.fen, pass1Nodes);
        totalNodesEvaluated += res.nodes || pass1Nodes;

        // Stockfish returns eval relative to side to move: convert to White perspective
        const isBlack = pos.fen.split(' ')[1] === 'b';
        const whiteCp = res.cp !== undefined ? (isBlack ? -res.cp : res.cp) : undefined;
        const whiteMate = res.mate !== undefined ? (isBlack ? -res.mate : res.mate) : undefined;

        evalsByPly[pos.ply] = { cp: whiteCp, mate: whiteMate };

        // Check if win% swing from previous ply was > 15%
        const prevEval = evalsByPly[pos.ply - 1] || { cp: 15 };
        const winBefore = evalToWinPct(prevEval, pos.ply % 2 === 1 ? 'white' : 'black');
        const winAfter = evalToWinPct({ cp: whiteCp, mate: whiteMate }, pos.ply % 2 === 1 ? 'white' : 'black');
        const winLost = calculateWinPctLost(winBefore, winAfter);

        if (winLost >= 15) {
          candidatesForPass2.push(pos.ply);
        }

        // Macro-task yield to avoid locking UI
        await new Promise((resolve) => setTimeout(resolve, isLowEnd ? 12 : 2));
      } catch {
        // Continue on engine failure for single position
      }
    }

    // --- PASS 2: Deep refinement on candidates ---
    for (const candPly of candidatesForPass2) {
      if (options.signal?.aborted) break;
      const pos = positions.find((item) => item.ply === candPly);
      if (!pos) continue;

      options.onProgress?.({
        status: 'running',
        currentGame: u + 1,
        totalGames: unanalyzedIndices.length,
        currentPly: candPly,
        totalPliesInGame: positions.length,
        pass: 2,
        totalNodesEvaluated,
      });

      try {
        const deepRes = await engine.evaluatePosition(pos.fen, pass2Nodes);
        totalNodesEvaluated += deepRes.nodes || pass2Nodes;

        const isBlack = pos.fen.split(' ')[1] === 'b';
        const whiteCp = deepRes.cp !== undefined ? (isBlack ? -deepRes.cp : deepRes.cp) : undefined;
        const whiteMate = deepRes.mate !== undefined ? (isBlack ? -deepRes.mate : deepRes.mate) : undefined;

        evalsByPly[candPly] = { cp: whiteCp, mate: whiteMate };

        // Macro-task yield to avoid locking UI
        await new Promise((resolve) => setTimeout(resolve, isLowEnd ? 12 : 2));
      } catch {}
    }

    // Update game moves with computed evals
    let lastEval: { cp?: number; mate?: number } = { cp: 15 };
    const updatedMoves: MoveAnalysis[] = game.moves.map((m) => {
      const evalBefore = { ...lastEval };
      const evalAfter = evalsByPly[m.ply] || { ...evalBefore };
      lastEval = { ...evalAfter };

      const winPctBefore = evalToWinPct(evalBefore, m.color);
      const winPctAfter = evalToWinPct(evalAfter, m.color);
      const winPctLost = calculateWinPctLost(winPctBefore, winPctAfter);
      const judgment = getJudgment(winPctLost);
      const accuracy = calculateAccuracy(winPctLost);

      return {
        ...m,
        // Restore the pre-move FEN when it was dropped by the persistence layer,
        // so replay-dependent features survive a reload from cache.
        fen: m.fen || fenBeforeByPly[m.ply],
        evalBefore,
        evalAfter,
        winPctBefore,
        winPctAfter,
        winPctLost,
        judgment,
        accuracy,
      };
    });

    // Recompute game aggregates
    const userMoves = updatedMoves.filter((m) => m.color === game.color);
    let winpctLostOpening = 0;
    let winpctLostMiddlegame = 0;
    let winpctLostEndgame = 0;
    let inaccuracies = 0;
    let mistakes = 0;
    let blunders = 0;

    for (const m of userMoves) {
      if (m.phase === 'opening') winpctLostOpening += m.winPctLost;
      else if (m.phase === 'middlegame') winpctLostMiddlegame += m.winPctLost;
      else if (m.phase === 'endgame') winpctLostEndgame += m.winPctLost;

      if (m.judgment === 'inaccuracy') inaccuracies++;
      else if (m.judgment === 'mistake') mistakes++;
      else if (m.judgment === 'blunder') blunders++;
    }

    const accuracy = userMoves.length > 0
      ? Math.round((userMoves.reduce((acc, m) => acc + m.accuracy, 0) / userMoves.length) * 10) / 10
      : 100;

    // Mate is encoded as ±10000 centipawns, matching deriveGameStats so that
    // locally analyzed games and Lichess-analyzed games stay on one scale.
    const toCp = (e: { cp?: number; mate?: number }) =>
      e.mate !== undefined ? (e.mate >= 0 ? 10000 : -10000) : (e.cp || 0);

    const criticalMoments: CriticalMoment[] = userMoves
      .filter((m) => m.judgment === 'blunder' || m.judgment === 'mistake' || m.winPctLost >= 15)
      .sort((a, b) => b.winPctLost - a.winPctLost)
      .slice(0, 10)
      .map((m) => {
        // Carry the position the blunder was played from, plus the preceding
        // plies, so "Maia Lens" and "Train in Arena" work on engine-analyzed
        // games exactly as they do on Lichess-analyzed ones.
        const fen = m.fen || fenBeforeByPly[m.ply];
        const moveIdx = updatedMoves.findIndex((um) => um.ply === m.ply);
        const setupMoves: CriticalMoment['setupMoves'] = [];
        if (moveIdx !== -1) {
          const pliesBack = Math.min(moveIdx, 6);
          for (let step = moveIdx - pliesBack; step < moveIdx; step++) {
            const um = updatedMoves[step];
            const stepFen = um.fen || fenBeforeByPly[um.ply];
            if (!stepFen) continue;
            const moveNum = Math.ceil(um.ply / 2);
            setupMoves.push({
              ply: um.ply,
              moveNumber: moveNum,
              turnPrefix: um.ply % 2 === 1 ? `${moveNum}.` : `${moveNum}...`,
              san: um.san,
              fen: stepFen,
            });
          }
        }

        return {
          gameId: game.gameId,
          ply: m.ply,
          moveNumber: m.moveNumber,
          san: m.san,
          color: m.color,
          fen,
          setupMoves,
          evalBefore: toCp(m.evalBefore),
          evalAfter: toCp(m.evalAfter),
          winPctLost: m.winPctLost,
          judgment: m.judgment,
          phase: m.phase,
          clockRemaining: m.clockRemaining,
          timeSpentSeconds: m.timeSpentSeconds,
          deepLink: `https://lichess.org/${game.gameId}/${game.color}#${m.ply}`,
        };
      });

    const enrichedGame: GameDerivedStats = {
      ...game,
      accuracy,
      winpctLostOpening: Math.round(winpctLostOpening * 10) / 10,
      winpctLostMiddlegame: Math.round(winpctLostMiddlegame * 10) / 10,
      winpctLostEndgame: Math.round(winpctLostEndgame * 10) / 10,
      inaccuracies,
      mistakes,
      blunders,
      evalSource: 'local',
      engineNodes: totalNodesEvaluated,
      moves: updatedMoves,
      criticalMoments,
    };

    updatedGames[gameIdx] = enrichedGame;

    // Checkpoint immediately: a sweep over a full history can run for a long
    // time, and a reload must not discard the games already evaluated.
    await saveLibraryGames(targetUsername, [enrichedGame]);

    // Publish the partial result so the dashboard reflects each finished game
    // rather than staying frozen until the whole batch completes.
    options.onGameAnalyzed?.([...updatedGames]);
  }

  engine.terminate();

  // An aborted run must not report itself complete: the paused progress bar
  // stays on screen, and a "done" frame would show the final game count as if
  // every game had been evaluated.
  if (!options.signal?.aborted) {
    options.onProgress?.({
      status: 'done',
      currentGame: unanalyzedIndices.length,
      totalGames: unanalyzedIndices.length,
      currentPly: 0,
      totalPliesInGame: 0,
      pass: 2,
      totalNodesEvaluated,
    });
  }

  return updatedGames;
}
