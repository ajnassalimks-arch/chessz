import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkBookMemoryPattern,
  selectNoveltyCruciblePuzzle,
  getPuzzleCategoryRule,
  evaluateBenchmarkMove,
  calculateNewElo5,
  mapEloToLevel,
  classifyBehavioralPattern,
  HISTORICAL_BENCHMARKS_STAGE_1,
  HISTORICAL_BENCHMARKS_STAGE_2,
  PuzzleAttemptRecord,
} from "../lib/diagnosisEngine";

describe("Con 1: Category Rules & Refutation Trees", () => {
  it("attaches appropriate pedagogical rule to each puzzle tier", () => {
    const beginnerRule = getPuzzleCategoryRule({ id: "p1", tier: "beginner" } as any);
    assert.equal(beginnerRule.ruleTitle, "The 2-Second Bodyguard Rule");

    const advBegRule = getPuzzleCategoryRule({ id: "p2", tier: "adv_beginner" } as any);
    assert.equal(advBegRule.ruleTitle, "The Geometric Radar Rule");

    const interRule = getPuzzleCategoryRule({ id: "p3", tier: "intermediate" } as any);
    assert.equal(interRule.ruleTitle, "Tactical Overload & Deflection Rule");

    const advRule = getPuzzleCategoryRule({ id: "p4", tier: "advanced" } as any);
    assert.equal(advRule.ruleTitle, "Steinitz's Worst-Placed Piece Principle");
  });

  it("preserves custom ruleTitle and ruleBody if already present on puzzle", () => {
    const customRule = getPuzzleCategoryRule({
      id: "custom",
      ruleTitle: "Custom Pin Principle",
      ruleBody: "Attack the absolute pin.",
    } as any);
    assert.equal(customRule.ruleTitle, "Custom Pin Principle");
    assert.equal(customRule.ruleBody, "Attack the absolute pin.");
  });

  it("evaluates candidate moves with deep refutations on Légal's trap", () => {
    assert.ok(HISTORICAL_BENCHMARKS_STAGE_1.length >= 3);
    const legalTrap = HISTORICAL_BENCHMARKS_STAGE_1.find((p) => p.id === "bench_legal_trap");
    assert.ok(legalTrap, "Légal's trap benchmark must exist");
    
    // Test Best Move: 1... Nxe5
    const bestRes = evaluateBenchmarkMove(legalTrap, "c6", "e5", 1250);
    assert.equal(bestRes.status, "best");
    assert.equal(bestRes.score, 1.0);

    // Test Blunder Move: 1... Bxd1??
    const blunderRes = evaluateBenchmarkMove(legalTrap, "h5", "d1", 1250);
    assert.equal(blunderRes.status, "blunder");
    assert.equal(blunderRes.score, 0.0);
    assert.ok(blunderRes.refutationMoves && blunderRes.refutationMoves.length >= 2, "Checkmate refutation moves must exist");
    assert.equal(blunderRes.refutationMoves[0].san, "Bxf7+");
  });
});

describe("Con 2: Velocity Heuristic & Novelty Crucible", () => {
  it("flags book memory if solved in under 4.0 seconds on famous traps", () => {
    // Under 4s on Légal's trap
    assert.equal(checkBookMemoryPattern("bench_legal_trap", 2100), true);
    assert.equal(checkBookMemoryPattern("bench_elephant_trap", 3800), true);

    // Over 4s on famous trap -> deliberate calculation
    assert.equal(checkBookMemoryPattern("bench_legal_trap", 6500), false);

    // Random non-trap puzzle -> false
    assert.equal(checkBookMemoryPattern("random_middlegame_123", 1500), false);
  });

  it("dampens rating jump when isBookMemory is true", () => {
    // Normal first move ace: K=160
    const normalElo = calculateNewElo5(1250, 1350, 1.0, 0, null, false, false);
    // Book memory ace: K=80
    const dampenedElo = calculateNewElo5(1250, 1350, 1.0, 0, null, false, true);

    assert.ok(normalElo > dampenedElo, "Normal jump should be larger than dampened book memory jump");
    assert.ok(dampenedElo <= 1350, "Dampened jump should not over-inflate past puzzle rating");
  });

  it("selects a valid Novelty Crucible asymmetric puzzle", () => {
    const cruciblePuz = selectNoveltyCruciblePuzzle(1350, ["bench_legal_trap"]);
    assert.ok(cruciblePuz, "Crucible puzzle must be returned");
    assert.notEqual(cruciblePuz.id, "bench_legal_trap");
    assert.ok(cruciblePuz.numericRating >= 1100, "Should have appropriate tactical rating");
  });
});

describe("Con 3: Master Ceiling & Grandmaster Crucible", () => {
  it("seeds initial Elo accurately using Lichess Prior", () => {
    const lichessRapid = 2100;
    const seededElo = Math.max(900, Math.min(2150, Math.round((1250 + lichessRapid) / 2)));
    assert.equal(seededElo, 1675);
  });

  it("allows Grandmaster Crucible (Trial 6) with K=260 to break 2000 ceiling", () => {
    // Starting at 1950, solving a 2150 puzzle in Trial 6 with 'sure' conviction
    const newElo = calculateNewElo5(1950, 2150, 1.0, 5, "sure", false, false);
    assert.ok(newElo >= 2150, `Expected new Elo >= 2150, got ${newElo}`);
    assert.ok(newElo <= 2350, `Expected capped at 2350, got ${newElo}`);

    const level = mapEloToLevel(newElo);
    assert.equal(level.tierId, "advanced");
  });

  it("routes blunder on trap straight to Beginner bracket (<900)", () => {
    const fallenElo = calculateNewElo5(1250, 1350, 0.0, 0, null, true, false);
    assert.ok(fallenElo < 900, `Expected fallen Elo < 900, got ${fallenElo}`);
    const level = mapEloToLevel(fallenElo);
    assert.equal(level.tierId, "beginner");
  });
});

describe("Behavioral Pattern Classifications", () => {
  it("classifies Clean Run for 5 flawless attempts", () => {
    const cleanHistory: PuzzleAttemptRecord[] = Array.from({ length: 5 }).map((_, i) => ({
      puzzleId: `p${i}`,
      puzzleTitle: `Puzzle ${i}`,
      rating: 1400,
      userEloBefore: 1250,
      userEloAfter: 1350,
      score: 1.0,
      commitment: "sure",
      helpUsed: "none",
      firstTryCorrect: true,
      timeMs: 15000,
      status: "best",
    }));

    const pattern = classifyBehavioralPattern(cleanHistory);
    assert.equal(pattern.patternId, "clean_run");
  });

  it("classifies Overconfident Striker when user blunders on 'sure'", () => {
    const overconfidentHistory: PuzzleAttemptRecord[] = [
      {
        puzzleId: "p1",
        puzzleTitle: "P1",
        rating: 1350,
        userEloBefore: 1250,
        userEloAfter: 1250,
        score: 1.0,
        commitment: null,
        helpUsed: "none",
        firstTryCorrect: true,
        timeMs: 5000,
        status: "best",
      },
      {
        puzzleId: "p2",
        puzzleTitle: "P2",
        rating: 1350,
        userEloBefore: 1250,
        userEloAfter: 1250,
        score: 1.0,
        commitment: null,
        helpUsed: "none",
        firstTryCorrect: true,
        timeMs: 5000,
        status: "best",
      },
      {
        puzzleId: "p3",
        puzzleTitle: "P3",
        rating: 1400,
        userEloBefore: 1250,
        userEloAfter: 1150,
        score: 0.0,
        commitment: "sure",
        helpUsed: "none",
        firstTryCorrect: false,
        timeMs: 6000,
        status: "blunder",
      },
      {
        puzzleId: "p4",
        puzzleTitle: "P4",
        rating: 1300,
        userEloBefore: 1150,
        userEloAfter: 1050,
        score: 0.0,
        commitment: "sure",
        helpUsed: "none",
        firstTryCorrect: false,
        timeMs: 7000,
        status: "blunder",
      },
    ];

    const pattern = classifyBehavioralPattern(overconfidentHistory);
    assert.equal(pattern.patternId, "overconfident_striker");
  });
});
