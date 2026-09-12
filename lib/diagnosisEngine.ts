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
  userMoveSan?: string;
  status?: "best" | "inaccurate" | "blunder";
  bestMoveSan?: string;
  coachExplanation?: string;
  ruleTitle?: string;
  ruleBody?: string;
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

// 10 Curated & Fully Explained Tactical Benchmark Puzzles (Ratings 850 - 1750)
export interface Puzzle1BranchResult {
  branchType: "best" | "blunder_trap" | "inaccurate_recapture" | "threat_missed";
  status: "best" | "inaccurate" | "blunder";
  score: number;
  userMoveSan: string;
  bestMoveSan: string;
  coachFeedback: string;
  calibratedElo: number;
  ruleTitle: string;
  ruleBody: string;
  refutationMoves?: { from: string; to: string; san: string }[];
}

export const BENCHMARK_PUZZLE_POOL: (ChessPuzzle & { numericRating: number })[] = [
  // 1. The Immortal Légal's Bait Trap (~1350 FIDE)
  {
    id: "bench_legal_trap",
    lichessId: "legal_1750",
    tier: "intermediate",
    track: "tactical",
    title: "Opening Benchmark: Légal's Counter-Trap",
    ratingBadge: "Benchmark ~1350",
    numericRating: 1350,
    initialFen: "r2qkbnr/ppp2ppp/2np4/4N2b/2B1P3/2N4P/PPPP1PP1/R1BQK2R b KQkq - 0 6",
    playerColor: "black",
    prompt: "Black to move: White just sacrificed their Queen with 6. Nxe5. Find the tactical refutation.",
    ruleTitle: "The Poisoned Bait Rule",
    ruleBody: "When an opponent leaves a major piece undefended, stop! Calculate forcing counter-attacks before touching the bait.",
    solutionMoves: [
      { from: "c6", to: "e5", san: "Nxe5", explanation: "Nxe5! Eliminates the checkmate threat on f7 and guards the bishop on h5." },
      { from: "e5", to: "c4", san: "Nxc4", explanation: "Nxc4! Black captures White's bishop, emerging with an extra piece (+3.5)." }
    ],
    opponentResponses: [
      { from: "d1", to: "h5", san: "Qxh5", explanation: "White recaptures the bishop on h5." }
    ],
    defaultRefutation: {
      from: "h5", to: "d1", san: "Bxd1",
      coachExplanation: "Fatal Trap! 1... Bxd1?? walks into 2. Bxf7+ Ke7 3. Nd5# (Checkmate)!"
    },
    successExplanation: "Masterclass Calculation! Instead of taking the bait on d1, you eliminated the attacker on e5 and won the bishop on c4."
  },

  // 2. The Central Double Attack (~850 FIDE)
  {
    id: "bench_fork_double_threat",
    lichessId: "fork_850",
    tier: "beginner",
    track: "tactical",
    title: "Tactical Benchmark: Central Fork",
    ratingBadge: "Benchmark ~850",
    numericRating: 850,
    initialFen: "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/2P2N2/PPP2PPP/R1BQK2R w KQkq - 0 7",
    playerColor: "white",
    prompt: "White to move: Black just seized e4 with their knight. Spot the tactical double attack.",
    ruleTitle: "The Double Threat Rule",
    ruleBody: "Look for Queen moves that create two lethal threats at the same time.",
    solutionMoves: [
      { from: "d1", to: "d5", san: "Qd5", explanation: "Qd5! Threatens mate on f7 and attacks the loose knight on e4." }
    ],
    defaultRefutation: {
      from: "e4", to: "f6", san: "Nf6",
      coachExplanation: "Black parries the mate, but White takes the knight on e4, winning material."
    },
    successExplanation: "Sharp eye! 1. Qd5 creates an inescapable dual threat: checkmate on f7 and the capture of the e4 knight."
  },

  // 3. Back Rank Deflection Decoy (~1050 FIDE)
  {
    id: "bench_backrank_decoy",
    lichessId: "backrank_1050",
    tier: "adv_beginner",
    track: "tactical",
    title: "Corridor Benchmark: Back-Rank Overload",
    ratingBadge: "Benchmark ~1050",
    numericRating: 1050,
    initialFen: "4r1k1/5ppp/8/8/8/2Q5/5PPP/4R1K1 w - - 0 1",
    playerColor: "white",
    prompt: "White to move: Black's back rank is defended only by their rook. Exploit the corridor.",
    ruleTitle: "The Back-Rank Corridor Rule",
    ruleBody: "When an opponent's king has no breathing room (luft), an overloaded defender can be removed.",
    solutionMoves: [
      { from: "e1", to: "e8", san: "Rxe8#", explanation: "Rxe8#! Back-rank corridor checkmate." }
    ],
    defaultRefutation: {
      from: "c3", to: "c7", san: "Qc7",
      coachExplanation: "Passive move allows Black to defend with Re6 or h6."
    },
    successExplanation: "Flawless! 1. Rxe8# delivers an instant back-rank checkmate because Black has no escape square."
  },

  // 4. Overworked Absolute Pin (~1180 FIDE)
  {
    id: "bench_pin_overworked",
    lichessId: "pin_1180",
    tier: "adv_beginner",
    track: "tactical",
    title: "Pin Benchmark: Eliminating the Defender",
    ratingBadge: "Benchmark ~1180",
    numericRating: 1180,
    initialFen: "r1b1k2r/pppp1ppp/2n5/4p3/1bB1P3/2NP1N2/PPP2PPP/R2QK2R b KQkq - 0 7",
    playerColor: "black",
    prompt: "Black to move: White's knight on c3 is pinned to the king. Shatter White's pawn structure.",
    ruleTitle: "The Pinned Piece Rule",
    ruleBody: "A pinned piece cannot defend adjacent squares and often leaves permanent pawn weaknesses upon capture.",
    solutionMoves: [
      { from: "b4", to: "c3", san: "Bxc3+", explanation: "Bxc3+! Shatters White's queenside pawns with check." }
    ],
    opponentResponses: [
      { from: "b2", to: "c3", san: "bxc3", explanation: "White is forced to recapture with the b-pawn." }
    ],
    defaultRefutation: {
      from: "d7", to: "d6", san: "d6",
      coachExplanation: "Quiet move allows White to castle (O-O) and unpin their knight."
    },
    successExplanation: "Crisp execution! 1... Bxc3+ forces bxc3, permanently ruining White's queenside pawn structure."
  },

  // 5. Philidor Smothered Mate Decoy (~1280 FIDE)
  {
    id: "bench_smothered_decoy",
    lichessId: "smothered_1280",
    tier: "intermediate",
    track: "tactical",
    title: "Mating Net: Smothered Geometry",
    ratingBadge: "Benchmark ~1280",
    numericRating: 1280,
    initialFen: "6k1/5Npp/8/8/8/8/8/1Q4K1 w - - 0 1",
    playerColor: "white",
    prompt: "White to move: Coordinate queen and knight to deliver an inescapable finish.",
    ruleTitle: "The Smothered Net Rule",
    ruleBody: "When a king is surrounded by its own pieces, a knight check can be immediately fatal.",
    solutionMoves: [
      { from: "b1", to: "b8", san: "Qb8#", explanation: "Qb8#! King is trapped behind its own pawns." }
    ],
    defaultRefutation: {
      from: "f7", to: "h6", san: "Nh6+",
      coachExplanation: "Nh6+ gives Black a chance to move Kf8 or Kh8 without decisive consequence."
    },
    successExplanation: "Decisive calculation! 1. Qb8# exploits the cornered king for an immediate victory."
  },

  // 6. Greek Gift Sacrifice (~1520 FIDE)
  {
    id: "bench_greek_gift",
    lichessId: "greekgift_1520",
    tier: "intermediate",
    track: "tactical",
    title: "Kingside Benchmark: Classical Destruction",
    ratingBadge: "Benchmark ~1520",
    numericRating: 1520,
    initialFen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 8",
    playerColor: "white",
    prompt: "White to move: Black castled into the classical Greek Gift vulnerability. Uncage the kingside assault.",
    ruleTitle: "The Greek Gift Sacrifice Rule",
    ruleBody: "When your bishop stares at h7 with a supporting knight ready to jump to g5 and queen to h5, sacrifice the bishop!",
    solutionMoves: [
      { from: "d3", to: "h7", san: "Bxh7+", explanation: "Bxh7+! Strips Black's king of protective pawn shelter." },
      { from: "f3", to: "g5", san: "Ng5+", explanation: "Ng5+! Brings the knight in with tempo, clearing the way for Qh5." }
    ],
    opponentResponses: [
      { from: "g8", to: "h7", san: "Kxh7", explanation: "Black is forced to accept the sacrificial bishop." }
    ],
    defaultRefutation: {
      from: "e1", to: "g1", san: "O-O",
      coachExplanation: "Castling allows Black to play Re8 or h6, eliminating the mating attack entirely."
    },
    successExplanation: "Grandmaster attacking instinct! 1. Bxh7+! Kxh7 2. Ng5+ initiates the legendary kingside destruction."
  },

  // 7. Anastasia's Mate Corridor (~1420 FIDE)
  {
    id: "bench_anastasia_corridor",
    lichessId: "anastasia_1420",
    tier: "intermediate",
    track: "tactical",
    title: "Mating Net: Anastasia's Corridor",
    ratingBadge: "Benchmark ~1420",
    numericRating: 1420,
    initialFen: "5rk1/1p3ppp/8/4N3/8/8/5PPP/1R4K1 w - - 0 1",
    playerColor: "white",
    prompt: "White to move: Black's b7 pawn is undefended. Seize the open file with maximum tempo.",
    ruleTitle: "The Open File Infiltration Rule",
    ruleBody: "Rooks belong on open files and the 7th rank where enemy pawns are completely exposed.",
    solutionMoves: [
      { from: "b1", to: "b7", san: "Rxb7", explanation: "Rxb7! Invades the 7th rank and wins clean material." }
    ],
    defaultRefutation: {
      from: "e5", to: "d7", san: "Nd7",
      coachExplanation: "Nd7 allows Black to contest the b-file with Rb8."
    },
    successExplanation: "Clean technique! 1. Rxb7 establishes an active rook on the 7th rank with a decisive advantage."
  },

  // 8. Noah's Ark Trapped Bishop (~1120 FIDE)
  {
    id: "bench_noah_ark_trap",
    lichessId: "noah_1120",
    tier: "adv_beginner",
    track: "tactical",
    title: "Tactical Benchmark: Trapping the Piece",
    ratingBadge: "Benchmark ~1120",
    numericRating: 1120,
    initialFen: "r1bqkb1r/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 5",
    playerColor: "black",
    prompt: "Black to move: Push White's Spanish bishop into a restricted square.",
    ruleTitle: "The Piece Mobility Rule",
    ruleBody: "A piece without retreating squares is vulnerable to pawn chains.",
    solutionMoves: [
      { from: "b7", to: "b5", san: "b5", explanation: "b5! Kicks White's bishop to b3." },
      { from: "c6", to: "a5", san: "Na5", explanation: "Na5! Traps the light-squared bishop." }
    ],
    opponentResponses: [
      { from: "a4", to: "b3", san: "Bb3", explanation: "Bishop retreats to b3." }
    ],
    defaultRefutation: {
      from: "d7", to: "d6", san: "d6",
      coachExplanation: "Passive move allows White to castle comfortably without threat."
    },
    successExplanation: "High-level opening vision! 1... b5 2. Bb3 Na5 corners White's prized Spanish bishop."
  },

  // 9. Absolute Rank Skewer (~1620 FIDE)
  {
    id: "bench_rank_skewer",
    lichessId: "skewer_1620",
    tier: "advanced",
    track: "tactical",
    title: "Endgame Benchmark: The Absolute Skewer",
    ratingBadge: "Benchmark ~1620",
    numericRating: 1620,
    initialFen: "r3k3/8/8/8/8/6R1/5PPP/6K1 w - - 0 1",
    playerColor: "white",
    prompt: "White to move: Black's king and rook share the 8th rank. Fire the skewer.",
    ruleTitle: "The Absolute Skewer Rule",
    ruleBody: "When a king is attacked with a valuable piece directly behind it on the line of sight, the piece behind is lost.",
    solutionMoves: [
      { from: "g3", to: "g8", san: "Rg8+", explanation: "Rg8+! Forces Black's king to move, leaving the a8 rook undefended." },
      { from: "g8", to: "a8", san: "Rxa8", explanation: "Rxa8! Captures the black rook, winning the game." }
    ],
    opponentResponses: [
      { from: "e8", to: "d7", san: "Kd7", explanation: "King moves away from the check." }
    ],
    defaultRefutation: {
      from: "g3", to: "c3", san: "Rc3",
      coachExplanation: "Rc3 lets Black consolidate with Ke7 or Kd7."
    },
    successExplanation: "Lethal endgame vision! 1. Rg8+ checks the king and skewers the a8 rook behind it for a clean win."
  },

  // 10. Clearance Destruction (~1750 FIDE)
  {
    id: "bench_clearance_kingside",
    lichessId: "clearance_1750",
    tier: "advanced",
    track: "tactical",
    title: "Master Benchmark: Kingside Clearance",
    ratingBadge: "Benchmark ~1750",
    numericRating: 1750,
    initialFen: "r4rk1/pp1b1ppp/1q2p3/3pP3/3P4/bP1BPN2/P5PP/R2Q1RK1 w - - 0 15",
    playerColor: "white",
    prompt: "White to move: Black's king is vulnerable to a kingside breakthrough. Sacrifice to clear the decisive line.",
    ruleTitle: "The Clearance Sacrifice Rule",
    ruleBody: "Sacrifice a minor piece to open lines of communication for your queen and remaining attackers.",
    solutionMoves: [
      { from: "d3", to: "h7", san: "Bxh7+", explanation: "Bxh7+! Destroys Black's kingside pawn shield." },
      { from: "f3", to: "g5", san: "Ng5+", explanation: "Ng5+! Brings the knight in with check." }
    ],
    opponentResponses: [
      { from: "g8", to: "h7", san: "Kxh7", explanation: "Black accepts the bishop sacrifice." }
    ],
    defaultRefutation: {
      from: "d1", to: "c2", san: "Qc2",
      coachExplanation: "Slow move allows Black to play g6 or h6, fortifying the castle."
    },
    successExplanation: "Grandmaster-level breakthrough! 1. Bxh7+! Kxh7 2. Ng5+ leaves Black's king defenseless against Queen invasion."
  }
];

// Preserved for backwards compatibility
export const FIXED_PUZZLE_1: ChessPuzzle = BENCHMARK_PUZZLE_POOL[0];

/**
 * Samples 3 distinct random benchmark puzzles across difficulty levels:
 * - Puzzle 1: Fundamental / Tactical awareness (~850 - 1180)
 * - Puzzle 2: Intermediate / Dynamic calculation (~1280 - 1520)
 * - Puzzle 3: Advanced / Deep visualization (~1520 - 1750)
 */
export function getRandomBenchmarkTrio(): (ChessPuzzle & { numericRating: number })[] {
  const tier1 = BENCHMARK_PUZZLE_POOL.filter((p) => p.numericRating <= 1180);
  const tier2 = BENCHMARK_PUZZLE_POOL.filter((p) => p.numericRating > 1180 && p.numericRating <= 1520);
  const tier3 = BENCHMARK_PUZZLE_POOL.filter((p) => p.numericRating > 1400);

  const p1 = tier1[Math.floor(Math.random() * tier1.length)] || BENCHMARK_PUZZLE_POOL[1];
  const p2 = tier2.filter((p) => p.id !== p1.id)[Math.floor(Math.random() * Math.max(1, tier2.length - 1))] || BENCHMARK_PUZZLE_POOL[0];
  const p3Candidates = tier3.filter((p) => p.id !== p1.id && p.id !== p2.id);
  const p3 = p3Candidates[Math.floor(Math.random() * p3Candidates.length)] || BENCHMARK_PUZZLE_POOL[8];

  return [p1, p2, p3];
}

/**
 * Universal evaluator for any puzzle in the benchmark pool
 */
export function evaluateBenchmarkMove(
  puzzle: ChessPuzzle,
  from: string,
  to: string,
  currentRating: number = 1250
): Puzzle1BranchResult {
  const ruleTitle = puzzle.ruleTitle || "Tactical Precision Rule";
  const ruleBody = puzzle.ruleBody || "Calculate forcing checks, captures, and threats before deciding.";
  const firstStep = puzzle.solutionMoves[0];
  const isBest = firstStep && firstStep.from === from && firstStep.to === to;

  // Granular handling for Légal's Trap specifically
  if (puzzle.id === "bench_legal_trap" || puzzle.id === "trap_legal_queen_bait") {
    if (from === "c6" && to === "e5") {
      return {
        branchType: "best",
        status: "best",
        score: 1.0,
        userMoveSan: "1... Nxe5",
        bestMoveSan: "1... Nxe5! 2. Qxh5 Nxc4!",
        calibratedElo: 1480,
        coachFeedback: "Masterclass Calculation: You neutralized White's f7 checkmate threat by eliminating the knight on e5, then won White's bishop on c4 (+3.5 advantage).",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "h5" && to === "d1") {
      return {
        branchType: "blunder_trap",
        status: "blunder",
        score: 0.0,
        userMoveSan: "1... Bxd1??",
        bestMoveSan: "1... Nxe5! 2. Qxh5 Nxc4!",
        calibratedElo: 820,
        coachFeedback: "Tactical Blunder: Capturing the Queen on d1 walked directly into Légal's Trap. White delivers forced checkmate with 2. Bxf7+ Ke7 3. Nd5#.",
        ruleTitle,
        ruleBody,
        refutationMoves: [
          { from: "c4", to: "f7", san: "Bxf7+" },
          { from: "e8", to: "e7", san: "Ke7" },
          { from: "c3", to: "d5", san: "Nd5#" }
        ]
      };
    }
  }

  const numeric = (puzzle as any).numericRating || 1250;

  if (isBest) {
    const eloGain = Math.round(180 * (1 - 1 / (1 + Math.pow(10, (numeric - currentRating) / 400))));
    return {
      branchType: "best",
      status: "best",
      score: 1.0,
      userMoveSan: firstStep.san,
      bestMoveSan: puzzle.solutionMoves.map((m) => m.san).join(" "),
      calibratedElo: Math.min(2100, currentRating + Math.max(160, eloGain)),
      coachFeedback: `Accurate Calculation: ${puzzle.successExplanation}`,
      ruleTitle,
      ruleBody,
    };
  }

  // Refutation or blunder
  const eloLoss = Math.round(200 * (1 / (1 + Math.pow(10, (numeric - currentRating) / 400))));
  return {
    branchType: "threat_missed",
    status: "blunder",
    score: 0.0,
    userMoveSan: `${from}-${to}`,
    bestMoveSan: puzzle.solutionMoves.map((m) => m.san).join(" "),
    calibratedElo: Math.max(600, currentRating - Math.max(180, eloLoss)),
    coachFeedback: puzzle.defaultRefutation?.coachExplanation || "Inaccurate continuation. The winning tactical line was missed.",
    ruleTitle,
    ruleBody,
  };
}

export function evaluatePuzzle1Move(from: string, to: string, currentRating: number = 1250): Puzzle1BranchResult {
  return evaluateBenchmarkMove(FIXED_PUZZLE_1, from, to, currentRating);
}


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
    return Math.min(880, Math.round(userRating - 370));
  }

  // Dynamic K-factor to allow full calibration range (600 - 2100) across 3 puzzles
  let K = 160;
  if (score >= 0.95) {
    // High conviction + accurate: accelerate climb to allow High Intermediate and Advanced tiers
    K = userRating >= 1650 ? 320 : 270;
  } else if (score >= 0.8) {
    K = 180;
  } else if (score <= 0.2) {
    K = 220;
  }

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
