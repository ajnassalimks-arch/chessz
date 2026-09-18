import { Chess } from 'chess.js';
import { ChessEngine, EngineEvalResult, EngineProgress } from './types';
import { GameDerivedStats, MoveAnalysis } from '../chessMetrics/types';
import { evalToWinPct, calculateWinPctLost, getJudgment, calculateAccuracy } from '../chessMetrics/math';

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

    return new Promise((resolve) => {
      try {
        const wasmSupported =
          typeof WebAssembly === 'object' &&
          typeof WebAssembly.validate === 'function' &&
          WebAssembly.validate(
            Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
          );

        const workerPath = wasmSupported
          ? '/stockfish/stockfish.wasm.js'
          : '/stockfish/stockfish.js';

        this.worker = new Worker(workerPath);

        this.worker.onmessage = (e: MessageEvent) => {
          const line = typeof e.data === 'string' ? e.data : '';

          if (line.includes('uciok')) {
            this.worker?.postMessage('isready');
          } else if (line.includes('readyok')) {
            this.ready = true;
            resolve(true);
          } else if (line.startsWith('info') && line.includes('score')) {
            this.handleInfoLine(line);
          } else if (line.startsWith('bestmove')) {
            this.handleBestMoveLine(line);
          }
        };

        this.worker.onerror = () => {
          resolve(false);
        };

        this.worker.postMessage('uci');
      } catch {
        resolve(false);
      }
    });
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
      this.activeResolver = { seq, resolve };

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
    allowAllOnMobile?: boolean;
    signal?: AbortSignal;
  } = {}
): Promise<GameDerivedStats[]> {
  const engine = options.engine || new BrowserStockfishEngine();
  await engine.init();

  const isLowEnd = isMobileOrLowEndDevice();
  // Low-end mobile phones throttle to max 5 games per batch
  const maxToAnalyze = isLowEnd && !options.allowAllOnMobile ? 5 : games.length;
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

    // Check localStorage checkpoint
    const checkpointKey = `chessz_engine_ckpt_${game.gameId}`;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(checkpointKey);
      if (saved) {
        try {
          const cachedGame = JSON.parse(saved);
          updatedGames[gameIdx] = cachedGame;
          continue;
        } catch {}
      }
    }

    // Replay moves to extract FEN for each ply
    const chess = new Chess();
    const positions: { fen: string; ply: number; san: string }[] = [];

    for (const m of game.moves) {
      try {
        chess.move(m.san);
        positions.push({ fen: chess.fen(), ply: m.ply, san: m.san });
      } catch {
        break;
      }
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

    const criticalMoments = userMoves
      .filter((m) => m.judgment === 'blunder' || m.judgment === 'mistake' || m.winPctLost >= 15)
      .sort((a, b) => b.winPctLost - a.winPctLost)
      .slice(0, 10)
      .map((m) => ({
        gameId: game.gameId,
        ply: m.ply,
        moveNumber: m.moveNumber,
        san: m.san,
        color: m.color,
        evalBefore: m.evalBefore.mate ? m.evalBefore.mate * 1000 : (m.evalBefore.cp || 0),
        evalAfter: m.evalAfter.mate ? m.evalAfter.mate * 1000 : (m.evalAfter.cp || 0),
        winPctLost: m.winPctLost,
        judgment: m.judgment,
        phase: m.phase,
        clockRemaining: m.clockRemaining,
        timeSpentSeconds: m.timeSpentSeconds,
        deepLink: `https://lichess.org/${game.gameId}/${game.color}#${m.ply}`,
      }));

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

    // Checkpoint this game immediately to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(checkpointKey, JSON.stringify(enrichedGame));
      } catch {}
    }
  }

  engine.terminate();

  options.onProgress?.({
    status: 'done',
    currentGame: unanalyzedIndices.length,
    totalGames: unanalyzedIndices.length,
    currentPly: 0,
    totalPliesInGame: 0,
    pass: 2,
    totalNodesEvaluated,
  });

  return updatedGames;
}
