import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import { deriveGameStats, LichessRawGame } from '../lib/chessMetrics/gameParser';
import { analyzeUnanalyzedGames } from '../lib/engine/browserStockfish';
import { momentsToBlunderPuzzles, evalSwingForPlayer } from '../lib/blunderAdapter';
import { ChessEngine, EngineEvalResult } from '../lib/engine/types';
import { CriticalMoment, GameDerivedStats } from '../lib/chessMetrics/types';
import { mergeGames, decideBackfillStep } from '../lib/gameLibrary';

/**
 * These cover the seams rather than the pure functions: parse -> analyse ->
 * adapt -> train. Every defect found in the audit lived here, in the handoffs
 * between modules that each worked correctly on their own.
 */

/** A deterministic stand-in for Stockfish, so the sweep is testable offline. */
class ScriptedEngine implements ChessEngine {
  private evals: Record<string, EngineEvalResult>;
  constructor(evals: Record<string, EngineEvalResult> = {}) {
    this.evals = evals;
  }
  async init() {
    return true;
  }
  async evaluatePosition(fen: string): Promise<EngineEvalResult> {
    const turn = fen.split(' ')[1];
    // Default: a steady small edge for whoever is to move, so no move registers
    // as a mistake unless the script says otherwise.
    return this.evals[fen] ?? { cp: turn === 'w' ? 20 : -20, depth: 12, nodes: 1000 };
  }
  terminate() {}
  isReady() {
    return true;
  }
}

/** Builds a PGN from SAN moves, optionally with [%eval] comments. */
function buildPgn(moves: string[], evals?: (number | undefined)[]): string {
  const chess = new Chess();
  const parts: string[] = [];
  moves.forEach((san, i) => {
    chess.move(san);
    if (i % 2 === 0) parts.push(`${i / 2 + 1}.`);
    parts.push(san);
    const ev = evals?.[i];
    if (ev !== undefined) parts.push(`{ [%eval ${(ev / 100).toFixed(2)}] }`);
  });
  return `[Event "Test"]\n[Site "https://lichess.org/test1234"]\n\n${parts.join(' ')} *`;
}

function makeGame(pgn: string, username = 'tester'): LichessRawGame {
  return {
    id: 'test1234',
    variant: 'standard',
    rated: true,
    speed: 'rapid',
    status: 'resign',
    createdAt: 1_700_000_000_000,
    winner: 'black',
    players: {
      white: { user: { name: username, id: username.toLowerCase() }, rating: 1500 },
      black: { user: { name: 'opponent', id: 'opponent' }, rating: 1520 },
    },
    opening: { eco: 'C50', name: 'Italian Game', ply: 6 },
    clock: { initial: 600, increment: 0 },
    pgn,
  };
}

test('Weakness pipeline seams', async (t) => {
  await t.test('critical moments from a Lichess-analyzed game carry a position and lead-up', () => {
    // White throws the game away on move 4 by hanging the queen.
    const moves = ['e4', 'e5', 'd3', 'Nc6', 'Qh5', 'Nf6', 'Qxf7+', 'Kxf7'];
    const evals = [20, 15, 25, 18, 30, 22, -900, -950];
    const stats = deriveGameStats(makeGame(buildPgn(moves, evals)), 'tester');

    assert.ok(stats, 'expected derived stats');
    assert.equal(stats!.evalSource, 'lichess');
    assert.ok(stats!.criticalMoments.length > 0, 'expected at least one critical moment');

    for (const m of stats!.criticalMoments) {
      assert.ok(m.fen, `moment at ply ${m.ply} has no fen`);
      assert.doesNotThrow(() => new Chess(m.fen!), `moment at ply ${m.ply} has an unplayable fen`);
      assert.ok(Array.isArray(m.setupMoves), `moment at ply ${m.ply} has no setupMoves array`);
    }
  });

  await t.test('setup steppers number black moves correctly', () => {
    const moves = ['e4', 'e5', 'd3', 'Nc6', 'Qh5', 'Nf6', 'Qxf7+', 'Kxf7'];
    const evals = [20, 15, 25, 18, 30, 22, -900, -950];
    const stats = deriveGameStats(makeGame(buildPgn(moves, evals)), 'tester')!;

    for (const m of stats.criticalMoments) {
      for (const step of m.setupMoves ?? []) {
        // ply 1 and 2 are both move 1: floor(ply/2)+1 used to render a pair as
        // "1. e4" followed by "2... e5".
        const expected = Math.ceil(step.ply / 2);
        assert.equal(step.moveNumber, expected, `ply ${step.ply} numbered ${step.moveNumber}`);
        const white = step.ply % 2 === 1;
        assert.equal(step.turnPrefix, white ? `${expected}.` : `${expected}...`);
      }
    }
  });

  await t.test('an engine sweep preserves fen and setupMoves on its moments', async () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'd3', 'd6', 'Bg5', 'h6', 'Bh4', 'g5'];
    // No [%eval] comments, so this arrives as an unanalyzed game.
    const stats = deriveGameStats(makeGame(buildPgn(moves)), 'tester')!;
    assert.equal(stats.evalSource, 'none', 'expected an unanalyzed game');

    // Script a collapse after white's 5th move so the sweep finds a mistake.
    const chess = new Chess();
    const fensAfter: string[] = [];
    for (const san of moves) {
      chess.move(san);
      fensAfter.push(chess.fen());
    }
    const scripted: Record<string, EngineEvalResult> = {};
    fensAfter.slice(8).forEach((fen) => {
      const blackToMove = fen.split(' ')[1] === 'b';
      scripted[fen] = { cp: blackToMove ? 800 : -800, depth: 14, nodes: 5000 };
    });

    const [swept] = await analyzeUnanalyzedGames([stats], 'tester', {
      engine: new ScriptedEngine(scripted),
      allowAllOnMobile: true,
    });

    assert.equal(swept.evalSource, 'local');
    assert.ok(swept.criticalMoments.length > 0, 'sweep produced no critical moments');
    for (const m of swept.criticalMoments) {
      assert.ok(m.fen, `swept moment at ply ${m.ply} lost its fen`);
      assert.ok(
        (m.setupMoves?.length ?? 0) > 0 || m.ply <= 1,
        `swept moment at ply ${m.ply} lost its setupMoves`
      );
    }
    for (const mv of swept.moves) {
      assert.ok(mv.fen, `swept move at ply ${mv.ply} lost its fen`);
    }
  });

  await t.test('eval swing is reported from the player\'s side, not White\'s', () => {
    const base = {
      gameId: 'g',
      ply: 10,
      moveNumber: 5,
      san: 'Qh5',
      winPctLost: 40,
      judgment: 'blunder' as const,
      phase: 'middlegame' as const,
      deepLink: '',
    };
    // White drops from +2.0 to -1.0: a 3 pawn loss for White.
    const asWhite: CriticalMoment = { ...base, color: 'white', evalBefore: 200, evalAfter: -100 };
    // Black is the mover, so the same White-perspective rise is Black's loss.
    const asBlack: CriticalMoment = { ...base, color: 'black', evalBefore: -200, evalAfter: 100 };

    assert.equal(evalSwingForPlayer(asWhite), 3);
    assert.equal(evalSwingForPlayer(asBlack), 3);
  });

  await t.test('moments convert into trainable puzzles, and unplayable ones are dropped', () => {
    const moves = ['e4', 'e5', 'd3', 'Nc6', 'Qh5', 'Nf6', 'Qxf7+', 'Kxf7'];
    const evals = [20, 15, 25, 18, 30, 22, -900, -950];
    const stats = deriveGameStats(makeGame(buildPgn(moves, evals)), 'tester')!;

    const puzzles = momentsToBlunderPuzzles(stats.criticalMoments, [stats], 'intermediate');
    assert.ok(puzzles.length > 0, 'adapter produced no puzzles');

    for (const p of puzzles) {
      assert.doesNotThrow(() => new Chess(p.initialFen), `puzzle ${p.id} has an unplayable fen`);
      const chess = new Chess(p.initialFen);
      assert.equal(
        chess.turn(),
        p.playerColor === 'white' ? 'w' : 'b',
        `puzzle ${p.id} says ${p.playerColor} to move but the fen disagrees`
      );
      assert.ok(p.playedSan, `puzzle ${p.id} lost the move that was played`);
      assert.ok(p.category, `puzzle ${p.id} was not classified`);
      // The Arena derives the solution from the engine; the adapter must not
      // invent one, and must never hand over an empty board.
      assert.deepEqual(p.solutionMoves, []);
    }

    // A moment whose position cannot be recovered is not trainable.
    const orphan: CriticalMoment = {
      gameId: 'missing',
      ply: 9,
      moveNumber: 5,
      san: 'Qxf7+',
      color: 'white',
      evalBefore: 10,
      evalAfter: -900,
      winPctLost: 60,
      judgment: 'blunder',
      phase: 'middlegame',
      deepLink: '',
    };
    assert.deepEqual(momentsToBlunderPuzzles([orphan], [], 'beginner'), []);
  });

  await t.test('an aborted sweep returns the games it finished and no more', async () => {
    const moves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'd3', 'd6'];
    const stats = deriveGameStats(makeGame(buildPgn(moves)), 'tester')!;
    const controller = new AbortController();
    controller.abort();

    const out = await analyzeUnanalyzedGames([stats], 'tester', {
      engine: new ScriptedEngine(),
      allowAllOnMobile: true,
      signal: controller.signal,
    });

    assert.equal(out.length, 1, 'aborting must not drop games from the list');
    assert.equal(out[0].gameId, stats.gameId);
  });

  await t.test('a re-sync never overwrites a game the local engine already swept', () => {
    const swept = { gameId: 'a', playedAt: 300, evalSource: 'local' } as GameDerivedStats;
    const other = { gameId: 'b', playedAt: 100, evalSource: 'lichess' } as GameDerivedStats;

    // Lichess reports evalSource 'none' for games it never analyzed. Taking
    // that row would silently discard minutes of the player's own CPU time.
    const fresh = { gameId: 'a', playedAt: 300, evalSource: 'none' } as GameDerivedStats;
    const merged = mergeGames([swept, other], [fresh]);

    assert.equal(merged.length, 2, 'merge must union, not replace');
    assert.equal(merged.find((g) => g.gameId === 'a')!.evalSource, 'local');

    // A genuinely analyzed row is still allowed to win.
    const analyzed = { gameId: 'a', playedAt: 300, evalSource: 'lichess' } as GameDerivedStats;
    assert.equal(
      mergeGames([swept], [analyzed]).find((g) => g.gameId === 'a')!.evalSource,
      'lichess'
    );

    // Newest first, so the oldest game is always the backwards cursor.
    const older = { gameId: 'c', playedAt: 50, evalSource: 'none' } as GameDerivedStats;
    const walked = mergeGames([swept, other], [older]);
    assert.deepEqual(walked.map((g) => g.gameId), ['a', 'b', 'c']);
  });

  await t.test('the backwards walk tells an empty page from a page of variants', () => {
    const cursor = 1_000;

    // Standard games came back: save them and keep walking.
    assert.deepEqual(
      decideBackfillStep({ standardGames: 40, rawGames: 40, oldestRawAt: 500, cursor }),
      { action: 'save' }
    );

    // Lichess had nothing older at all. This is the only real end of history.
    assert.deepEqual(
      decideBackfillStep({ standardGames: 0, rawGames: 0, oldestRawAt: 0, cursor }),
      { action: 'complete' }
    );

    // A block of chess960 games: nothing to save, but they are real history.
    // Stopping here would truncate the library, and retrying the same cursor
    // would loop on the same page forever -- so step the cursor past them.
    assert.deepEqual(
      decideBackfillStep({ standardGames: 0, rawGames: 100, oldestRawAt: 400, cursor }),
      { action: 'advance', to: 400 }
    );

    // Rows came back but none older than where we already are: no progress is
    // possible, so stop rather than loop.
    assert.deepEqual(
      decideBackfillStep({ standardGames: 0, rawGames: 100, oldestRawAt: 1_000, cursor }),
      { action: 'complete' }
    );
  });
});
