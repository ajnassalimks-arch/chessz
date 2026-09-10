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

// Fixed Puzzle 1: Clean, easy hanging piece (~880–950 Elo, no commitment)
export const FIXED_PUZZLE_1: ChessPuzzle = {
  id: "lichess_00dzT",
  lichessId: "00dzT",
  tier: "adv_beginner",
  track: "tactical",
  title: "Level Calibrator 1: Hanging Piece Radar",
  ratingBadge: "Lichess: ~881",
  initialFen: "6k1/1Q4p1/p1p4p/3pP3/P3bq2/2N4P/1P4P1/5B1K b - - 2 26",
  playerColor: "black",
  prompt: "Black to move: White's bishop on f1 is completely unguarded. Find the killer strike!",
  ruleTitle: "The 2-Second Bodyguard Rule",
  ruleBody: "Before touching any piece, scan the board for undefended pieces. Never miss free material.",
  solutionMoves: [
    {
      from: "f4",
      to: "f1",
      san: "Qxf1+",
      explanation: "Qxf1+ captures the hanging bishop with check!"
    }
  ],
  defaultRefutation: {
    from: "h1",
    to: "h2",
    san: "Kh2",
    coachExplanation: "Opponent plays Kh2 to escape. Always take undefended pieces first!"
  },
  successExplanation: "Spot on! The bishop was undefended. Capturing with check seals the tactical win."
};

/**
 * Elo Rating Calculation
 * Starting Rating: 1250
 * K-factor: 120
 * Expected = 1 / (1 + 10^((PuzzleRating - UserRating) / 400))
 * NewRating = OldRating + 120 * (Score - Expected)
 */
export function calculateNewElo(userRating: number, puzzleRating: number, score: number): number {
  const K = 120;
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
    insight: "You see the right ideas more often than you trust them. Your intuition is better than you think.",
    strength: "Good underlying vision",
    weakness: "Confidence in your own reads",
  },
  low_conviction_inaccurate: {
    patternId: "low_conviction_inaccurate",
    patternName: "Low Conviction + Inaccurate",
    insight: "You are still building both accuracy and confidence. Focus on clear, forcing moves first.",
    strength: "Openness to improvement",
    weakness: "Both accuracy and decisiveness",
  },
};

export function classifyBehavioralPattern(attempts: PuzzleAttemptRecord[]): BehavioralInsight {
  if (!attempts || attempts.length === 0) {
    return INSIGHT_TEMPLATES.clean_run;
  }

  const cleanAll = attempts.every((a) => a.helpUsed === "none" && a.firstTryCorrect);
  const helpCount = attempts.filter((a) => a.helpUsed === "hint" || a.helpUsed === "solution").length;
  const p1Missed = !attempts[0]?.firstTryCorrect;
  const p2Missed = attempts[1] && !attempts[1].firstTryCorrect;
  const p3Clean = attempts[2] && attempts[2].helpUsed === "none" && attempts[2].firstTryCorrect;

  // 1. Heavy Help Usage (>= 2 hints or solutions)
  if (helpCount >= 2) {
    return INSIGHT_TEMPLATES.heavy_help;
  }

  // 2. High Conviction + Inaccurate (Chose "Sure" but blundered/needed help in p2 or p3)
  const overconfident = attempts.some(
    (a) => a.commitment === "sure" && !a.firstTryCorrect
  );
  if (overconfident) {
    return INSIGHT_TEMPLATES.high_conviction_inaccurate;
  }

  // 3. Clean Run (All 3 solved first try without help)
  if (cleanAll) {
    // If they were confident, highlight High Conviction + Accurate
    const confident = attempts.some((a) => a.commitment === "sure" || a.commitment === "think_so");
    if (confident && attempts.every((a) => a.commitment !== "guessing")) {
      return INSIGHT_TEMPLATES.high_conviction_accurate;
    }
    return INSIGHT_TEMPLATES.clean_run;
  }

  // 4. Strong Recovery (Struggled in P1 or P2, but solved P3 cleanly)
  if ((p1Missed || p2Missed) && p3Clean) {
    return INSIGHT_TEMPLATES.strong_recovery;
  }

  // 5. Low Conviction + Accurate (Guessed/unsure on p2 or p3, but got it right!)
  const underconfident = attempts.some(
    (a) => (a.commitment === "guessing" || a.commitment === "think_so") && a.firstTryCorrect
  );
  if (underconfident) {
    return INSIGHT_TEMPLATES.low_conviction_accurate;
  }

  // 6. Low Conviction + Inaccurate (Guessed and missed)
  const guessedAndMissed = attempts.some(
    (a) => a.commitment === "guessing" && !a.firstTryCorrect
  );
  if (guessedAndMissed) {
    return INSIGHT_TEMPLATES.low_conviction_inaccurate;
  }

  // Fallback default
  return INSIGHT_TEMPLATES.high_conviction_accurate;
}
