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

describe('Chess Metrics Pure Math', () => {
  it('winPct(0) === 50', () => {
    const result = calculateWinPctFromCp(0);
    assert.strictEqual(result, 50);
  });

  it('Symmetry test: winPct(cp) + winPct(-cp) === 100', () => {
    const testCentipawns = [10, 50, 100, 180, 300, 550, 800, 1000, 1500];
    for (const cp of testCentipawns) {
      const pos = calculateWinPctFromCp(cp);
      const neg = calculateWinPctFromCp(-cp);
      const sum = Math.round((pos + neg) * 100) / 100;
      assert.strictEqual(
        sum,
        100,
        `Failed symmetry for cp=${cp}: pos=${pos}, neg=${neg}, sum=${sum}`
      );
    }
  });

  it('Clamps cp to [-1000, 1000]', () => {
    const at1000 = calculateWinPctFromCp(1000);
    const at2000 = calculateWinPctFromCp(2000);
    assert.strictEqual(at1000, at2000);

    const atMinus1000 = calculateWinPctFromCp(-1000);
    const atMinus2000 = calculateWinPctFromCp(-2000);
    assert.strictEqual(atMinus1000, atMinus2000);
  });

  it('Handles mate evaluations for White and Black', () => {
    assert.strictEqual(evalToWinPct({ mate: 1 }, 'white'), 100);
    assert.strictEqual(evalToWinPct({ mate: 1 }, 'black'), 0);
    assert.strictEqual(evalToWinPct({ mate: -2 }, 'white'), 0);
    assert.strictEqual(evalToWinPct({ mate: -2 }, 'black'), 100);
  });

  it('Judgment threshold boundaries', () => {
    // < 10: none
    assert.strictEqual(getJudgment(0), 'none');
    assert.strictEqual(getJudgment(9.99), 'none');

    // 10 to < 20: inaccuracy
    assert.strictEqual(getJudgment(10.0), 'inaccuracy');
    assert.strictEqual(getJudgment(15.5), 'inaccuracy');
    assert.strictEqual(getJudgment(19.99), 'inaccuracy');

    // 20 to < 30: mistake
    assert.strictEqual(getJudgment(20.0), 'mistake');
    assert.strictEqual(getJudgment(25.0), 'mistake');
    assert.strictEqual(getJudgment(29.99), 'mistake');

    // >= 30: blunder
    assert.strictEqual(getJudgment(30.0), 'blunder');
    assert.strictEqual(getJudgment(45.2), 'blunder');
    assert.strictEqual(getJudgment(100.0), 'blunder');
  });

  it('Accuracy formula correctly scales from 100 to 0', () => {
    assert.strictEqual(calculateAccuracy(0), 100);
    const accSmallLoss = calculateAccuracy(5);
    const accInaccuracy = calculateAccuracy(15);
    const accBlunder = calculateAccuracy(40);

    assert.ok(accSmallLoss > accInaccuracy);
    assert.ok(accInaccuracy > accBlunder);
    assert.strictEqual(calculateAccuracy(200), 0);
  });

  it('Wilson score interval calculates sane proportions and bounds', () => {
    const w = wilsonScoreInterval(7, 10);
    assert.ok(w.lower > 0.3);
    assert.ok(w.upper < 0.95);
    assert.ok(w.center >= w.lower && w.center <= w.upper);

    // Empty case
    const empty = wilsonScoreInterval(0, 0);
    assert.strictEqual(empty.center, 0);
  });

  it('Clock string parsing', () => {
    assert.strictEqual(parseClockToSeconds('0:03:00'), 180);
    assert.strictEqual(parseClockToSeconds('0:02:45.5'), 165.5);
    assert.strictEqual(parseClockToSeconds('1:15:00'), 4500);
    assert.strictEqual(parseClockToSeconds('45'), 45);
  });
});

describe('PGN Tokenizer & Phase Detection', () => {
  it('Tokenizes PGN headers and moves with comments and clocks', () => {
    const samplePgn = `[Event "Rated Blitz game"]
[Site "https://lichess.org/abc12345"]
[White "magnus"]
[Black "hikaru"]
[Result "1-0"]

1. e4 { [%eval 0.25] [%clk 0:03:00] } 1... c5 { [%eval 0.30] [%clk 0:02:58] } 2. Nf3 { [%eval 0.22] [%clk 0:02:59] } 2... d6 { [%eval 0.45] [%clk 0:02:55] } 1-0`;

    const parsed = parsePgn(samplePgn);
    assert.strictEqual(parsed.headers.White, 'magnus');
    assert.strictEqual(parsed.headers.Black, 'hikaru');
    assert.strictEqual(parsed.moves.length, 4);

    assert.strictEqual(parsed.moves[0].san, 'e4');
    assert.strictEqual(parsed.moves[0].ply, 1);
    assert.strictEqual(parsed.moves[0].color, 'white');
    assert.strictEqual(parsed.moves[0].eval?.cp, 25);
    assert.strictEqual(parsed.moves[0].clockSeconds, 180);

    assert.strictEqual(parsed.moves[1].san, 'c5');
    assert.strictEqual(parsed.moves[1].ply, 2);
    assert.strictEqual(parsed.moves[1].color, 'black');
    assert.strictEqual(parsed.moves[1].eval?.cp, 30);
    assert.strictEqual(parsed.moves[1].clockSeconds, 178);
  });

  it('Exact piece count tracking with captures and phase transitions', () => {
    // 32 pieces initially
    // If opening.ply is 6:
    // Plies 1-6 are opening
    // Ply 7+ is middlegame unless piece count <= 12
    const openingPly = 6;
    assert.strictEqual(getGamePhase(1, openingPly, 32), 'opening');
    assert.strictEqual(getGamePhase(6, openingPly, 32), 'opening');
    assert.strictEqual(getGamePhase(7, openingPly, 32), 'middlegame');
    assert.strictEqual(getGamePhase(20, openingPly, 16), 'middlegame');
    assert.strictEqual(getGamePhase(21, openingPly, 12), 'endgame');
    assert.strictEqual(getGamePhase(30, openingPly, 8), 'endgame');
  });

  it('Parses full-game fixture and asserts piece counts, judgments, and stats', () => {
    const fixturePgn = `[Event "Rated Rapid game"]
[Site "https://lichess.org/testgame1"]
[Date "2026.09.13"]
[White "thibault"]
[Black "opponent"]
[Result "1-0"]
[ECO "C50"]
[Opening "Italian Game"]

1. e4 { [%eval 0.20] [%clk 0:10:00] } 1... e5 { [%eval 0.25] [%clk 0:10:00] } 
2. Nf3 { [%eval 0.30] [%clk 0:09:58] } 2... Nc6 { [%eval 0.28] [%clk 0:09:55] }
3. Bc4 { [%eval 0.35] [%clk 0:09:55] } 3... Bc5 { [%eval 0.30] [%clk 0:09:50] }
4. d3 { [%eval 0.25] [%clk 0:09:50] } 4... Nf6 { [%eval 0.20] [%clk 0:09:45] }
5. O-O { [%eval 0.30] [%clk 0:09:48] } 5... O-O { [%eval 0.25] [%clk 0:09:40] }
6. Bg5 { [%eval 0.40] [%clk 0:09:40] } 6... h6 { [%eval 0.35] [%clk 0:09:35] }
7. Bh4 { [%eval 0.30] [%clk 0:09:35] } 7... d6 { [%eval 0.25] [%clk 0:09:30] }
8. Nc3 { [%eval 0.40] [%clk 0:09:30] } 8... Be6 { [%eval 0.35] [%clk 0:09:20] }
9. Nd5 { [%eval 0.60] [%clk 0:09:25] } 9... Bxd5 { [%eval 0.50] [%clk 0:09:10] }
10. Bxd5 { [%eval 0.55] [%clk 0:09:20] } 10... g5 { [%eval 3.80] [%clk 0:08:45] }
11. Nxg5 { [%eval 4.20] [%clk 0:09:10] } 11... hxg5 { [%eval 4.10] [%clk 0:08:30] }
12. Bxg5 { [%eval 4.30] [%clk 0:09:05] } 12... Kg7 { [%eval 4.20] [%clk 0:08:00] }
13. Qf3 { [%eval 4.50] [%clk 0:09:00] } 13... Nd4 { [%eval #3] [%clk 0:07:30] }
14. Qxf6+ { [%eval #2] [%clk 0:08:50] } 14... Qxf6 { [%eval #2] [%clk 0:07:20] }
15. Bxf6+ { [%eval #1] [%clk 0:08:45] } 15... Kxf6 { [%eval #1] [%clk 0:07:15] }
16. c3 { [%eval 5.50] [%clk 0:08:40] } 16... Ne2+ { [%eval 5.40] [%clk 0:07:00] }
1-0`;

    const rawGame: LichessRawGame = {
      id: 'testgame1',
      rated: true,
      speed: 'rapid',
      status: 'mate',
      winner: 'white',
      players: {
        white: { user: { name: 'thibault', id: 'thibault' }, rating: 1800 },
        black: { user: { name: 'opponent', id: 'opponent' }, rating: 1750 },
      },
      opening: { eco: 'C50', name: 'Italian Game', ply: 10 },
      clock: { initial: 600, increment: 0 },
      pgn: fixturePgn,
    };

    const derived = deriveGameStats(rawGame, 'thibault');
    assert.ok(derived !== null);
    assert.strictEqual(derived.color, 'white');
    assert.strictEqual(derived.result, 'win');
    assert.strictEqual(derived.openingName, 'Italian Game');
    assert.strictEqual(derived.eco, 'C50');

    // Check piece count tracking: 9 captures total -> piece count at end is 32 - 9 = 23
    const lastMove = derived.moves[derived.moves.length - 1];
    assert.strictEqual(lastMove.pieceCount, 23);

    // Assert user conversion status
    assert.strictEqual(derived.converted, true);

    // Assert aggregation works
    const aggregate = aggregateUserStats([derived], 'thibault');
    assert.strictEqual(aggregate.totalGames, 1);
    assert.strictEqual(aggregate.colorRecord.white.wins, 1);
    assert.strictEqual(aggregate.openings.length, 1);
    assert.strictEqual(aggregate.openings[0].name, 'Italian Game');
  });
});
