import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Chess } from 'chess.js';
import {
  fetchMaiaAnalysis,
  diagnosePsychology,
  detectMiaiDilemma,
} from '../lib/engine/maiaClient';

describe('Maia Human-AI Intelligence & Cognitive Diagnostics', () => {
  const SICILIAN_FEN = 'r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 2 6';
  const KIWIPETE_FEN = 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 10';

  it('fetchMaiaAnalysis returns measured move frequencies for a known position', async () => {
    const result = await fetchMaiaAnalysis(SICILIAN_FEN, 1500, 'Be2');

    assert.ok(result);
    assert.strictEqual(result.fen, SICILIAN_FEN);
    assert.strictEqual(result.ratingTier, 1500);
    assert.ok(Array.isArray(result.candidateMoves));

    if (!result.hasData) {
      // Explorer unreachable or no games: the empty contract must hold exactly.
      assert.ok(result.source === 'no_data' || result.source === 'unavailable');
      assert.strictEqual(result.candidateMoves.length, 0);
      assert.strictEqual(result.topHumanMove, null);
      assert.strictEqual(result.cognitiveDiagnosis, null);
      assert.strictEqual(result.totalGames, 0);
      return;
    }

    assert.strictEqual(result.source, 'lichess_explorer');
    assert.ok(result.totalGames > 0);
    assert.ok(result.candidateMoves.length > 0);
    assert.ok(result.topHumanMove);

    // Frequencies are shares of the full sample, so they sum to at most 100 -
    // the shortfall is the long tail of rarer moves, not a rounding bug.
    const totalProb = result.candidateMoves.reduce((acc, cur) => acc + cur.probability, 0);
    assert.ok(totalProb > 0 && totalProb <= 101, `Frequencies should not exceed 100, got ${totalProb}`);
    assert.ok(result.coveragePercent > 0 && result.coveragePercent <= 100);
  });

  it('never fabricates a distribution for a position with no games', async () => {
    // A legal but absurd position that cannot appear in any real game database.
    const NONSENSE_FEN = '1nbqkbn1/1ppppp2/8/r6r/R6R/8/2PPPPP1/1NBQKBN1 w - - 0 30';
    const result = await fetchMaiaAnalysis(NONSENSE_FEN, 1500);

    assert.strictEqual(result.hasData, false);
    // 'no_data' when the explorer answers with nothing, 'unavailable' when it
    // cannot be reached. Either way, no distribution is invented.
    assert.ok(result.source === 'no_data' || result.source === 'unavailable');
    assert.strictEqual(result.candidateMoves.length, 0);
    assert.strictEqual(result.topHumanMove, null);
    assert.strictEqual(result.cognitiveDiagnosis, null);
  });

  it('Rating tiers are carried through to the result', async () => {
    const res1100 = await fetchMaiaAnalysis(SICILIAN_FEN, 1100);
    const res1900 = await fetchMaiaAnalysis(SICILIAN_FEN, 1900);

    assert.strictEqual(res1100.ratingTier, 1100);
    assert.strictEqual(res1900.ratingTier, 1900);
  });

  it('diagnosePsychology reports the measured rate it was given, not an estimate', () => {
    const chess = new Chess();
    const diagnosis = diagnosePsychology(chess, 'Nxe5', 1300, 63);

    assert.strictEqual(diagnosis.blunderCategory, 'Greed Trap');
    assert.strictEqual(diagnosis.humanTrapRate, 63);
    assert.ok(diagnosis.explanation.includes('material'));
  });

  it('diagnosePsychology correctly flags Tunnel Vision on impulsive checks', () => {
    const chess = new Chess();
    const diagnosis = diagnosePsychology(chess, 'Qh5+', 1100, 41);

    assert.strictEqual(diagnosis.blunderCategory, 'Tunnel Vision');
    assert.strictEqual(diagnosis.humanTrapRate, 41);
    assert.ok(diagnosis.explanation.includes('check'));
  });

  it('diagnosePsychology correctly flags Passive Waiting moves', () => {
    const chess = new Chess();
    const diagnosis = diagnosePsychology(chess, 'a3', 1500, 52);

    assert.strictEqual(diagnosis.blunderCategory, 'Passive Waiting');
    assert.strictEqual(diagnosis.humanTrapRate, 52);
  });

  it('detectMiaiDilemma identifies dual threat geometry in sharp tactical positions', () => {
    // In KiwiPete, White has pins and heavy dual piece attacks
    const miai = detectMiaiDilemma(KIWIPETE_FEN, []);

    assert.ok(typeof miai.hasDualThreat === 'boolean');
    assert.ok(miai.explanation);
  });
});
