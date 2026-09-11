import { ChessPuzzle, CONTINUOUS_PUZZLES, LICHESS_DIAGNOSTIC_CATEGORIES, LevelType } from "./puzzles";

export type CommitmentLevel = "sure" | "think_so" | "guessing";
export type HelpType = "none" | "try_again" | "hint" | "solution" | "fail";

export interface PuzzleAttemptRecord {
  puzzleId: string;
  puzzleTitle: string;
  rating: number;
  userEloBefore: number;
  userEloAfter: number;
  score: number;
  commitment: CommitmentLevel | null;
  helpUsed: HelpType;
  firstTryCorrect: boolean;
  timeMs: number;
  moveSan?: string;
}

export interface BehavioralInsight {
  patternId: string;
  patternName: string;
  insight: string;
  strength: string;
  weakness: string;
}

export interface DiagnosisProfile {
  finalElo: number;
  finalLevel: string;
  tierId: LevelType;
  behavioralPattern: string;
  insightShown: string;
  strength: string;
  weakness: string;
  fullHistory: PuzzleAttemptRecord[];
  trainingSeed: {
    focus: string;
    level: string;
    tierId: LevelType;
  };
  completedAt: string;
}

// Fixed Puzzle 1: The Immortal Légal's Queen-Bait Trap (~1350 FIDE Benchmark)
// White has sacrificed the Queen with Nxe5! Black must reject the poisoned Queen on d1 and play 1... Nxe5!
export const FIXED_PUZZLE_1: ChessPuzzle = {
  id: "trap_legal_queen_bait",
  lichessId: "legal_1750",
  tier: "intermediate",
  track: "tactical",
  title: "Level Calibrator 1: The Poisoned Queen Trap",
  ratingBadge: "Master Trap: ~1350",
  initialFen: "r2qkbnr/ppp2ppp/2np4/4N2b/2B1P3/2N4P/PPPP1PP1/R1BQK2R b KQkq - 0 6",
  playerColor: "black",
  prompt: "Black to move: White has jumped their knight to e5, leaving their Queen on d1 completely undefended. Is that Queen really free to take, or is it a lethal trap? Calculate the critical line!",
  ruleTitle: "The Poisoned Bait Rule",
  ruleBody: "When an opponent leaves a major piece undefended, stop! Calculate forcing counter-attacks before touching the bait.",
  solutionMoves: [
    {
      from: "c6",
      to: "e5",
      san: "Nxe5",
      explanation: "Nxe5! Eliminates White's attacking knight, parries the mate on f7, and defends the bishop on h5."
    },
    {
      from: "e5",
      to: "c4",
      san: "Nxc4",
      explanation: "Nxc4! White's bishop falls. Black is up a full piece with a completely winning position (+3.5)."
    }
  ],
  opponentResponses: [
    {
      from: "d1",
      to: "h5",
      san: "Qxh5",
      explanation: "White recaptures the bishop on h5."
    }
  ],
  defaultRefutation: {
    from: "h5",
    to: "d1",
    san: "Bxd1",
    coachExplanation: "Tactical Trap! The Queen on d1 was poisoned bait. Taking it walked straight into 2. Bxf7+ Ke7 3. Nd5# (Checkmate)!"
  },
  successExplanation: "Masterclass Calculation! You saw right through the famous Légal's Trap. Instead of falling for the poisoned Queen on d1, you eliminated the key attacker on e5 and won a full piece!"
};

/**
 * Elo Rating Calculation
 * Starting Rating: 1250
 * Dynamic K-factor with trap detection and high-conviction bonuses
 */
export function calculateNewElo(
  userRating: number,
  puzzleRating: number,
  score: number,
  isBlunderOnTrap: boolean = false
): number {
  if (isBlunderOnTrap) {
    // Falling for an elementary opening trap routes to the Beginner bracket (<900)
    return Math.min(880, Math.round(userRating - 320));
  }

  // Dynamic K-factor to allow full calibration range (800 - 2050) across 3 puzzles
  let K = 140;
  if (score >= 0.9) K = 180;
  else if (score >= 0.8) K = 150;
  else if (score <= 0.2) K = 160;

  const expected = 1 / (1 + Math.pow(10, (puzzleRating - userRating) / 400));
  const newRating = userRating + K * (score - expected);
  return Math.round(newRating);
}

/**
 * Locked Level Mapping
 * < 900: Beginner
 * 900 – 1199: Advanced Beginner
 * 1200 – 1599: Intermediate
 * 1600 – 1799: Intermediate 2
 * 1800 – 1999: High Intermediate
 * 2000+: Advanced
 */
export function mapEloToLevel(elo: number): {
  levelName: string;
  tierId: LevelType;
  colorClass: string;
} {
  if (elo < 900) {
    return { levelName: "Beginner", tierId: "beginner", colorClass: "text-emerald-500" };
  }
  if (elo < 1200) {
    return { levelName: "Advanced Beginner", tierId: "adv_beginner", colorClass: "text-sky-500" };
  }
  if (elo < 1600) {
    return { levelName: "Intermediate", tierId: "intermediate", colorClass: "text-indigo-500" };
  }
  if (elo < 1800) {
    return { levelName: "Intermediate 2", tierId: "intermediate", colorClass: "text-violet-500" };
  }
  if (elo < 2000) {
    return { levelName: "High Intermediate", tierId: "advanced", colorClass: "text-amber-500" };
  }
  return { levelName: "Advanced", tierId: "advanced", colorClass: "text-rose-500" };
}

/**
 * Compute move score for Puzzle 2 & 3 based on precision, commitment, help, and blunder penalties.
 */
export function computeMoveScore(
  isBestMove: boolean,
  isGoodMove: boolean,
  commitment: CommitmentLevel | null,
  helpUsed: HelpType,
  blunderedOnSure: boolean
): number {
  let score = 0;

  if (helpUsed === "none") {
    if (isBestMove) {
      if (commitment === "sure") score = 1.00;
      else if (commitment === "think_so") score = 0.82;
      else if (commitment === "guessing") score = 0.60;
      else score = 1.00;
    } else if (isGoodMove) {
      if (commitment === "sure") score = 0.55;
      else if (commitment === "think_so") score = 0.48;
      else if (commitment === "guessing") score = 0.40;
      else score = 0.50;
    }
  } else {
    // After Help
    if (helpUsed === "try_again") score = 0.42;
    else if (helpUsed === "hint") score = 0.28;
    else if (helpUsed === "solution") score = 0.08;
    else score = 0.00;
  }

  // Extra penalty (-0.15) if user chose "Sure" and played a clear blunder / wrong move
  if (blunderedOnSure) {
    score = Math.max(0, score - 0.15);
  }

  return Math.round(score * 100) / 100;
}

/**
 * All available offline Lichess puzzles with numerical ratings extracted
 */
let cachedAllPuzzles: (ChessPuzzle & { numericRating: number })[] | null = null;

export function getAllPuzzlesWithRatings(): (ChessPuzzle & { numericRating: number })[] {
  if (cachedAllPuzzles) return cachedAllPuzzles;

  const pool: (ChessPuzzle & { numericRating: number })[] = [];
  const addedIds = new Set<string>();

  const processPuzzle = (p: ChessPuzzle) => {
    if (!p || addedIds.has(p.id)) return;
    addedIds.add(p.id);
    const match = p.ratingBadge?.match(/\d+/);
    const rating = match ? parseInt(match[0], 10) : 1200;
    pool.push({ ...p, numericRating: rating });
  };

  // 1. Process continuous puzzles
  (CONTINUOUS_PUZZLES || []).forEach(processPuzzle);

  // 2. Process diagnostic categories
  Object.values(LICHESS_DIAGNOSTIC_CATEGORIES || {}).forEach((list) => {
    (list || []).forEach(processPuzzle);
  });

  cachedAllPuzzles = pool;
  return cachedAllPuzzles;
}

/**
 * Adaptive Puzzle Selector: finds a puzzle matching targetElo
 */
export function selectAdaptivePuzzle(
  targetElo: number,
  excludeIds: string[] = []
): ChessPuzzle & { numericRating: number } {
  const pool = getAllPuzzlesWithRatings();
  const excludeSet = new Set(excludeIds);

  const available = pool.filter((p) => !excludeSet.has(p.id));
  if (available.length === 0) {
    return pool[0];
  }

  // Sort by closest rating distance
  available.sort((a, b) => {
    const diffA = Math.abs(a.numericRating - targetElo);
    const diffB = Math.abs(b.numericRating - targetElo);
    return diffA - diffB;
  });

  // Pick from the top 5 closest to provide subtle variation
  const candidates = available.slice(0, Math.min(5, available.length));
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

/**
 * Detect Behavioral Pattern & Insight Templates
 */
export const INSIGHT_TEMPLATES: Record<string, BehavioralInsight> = {
  clean_run: {
    patternId: "clean_run",
    patternName: "Clean Run",
    insight: "You handled the positions cleanly. Your foundation is solid for the next level of complexity.",
    strength: "Consistency and clarity",
    weakness: "Need for higher complexity",
  },
  strong_recovery: {
    patternId: "strong_recovery",
    patternName: "Strong Recovery",
    insight: "You recover well after mistakes. That resilience is a real strength.",
    strength: "Resilience and problem-solving",
    weakness: "First-move accuracy",
  },
  heavy_help: {
    patternId: "heavy_help",
    patternName: "Heavy Help Usage",
    insight: "The key patterns aren’t fully automatic yet. Focused repetition will make a big difference.",
    strength: "Persistence",
    weakness: "Automatic pattern recognition",
  },
  high_conviction_accurate: {
    patternId: "high_conviction_accurate",
    patternName: "High Conviction + Accurate",
    insight: "When you feel sure, you are usually right. Trust your calculation more often.",
    strength: "Strong self-trust and calculation",
    weakness: "Occasional over-extension",
  },
  high_conviction_inaccurate: {
    patternId: "high_conviction_inaccurate",
    patternName: "High Conviction + Inaccurate",
    insight: "You often feel confident, but your calculation doesn’t always support it yet.",
    strength: "Willingness to decide",
    weakness: "Verification of ideas",
  },
  low_conviction_accurate: {
    patternId: "low_conviction_accurate",
    patternName: "Low Conviction + Accurate",
    insight: "You play good moves, but you doubt yourself too much. Trust your instincts.",
    strength: "Accurate tactical vision",
    weakness: "Self-trust under pressure",
  },
  mixed_profile: {
    patternId: "mixed_profile",
    patternName: "Balanced Pragmatist",
    insight: "You balance calculation with pragmatic risk. Targeted practice will stabilize your peak level.",
    strength: "Pragmatic adaptability",
    weakness: "Complex calculation depth",
  },
};

/**
 * Classify behavioral pattern based on attempt history
 */
export function classifyBehavioralPattern(history: PuzzleAttemptRecord[]): BehavioralInsight {
  if (!history || history.length === 0) {
    return INSIGHT_TEMPLATES.clean_run;
  }

  const p1 = history[0];
  const p2 = history[1];
  const p3 = history[2];

  const totalHelpCount = history.filter((h) => h.helpUsed !== "none").length;
  const allFirstTry = history.every((h) => h.firstTryCorrect);
  const p2Sure = p2?.commitment === "sure";
  const p3Sure = p3?.commitment === "sure";
  const p2Accurate = p2?.firstTryCorrect;
  const p3Accurate = p3?.firstTryCorrect;

  // 1. Heavy Help Usage
  if (totalHelpCount >= 2) {
    return INSIGHT_TEMPLATES.heavy_help;
  }

  // 2. High Conviction + Accurate
  if ((p2Sure && p2Accurate) || (p3Sure && p3Accurate)) {
    if ((p2Sure && !p2Accurate) || (p3Sure && !p3Accurate)) {
      return INSIGHT_TEMPLATES.high_conviction_inaccurate;
    }
    return INSIGHT_TEMPLATES.high_conviction_accurate;
  }

  // 3. High Conviction + Inaccurate
  if ((p2Sure && !p2Accurate) || (p3Sure && !p3Accurate)) {
    return INSIGHT_TEMPLATES.high_conviction_inaccurate;
  }

  // 4. Low Conviction + Accurate
  const lowConviction =
    (p2?.commitment === "guessing" || p2?.commitment === "think_so") &&
    (p3?.commitment === "guessing" || p3?.commitment === "think_so");
  if (lowConviction && p2Accurate && p3Accurate) {
    return INSIGHT_TEMPLATES.low_conviction_accurate;
  }

  // 5. Strong Recovery (failed P1/P2 then cleanly solved P3)
  if (!p1.firstTryCorrect && p3?.firstTryCorrect) {
    return INSIGHT_TEMPLATES.strong_recovery;
  }

  // 6. Clean Run
  if (allFirstTry && totalHelpCount === 0) {
    return INSIGHT_TEMPLATES.clean_run;
  }

  return INSIGHT_TEMPLATES.mixed_profile;
}
