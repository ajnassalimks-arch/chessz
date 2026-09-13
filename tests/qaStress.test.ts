import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateWinPctFromCp,
  evalToWinPct,
  calculateWinPctLost,
  getJudgment,
  calculateAccuracy,
  wilsonScoreInterval,
  parseClockToSeconds,
} from '../lib/chessMetrics/math';
import { parsePgn, tokenizeMovetext } from '../lib/chessMetrics/tokenizer';
import {
  getGamePhase,
  parseGameMoves,
  deriveGameStats,
  aggregateUserStats,
  LichessRawGame,
} from '../lib/chessMetrics/gameParser';

describe('QA Stress Test: Edge Cases & Boundary Conditions', () => {
  it('Handles aborted games with 0 or 1 ply without throwing', () => {
    const emptyGame: LichessRawGame = {
      id: 'empty1',
      rated: false,
      speed: 'blitz',
      status: 'aborted',
      pgn: '[Event "Aborted Game"]\n\n*',
    };

    const derived = deriveGameStats(emptyGame, 'user1');
    assert.ok(derived !== null);
    assert.strictEqual(derived.moves.length, 0);
    assert.strictEqual(derived.criticalMoments.length, 0);
    assert.strictEqual(derived.accuracy, 100);

    const agg = aggregateUserStats([derived], 'user1');
    assert.strictEqual(agg.totalGames, 1);
    assert.strictEqual(agg.criticalMoments.length, 0);
  });

  it('Handles complex PGN with variations, NAGs, and underpromotions', () => {
    const complexPgn = `[Event "Complex PGN Test"]
[White "alice"]
[Black "bob"]
[Result "0-1"]

1. e4 (1. d4 d5) $1 c5 2. Nf3 { [%eval 0.20] [%clk 0:05:00] } 2... d6
3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5
7. Nb3 Be6 8. f3 Be7 9. Qd2 O-O 10. O-O-O Nbd7
11. g4 b5 12. g5 b4 13. Ne2 Ne8 14. h4 a5
15. Kb1 a4 16. Nc1 b3 17. cxb3 axb3 18. Nxb3 Bxb3
19. axb3 Nc7 20. Bc4 Ne6 21. g6 hxg6 22. h5 g5
23. h6 g6 24. h7+ Kh8 25. Bxe6 fxe6 26. Rh6 Rxf3
27. Rxg6 Nf8 28. Rg8+ Kxh7 29. Rxf8 Qxf8 30. Bxg5 Rf1
31. Bxe7 Rxd1+ 32. Qxd1 Qxe7 33. Qh5+ Kg7 34. Qg4+ Kf7
35. Qh5+ Kf8 36. Qh8+ Kf7 37. Qxa8 Qh4 38. Qb7+ Kf6
39. Qc6 Qe1+ 40. Nc1 Qd2 41. Qc2 Qd4 42. Qd3 d5
43. exd5 exd5 44. Qxd4 exd4 45. Kc2 Ke5 46. Kd3 d3
47. Nxd3+ Kd6 48. Kd4 Kc6 49. b4 Kb5 50. Kxd5 Ka4
51. Kc5 Kb3 52. b5 Kc2 53. b6 Kxd3 54. b7 Kc2
55. b8=R { [%eval 0.00] [%clk 0:00:30] } 55... Kd3 56. b4 Ke4
57. b5 Ke5 58. b6 Ke6 59. b7 Kd7 60. Rc8 Ke7
61. b8=Q { [%eval #1] [%clk 0:00:20] } 61... Kf7 62. Qd6 Kg7
63. Rc7+ Kg8 64. Qd8# { [%eval #0] [%clk 0:00:15] } 1-0`;

    const parsed = parsePgn(complexPgn);
    assert.ok(parsed.moves.length > 50);

    // Verify underpromotion to Rook (b8=R) was parsed cleanly
    const underpromotionMove = parsed.moves.find((m) => m.san === 'b8=R');
    assert.ok(underpromotionMove !== undefined);
    assert.strictEqual(underpromotionMove.san, 'b8=R');

    // Verify Queen promotion (b8=Q)
    const queenPromotion = parsed.moves.find((m) => m.san === 'b8=Q');
    assert.ok(queenPromotion !== undefined);

    // Verify castling moves
    const whiteO_O_O = parsed.moves.find((m) => m.san === 'O-O-O');
    assert.ok(whiteO_O_O !== undefined);
  });

  it('Handles mate in 0, 1, and negative mates cleanly', () => {
    assert.strictEqual(evalToWinPct({ mate: 0 }, 'white'), 100);
    assert.strictEqual(evalToWinPct({ mate: 0 }, 'black'), 0);
    assert.strictEqual(evalToWinPct({ mate: 1 }, 'white'), 100);
    assert.strictEqual(evalToWinPct({ mate: -1 }, 'white'), 0);
    assert.strictEqual(evalToWinPct({ mate: -1 }, 'black'), 100);
  });

  it('Handles massive eval swings without NaN or infinite values', () => {
    const swing1 = calculateWinPctLost(100, 0);
    assert.strictEqual(swing1, 100);
    assert.strictEqual(getJudgment(swing1), 'blunder');

    const swing2 = calculateWinPctLost(0, 100);
    assert.strictEqual(swing2, 0); // Negative loss floored at 0
    assert.strictEqual(getJudgment(swing2), 'none');

    const accAtZero = calculateAccuracy(0);
    const accAt100 = calculateAccuracy(100);
    assert.strictEqual(accAtZero, 100);
    assert.ok(accAt100 >= 0 && accAt100 <= 5);
    assert.ok(!isNaN(accAt100));
  });

  it('Wilson score interval edge cases (0 games, 1 game, all wins, all losses)', () => {
    // 0 games
    const zero = wilsonScoreInterval(0, 0);
    assert.strictEqual(zero.lower, 0);
    assert.strictEqual(zero.upper, 0);

    // 1 win / 1 game
    const oneWin = wilsonScoreInterval(1, 1);
    assert.ok(oneWin.lower > 0.15);
    assert.strictEqual(oneWin.upper, 1.0);

    // 0 wins / 1 game
    const oneLoss = wilsonScoreInterval(0, 1);
    assert.strictEqual(oneLoss.lower, 0.0);
    assert.ok(oneLoss.upper < 0.85);

    // 50 wins / 50 games (100%)
    const perfect50 = wilsonScoreInterval(50, 50);
    assert.ok(perfect50.lower > 0.90);
    assert.strictEqual(perfect50.upper, 1.0);

    // 0 wins / 50 games (0%)
    const zero50 = wilsonScoreInterval(0, 50);
    assert.strictEqual(zero50.lower, 0.0);
    assert.ok(zero50.upper < 0.10);
  });

  it('Clock calculation with increment greater than move time spent', () => {
    // White starts with 180s, moves, has 182s because 3s increment was added
    const moves = [
      { san: 'e4', ply: 1, moveNumber: 1, color: 'white' as const, clockSeconds: 182 },
      { san: 'e5', ply: 2, moveNumber: 1, color: 'black' as const, clockSeconds: 181 },
    ];
    const analyzed = parseGameMoves(moves, 16, 180, 3);
    // Initial clock: 180, curr: 182, inc: 3 -> time spent = 180 - 182 + 3 = 1 second
    assert.strictEqual(analyzed[0].timeSpentSeconds, 1);
  });

  it('Game phase transitions with multiple captures down to bare kings', () => {
    // 32 pieces down to 10 pieces (22 captures)
    const openingPly = 10;
    // ply 5 -> opening
    assert.strictEqual(getGamePhase(5, openingPly, 32), 'opening');
    // ply 12 with 20 pieces -> middlegame
    assert.strictEqual(getGamePhase(12, openingPly, 20), 'middlegame');
    // ply 25 with 12 pieces -> endgame
    assert.strictEqual(getGamePhase(25, openingPly, 12), 'endgame');
    // ply 35 with 4 pieces -> endgame
    assert.strictEqual(getGamePhase(35, openingPly, 4), 'endgame');
  });

  it('Conversion failure and rescue detection logic', () => {
    // Test conversion failure: peak eval was +500 (White), but result was loss
    const mockGameFail: LichessRawGame = {
      id: 'conv_fail',
      status: 'resign',
      winner: 'black',
      players: {
        white: { user: { name: 'tester', id: 'tester' } },
        black: { user: { name: 'opp', id: 'opp' } },
      },
      pgn: `1. e4 { [%eval 0.20] } 1... e5 { [%eval 0.20] } 2. Qh5 { [%eval 5.20] } 2... Ke7 { [%eval 5.10] } 3. Qxe5# { [%eval -9.99] } 0-1`,
    };

    const derived = deriveGameStats(mockGameFail, 'tester');
    assert.ok(derived !== null);
    // User had +520 cp, but lost -> converted must be false
    assert.strictEqual(derived.converted, false);

    // Test rescue: user fell to -400 cp, but won
    const mockGameRescue: LichessRawGame = {
      id: 'rescue_win',
      status: 'mate',
      winner: 'white',
      players: {
        white: { user: { name: 'tester', id: 'tester' } },
        black: { user: { name: 'opp', id: 'opp' } },
      },
      pgn: `1. e4 { [%eval -4.50] } 1... e5 { [%eval -4.00] } 2. Nf3 { [%eval #1] } 1-0`,
    };

    const derivedRescue = deriveGameStats(mockGameRescue, 'tester');
    assert.ok(derivedRescue !== null);
    assert.strictEqual(derivedRescue.rescued, true);
  });
});
