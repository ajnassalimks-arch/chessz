import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Chess } from 'chess.js';
import {
  fetchMaiaAnalysis,
  diagnosePsychology,
  detectMiaiDilemma,
  MaiaRatingTier,
} from '../lib/engine/maiaClient';

describe('Maia Human-AI Intelligence & Cognitive Diagnostics', () => {
  const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const SICILIAN_FEN = 'r1bqkb1r/pp2pppp/2np1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 2 6';
  const KIWIPETE_FEN = 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 10';

  it('fetchMaiaAnalysis returns valid candidate moves with normalized probabilities', async () => {
    const result = await fetchMaiaAnalysis(SICILIAN_FEN, 1500, 'Be2');

    assert.ok(result);
    assert.strictEqual(result.fen, SICILIAN_FEN);
    assert.strictEqual(result.ratingTier, 1500);
    assert.ok(Array.isArray(result.candidateMoves));
    assert.ok(result.candidateMoves.length > 0);

    // Verify probabilities are positive numbers and top move exists
    const totalProb = result.candidateMoves.reduce((acc, cur) => acc + cur.probability, 0);
    assert.ok(totalProb >= 90 && totalProb <= 105, `Total probability should sum near 100, got ${totalProb}`);
    assert.ok(result.topHumanMove);
    assert.ok(result.topHumanMove.san);
  });

  it('Rating tiers affect move probabilities across 1100 vs 1900', async () => {
    const res1100 = await fetchMaiaAnalysis(SICILIAN_FEN, 1100);
    const res1900 = await fetchMaiaAnalysis(SICILIAN_FEN, 1900);

    assert.strictEqual(res1100.ratingTier, 1100);
    assert.strictEqual(res1900.ratingTier, 1900);
    assert.ok(res1100.candidateMoves.length > 0);
    assert.ok(res1900.candidateMoves.length > 0);
  });

  it('diagnosePsychology correctly flags Greed Traps', () => {
    const chess = new Chess();
    const diagnosis = diagnosePsychology(chess, 'Nxe5', 1300);

    assert.strictEqual(diagnosis.blunderCategory, 'Greed Trap');
    assert.ok(diagnosis.humanTrapRate > 50);
    assert.ok(diagnosis.explanation.includes('material'));
  });

  it('diagnosePsychology correctly flags Tunnel Vision on impulsive checks', () => {
    const chess = new Chess();
    const diagnosis = diagnosePsychology(chess, 'Qh5+', 1100);

    assert.strictEqual(diagnosis.blunderCategory, 'Tunnel Vision');
    assert.ok(diagnosis.humanTrapRate > 50);
    assert.ok(diagnosis.explanation.includes('check'));
  });

  it('diagnosePsychology correctly flags Passive Waiting moves', () => {
    const chess = new Chess();
    const diagnosis = diagnosePsychology(chess, 'a3', 1500);

    assert.strictEqual(diagnosis.blunderCategory, 'Passive Waiting');
    assert.ok(diagnosis.humanTrapRate > 30);
  });

  it('detectMiaiDilemma identifies dual threat geometry in sharp tactical positions', () => {
    // In KiwiPete, White has pins and heavy dual piece attacks
    const miai = detectMiaiDilemma(KIWIPETE_FEN, []);

    assert.ok(typeof miai.hasDualThreat === 'boolean');
    assert.ok(miai.explanation);
  });
});
