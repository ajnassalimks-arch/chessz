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
  branchType: "best" | "blunder_trap" | "inaccurate_recapture" | "threat_missed" | "passive_retreat" | "solid_defense";
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

// Stage 1: Historic Opening Radar & Bait Traps (~800 - 1350 FIDE)
export const HISTORICAL_BENCHMARKS_STAGE_1: (ChessPuzzle & { numericRating: number })[] = [
  // 1A. Légal's Counter-Trap (Sire de Légal, 1750)
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

  // 1B. The Elephant Trap (Queen's Gambit Declined, Cambridge Springs)
  {
    id: "bench_elephant_trap",
    lichessId: "elephant_1150",
    tier: "adv_beginner",
    track: "tactical",
    title: "Historical Benchmark: The Elephant Trap",
    ratingBadge: "Benchmark ~1150",
    numericRating: 1150,
    initialFen: "r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6",
    playerColor: "black",
    prompt: "Black to move: White just played 6. Nxd5??, thinking your Knight on f6 is pinned to your Queen. Spot the tactical refutation!",
    ruleTitle: "The False Absolute Pin",
    ruleBody: "A pinned piece can still move if the resulting counter-attack delivers check against the opponent's king!",
    solutionMoves: [
      { from: "f6", to: "d5", san: "Nxd5", explanation: "Nxd5! Shatters the illusion of the pin on your Queen." },
      { from: "f8", to: "b4", san: "Bb4+", explanation: "Bb4+! Decisive check forcing White to interpose their Queen." },
      { from: "b4", to: "d2", san: "Bxd2+", explanation: "Bxd2+! Captures White's queen." },
      { from: "e8", to: "d8", san: "Kxd8", explanation: "Kxd8! Black emerges with an extra minor piece (+3.0)." }
    ],
    opponentResponses: [
      { from: "g5", to: "d8", san: "Bxd8", explanation: "White greedily captures your Queen on d8." },
      { from: "d1", to: "d2", san: "Qd2", explanation: "White is forced to block the check with their Queen." },
      { from: "e1", to: "d2", san: "Kxd2", explanation: "White recaptures the bishop on d2." }
    ],
    defaultRefutation: {
      from: "c7", to: "c6", san: "c6",
      coachExplanation: "c6 is a solid defense kicking the knight, but misses 1... Nxd5! which wins a full piece immediately."
    },
    successExplanation: "Masterclass Trap! You saw that the pin was an illusion: after 7. Bxd8 Bb4+! 8. Qd2 Bxd2+ 9. Kxd2 Kxd8, Black emerges with an extra minor piece (+3.0)!"
  },

  // 1C. The Blackburne Shilling Counter-Trap (Italian Game)
  {
    id: "bench_blackburne_shilling",
    lichessId: "blackburne_950",
    tier: "beginner",
    track: "tactical",
    title: "Historical Benchmark: Blackburne Shilling Trap",
    ratingBadge: "Benchmark ~950",
    numericRating: 950,
    initialFen: "r1bqkbnr/pppp1ppp/8/4N3/2BnP3/8/PPPP1PPP/RNBQK2R b KQkq - 0 4",
    playerColor: "black",
    prompt: "Black to move: White arrogantly played 4. Nxe5?, attacking f7 with two pieces. Uncage the tactical counter-strike!",
    ruleTitle: "The Poisoned f7 Sac",
    ruleBody: "When an opponent rushes into f7 prematurely, look for counter-attacks against their loose pieces and kingside pawns.",
    solutionMoves: [
      { from: "d8", to: "g5", san: "Qg5", explanation: "Qg5! Creates a double threat on White's e5 knight and the g2 pawn." },
      { from: "g5", to: "g2", san: "Qxg2", explanation: "Qxg2! Invades White's kingside and threatens the rook on h1." },
      { from: "g2", to: "e4", san: "Qxe4+", explanation: "Qxe4+! Checks the White king, forcing Be2." },
      { from: "d4", to: "f3", san: "Nf3#", explanation: "Nf3#! Smothered checkmate on the White king!" }
    ],
    opponentResponses: [
      { from: "e5", to: "f7", san: "Nxf7", explanation: "White forks Black's Queen and Rook on f7." },
      { from: "h1", to: "f1", san: "Rf1", explanation: "White scrambles to save the rook." },
      { from: "c4", to: "e2", san: "Be2", explanation: "White interposes the bishop." }
    ],
    defaultRefutation: {
      from: "d8", to: "e7", san: "Qe7",
      coachExplanation: "Qe7 pins the knight and regains the pawn, but misses 1... Qg5! which delivers a crushing knockout attack."
    },
    successExplanation: "Grandmaster Counter-Attack! 1... Qg5! attacks White's knight and g2 pawn, leading to the legendary smothered mate or winning decisive material!"
  }
];

// Stage 2: Historic Tactical Geometry & Double Attacks (~850 - 1250 FIDE)
export const HISTORICAL_BENCHMARKS_STAGE_2: (ChessPuzzle & { numericRating: number })[] = [
  // 2A. The Central Double Attack (~850 FIDE)
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

  // 2B. Paul Morphy's Opera Game Deflection (Paris, 1858)
  {
    id: "bench_morphy_opera",
    lichessId: "morphy_1250",
    tier: "intermediate",
    track: "tactical",
    title: "Historical Benchmark: Morphy's Opera Game Deflection",
    ratingBadge: "Benchmark ~1250",
    numericRating: 1250,
    initialFen: "3rkb1r/p2nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 3 13",
    playerColor: "white",
    prompt: "White to move: Morphy has pinned Black's pieces to the King on e8. Shatter Black's defense with a forcing exchange sacrifice!",
    ruleTitle: "The Pinned Piece Shatter Rule",
    ruleBody: "When an opponent's piece is pinned to the King, sacrifice material to remove defenders and break open the fortress.",
    solutionMoves: [
      { from: "d1", to: "d7", san: "Rxd7", explanation: "Rxd7! Morphy's classic sacrifice eliminating Black's pinned knight defender." },
      { from: "h1", to: "d1", san: "Rd1", explanation: "Rd1! Brings the remaining rook to the open file with an absolute pin." },
      { from: "b5", to: "d7", san: "Bxd7+", explanation: "Bxd7+! Shatters Black's defense with check." },
      { from: "b3", to: "b8", san: "Qb8+", explanation: "Qb8+! Morphy's immortal Queen sacrifice." },
      { from: "d1", to: "d8", san: "Rd8#", explanation: "Rd8#! Legendary corridor checkmate." }
    ],
    opponentResponses: [
      { from: "d8", to: "d7", san: "Rxd7", explanation: "Black recaptures with the rook." },
      { from: "e7", to: "e6", san: "Qe6", explanation: "Black tries to unpin." },
      { from: "f6", to: "d7", san: "Nxd7", explanation: "Black recaptures with the knight." },
      { from: "d7", to: "b8", san: "Nxb8", explanation: "Black captures the Queen." }
    ],
    defaultRefutation: {
      from: "b5", to: "d7", san: "Bxd7+",
      coachExplanation: "Bxd7+ is very strong, but Morphy's 1. Rxd7! is the immortal line that completely dominates the open file."
    },
    successExplanation: "Paul Morphy's Masterpiece! 1. Rxd7! sacrifices the exchange to eliminate Black's pinned defender, shattering the position and leading to forced checkmate!"
  },

  // 2C. The Noah's Ark Trap (Ruy Lopez)
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
  }
];

export const BENCHMARK_PUZZLE_POOL: (ChessPuzzle & { numericRating: number })[] = [
  ...HISTORICAL_BENCHMARKS_STAGE_1,
  ...HISTORICAL_BENCHMARKS_STAGE_2,
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
      { from: "b1", to: "b8", san: "Qb8+", explanation: "Qb8#! King is trapped behind its own pawns." }
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
 * Samples randomized benchmark puzzles:
 * - Puzzle 1: Random selection from HISTORICAL_BENCHMARKS_STAGE_1 (Opening Radar & Traps)
 * - Puzzle 2: Random selection from HISTORICAL_BENCHMARKS_STAGE_2 (Tactical Geometry & Deflections)
 * - Remaining: Curated benchmarks / adaptive
 */
export function getRandomBenchmarkPair(): [
  ChessPuzzle & { numericRating: number },
  ChessPuzzle & { numericRating: number }
] {
  const p1 =
    HISTORICAL_BENCHMARKS_STAGE_1[
      Math.floor(Math.random() * HISTORICAL_BENCHMARKS_STAGE_1.length)
    ] || HISTORICAL_BENCHMARKS_STAGE_1[0];
  const p2 =
    HISTORICAL_BENCHMARKS_STAGE_2[
      Math.floor(Math.random() * HISTORICAL_BENCHMARKS_STAGE_2.length)
    ] || HISTORICAL_BENCHMARKS_STAGE_2[0];
  return [p1, p2];
}

export function getRandomBenchmarkTrio(): (ChessPuzzle & { numericRating: number })[] {
  const [p1, p2] = getRandomBenchmarkPair();
  const tier3 = BENCHMARK_PUZZLE_POOL.filter((p) => p.numericRating > 1400);
  const p3 = tier3[Math.floor(Math.random() * tier3.length)] || BENCHMARK_PUZZLE_POOL[8];
  return [p1, p2, p3];
}

export function getRandomDiagnosticQuintet(): (ChessPuzzle & { numericRating: number })[] {
  const [p1, p2] = getRandomBenchmarkPair();
  const p3 = selectAdaptivePuzzle(1250, [p1.id, p2.id]);
  const p4 = selectAdaptivePuzzle(1350, [p1.id, p2.id, p3.id]);
  const p5 = selectAdaptivePuzzle(1500, [p1.id, p2.id, p3.id, p4.id]);
  return [p1, p2, p3, p4, p5];
}

/**
 * Universal evaluator for any puzzle in the benchmark pool with candidate-move awareness
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

  // 1. Granular handling for Légal's Trap (1750)
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
    if (from === "d6" && to === "e5") {
      return {
        branchType: "inaccurate_recapture",
        status: "inaccurate",
        score: 0.55,
        userMoveSan: "1... dxe5",
        bestMoveSan: "1... Nxe5! 2. Qxh5 Nxc4!",
        calibratedElo: 1220,
        coachFeedback: "Right instinct to eliminate the attacker! But capturing with the pawn allows White's Queen to escape with 7. Qxh5, losing your bishop on h5 without capturing White's bishop on c4.",
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
        coachFeedback: "Fatal Trap! 1... Bxd1?? walked directly into Légal's Trap. White delivers forced checkmate with 2. Bxf7+ Ke7 3. Nd5#.",
        ruleTitle,
        ruleBody,
        refutationMoves: [
          { from: "c4", to: "f7", san: "Bxf7+" },
          { from: "e8", to: "e7", san: "Ke7" },
          { from: "c3", to: "d5", san: "Nd5#" }
        ]
      };
    }
    if (from === "d6" && to === "d5") {
      return {
        branchType: "threat_missed",
        status: "inaccurate",
        score: 0.30,
        userMoveSan: "1... d5",
        bestMoveSan: "1... Nxe5! 2. Qxh5 Nxc4!",
        calibratedElo: 1100,
        coachFeedback: "Passive block. 1... d5 blocks the bishop's diagonal to f7, but ignores White's knight on e5. 1... Nxe5! directly eliminates the attacker.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "h5" && ["g6", "g4", "f3", "e2"].includes(to)) {
      return {
        branchType: "passive_retreat",
        status: "inaccurate",
        score: 0.30,
        userMoveSan: `1... B${to}`,
        bestMoveSan: "1... Nxe5! 2. Qxh5 Nxc4!",
        calibratedElo: 1080,
        coachFeedback: "Retreating senses danger, but surrenders the initiative without punishment. 1... Nxe5! directly eliminates the attacker and wins clean material.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "d8" && to === "f6") {
      return {
        branchType: "threat_missed",
        status: "blunder",
        score: 0.10,
        userMoveSan: "1... Qf6",
        bestMoveSan: "1... Nxe5! 2. Qxh5 Nxc4!",
        calibratedElo: 980,
        coachFeedback: "Active Queen counter-attack, but overlooks White's 7. Nxf7! forking your Queen and Rook.",
        ruleTitle,
        ruleBody,
      };
    }
  }

  // 2. Granular handling for The Elephant Trap (Cambridge Springs)
  if (puzzle.id === "bench_elephant_trap") {
    if (from === "f6" && to === "d5") {
      return {
        branchType: "best",
        status: "best",
        score: 1.0,
        userMoveSan: "1... Nxd5!",
        bestMoveSan: "1... Nxd5! 2. Bxd8 Bb4+! 3. Qd2 Bxd2+ 4. Kxd2 Kxd8",
        calibratedElo: 1400,
        coachFeedback: "Masterclass Trap! You saw that the pin was an illusion: after 7. Bxd8 Bb4+! 8. Qd2 Bxd2+ 9. Kxd2 Kxd8, Black emerges with an extra minor piece (+3.0)!",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "c7" && to === "c6") {
      return {
        branchType: "solid_defense",
        status: "inaccurate",
        score: 0.50,
        userMoveSan: "1... c6",
        bestMoveSan: "1... Nxd5! 2. Bxd8 Bb4+! 3. Qd2 Bxd2+ 4. Kxd2 Kxd8",
        calibratedElo: 1150,
        coachFeedback: "Solid pawn kick attacking the knight, but misses 1... Nxd5! which shatters the pin and wins a full piece immediately.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "f8" && to === "e7") {
      return {
        branchType: "passive_retreat",
        status: "inaccurate",
        score: 0.35,
        userMoveSan: "1... Be7",
        bestMoveSan: "1... Nxd5! 2. Bxd8 Bb4+! 3. Qd2 Bxd2+ 4. Kxd2 Kxd8",
        calibratedElo: 1080,
        coachFeedback: "Timid unpin. Passive development allows White to retreat the knight with an extra pawn on d5, escaping unpunished.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "h7" && to === "h6") {
      return {
        branchType: "threat_missed",
        status: "blunder",
        score: 0.20,
        userMoveSan: "1... h6",
        bestMoveSan: "1... Nxd5! 2. Bxd8 Bb4+! 3. Qd2 Bxd2+ 4. Kxd2 Kxd8",
        calibratedElo: 1020,
        coachFeedback: "Slow probe. Provoking the bishop allows White to simply exchange on f6 or retreat with an extra center pawn.",
        ruleTitle,
        ruleBody,
      };
    }
  }

  // 3. Granular handling for The Blackburne Shilling Trap
  if (puzzle.id === "bench_blackburne_shilling") {
    if (from === "d8" && to === "g5") {
      return {
        branchType: "best",
        status: "best",
        score: 1.0,
        userMoveSan: "1... Qg5!",
        bestMoveSan: "1... Qg5! 2. Nxf7 Qxg2 3. Rf1 Qxe4+ 4. Be2 Nf3#",
        calibratedElo: 1350,
        coachFeedback: "Grandmaster Counter-Attack! 1... Qg5! attacks White's knight and g2 pawn, leading to the legendary smothered mate or winning decisive material!",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "d8" && to === "e7") {
      return {
        branchType: "solid_defense",
        status: "inaccurate",
        score: 0.60,
        userMoveSan: "1... Qe7",
        bestMoveSan: "1... Qg5! 2. Nxf7 Qxg2 3. Rf1 Qxe4+ 4. Be2 Nf3#",
        calibratedElo: 1120,
        coachFeedback: "Pins the knight to the king and regains the pawn, but misses 1... Qg5! which unleashes a devastating knockout attack.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "d7" && to === "d5") {
      return {
        branchType: "threat_missed",
        status: "inaccurate",
        score: 0.40,
        userMoveSan: "1... d5",
        bestMoveSan: "1... Qg5! 2. Nxf7 Qxg2 3. Rf1 Qxe4+ 4. Be2 Nf3#",
        calibratedElo: 1050,
        coachFeedback: "Disrupts White's bishop, but gives up a pawn without sufficient counterplay.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "d4" && to === "b3") {
      return {
        branchType: "threat_missed",
        status: "inaccurate",
        score: 0.30,
        userMoveSan: "1... Nxb3",
        bestMoveSan: "1... Qg5! 2. Nxf7 Qxg2 3. Rf1 Qxe4+ 4. Be2 Nf3#",
        calibratedElo: 980,
        coachFeedback: "Timid trade: exchanges off your active knight and lets White play 2. Nxf7 or 2. axb3 with strong development.",
        ruleTitle,
        ruleBody,
      };
    }
  }

  // 4. Granular handling for The Central Fork
  if (puzzle.id === "bench_fork_double_threat") {
    if (from === "d1" && to === "d5") {
      return {
        branchType: "best",
        status: "best",
        score: 1.0,
        userMoveSan: "1. Qd5!",
        bestMoveSan: "1. Qd5! (Threatens mate on f7 and wins e4)",
        calibratedElo: 1320,
        coachFeedback: "Sharp eye! 1. Qd5 creates an inescapable dual threat: checkmate on f7 and the capture of the e4 knight.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "d1" && to === "e2") {
      return {
        branchType: "threat_missed",
        status: "inaccurate",
        score: 0.50,
        userMoveSan: "1. Qe2",
        bestMoveSan: "1. Qd5!",
        calibratedElo: 1050,
        coachFeedback: "Attacks the knight, but allows Black to defend comfortably with 1... d5.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "c4" && to === "d5") {
      return {
        branchType: "threat_missed",
        status: "inaccurate",
        score: 0.40,
        userMoveSan: "1. Bd5",
        bestMoveSan: "1. Qd5!",
        calibratedElo: 980,
        coachFeedback: "Attacks the knight, but allows 1... Nf6 escaping without checkmate pressure.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "e1" && to === "g1") {
      return {
        branchType: "threat_missed",
        status: "blunder",
        score: 0.15,
        userMoveSan: "1. O-O",
        bestMoveSan: "1. Qd5!",
        calibratedElo: 850,
        coachFeedback: "Castling is safe, but completely overlooks an immediate winning double strike.",
        ruleTitle,
        ruleBody,
      };
    }
  }

  // 5. Granular handling for Paul Morphy's Opera Game Deflection
  if (puzzle.id === "bench_morphy_opera") {
    if (from === "d1" && to === "d7") {
      return {
        branchType: "best",
        status: "best",
        score: 1.0,
        userMoveSan: "1. Rxd7!",
        bestMoveSan: "1. Rxd7! Rxd7 2. Rd1 Qe6 3. Bxd7+ Nxd7 4. Qb8+! Nxb8 5. Rd8#",
        calibratedElo: 1520,
        coachFeedback: "Paul Morphy's Masterpiece! 1. Rxd7! sacrifices the exchange to eliminate Black's pinned defender, shattering the position and leading to forced checkmate!",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "b5" && to === "d7") {
      return {
        branchType: "solid_defense",
        status: "best",
        score: 0.85,
        userMoveSan: "1. Bxd7+",
        bestMoveSan: "1. Rxd7! Rxd7 2. Rd1 Qe6 3. Bxd7+ Nxd7 4. Qb8+! Nxb8 5. Rd8#",
        calibratedElo: 1380,
        coachFeedback: "Very strong tactical line! Eliminating the knight with check keeps massive pressure on Black's king.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "g5" && to === "f6") {
      return {
        branchType: "inaccurate_recapture",
        status: "inaccurate",
        score: 0.45,
        userMoveSan: "1. Bxf6",
        bestMoveSan: "1. Rxd7!",
        calibratedElo: 1150,
        coachFeedback: "Removes one defender, but allows 1... Qxf6, easing Black's defensive task.",
        ruleTitle,
        ruleBody,
      };
    }
    if ((from === "h2" && to === "h3") || (from === "c1" && to === "b1")) {
      return {
        branchType: "threat_missed",
        status: "blunder",
        score: 0.15,
        userMoveSan: `${from}-${to}`,
        bestMoveSan: "1. Rxd7!",
        calibratedElo: 950,
        coachFeedback: "Slow move that lets Black escape the pin with 1... a6 or 1... Qe6.",
        ruleTitle,
        ruleBody,
      };
    }
  }

  // 6. Granular handling for The Noah's Ark Trap
  if (puzzle.id === "bench_noah_ark_trap") {
    if (from === "b7" && to === "b5") {
      return {
        branchType: "best",
        status: "best",
        score: 1.0,
        userMoveSan: "1... b5",
        bestMoveSan: "1... b5! 2. Bb3 Na5 (Corners White's Spanish bishop)",
        calibratedElo: 1380,
        coachFeedback: "High-level opening vision! 1... b5 2. Bb3 Na5 corners White's prized Spanish bishop, preparing to trap it with pawns.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "d7" && to === "d6") {
      return {
        branchType: "solid_defense",
        status: "inaccurate",
        score: 0.50,
        userMoveSan: "1... d6",
        bestMoveSan: "1... b5! 2. Bb3 Na5",
        calibratedElo: 1100,
        coachFeedback: "Solid development, but misses the concrete opportunity to corner and trap White's Spanish bishop.",
        ruleTitle,
        ruleBody,
      };
    }
    if (from === "g8" && to === "f6") {
      return {
        branchType: "threat_missed",
        status: "inaccurate",
        score: 0.40,
        userMoveSan: "1... Nf6",
        bestMoveSan: "1... b5! 2. Bb3 Na5",
        calibratedElo: 1050,
        coachFeedback: "Principled developing move, but allows White to castle comfortably without crisis.",
        ruleTitle,
        ruleBody,
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

  // Robust fallback for unlisted legal moves:
  const eloLoss = Math.round(180 * (1 / (1 + Math.pow(10, (numeric - currentRating) / 400))));
  const fallbackFeedback =
    puzzle.defaultRefutation?.coachExplanation ||
    "Passive continuation: You made a routine move while a decisive tactic or threat was present. Always scan for checks, captures, and threats before making quiet moves.";

  return {
    branchType: "threat_missed",
    status: "inaccurate",
    score: 0.15,
    userMoveSan: `${from}-${to}`,
    bestMoveSan: puzzle.solutionMoves.map((m) => m.san).join(" "),
    calibratedElo: Math.max(650, currentRating - Math.max(140, eloLoss)),
    coachFeedback: fallbackFeedback,
    ruleTitle,
    ruleBody,
  };
}

export function evaluatePuzzle1Move(from: string, to: string, currentRating: number = 1250): Puzzle1BranchResult {
  return evaluateBenchmarkMove(FIXED_PUZZLE_1, from, to, currentRating);
}


export function computeTimeModifier(timeMs: number): number {
  if (timeMs < 8000) return 0.08;
  if (timeMs > 35000) return -0.05;
  return 0.0;
}

/**
 * Detects if a move in a famous benchmark was played with "book memory" velocity (< 4.0s)
 */
export function checkBookMemoryPattern(puzzleId: string, timeMs: number): boolean {
  const famousTraps = [
    "bench_legal_trap",
    "trap_legal_queen_bait",
    "bench_elephant_trap",
    "bench_blackburne_shilling",
  ];
  return famousTraps.includes(puzzleId) && timeMs < 4000;
}

/**
 * Selects an obscure, asymmetric novelty puzzle for Trial 3 to verify true calculation
 */
export function selectNoveltyCruciblePuzzle(
  currentRating: number,
  excludeIds: string[] = []
): ChessPuzzle & { numericRating: number } {
  const pool = getAllPuzzlesWithRatings();
  const excludeSet = new Set(excludeIds);

  // Filter for non-opening tactical themes (middlegame combinations, deflection, overworked pieces)
  const noveltyCandidates = pool.filter((p) => {
    if (excludeSet.has(p.id)) return false;
    const isMiddlegame = !p.id.includes("opening") && !p.id.includes("trap") && !p.id.includes("legal");
    const ratingClose = Math.abs(p.numericRating - currentRating) <= 250;
    return isMiddlegame && ratingClose;
  });

  if (noveltyCandidates.length > 0) {
    const randomIndex = Math.floor(Math.random() * Math.min(8, noveltyCandidates.length));
    return noveltyCandidates[randomIndex];
  }

  return selectAdaptivePuzzle(currentRating, excludeIds);
}

/**
 * Maps puzzle tier or ID to its corresponding pedagogical rule
 */
export function getPuzzleCategoryRule(puzzle: ChessPuzzle): {
  ruleTitle: string;
  ruleBody: string;
} {
  if (puzzle.ruleTitle && puzzle.ruleBody) {
    return { ruleTitle: puzzle.ruleTitle, ruleBody: puzzle.ruleBody };
  }

  const tier = puzzle.tier || "beginner";
  if (tier === "beginner") {
    return {
      ruleTitle: "The 2-Second Bodyguard Rule",
      ruleBody: "Before touching any piece, check if all friendly pieces have an active defender. Never donate free points.",
    };
  }
  if (tier === "adv_beginner") {
    return {
      ruleTitle: "The Geometric Radar Rule",
      ruleBody: "Knights can only fork pieces on the exact same square color. Always notice when your King and heavy pieces share colors.",
    };
  }
  if (tier === "intermediate") {
    return {
      ruleTitle: "Tactical Overload & Deflection Rule",
      ruleBody: "When a piece is defending multiple duties, deflect it away or attack the weakest link.",
    };
  }
  return {
    ruleTitle: "Steinitz's Worst-Placed Piece Principle",
    ruleBody: "When direct tactics fade, locate your least active piece and reposition it to dominate key squares.",
  };
}

/**
 * 5-to-6 Trial Elo Rating Calculation with progressive K-factor & conviction tuning
 */
export function calculateNewElo5(
  userRating: number,
  puzzleRating: number,
  score: number,
  trialIndex: number = 0,
  conviction: CommitmentLevel | null = null,
  isBlunderOnTrap: boolean = false,
  isBookMemory: boolean = false
): number {
  if (isBlunderOnTrap) {
    // Falling for an elementary opening trap routes to the Beginner bracket (<900)
    return Math.min(880, Math.round(userRating - 370));
  }

  // Progressive K-factor: front-loaded for fast placement, back-loaded for ceiling reach
  let K = 160;
  if (trialIndex === 0) K = isBookMemory ? 80 : 160; // Dampen 1-move book memory leap
  else if (trialIndex === 1) K = 130;
  else if (trialIndex === 2) K = 120;
  else if (trialIndex === 3) K = 150;
  else if (trialIndex === 4) K = 200;
  else K = 260; // Grandmaster Crucible (Trial 6) allows breaking the 2000 ceiling!

  // Conviction multipliers for Trials 2-6
  if (conviction === "sure") {
    K = Math.round(K * (userRating >= 1450 ? 2.2 : 1.6));
  } else if (conviction === "guessing") {
    K = Math.round(K * 0.8);
  }

  const expected = 1 / (1 + Math.pow(10, (puzzleRating - userRating) / 400));
  const newRating = userRating + K * (score - expected);
  return Math.max(600, Math.min(2350, Math.round(newRating)));
}

/**
 * Elo Rating Calculation (backwards-compatible wrapper)
 */
export function calculateNewElo(
  userRating: number,
  puzzleRating: number,
  score: number,
  isBlunderOnTrap: boolean = false
): number {
  return calculateNewElo5(userRating, puzzleRating, score, 0, null, isBlunderOnTrap);
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
/**
 * Detect Behavioral Pattern & Cognitive Archetype Templates
 */
export const INSIGHT_TEMPLATES: Record<string, BehavioralInsight> = {
  instinctive_hunter: {
    patternId: "instinctive_hunter",
    patternName: "The Instinctive Hunter",
    insight: "You spot tactical shots and King weaknesses with lightning speed. Focus on taking 2 seconds to double-check opponent defensive resources.",
    strength: "Fast tactical intuition & attacking radar",
    weakness: "Overlooking opponent defensive replies",
  },
  careful_calculator: {
    patternId: "careful_calculator",
    patternName: "The Careful Calculator",
    insight: "Your calculation process is disciplined and deep. Drill core tactical patterns to build intuition so you preserve your clock.",
    strength: "Deep calculation & defensive discipline",
    weakness: "Decision speed under clock pressure",
  },
  overconfident_striker: {
    patternId: "overconfident_striker",
    patternName: "The Overconfident Striker",
    insight: "You play with great courage and conviction, but your calculations sometimes miss in-between moves. Ask: 'What is my opponent's refutation?' before moving.",
    strength: "Decisive play and high self-trust",
    weakness: "Impulsive commitments on tricky lines",
  },
  doubting_technician: {
    patternId: "doubting_technician",
    patternName: "The Doubting Technician",
    insight: "You find strong tactical moves, but doubt yourself too much. Trust your instincts—your tactical vision is sharper than you give yourself credit for.",
    strength: "Accurate tactical vision & geometric radar",
    weakness: "Self-doubt under pressure",
  },
  resilient_learner: {
    patternId: "resilient_learner",
    patternName: "The Resilient Learner",
    insight: "You recover brilliantly after difficult positions. Once you strengthen your opening trap radar, your rating will rapidly climb.",
    strength: "Rapid in-game adaptability & resilience",
    weakness: "Opening trap awareness",
  },
  foundation_builder: {
    patternId: "foundation_builder",
    patternName: "The Foundation Builder",
    insight: "Every chess master started here. Focus on the 2-Second Bodyguard Rule to eliminate free hanging pieces, and your level will soar.",
    strength: "Persistence and willingness to test yourself",
    weakness: "1-move hanging pieces and basic tactical motifs",
  },
  clean_run: {
    patternId: "clean_run",
    patternName: "Clean Run",
    insight: "You handled the benchmark positions cleanly. Your foundation is solid for higher complexity.",
    strength: "Consistency and tactical clarity",
    weakness: "Need for higher master complexity",
  },
  heavy_help: {
    patternId: "heavy_help",
    patternName: "Heavy Help Usage",
    insight: "The key patterns aren't fully automatic yet. Focused repetition will make a big difference.",
    strength: "Persistence",
    weakness: "Automatic pattern recognition",
  },
  high_conviction_accurate: {
    patternId: "instinctive_hunter",
    patternName: "The Instinctive Hunter",
    insight: "When you feel sure, you are usually right. Trust your calculation more often.",
    strength: "Strong self-trust and calculation",
    weakness: "Occasional over-extension",
  },
  high_conviction_inaccurate: {
    patternId: "overconfident_striker",
    patternName: "The Overconfident Striker",
    insight: "You often feel confident, but your calculation doesn't always support it yet.",
    strength: "Willingness to decide",
    weakness: "Verification of ideas",
  },
  low_conviction_accurate: {
    patternId: "doubting_technician",
    patternName: "The Doubting Technician",
    insight: "You play good moves, but you doubt yourself too much. Trust your instincts.",
    strength: "Accurate tactical vision",
    weakness: "Self-trust under pressure",
  },
  strong_recovery: {
    patternId: "resilient_learner",
    patternName: "The Resilient Learner",
    insight: "You recover well after mistakes. That resilience is a real strength.",
    strength: "Resilience and problem-solving",
    weakness: "First-move accuracy",
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
 * Classify behavioral pattern based on attempt history across 5 trials
 */
export function classifyBehavioralPattern(history: PuzzleAttemptRecord[]): BehavioralInsight {
  if (!history || history.length === 0) {
    return INSIGHT_TEMPLATES.clean_run;
  }

  const totalAttempts = history.length;
  const totalCorrect = history.filter((h) => h.firstTryCorrect || h.status === "best").length;
  const totalHelpCount = history.filter((h) => h.helpUsed !== "none").length;
  const sureAttempts = history.filter((h) => h.commitment === "sure");
  const sureAndWrong = sureAttempts.filter((h) => h.status === "blunder" || !h.firstTryCorrect).length;
  const lowConviction = history.filter((h) => h.commitment === "guessing" || h.commitment === "think_so").length;
  const avgTimeMs = history.reduce((sum, h) => sum + (h.timeMs || 15000), 0) / totalAttempts;

  // 1. Foundation Builder: Struggled across most trials
  if (totalCorrect <= 1 && totalAttempts >= 3) {
    return INSIGHT_TEMPLATES.foundation_builder;
  }

  // 2. Heavy Help Usage
  if (totalHelpCount >= 2) {
    return INSIGHT_TEMPLATES.heavy_help;
  }

  // 3. Overconfident Striker: Blundered when "Sure"
  if (sureAndWrong >= 2 || (sureAndWrong >= 1 && avgTimeMs < 12000)) {
    return INSIGHT_TEMPLATES.overconfident_striker;
  }

  // 4. Resilient Learner: Failed early benchmarks (P1/P2), then solved later trials cleanly
  const p1Fail = !history[0]?.firstTryCorrect;
  const p2Fail = history[1] ? !history[1].firstTryCorrect : false;
  const lateSuccess = history.slice(2).some((h) => h.firstTryCorrect);
  if ((p1Fail || p2Fail) && lateSuccess && totalCorrect >= 2) {
    return INSIGHT_TEMPLATES.resilient_learner;
  }

  // 5. Doubting Technician: High accuracy but doubts themselves
  if (totalCorrect >= 3 && lowConviction >= 2) {
    return INSIGHT_TEMPLATES.doubting_technician;
  }

  // 6. Instinctive Hunter: High accuracy with fast moves
  if (totalCorrect >= 4 && avgTimeMs < 14000) {
    return INSIGHT_TEMPLATES.instinctive_hunter;
  }

  // 7. Careful Calculator: High accuracy with deliberate pace
  if (totalCorrect >= 3 && avgTimeMs >= 20000) {
    return INSIGHT_TEMPLATES.careful_calculator;
  }

  // 8. Clean Run
  if (totalCorrect === totalAttempts && totalHelpCount === 0) {
    return INSIGHT_TEMPLATES.clean_run;
  }

  return INSIGHT_TEMPLATES.mixed_profile;
}
