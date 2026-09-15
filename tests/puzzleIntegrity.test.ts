import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from 'chess.js';
import {
  LICHESS_DIAGNOSTIC_CATEGORIES,
  CONTINUOUS_PUZZLES,
  ChessPuzzle,
} from '../lib/puzzles';
import { BENCHMARK_PUZZLE_POOL } from '../lib/diagnosisEngine';

test('Puzzle Integrity — Tactical Arena & Diagnostic Pool (500 Puzzles)', async (t) => {
  const allPuzzles: (ChessPuzzle & { source: string })[] = [];

  for (const [category, puzzles] of Object.entries(LICHESS_DIAGNOSTIC_CATEGORIES)) {
    for (const p of puzzles) {
      allPuzzles.push({ ...p, source: `category:${category}` });
    }
  }

  for (const p of CONTINUOUS_PUZZLES) {
    allPuzzles.push({ ...p, source: 'continuous' });
  }

  assert.equal(allPuzzles.length, 500, 'Should load exactly 500 tactical puzzles');

  await t.test('All 500 puzzles have valid FENs and matching playerColor turn', () => {
    for (const puzzle of allPuzzles) {
      let chess: Chess;
      try {
        chess = new Chess(puzzle.initialFen);
      } catch (err: any) {
        assert.fail(`Invalid FEN in puzzle "${puzzle.id}": ${puzzle.initialFen}`);
      }

      const expectedTurn = puzzle.playerColor === 'white' ? 'w' : 'b';
      assert.equal(
        chess.turn(),
        expectedTurn,
        `Side to move mismatch in puzzle "${puzzle.id}": expected ${puzzle.playerColor} (${expectedTurn}), found ${chess.turn()}`
      );
    }
  });

  await t.test('All solutionMoves and opponentResponses are legal, match declared SAN, and # is genuine checkmate', () => {
    for (const puzzle of allPuzzles) {
      const chess = new Chess(puzzle.initialFen);
      const solMoves = puzzle.solutionMoves || [];
      const oppResponses = puzzle.opponentResponses || [];

      assert.ok(solMoves.length > 0, `Puzzle "${puzzle.id}" has no solution moves`);

      for (let i = 0; i < solMoves.length; i++) {
        const sm = solMoves[i];
        let playedMove;
        try {
          playedMove = chess.move({
            from: sm.from,
            to: sm.to,
            promotion: sm.promotion || 'q',
          });
        } catch (err: any) {
          assert.fail(`Illegal solution move in puzzle "${puzzle.id}": ${sm.from}->${sm.to} (${err.message})`);
        }

        assert.ok(playedMove, `Failed to play solution move in "${puzzle.id}": ${sm.from}->${sm.to}`);
        assert.equal(
          playedMove.san,
          sm.san,
          `SAN mismatch in puzzle "${puzzle.id}": declared "${sm.san}", generated "${playedMove.san}"`
        );

        if (sm.san.includes('#')) {
          assert.equal(
            chess.isCheckmate(),
            true,
            `Puzzle "${puzzle.id}" declares checkmate SAN "${sm.san}" but board isCheckmate() is false`
          );
        }

        if (i < oppResponses.length) {
          const om = oppResponses[i];
          let playedOpp;
          try {
            playedOpp = chess.move({
              from: om.from,
              to: om.to,
              promotion: om.promotion || 'q',
            });
          } catch (err: any) {
            assert.fail(`Illegal opponent response in puzzle "${puzzle.id}": ${om.from}->${om.to} (${err.message})`);
          }

          assert.ok(playedOpp, `Failed to play opponent move in "${puzzle.id}": ${om.from}->${om.to}`);
          assert.equal(
            playedOpp.san,
            om.san,
            `Opponent SAN mismatch in puzzle "${puzzle.id}": declared "${om.san}", generated "${playedOpp.san}"`
          );

          if (om.san.includes('#')) {
            assert.equal(
              chess.isCheckmate(),
              true,
              `Opponent move in "${puzzle.id}" declares checkmate SAN "${om.san}" but isCheckmate() is false`
            );
          }
        }
      }
    }
  });

  await t.test('All defaultRefutations are legal opponent responses after at least one wrong player move, with matching SAN', () => {
    for (const puzzle of allPuzzles) {
      const ref = puzzle.defaultRefutation;
      assert.ok(ref, `Puzzle "${puzzle.id}" is missing defaultRefutation`);
      assert.ok(ref.from && ref.to && ref.san, `Incomplete refutation in puzzle "${puzzle.id}"`);

      const rootChess = new Chess(puzzle.initialFen);
      const solFirst = puzzle.solutionMoves[0];
      const wrongMoves = rootChess
        .moves({ verbose: true })
        .filter((m) => !(m.from === solFirst.from && m.to === solFirst.to));

      assert.ok(
        wrongMoves.length > 0,
        `Puzzle "${puzzle.id}" has no alternative moves to test refutation against`
      );

      let foundLegalReply = false;
      let matchingSan = '';

      for (const wm of wrongMoves) {
        const testBoard = new Chess(rootChess.fen());
        testBoard.move(wm);

        try {
          const promoPiece =
            ref.promotion ||
            (ref.san.includes('=R') ? 'r' : ref.san.includes('=N') ? 'n' : ref.san.includes('=B') ? 'b' : 'q');
          const refResult = testBoard.move({
            from: ref.from,
            to: ref.to,
            promotion: promoPiece,
          });

          if (refResult && refResult.san === ref.san) {
            foundLegalReply = true;
            matchingSan = refResult.san;
            break;
          }
        } catch {}
      }

      assert.ok(
        foundLegalReply,
        `Puzzle "${puzzle.id}" defaultRefutation (${ref.from}->${ref.to}, declared "${ref.san}") is illegal or has SAN mismatch after all wrong player moves`
      );
    }
  });
});

test('Puzzle Integrity — Benchmark Puzzle Pool', async (t) => {
  assert.ok(
    BENCHMARK_PUZZLE_POOL.length >= 12,
    `Expected at least 12 benchmark puzzles, found ${BENCHMARK_PUZZLE_POOL.length}`
  );

  await t.test('Benchmark puzzles have valid FENs, valid solutions, and player blunder refutations', () => {
    for (const puzzle of BENCHMARK_PUZZLE_POOL) {
      const chess = new Chess(puzzle.initialFen);
      const expectedTurn = puzzle.playerColor === 'white' ? 'w' : 'b';
      assert.equal(chess.turn(), expectedTurn, `Benchmark "${puzzle.id}" turn mismatch`);

      // Solution check
      const sol = puzzle.solutionMoves[0];
      const played = chess.move({ from: sol.from, to: sol.to, promotion: sol.promotion || 'q' });
      assert.equal(played.san, sol.san, `Benchmark "${puzzle.id}" solution SAN mismatch`);

      if (sol.san.includes('#')) {
        assert.equal(
          chess.isCheckmate(),
          true,
          `Benchmark "${puzzle.id}" solution declares mate "${sol.san}" but isCheckmate is false`
        );
      }

      // Default refutation check: In benchmark puzzles, defaultRefutation is the player's candidate blunder from initial position
      const ref = puzzle.defaultRefutation;
      if (ref) {
        const blunderChess = new Chess(puzzle.initialFen);
        const blunderPlayed = blunderChess.move({
          from: ref.from,
          to: ref.to,
          promotion: ref.promotion || 'q',
        });
        assert.ok(
          blunderPlayed,
          `Benchmark "${puzzle.id}" defaultRefutation (${ref.from}->${ref.to}) is illegal from initial position`
        );
        assert.equal(
          blunderPlayed.san,
          ref.san,
          `Benchmark "${puzzle.id}" defaultRefutation SAN mismatch: expected "${ref.san}", got "${blunderPlayed.san}"`
        );
      }
    }
  });
});
