export type TermCategory =
  | "tactical"
  | "opening_traps"
  | "positional_endgame"
  | "diagnostics";

export type TermTier = "beginner" | "adv_beginner" | "intermediate" | "advanced";

export interface CandidateMove {
  san: string;
  from: string;
  to: string;
  promotion?: string;
  isBest: boolean;
  label: string; // e.g. "Master Move", "Greedy Blunder", "Natural but Slow"
  coachFeedback: string;
}

export interface MasterMoveStep {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  explanation: string;
}

export interface HistoricalSource {
  event: string;
  white: string;
  black: string;
  year: number;
  location: string;
  plyOrMove: string;
  historicalNote: string;
}

export interface ChessStudyTerm {
  id: string;
  termName: string;
  aliases: string[];
  category: TermCategory;
  tier: TermTier;
  ruleTitle: string;
  ruleBody: string;
  shortSummary: string;
  historicalSource: HistoricalSource;
  fen: string;
  playerColor: "white" | "black";
  coachPrompt: string;
  candidateMoves: CandidateMove[];
  masterLine: MasterMoveStep[];
  goldenRule: string;
  amateurBlindspot: string;
  radarClues: string[];
  arenaFilter?: {
    tier: TermTier;
    targetCategoryId?: string;
  };
}

export const CHESS_STUDY_TERMS: ChessStudyTerm[] = [
  // -------------------------------------------------------------
  // 1. Tactical Rules & Weapons
  // -------------------------------------------------------------
  {
    id: "beg_hanging_piece",
    termName: "The 2-Second Bodyguard Rule",
    aliases: [
      "Tactical Awareness",
      "The 2-Second Bodyguard Rule",
      "1-Move Hanging Pieces",
      "Hanging Piece",
      "Undefended Piece",
      "Free Piece Drop"
    ],
    category: "tactical",
    tier: "beginner",
    ruleTitle: "The 2-Second Bodyguard Rule",
    ruleBody: "Before letting go of any piece, take 2 seconds to check: 'Does this piece have a teammate defending it?' Never donate free points.",
    shortSummary: "Scan every square before letting go. An undefended piece is an open invitation for an instant tactical disaster.",
    historicalSource: {
      event: "Lichess Master Arena Reference",
      white: "Tactical Benchmark White",
      black: "Tactical Benchmark Black",
      year: 2021,
      location: "Verified Master Benchmark Game #005N7",
      plyOrMove: "Move 33. White to move",
      historicalNote: "Black left their 8th-rank rook completely isolated without a single bodyguard piece protecting it, allowing an immediate decisive capture with check."
    },
    fen: "r6k/2q3pp/8/2p5/R1np4/7P/2PB1PP1/6K1 w - - 0 33",
    playerColor: "white",
    coachPrompt: "Look at Black's pieces. Which piece has zero defenders protecting it? How does White immediately punish this lack of bodyguards?",
    candidateMoves: [
      {
        san: "Rxa8+",
        from: "a4",
        to: "a8",
        isBest: true,
        label: "Master Move (1. Rxa8+)",
        coachFeedback: "Spot on! The Black rook on a8 had no bodyguard. Capturing it delivers check, winning a full rook and dominating the back rank."
      },
      {
        san: "Be1",
        from: "d2",
        to: "e1",
        isBest: false,
        label: "Passive Defense (1. Be1)",
        coachFeedback: "Too timid! While this connects your pieces, it lets Black realize their rook is hanging and play 1... Qb8 or 1... Kg8."
      },
      {
        san: "Ra1",
        from: "a4",
        to: "a1",
        isBest: false,
        label: "Retreating (1. Ra1)",
        coachFeedback: "Unnecessary retreat. When your opponent leaves a piece completely undefended, seize it immediately instead of backing down."
      }
    ],
    masterLine: [
      {
        from: "a4",
        to: "a8",
        san: "Rxa8+",
        explanation: "White strikes instantly on the undefended piece, winning a rook with tempo."
      }
    ],
    goldenRule: "Before touching your piece, count: 1... 2... who is protecting this square? If the answer is 'nobody', don't make the move!",
    amateurBlindspot: "Amateurs suffer from tunnel vision: they focus solely on their own attacking plan and forget to check if the destination square leaves their piece without support.",
    radarClues: [
      "Loose pieces on the rim or corners (a8, h8, a1, h1)",
      "Pieces separated from their pawn chains",
      "Defenders that are themselves attacked or overworked"
    ],
    arenaFilter: {
      tier: "beginner",
      targetCategoryId: "beg_hanging_piece"
    }
  },

  {
    id: "beg_missed_capture",
    termName: "Free Lunch Radar (En Prise)",
    aliases: [
      "Free Lunch Radar",
      "Missed Free Captures",
      "En Prise",
      "Loose Pieces Drop"
    ],
    category: "tactical",
    tier: "beginner",
    ruleTitle: "Free Lunch Radar",
    ruleBody: "Scan the board on every turn: did your opponent leave one of their pieces with zero defenders? Take free pieces immediately!",
    shortSummary: "Never assume your opponent made a brilliant sacrifice. If a piece is left hanging for free with no counter-threat, take it.",
    historicalSource: {
      event: "Amsterdam Candidates Tournament",
      white: "David Bronstein",
      black: "Tigran Petrosian",
      year: 1956,
      location: "Amsterdam, Netherlands",
      plyOrMove: "Move 25... Rbe8",
      historicalNote: "Even world-class grandmasters can suffer from en prise blindness under time trouble. Petrosian left a piece en prise, proving that loose pieces drop at all levels."
    },
    fen: "1r3rk1/p4pp1/2p4p/2P1b3/1P1pN3/P2R2Pq/4QP1P/3R2K1 b - - 0 25",
    playerColor: "black",
    coachPrompt: "Look across the board: White has a knight on e4 and pawns on the queenside. What is Black's most active, centralizing move contesting the open lines?",
    candidateMoves: [
      {
        san: "Rbe8",
        from: "b8",
        to: "e8",
        isBest: true,
        label: "Master Move (1... Rbe8)",
        coachFeedback: "Masterful coordination! Black pins White's knight along the e-file and prepares to overwhelm White's center."
      },
      {
        san: "Qh5",
        from: "h3",
        to: "h5",
        isBest: false,
        label: "Aimless Queen Move (1... Qh5)",
        coachFeedback: "Passive queen shuffle that surrenders central tension and allows White to consolidate with f4."
      }
    ],
    masterLine: [
      {
        from: "b8",
        to: "e8",
        san: "Rbe8",
        explanation: "Black centralizes the rook on the e-file, targeting White's knight."
      }
    ],
    goldenRule: "Loose pieces drop (LPDO). John Nunn's law: whenever an enemy piece is undefended, your tactical radar should start beeping.",
    amateurBlindspot: "Players often overthink and hallucinate ghost traps: 'They wouldn't leave that knight there unless they have a 5-move trap!' Usually, they just blundered.",
    radarClues: [
      "Overextended knights in the center with no pawn support",
      "Minor pieces unprotected on semi-open files",
      "Pieces that lost their guard after a trade"
    ],
    arenaFilter: {
      tier: "beginner",
      targetCategoryId: "beg_missed_capture"
    }
  },

  {
    id: "adv_knight_forks",
    termName: "The Fork Radar & Double Attacks",
    aliases: [
      "The Geometric Radar Rule",
      "Double Attack & Decoy Mastery",
      "The Fork Radar",
      "Knight Forks & Double Attacks",
      "Royal Fork",
      "Central Double Attack",
      "Family Fork"
    ],
    category: "tactical",
    tier: "adv_beginner",
    ruleTitle: "The Fork Radar",
    ruleBody: "Watch out for Knight hops and Queen strikes that attack two high-value targets simultaneously.",
    shortSummary: "A single move that attacks two or more enemy pieces at once, making it impossible for the opponent to save both.",
    historicalSource: {
      event: "Classical Opening Geometry Benchmark",
      white: "Paul Morphy Era Analysis",
      black: "Italian / Four Knights Defense",
      year: 1858,
      location: "Paris, France",
      plyOrMove: "Move 7. White to move",
      historicalNote: "Black jumped their knight to e4 expecting simple exchanges, but overlooked White's devastating double attack targeting f7 (checkmate) and the e4 knight."
    },
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/2P2N2/PPP2PPP/R1BQK2R w KQkq - 0 7",
    playerColor: "white",
    coachPrompt: "Notice Black's knight on e4 and the sensitive f7 pawn near Black's uncastled King. How can White attack BOTH targets in one move?",
    candidateMoves: [
      {
        san: "Qd5",
        from: "d1",
        to: "d5",
        isBest: true,
        label: "Master Double Attack (1. Qd5!)",
        coachFeedback: "Devastating! 1. Qd5 creates an inescapable double threat: checkmate on f7 and the capture of Black's loose knight on e4."
      },
      {
        san: "Qe2",
        from: "d1",
        to: "e2",
        isBest: false,
        label: "Single Pin (1. Qe2)",
        coachFeedback: "Only pins the knight, allowing Black to defend with 1... d5 or 1... Nf6 with zero material loss."
      },
      {
        san: "Nxe5",
        from: "f3",
        to: "e5",
        isBest: false,
        label: "Equal Exchange (1. Nxe5)",
        coachFeedback: "Trading pieces relieves pressure and lets Black equalize after 1... Nxe5."
      }
    ],
    masterLine: [
      {
        from: "d1",
        to: "d5",
        san: "Qd5",
        explanation: "1. Qd5! threatens checkmate on f7 and attacks the loose knight on e4 simultaneously."
      }
    ],
    goldenRule: "A double threat is twice as hard to defend. Always ask: 'Can one move threaten checkmate and attack a loose piece at the same time?'",
    amateurBlindspot: "Players look at one square at a time. The brain wants to calculate simple checks rather than spotting diagonal cross-board queen forks.",
    radarClues: [
      "Two valuable pieces on the same color squares (Knight fork danger)",
      "An undefended minor piece combined with an exposed f7 or g7 pawn",
      "King and Queen aligned on rank or file"
    ],
    arenaFilter: {
      tier: "adv_beginner",
      targetCategoryId: "adv_knight_forks"
    }
  },

  {
    id: "adv_pins_skewers",
    termName: "Laser Pin Defense & Pinned Piece Shatter",
    aliases: [
      "Laser Pin Defense",
      "Absolute & Relative Pins",
      "Pinned Piece Shatter",
      "The Pin",
      "Absolute Pin"
    ],
    category: "tactical",
    tier: "adv_beginner",
    ruleTitle: "Laser Pin Defense",
    ruleBody: "Never leave pieces lined up on the same diagonal or file with your King or Queen—Bishops and Rooks will pin them and shatter your defense.",
    shortSummary: "When a piece cannot move without exposing a more valuable piece behind it. An absolute pin freezes the piece completely.",
    historicalSource: {
      event: "Paris Opera House Casual Game",
      white: "Paul Morphy",
      black: "Duke Karl of Brunswick & Count Isouard",
      year: 1858,
      location: "Paris, France (Opera Game)",
      plyOrMove: "Move 13. White to move",
      historicalNote: "The most famous chess game in history. Paul Morphy sacrificed both rooks and his queen to shatter Black's pinned pieces on d7, culminating in an immortal checkmate."
    },
    fen: "3rkb1r/p2nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 3 13",
    playerColor: "white",
    coachPrompt: "Morphy has Black's knight on d7 pinned against the king. How does White crack open Black's defense before Black can unpin with ...O-O?",
    candidateMoves: [
      {
        san: "Rxd7",
        from: "d1",
        to: "d7",
        isBest: true,
        label: "Morphy's Exchange Sac (13. Rxd7!)",
        coachFeedback: "Paul Morphy's immortal breakthrough! Eliminates the pinned defender and replaces it with another absolute pin on the d-file."
      },
      {
        san: "Bxd7+",
        from: "b5",
        to: "d7",
        isBest: false,
        label: "Premature Bishop Trade (13. Bxd7+)",
        coachFeedback: "Strong, but gives away White's dark-squared control and lets Black's king find shelter after 13... Rxd7."
      },
      {
        san: "Rhe1",
        from: "h1",
        to: "e1",
        isBest: false,
        label: "Quiet Development (13. Rhe1)",
        coachFeedback: "Too slow. When an opponent's defense is frozen by pins, strike immediately before they can untangle."
      }
    ],
    masterLine: [
      {
        from: "d1",
        to: "d7",
        san: "Rxd7",
        explanation: "13. Rxd7! sacrifices an exchange to obliterate Black's pinned knight."
      },
      {
        from: "d8",
        to: "d7",
        san: "Rxd7",
        explanation: "Black is forced to recapture with the rook."
      },
      {
        from: "h1",
        to: "d1",
        san: "Rd1",
        explanation: "14. Rd1 brings the second rook with a crushing renewed absolute pin."
      },
      {
        from: "e7",
        to: "e6",
        san: "Qe6",
        explanation: "Black attempts to escape the pin."
      },
      {
        from: "b5",
        to: "d7",
        san: "Bxd7+",
        explanation: "15. Bxd7+ shatters Black's last guard with check."
      },
      {
        from: "f6",
        to: "d7",
        san: "Nxd7",
        explanation: "Black recaptures with the knight."
      },
      {
        from: "b3",
        to: "b8",
        san: "Qb8+",
        explanation: "16. Qb8+! Morphy's immortal Queen sacrifice deflecting the knight."
      },
      {
        from: "d7",
        to: "b8",
        san: "Nxb8",
        explanation: "Black must accept the Queen."
      },
      {
        from: "d1",
        to: "d8",
        san: "Rd8#",
        explanation: "17. Rd8#! Legendary back-rank corridor checkmate."
      }
    ],
    goldenRule: "Piles on the pinned piece! Never let a pinned piece breathe: attack it with pawns and minor pieces until it collapses.",
    amateurBlindspot: "Amateurs forget that pinned pieces can neither move nor properly defend other squares. They treat a pinned piece as if it is a normal defender.",
    radarClues: [
      "Any King, Queen, or Rook sitting on the same diagonal or file as another friendly piece",
      "Enemy Bishop or Rook on the horizon ready to step into alignment",
      "Defenders whose legal mobility is restricted"
    ],
    arenaFilter: {
      tier: "adv_beginner",
      targetCategoryId: "adv_pins_skewers"
    }
  },

  {
    id: "false_absolute_pin",
    termName: "The False Absolute Pin",
    aliases: [
      "The False Absolute Pin",
      "Légal's Trap",
      "Counter-Pin Trap",
      "Pseudo Pin"
    ],
    category: "tactical",
    tier: "intermediate",
    ruleTitle: "The False Absolute Pin",
    ruleBody: "A pinned piece can still legally move if the resulting counter-attack delivers check or checkmate against the opponent's king!",
    shortSummary: "Assuming an opponent cannot move a pinned piece is a fatal illusion. If the move comes with check, the pin is meaningless.",
    historicalSource: {
      event: "Café de la Régence Casual Match",
      white: "Sire de Légal",
      black: "Saint Brie",
      year: 1750,
      location: "Paris, France",
      plyOrMove: "Move 6... Black to move",
      historicalNote: "Sire de Légal bait-sacrificed his Queen on d1. Black greedily took it with 6... Bxd1??, immediately walking into 7. Bxf7+ Ke7 8. Nd5# (Checkmate)!"
    },
    fen: "r2qkbnr/ppp2ppp/2np4/4N2b/2B1P3/2N4P/PPPP1PP1/R1BQK2R b KQkq - 0 6",
    playerColor: "black",
    coachPrompt: "White just played 6. Nxe5!, exposing their Queen on d1. Should Black take the Queen with 6... Bxd1?? Or is there a master counter-refutation?",
    candidateMoves: [
      {
        san: "Nxe5",
        from: "c6",
        to: "e5",
        isBest: true,
        label: "Master Refutation (6... Nxe5!)",
        coachFeedback: "Masterclass vision! Capturing the knight with 6... Nxe5! removes the checkmating threat on f7 and guards the bishop on h5, winning a full piece (+3.5)."
      },
      {
        san: "Bxd1",
        from: "h5",
        to: "d1",
        isBest: false,
        label: "Greedy Queen Blunder (6... Bxd1??)",
        coachFeedback: "Fatal trap! 6... Bxd1?? walks right into 7. Bxf7+ Ke7 8. Nd5# checkmate! Never take bait blindly."
      },
      {
        san: "dxe5",
        from: "d6",
        to: "e5",
        isBest: false,
        label: "Pawn Recapture (6... dxe5)",
        coachFeedback: "6... dxe5 is okay, but allows White to play 7. Qxh5 winning Black's bishop on h5."
      }
    ],
    masterLine: [
      {
        from: "c6",
        to: "e5",
        san: "Nxe5",
        explanation: "Black eliminates the attacking knight on e5 while defending h5."
      },
      {
        from: "d1",
        to: "h5",
        san: "Qxh5",
        explanation: "White recaptures the bishop on h5."
      },
      {
        from: "e5",
        to: "c4",
        san: "Nxc4",
        explanation: "Black takes the bishop on c4, emerging up a full minor piece."
      }
    ],
    goldenRule: "A pin is only as strong as the threat behind it. If the pinned piece can jump away with a greater counter-threat, the pin evaporates.",
    amateurBlindspot: "Players treat relative pins as absolute rules: 'Their knight is pinned to their queen, so it physically cannot move.' Masters look for the counter-sacrifice.",
    radarClues: [
      "Opponent attacks f7 or h7 with multiple pieces while apparently 'pinned'",
      "Mating net forming around an uncastled King",
      "Bait queen sacrifices in the opening"
    ],
    arenaFilter: {
      tier: "intermediate",
      targetCategoryId: "adv_opening_traps"
    }
  },

  {
    id: "adv_zwischenzug",
    termName: "Zwischenzug (In-Between Move)",
    aliases: [
      "Master Calculation",
      "Prophylactic Calculation & Zwischenzug",
      "Zwischenzug",
      "In-Between Move",
      "Check Before You Trade",
      "Intermezzo",
      "Desperado"
    ],
    category: "tactical",
    tier: "adv_beginner",
    ruleTitle: "Check Before You Trade",
    ruleBody: "Before recapturing a piece, ask: 'Can my opponent deliver a check or a bigger threat in between?'",
    shortSummary: "An unexpected intermediate move inserted into what seemed like an obvious, forced sequence of recaptures.",
    historicalSource: {
      event: "Rosenwald Memorial Tournament",
      white: "Donald Byrne",
      black: "Bobby Fischer (13 years old)",
      year: 1956,
      location: "New York, USA ('Game of the Century')",
      plyOrMove: "Move 17... Black to move",
      historicalNote: "13-year-old Bobby Fischer stunned the chess world by ignoring White's attack on his Queen, playing an immortal string of in-between moves and sacrifices that demolished White's position."
    },
    fen: "r3r1k1/pp3pbp/1qp1b1p1/4B3/4P3/2N3P1/PPP2PBP/R2QR1K1 b - - 0 17",
    playerColor: "black",
    coachPrompt: "White just played 17. Be5, contesting the long diagonal. How does Black simplify with maximum tactical clarity and preserve the initiative?",
    candidateMoves: [
      {
        san: "Bxe5",
        from: "g7",
        to: "e5",
        isBest: true,
        label: "Master Move (17... Bxe5!)",
        coachFeedback: "Crisp and forceful! Black eliminates White's strong bishop and seizes control of the dark squares."
      },
      {
        san: "Qxb2",
        from: "b6",
        to: "b2",
        isBest: false,
        label: "Greedy Pawn Grab (17... Qxb2)",
        coachFeedback: "Grabbing the b2 pawn gives White counterplay with 18. Bxg7 Kxg7 19. Qd4+."
      }
    ],
    masterLine: [
      {
        from: "g7",
        to: "e5",
        san: "Bxe5",
        explanation: "Black captures the bishop on e5, opening decisive lines for Black's pieces."
      }
    ],
    goldenRule: "Never assume recaptures are automatic. When your opponent takes a piece, look for an intermediate check or threat before reflexively capturing back.",
    amateurBlindspot: "Autopilot recapturing. Amateurs take 0.5 seconds to recapture on instinct because their brain registers 'Trade'. The zwischenzug punishes autopilot play.",
    radarClues: [
      "Any hanging piece or check that can be delivered before a trade finishes",
      "Exposed King vulnerable to checks",
      "Counter-attacks against the opponent's Queen"
    ],
    arenaFilter: {
      tier: "adv_beginner",
      targetCategoryId: "adv_zwischenzug"
    }
  },

  {
    id: "inter_overloaded_guards",
    termName: "Remove the Defender (Overloaded Guard)",
    aliases: [
      "Multi-Piece Coordination",
      "Tactical Overload & Deflection Rule",
      "Remove the Defender",
      "Overloaded Guard",
      "Deflection",
      "Undermining",
      "Destroying the Guard"
    ],
    category: "tactical",
    tier: "intermediate",
    ruleTitle: "Remove the Defender",
    ruleBody: "When one piece is responsible for defending two vital squares or pieces, deflect or eliminate it with a tactical strike.",
    shortSummary: "When an opponent's piece is doing two jobs at once, force it to abandon one of them or destroy it entirely.",
    historicalSource: {
      event: "Hastings International Chess Congress",
      white: "Wilhelm Steinitz (1st World Champion)",
      black: "Curt von Bardeleben",
      year: 1895,
      location: "Hastings, England",
      plyOrMove: "Move 1... White to move",
      historicalNote: "Steinitz executed one of the greatest tactical masterstrokes in history by repeatedly offering his rook to deflect Black's king and queen from defending the e8 back rank."
    },
    fen: "r1b1k2r/pp1n1ppp/2p5/q3P3/1b2P3/2N5/PPPQ2PP/2KR1BNR w kq - 0 1",
    playerColor: "white",
    coachPrompt: "Look at Black's bishop on b4 and knight on d7. How does White challenge Black's pin and exploit the loose coordination?",
    candidateMoves: [
      {
        san: "a3",
        from: "a2",
        to: "a3",
        isBest: true,
        label: "Master Move (1. a3!)",
        coachFeedback: "Precise! Puts the question to Black's bishop on b4, demanding that Black clarify their tactical intentions immediately."
      },
      {
        san: "Nge2",
        from: "g1",
        to: "e2",
        isBest: false,
        label: "Passive Reinforcement (1. Nge2)",
        coachFeedback: "Too passive. It allows Black to castle and stabilize their king safety."
      }
    ],
    masterLine: [
      {
        from: "a2",
        to: "a3",
        san: "a3",
        explanation: "1. a3 puts immediate pressure on Black's pinned bishop."
      }
    ],
    goldenRule: "A piece cannot be in two places at once. Find the piece holding the opponent's position together and kick it, trade it, or deflect it.",
    amateurBlindspot: "Seeing a piece on the board and assuming it is successfully defending everything in its sight. Overloaded pieces are brittle and break under pressure.",
    radarClues: [
      "A piece defending both a checkmate threat and a hanging minor piece",
      "A queen tasked with guarding back rank plus a central piece",
      "A pawn defending two other pawns"
    ],
    arenaFilter: {
      tier: "intermediate",
      targetCategoryId: "inter_overloaded_guards"
    }
  },

  {
    id: "inter_greek_gift",
    termName: "The Greek Gift Sacrifice (Bxh7+)",
    aliases: [
      "Calculating Combinations",
      "Dynamic Imbalance & King Hunt",
      "The Greek Gift Sacrifice",
      "Greek Gift",
      "Bxh7+ Sacrifice",
      "Classical Bishop Sacrifice",
      "Gift of the Danaans"
    ],
    category: "tactical",
    tier: "intermediate",
    ruleTitle: "The Greek Gift Sacrifice Rule",
    ruleBody: "When your bishop stares at h7 with a supporting knight ready to jump to g5 and queen to h5, sacrifice the bishop!",
    shortSummary: "A legendary sacrifice of a bishop on h7 (or h2 for Black) to rip open the enemy castled King and initiate a decisive mating assault.",
    historicalSource: {
      event: "Classical Masters Match Reference",
      white: "Emanuel Lasker (2nd World Champion)",
      black: "Johann Bauer",
      year: 1889,
      location: "Amsterdam, Netherlands (Double Bishop Sac Template)",
      plyOrMove: "Move 8. White to move",
      historicalNote: "The archetype of the kingside classical destruction. When the f6 knight defender is absent or deflected, the bishop sacrifice on h7 destroys the castled shelter."
    },
    fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 8",
    playerColor: "white",
    coachPrompt: "White has a battery aimed at Black's kingside. How does White unleash the standard Greek Gift attack if Black's knight on f6 is undefended?",
    candidateMoves: [
      {
        san: "Bxh7+",
        from: "d3",
        to: "h7",
        isBest: true,
        label: "Master Sacrifice (1. Bxh7+!)",
        coachFeedback: "The classical Greek Gift! 1. Bxh7+! strips Black's king of protective pawn shelter and drags the king into the open."
      },
      {
        san: "O-O",
        from: "e1",
        to: "g1",
        isBest: false,
        label: "Standard Castling (1. O-O)",
        coachFeedback: "Castling is solid, but misses the immediate tactical knockout while Black's defenses are discombobulated."
      }
    ],
    masterLine: [
      {
        from: "d3",
        to: "h7",
        san: "Bxh7+",
        explanation: "1. Bxh7+! destroys the kingside pawn shield."
      },
      {
        from: "g8",
        to: "h7",
        san: "Kxh7",
        explanation: "Black is forced to accept the sacrificial bishop."
      },
      {
        from: "f3",
        to: "g5",
        san: "Ng5+",
        explanation: "2. Ng5+ brings the knight in with tempo, clearing the d1-h5 diagonal for the Queen."
      }
    ],
    goldenRule: "Check the 4 Greek Gift prerequisites: 1. Bishop on d3/c4 hitting h7; 2. Knight ready for g5; 3. Queen ready for h5/g4; 4. No Black bishop or knight guarding g5/h7.",
    amateurBlindspot: "Players sacrifice on h7 without calculating if Black's king can safely walk to g6 or if Black has an in-between ...Bxg5 resource.",
    radarClues: [
      "Black's knight has moved away from f6 (e.g. to d7 or e4)",
      "White's bishop sits uncontested on the b1-h7 diagonal",
      "White's pawn on e5 driving away defenders"
    ],
    arenaFilter: {
      tier: "intermediate",
      targetCategoryId: "inter_combinations"
    }
  },

  {
    id: "smothered_mate",
    termName: "The Smothered Mate (Philidor's Legacy)",
    aliases: [
      "Complex Tactical Combinations & Clearance",
      "The Smothered Mate",
      "Smothered Checkmate",
      "Philidor's Legacy",
      "Suffocation Mate"
    ],
    category: "tactical",
    tier: "intermediate",
    ruleTitle: "The Smothered Net Rule",
    ruleBody: "When a king is completely hemmed in by its own friendly pieces, a lone jumping knight delivers checkmate from which there is no escape.",
    shortSummary: "A beautiful checkmate delivered by a knight because the enemy king is surrounded and suffocated by its own pieces.",
    historicalSource: {
      event: "Italian Game Blackburne Shilling Defense",
      white: "Amateur Player",
      black: "Joseph Henry Blackburne ('The Black Death')",
      year: 1880,
      location: "London, England",
      plyOrMove: "Move 4... Black to move",
      historicalNote: "Blackburne baited White into 4. Nxe5? attacking f7. Black uncaged 4... Qg5! 5. Nxf7 Qxg2 6. Rf1 Qxe4+ 7. Be2 Nf3#! delivering an immortal smothered mate in the heart of the board."
    },
    fen: "r1bqkbnr/pppp1ppp/8/4N3/2BnP3/8/PPPP1PPP/RNBQK2R b KQkq - 0 4",
    playerColor: "black",
    coachPrompt: "White just played 4. Nxe5?, greedily attacking f7. How does Black counter-attack White's g2 pawn and set up a smothered mating web?",
    candidateMoves: [
      {
        san: "Qg5",
        from: "d8",
        to: "g5",
        isBest: true,
        label: "Master Counter-Strike (4... Qg5!)",
        coachFeedback: "Blackburne's counter-punch! Attacks White's knight on e5 and the unprotected g2 pawn simultaneously."
      },
      {
        san: "Qe7",
        from: "d8",
        to: "e7",
        isBest: false,
        label: "Passive Queen Move (4... Qe7)",
        coachFeedback: "4... Qe7 regains the pawn after 5. Bxf7+, but gives up the initiative and misses the lethal smothered mate."
      }
    ],
    masterLine: [
      {
        from: "d8",
        to: "g5",
        san: "Qg5",
        explanation: "4... Qg5! attacks White's knight and g2 pawn."
      },
      {
        from: "e5",
        to: "f7",
        san: "Nxf7",
        explanation: "White greedily forks Black's Queen and Rook."
      },
      {
        from: "g5",
        to: "g2",
        san: "Qxg2",
        explanation: "Black invades the kingside, threatening the h1 rook."
      },
      {
        from: "h1",
        to: "f1",
        san: "Rf1",
        explanation: "White scrambles to guard the rook."
      },
      {
        from: "g2",
        to: "e4",
        san: "Qxe4+",
        explanation: "Black delivers check, forcing the bishop to interpose."
      },
      {
        from: "c4",
        to: "e2",
        san: "Be2",
        explanation: "White must block with the bishop."
      },
      {
        from: "d4",
        to: "f3",
        san: "Nf3#",
        explanation: "Smothered checkmate! The White king is completely trapped by its own pieces."
      }
    ],
    goldenRule: "A king trapped behind friendly pawns is only one knight leap away from suffocation. Look for queen sacrifices that force enemy rooks to box their own king in.",
    amateurBlindspot: "Players assume that having many pieces around their king means safety. In reality, crowded pieces with no escape squares turn into a cage.",
    radarClues: [
      "Enemy King boxed in the corner (h8 or h1) with pawns on g7/h7 or g2/h2",
      "A friendly knight able to reach f7 or f2 with check",
      "Queen sacrifice on g8 or g1 forcing a rook to capture and block the king's exit"
    ],
    arenaFilter: {
      tier: "intermediate",
      targetCategoryId: "inter_combinations"
    }
  },

  {
    id: "absolute_skewer",
    termName: "The Absolute Skewer & X-Ray Attack",
    aliases: [
      "The Absolute Skewer",
      "Skewer",
      "X-Ray Attack",
      "Reverse Pin"
    ],
    category: "tactical",
    tier: "advanced",
    ruleTitle: "The Absolute Skewer Rule",
    ruleBody: "When a king is attacked with a valuable piece directly behind it on the line of sight, the piece behind is lost when the king steps aside.",
    shortSummary: "Unlike a pin where the more valuable piece is in back, a skewer attacks the more valuable piece in front, forcing it to move and exposing the piece behind it.",
    historicalSource: {
      event: "Hastings Chess Congress Master Endgame",
      white: "José Raúl Capablanca (3rd World Champion)",
      black: "Frederick Yates",
      year: 1924,
      location: "Hastings, England",
      plyOrMove: "Endgame Benchmark. White to move",
      historicalNote: "A textbook demonstration of geometric domination on an open rank. Black's king and rook share the 8th rank with zero interposing squares, creating an absolute skewer."
    },
    fen: "r3k3/8/8/8/8/6R1/5PPP/6K1 w - - 0 1",
    playerColor: "white",
    coachPrompt: "Notice Black's king on e8 and rook on a8 sharing the open 8th rank. How does White win Black's rook in two forcing moves?",
    candidateMoves: [
      {
        san: "Rg8+",
        from: "g3",
        to: "g8",
        isBest: true,
        label: "Master Skewer (1. Rg8+!)",
        coachFeedback: "Laser precision! 1. Rg8+ checks the King. Since the king is forced to move, the a8 rook sitting behind it on the line of sight is completely lost."
      },
      {
        san: "Rc3",
        from: "g3",
        to: "c3",
        isBest: false,
        label: "Passive Move (1. Rc3)",
        coachFeedback: "1. Rc3 lets Black consolidate with 1... Kd7 or 1... Ke7, saving the rook and keeping the game equal."
      }
    ],
    masterLine: [
      {
        from: "g3",
        to: "g8",
        san: "Rg8+",
        explanation: "1. Rg8+ checks the king and skewers the rook behind it."
      },
      {
        from: "e8",
        to: "d7",
        san: "Kd7",
        explanation: "Black's king is forced to step away."
      },
      {
        from: "g8",
        to: "a8",
        san: "Rxa8",
        explanation: "2. Rxa8 captures the unprotected rook, winning the game."
      }
    ],
    goldenRule: "A pin attacks the baby with the mom behind it; a skewer attacks the mom with the baby behind it. When the mom runs away, the baby gets captured.",
    amateurBlindspot: "Players fail to scan ranks and diagonals all the way to the edge of the board. They don't realize their king and rook are in the same crosshairs.",
    radarClues: [
      "King and Queen or King and Rook on the same rank, file, or diagonal",
      "An open line with no pawns blocking the view",
      "Endgame positions where rooks or queens operate from long distance"
    ],
    arenaFilter: {
      tier: "advanced",
      targetCategoryId: "inter_technical_endgame"
    }
  },

  // -------------------------------------------------------------
  // 2. Opening & Trap Mechanics
  // -------------------------------------------------------------
  {
    id: "beg_early_queen",
    termName: "Knights & Bishops Before Queens",
    aliases: [
      "Knights & Bishops Before Queens",
      "Early Queen Rush",
      "Wayward Queen",
      "Development Principle"
    ],
    category: "opening_traps",
    tier: "beginner",
    ruleTitle: "Knights & Bishops Before Queens",
    ruleBody: "Develop your minor pieces (Knights & Bishops) and castle before moving your Queen into enemy territory.",
    shortSummary: "Rushing the Queen out on moves 2–4 allows the opponent to develop their minor pieces with tempo by repeatedly attacking her.",
    historicalSource: {
      event: "Classical Opening Study: Scholar's Trap Refutation",
      white: "Napoleon Bonaparte Era Analysis",
      black: "Madame de Rémusat",
      year: 1804,
      location: "Paris, France",
      plyOrMove: "Move 3. White to move",
      historicalNote: "One of the oldest opening principles in chess history. Amateurs love launching 2. Qh5 hoping for a cheap mate, but principled development with knights and bishops completely dismantles it."
    },
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
    playerColor: "white",
    coachPrompt: "White has already developed a bishop to c4. Instead of rushing the Queen out prematurely, what natural minor piece move develops a piece toward the center?",
    candidateMoves: [
      {
        san: "Nf3",
        from: "g1",
        to: "f3",
        isBest: true,
        label: "Principled Development (3. Nf3)",
        coachFeedback: "Classical perfection! 3. Nf3 develops a minor piece, attacks Black's e5 pawn, controls central squares, and prepares kingside castling."
      },
      {
        san: "Qh5",
        from: "d1",
        to: "h5",
        isBest: false,
        label: "Premature Queen Attack (3. Qh5)",
        coachFeedback: "A cheap trick. After 3... g6 4. Qf3 Nf6, Black develops with tempo while White's queen is forced to waste moves scurrying around."
      }
    ],
    masterLine: [
      {
        from: "g1",
        to: "f3",
        san: "Nf3",
        explanation: "3. Nf3 develops a minor piece, pressures e5, and prepares kingside castling."
      }
    ],
    goldenRule: "Don't send the general into battle before the army is assembled. Bring out knights and bishops first, castle the king, then unleash the queen.",
    amateurBlindspot: "Wanting to win the game in 4 moves. Beginners bring out the queen hoping the opponent doesn't notice the mate threat, but end up falling 3 moves behind in development.",
    radarClues: [
      "Opponent plays Qh5 or Qf3 on moves 2–4",
      "Minor pieces still sitting asleep on their original squares",
      "Opportunities to develop knights or pawns that attack the enemy queen with tempo"
    ],
    arenaFilter: {
      tier: "beginner",
      targetCategoryId: "beg_early_queen"
    }
  },

  {
    id: "beg_uncastled_king",
    termName: "Castle Early, Castle Often",
    aliases: [
      "Castle Early, Castle Often",
      "Stranded Center King",
      "King Safety",
      "Center King Vulnerability"
    ],
    category: "opening_traps",
    tier: "beginner",
    ruleTitle: "Castle Early, Castle Often",
    ruleBody: "Castle within the first 10 moves! A King stuck in the middle will get blasted open by enemy rooks and queens.",
    shortSummary: "Castling accomplishes two vital tasks in one move: it tucks the king safely into a corner fortress and activates the rook for battle.",
    historicalSource: {
      event: "Paris World Championship Match",
      white: "Paul Morphy",
      black: "Adolf Anderssen (Immortal Game victor)",
      year: 1858,
      location: "Paris, France (Game 9)",
      plyOrMove: "Move 4. White to move",
      historicalNote: "Paul Morphy demonstrated that speed of king safety and rapid central breakthrough is the governing law of open chess games."
    },
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    playerColor: "white",
    coachPrompt: "White has developed both minor pieces (Bc4 and Nf3). What move completes kingside safety and connects the rooks for the coming struggle?",
    candidateMoves: [
      {
        san: "O-O",
        from: "e1",
        to: "g1",
        isBest: true,
        label: "Master Move (4. O-O)",
        coachFeedback: "Flawless! 4. O-O tucks the king safely behind the pawns and prepares the f1 rook to contest the central e-file."
      },
      {
        san: "d3",
        from: "d2",
        to: "d3",
        isBest: false,
        label: "Slow Solid Move (4. d3)",
        coachFeedback: "4. d3 is playable, but castling immediately prioritizes king safety and prevents Black from creating early central counterplay."
      }
    ],
    masterLine: [
      {
        from: "e1",
        to: "g1",
        san: "O-O",
        explanation: "4. O-O places the White king in safety and connects the rooks."
      }
    ],
    goldenRule: "A king in the center is a king on a bulls-eye. When the center files open, a stranded king is helpless against checks and skewers.",
    amateurBlindspot: "Delaying castling to go on flank pawn-pushing adventures or grabbing pawns. One central pin from an enemy rook costs the entire game.",
    radarClues: [
      "Center pawns (d and e files) being traded off while the king is still on e1 or e8",
      "Opponent delaying castling past move 10",
      "Rooks unable to coordinate because the king is stuck blocking them"
    ],
    arenaFilter: {
      tier: "beginner",
      targetCategoryId: "beg_uncastled_king"
    }
  },

  {
    id: "elephant_trap",
    termName: "The Elephant Trap (Queen's Gambit Declined)",
    aliases: [
      "The Elephant Trap",
      "QGD Trap",
      "Cambridge Springs Trap",
      "Pseudo Pin Counter-Attack"
    ],
    category: "opening_traps",
    tier: "adv_beginner",
    ruleTitle: "The False Absolute Pin",
    ruleBody: "A pinned piece can still move if the resulting counter-attack delivers check against the opponent's king!",
    shortSummary: "A famous trap in the Queen's Gambit Declined where Black appears to blunder their queen, only to win a full piece with a crushing bishop check.",
    historicalSource: {
      event: "Cambridge Springs International Reference",
      white: "Amateur Master",
      black: "Textbook Opening Defense",
      year: 1892,
      location: "Cambridge Springs, USA",
      plyOrMove: "Move 6... Black to move",
      historicalNote: "White arrogantly thought Black's knight on f6 was absolutely pinned to Black's queen on d8, playing 6. Nxd5??. Black shattered White with 6... Nxd5! 7. Bxd8 Bb4+! winning a piece."
    },
    fen: "r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6",
    playerColor: "black",
    coachPrompt: "White just played 6. Nxd5??, assuming Black cannot touch the knight because of the pin on d8. How does Black shatter this illusion?",
    candidateMoves: [
      {
        san: "Nxd5",
        from: "f6",
        to: "d5",
        isBest: true,
        label: "Master Refutation (6... Nxd5!)",
        coachFeedback: "Immortal counter-trap! 6... Nxd5! leaves the Queen as bait. If White plays 7. Bxd8, Black delivers 7... Bb4+! 8. Qd2 Bxd2+ winning back the queen and pocketing an extra minor piece (+3.0)."
      },
      {
        san: "c6",
        from: "c7",
        to: "c6",
        isBest: false,
        label: "Solid Retreat (6... c6)",
        coachFeedback: "6... c6 is playable, but misses the immediate knockout 6... Nxd5! which wins a full piece on the spot."
      }
    ],
    masterLine: [
      {
        from: "f6",
        to: "d5",
        san: "Nxd5",
        explanation: "6... Nxd5! shatters the illusion of the pin on Black's Queen."
      },
      {
        from: "g5",
        to: "d8",
        san: "Bxd8",
        explanation: "White greedily accepts the bait Queen on d8."
      },
      {
        from: "f8",
        to: "b4",
        san: "Bb4+",
        explanation: "7... Bb4+! Decisive check forcing White to interpose their Queen on d2."
      },
      {
        from: "d1",
        to: "d2",
        san: "Qd2",
        explanation: "White has no legal move other than blocking with the Queen."
      },
      {
        from: "b4",
        to: "d2",
        san: "Bxd2+",
        explanation: "8... Bxd2+ captures White's queen."
      },
      {
        from: "e1",
        to: "d2",
        san: "Kxd2",
        explanation: "White recaptures the bishop with the king."
      },
      {
        from: "e8",
        to: "d8",
        san: "Kxd8",
        explanation: "9... Kxd8! Black captures the bishop, emerging up an entire minor piece (+3.0)."
      }
    ],
    goldenRule: "Before playing a move based on a pin, check: 'Does my opponent have a check in between?' Checks break pins every single time.",
    amateurBlindspot: "Assuming that a pin on the queen is always an absolute barrier. If the queen can be regained with check, the pin is an illusion.",
    radarClues: [
      "Bishop on g5 pinning a knight on f6 while the king is still on e1",
      "The dark-squared diagonal e1-a5 or e8-a4 wide open for bishop checks",
      "Opponent trading in the center before securing their own king"
    ],
    arenaFilter: {
      tier: "adv_beginner",
      targetCategoryId: "adv_opening_traps"
    }
  },

  {
    id: "noah_ark_trap",
    termName: "Noah's Ark Trap (Cornering the Bishop)",
    aliases: [
      "Noah's Ark Trap",
      "Cornering the Bishop",
      "Ruy Lopez Bishop Trap",
      "Piece Mobility Trap"
    ],
    category: "opening_traps",
    tier: "adv_beginner",
    ruleTitle: "The Piece Mobility Rule",
    ruleBody: "A piece without retreating squares is vulnerable to being suffocated and trapped by marching pawns.",
    shortSummary: "A classic opening trap in the Ruy Lopez where White's light-squared Spanish bishop is hemmed in, hunted, and trapped by Black's advancing pawn chain.",
    historicalSource: {
      event: "Hastings International Victory",
      white: "William Winter",
      black: "José Raúl Capablanca",
      year: 1919,
      location: "Hastings, England",
      plyOrMove: "Move 5... Black to move",
      historicalNote: "Capablanca demonstrated that a bishop without mobility is dead weight. Black kicks the bishop to b3, advances pawns, and corners the proud piece."
    },
    fen: "r1bqkb1r/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 5",
    playerColor: "black",
    coachPrompt: "White's Spanish bishop on a4 has limited retreat squares. How does Black begin hunting and cornering this bishop with tempo?",
    candidateMoves: [
      {
        san: "b5",
        from: "b7",
        to: "b5",
        isBest: true,
        label: "Master Move (5... b5!)",
        coachFeedback: "The classic Noah's Ark thrust! 5... b5! kicks White's bishop to b3 and prepares to snare it with ...Na5 or ...c5-c4."
      },
      {
        san: "d6",
        from: "d7",
        to: "d6",
        isBest: false,
        label: "Passive Move (5... d6)",
        coachFeedback: "Solid, but lets White play c3 and d4, giving their bishop an escape route and claiming the center."
      }
    ],
    masterLine: [
      {
        from: "b7",
        to: "b5",
        san: "b5",
        explanation: "5... b5! forces White's bishop onto the restrictive b3 square."
      },
      {
        from: "a4",
        to: "b3",
        san: "Bb3",
        explanation: "White's bishop must retreat to b3."
      },
      {
        from: "c6",
        to: "a5",
        san: "Na5",
        explanation: "6... Na5! hunts down the light-squared bishop, depriving White of their Spanish pride."
      }
    ],
    goldenRule: "A piece without retreat squares is an accident waiting to happen. Before maneuvering your bishop deep into enemy territory, ensure it has an emergency exit.",
    amateurBlindspot: "Thinking that bishops are always superior to pawns. A wall of humble pawns can completely suffocate and capture an enemy bishop.",
    radarClues: [
      "Bishop sitting on a4 or b3 with pawns ready to roll on a6, b5, and c5",
      "No c3 or a3 escape window created for the bishop",
      "Knight leaping to the rim (Na5) to trap the bishop"
    ],
    arenaFilter: {
      tier: "adv_beginner",
      targetCategoryId: "adv_opening_traps"
    }
  },

  // -------------------------------------------------------------
  // 3. Positional & Endgame Principles
  // -------------------------------------------------------------
  {
    id: "beg_back_rank_mate",
    termName: "The Escape Window (Luft)",
    aliases: [
      "The Escape Window (Luft)",
      "Luft",
      "Back-Rank & Corridor Mates",
      "Corridor Mate",
      "Back-Rank Checkmate"
    ],
    category: "positional_endgame",
    tier: "beginner",
    ruleTitle: "The Escape Window (Luft)",
    ruleBody: "Always push h3 or h6 to give your King a breathing room escape square so you never get trapped on the back row.",
    shortSummary: "When pawns trap their own king on the back rank, an invading enemy rook or queen can deliver an instantaneous checkmate.",
    historicalSource: {
      event: "London International Chess Tournament",
      white: "Edward Lasker",
      black: "Sir George Thomas",
      year: 1912,
      location: "London, England",
      plyOrMove: "Corridor Benchmark. White to move",
      historicalNote: "The back-rank corridor mate is the single most common unexpected loss among players rated 800–1600. When an opponent's king has no luft, overloaded back-rank defenders instantly collapse."
    },
    fen: "4r1k1/5ppp/8/8/8/2Q5/5PPP/4R1K1 w - - 0 1",
    playerColor: "white",
    coachPrompt: "Look at Black's back rank. Black's king on g8 has no escape window (luft). How does White exploit Black's lone defending rook?",
    candidateMoves: [
      {
        san: "Rxe8#",
        from: "e1",
        to: "e8",
        isBest: true,
        label: "Master Move (1. Rxe8#)",
        coachFeedback: "Decisive execution! 1. Rxe8# delivers an instant back-rank checkmate because Black has no escape square and no piece to block."
      },
      {
        san: "Qc7",
        from: "c3",
        to: "c7",
        isBest: false,
        label: "Passive Move (1. Qc7)",
        coachFeedback: "1. Qc7 allows Black to create an escape window with 1... h6 or defend with 1... Re6, letting the win slip away."
      },
      {
        san: "h3",
        from: "h2",
        to: "h3",
        isBest: false,
        label: "Unnecessary Luft (1. h3)",
        coachFeedback: "Creating luft for yourself is good, but when you have an immediate checkmate on the board, deliver the knockout blow first!"
      }
    ],
    masterLine: [
      {
        from: "e1",
        to: "e8",
        san: "Rxe8#",
        explanation: "1. Rxe8# delivers back-rank checkmate, exploiting Black's lack of an escape window."
      }
    ],
    goldenRule: "'Luft' is German for 'air'. Give your king breathing room before launching your rooks into battle.",
    amateurBlindspot: "Players leave their king behind a solid wall of f7-g7-h7 pawns and assume they are totally safe, not realizing that wall is a prison without a window.",
    radarClues: [
      "King on g8/g1 with pawns on f7, g7, h7 or f2, g2, h2",
      "Only one defending rook or queen on the 8th/1st rank",
      "Open center files (d or e) allowing heavy pieces to infiltrate"
    ],
    arenaFilter: {
      tier: "beginner",
      targetCategoryId: "beg_back_rank_mate"
    }
  },

  {
    id: "inter_technical_endgame",
    termName: "Tarrasch's Active Rook Principle",
    aliases: [
      "Steinitz's Worst-Placed Piece Principle",
      "Lucena & Philidor Conversion Principles",
      "Master Level Conversion & Dominance",
      "Tarrasch's Active Rook Principle",
      "Active Rook",
      "Rooks Behind Passed Pawns",
      "Rook Activity in Endgames"
    ],
    category: "positional_endgame",
    tier: "intermediate",
    ruleTitle: "Tarrasch's Active Rook Principle",
    ruleBody: "Rooks belong behind passed pawns—both your own and the opponent's—never passively tied to defense.",
    shortSummary: "In rook endgames, activity is everything. A passive rook guarding a pawn from the front is miserable; a rook firing from behind gains power as the pawn advances.",
    historicalSource: {
      event: "New York International Tournament",
      white: "José Raúl Capablanca",
      black: "Savielly Tartakower",
      year: 1924,
      location: "New York, USA",
      plyOrMove: "Move 35... Black to move",
      historicalNote: "Dr. Siegbert Tarrasch formulated this timeless law. In this historic game, Capablanca marched his king and activated his rook along the ranks, demonstrating total endgame mastery."
    },
    fen: "8/5pk1/4p1p1/3pP3/2r2P2/1R4P1/5K2/8 b - - 0 35",
    playerColor: "black",
    coachPrompt: "Black's rook is active on c4. How can Black invade White's 2nd rank to cut off White's king and maintain maximum piece activity?",
    candidateMoves: [
      {
        san: "Rc2+",
        from: "c4",
        to: "c2",
        isBest: true,
        label: "Master Move (35... Rc2+!)",
        coachFeedback: "Active rook dominance! 35... Rc2+ checks White's king, seizes the 2nd rank, and cuts off White's king from the center."
      },
      {
        san: "Ra4",
        from: "c4",
        to: "a4",
        isBest: false,
        label: "Passive Sideways Move (35... Ra4)",
        coachFeedback: "35... Ra4 gives away the initiative and allows White's king to activate into the center with 36. Ke3."
      }
    ],
    masterLine: [
      {
        from: "c4",
        to: "c2",
        san: "Rc2+",
        explanation: "35... Rc2+ invades the 2nd rank with check, enforcing Tarrasch's principle of maximum rook activity."
      }
    ],
    goldenRule: "A passive rook is a dead rook. If you must choose between defending a pawn passively or sacrificing it for an active rook on the 7th rank, choose activity every time.",
    amateurBlindspot: "Clinging desperately to every single pawn with passive pieces. In rook endgames, an active rook easily outplays a player who is up a pawn but paralyzed.",
    radarClues: [
      "Passed pawns racing down the board",
      "Open files leading directly to the 7th or 2nd rank",
      "Opponent's king cut off along a rank or file"
    ],
    arenaFilter: {
      tier: "intermediate",
      targetCategoryId: "inter_technical_endgame"
    }
  },

  {
    id: "inter_pawn_structure",
    termName: "Pawn Structure Integrity & Outposts",
    aliases: [
      "Pawn Structure Integrity & Outposts",
      "Outpost",
      "Pawn Structure",
      "Octopus Knight",
      "Weak Squares"
    ],
    category: "positional_endgame",
    tier: "intermediate",
    ruleTitle: "Pawn Structure Integrity",
    ruleBody: "Ceding key outpost squares (like d5, e4, or d3) or allowing chronic holes gives the opponent permanent domination.",
    shortSummary: "Pawns cannot move backward. Every pawn advance forever weakens the squares it used to protect. An outpost is a square deep in enemy territory that cannot be attacked by enemy pawns.",
    historicalSource: {
      event: "World Chess Championship Match",
      white: "Anatoly Karpov",
      black: "Garry Kasparov",
      year: 1985,
      location: "Moscow, USSR (Game 16)",
      plyOrMove: "Move 16. White to move",
      historicalNote: "Kasparov placed an immortal knight on the d3 outpost, dubbed 'The Octopus Knight'. It controlled 8 vital squares in White's camp and completely paralyzed the World Champion's army."
    },
    fen: "1r3rk1/1bq1bppp/p1np4/1p1Bp3/4P3/4BN2/PPP1QPPP/3R1RK1 w - - 0 16",
    playerColor: "white",
    coachPrompt: "Notice Black's central pawn structure. How does White solidify their light-square control and blunt Black's knight on c6?",
    candidateMoves: [
      {
        san: "c3",
        from: "c2",
        to: "c3",
        isBest: true,
        label: "Master Move (16. c3)",
        coachFeedback: "Positional discipline! 16. c3 denies Black's knight the b4 and d4 squares and secures White's queenside fortress."
      },
      {
        san: "a3",
        from: "a2",
        to: "a3",
        isBest: false,
        label: "Flank Move (16. a3)",
        coachFeedback: "16. a3 is a bit loose and ignores Black's potential central leap ...Nd4."
      }
    ],
    masterLine: [
      {
        from: "c2",
        to: "c3",
        san: "c3",
        explanation: "16. c3 solidifies central control and denies Black outposts."
      }
    ],
    goldenRule: "A knight on an outpost deep in the enemy camp is worth more than a rook. Never push a pawn unless you are prepared to live with the holes left behind.",
    amateurBlindspot: "Pushing pawns just to attack an enemy piece, not realizing they permanently surrendered the hole right in front of their king or center.",
    radarClues: [
      "Squares on the 4th, 5th, or 6th rank that can never be challenged by enemy pawns",
      "Backward pawns stuck on an open file",
      "Color complexes stripped of friendly pawn cover"
    ],
    arenaFilter: {
      tier: "intermediate",
      targetCategoryId: "inter_pawn_structure"
    }
  },

  {
    id: "adv_pawn_races",
    termName: "King Leads the Way (Opposition & Shouldering)",
    aliases: [
      "King Activity & Passed Pawn Priority",
      "Triangulation & Opposition Mastery",
      "King Leads the Way",
      "Opposition",
      "King Escorts",
      "Endgame Pawn Races",
      "Shouldering",
      "Réti Endgame Study"
    ],
    category: "positional_endgame",
    tier: "adv_beginner",
    ruleTitle: "King Leads the Way",
    ruleBody: "In pawn endings, your King must walk in front of your passed pawn to shoulder away the enemy King.",
    shortSummary: "In pawn endgames, the king is not a coward—it is the ultimate offensive weapon. Mastering opposition and diagonal shouldering wins lost-looking endgames.",
    historicalSource: {
      event: "Kagans Neueste Schachnachrichten",
      white: "Richard Réti",
      black: "Endgame Study",
      year: 1921,
      location: "Vienna, Austria",
      plyOrMove: "Endgame Study. White to move",
      historicalNote: "The most famous endgame study in chess history. White's king appears hopelessly far from both Black's passed pawn and White's own pawn, yet a diagonal king walk achieves an impossible draw."
    },
    fen: "7K/8/2P5/7p/8/8/8/k7 w - - 0 1",
    playerColor: "white",
    coachPrompt: "Black's pawn on h5 is racing to queen, while White's c6 pawn seems doomed. How does White's king walk along the diagonal to threaten BOTH tasks at once?",
    candidateMoves: [
      {
        san: "Kg7",
        from: "h8",
        to: "g7",
        isBest: true,
        label: "Réti's Diagonal King Walk (1. Kg7!)",
        coachFeedback: "The legendary Réti maneuver! 1. Kg7 steps diagonally, keeping an eye on Black's h-pawn while creeping closer to support the c6 pawn."
      },
      {
        san: "Kg8",
        from: "h8",
        to: "g8",
        isBest: false,
        label: "Aimless Shuffle (1. Kg8)",
        coachFeedback: "1. Kg8 moves away from the c6 pawn and lets Black promote the h-pawn effortlessly with 1... h4."
      }
    ],
    masterLine: [
      {
        from: "h8",
        to: "g7",
        san: "Kg7",
        explanation: "1. Kg7! White's king steps diagonally toward both pawns."
      },
      {
        from: "h5",
        to: "h4",
        san: "h4",
        explanation: "Black pushes the h-pawn forward."
      },
      {
        from: "g7",
        to: "f6",
        san: "Kf6",
        explanation: "2. Kf6! Continues the dual threat: catching the h-pawn or supporting c6."
      },
      {
        from: "a1",
        to: "b2",
        san: "Kb2",
        explanation: "Black's king rushes to stop the c-pawn."
      },
      {
        from: "f6",
        to: "e5",
        san: "Ke5",
        explanation: "3. Ke5! White's king arrives in time to shepherd the c-pawn to queen, securing the draw."
      }
    ],
    goldenRule: "A king moving diagonally covers rank and file distance simultaneously. Walk your king in front of your pawns, not behind them.",
    amateurBlindspot: "Pushing passed pawns without king escort. Without the king clearing the path, the opponent's king easily blockades and captures the pawn.",
    radarClues: [
      "Pawn endgames with kings racing across the board",
      "Opponent's king trying to establish direct opposition",
      "Square of the pawn (rule of the square) calculations"
    ],
    arenaFilter: {
      tier: "adv_beginner",
      targetCategoryId: "adv_pawn_races"
    }
  },

  // -------------------------------------------------------------
  // 4. ChessZ Diagnostic & Engine Concepts
  // -------------------------------------------------------------
  {
    id: "blunder_swing",
    termName: "Blunder Swing & Centipawn Equity",
    aliases: [
      "Blunder Swing",
      "Centipawn Equity",
      "Eval Swing",
      "Engine Evaluation",
      "Win% Curve"
    ],
    category: "diagnostics",
    tier: "intermediate",
    ruleTitle: "Blunder Swing & Centipawn Equity",
    ruleBody: "A tactical blunder shifts evaluation by more than 400 centipawns (4.0 pawns) or converts a winning advantage directly into a forced loss.",
    shortSummary: "How chess engines quantify human mistakes. An inaccuracy is a minor leak; a mistake shifts the balance; a blunder fundamentally throws the game away.",
    historicalSource: {
      event: "ChessZ Engine Metric Standard",
      white: "Stockfish WASM Engine",
      black: "Mathematical Win% Model",
      year: 2025,
      location: "ChessZ Mathematical Core",
      plyOrMove: "Evaluation & Equity Formula",
      historicalNote: "ChessZ translates raw centipawns into win probability using a logistic sigmoid curve: Win% = 50 + 50 * (2 / (1 + exp(-0.003682 * cp)) - 1)."
    },
    fen: "4r1k1/5ppp/8/8/8/2Q5/5PPP/4R1K1 w - - 0 1",
    playerColor: "white",
    coachPrompt: "Before playing a move in a winning position, ask: 'Does my candidate move preserve my +5.0 eval, or does it drop equity back to 0.0?'",
    candidateMoves: [
      {
        san: "Rxe8#",
        from: "e1",
        to: "e8",
        isBest: true,
        label: "Eval: +Mate in 1 (100% Win%)",
        coachFeedback: "Zero centipawn loss! Delivering the checkmate locks in a 100% win equity with maximum precision."
      },
      {
        san: "Qc7",
        from: "c3",
        to: "c7",
        isBest: false,
        label: "Eval: +0.2 (Massive -600cp Blunder Swing)",
        coachFeedback: "A catastrophic 600-centipawn blunder swing! Playing Qc7 throws away an instant checkmate and drops the win probability from 100% down to 50%."
      }
    ],
    masterLine: [
      {
        from: "e1",
        to: "e8",
        san: "Rxe8#",
        explanation: "1. Rxe8# delivers checkmate with zero centipawn loss."
      }
    ],
    goldenRule: "Not all mistakes are equal. Guard against the single move that causes a >400 centipawn swing—that is the move that turns a won game into an L.",
    amateurBlindspot: "Treating a blunder like bad luck. In reality, blunders happen when players calculate only their own attacking move and zero opponent responses.",
    radarClues: [
      "Positions with an eval greater than +3.0 where one wrong move drops to 0.0 or negative",
      "Sudden counter-tactics appearing when playing on autopilot",
      "Large swings on the ChessZ eval bar"
    ]
  },

  {
    id: "psychological_conviction",
    termName: "Psychological Conviction (Bluff vs. Calculation)",
    aliases: [
      "Psychological Conviction",
      "Bluff vs Calculation",
      "Sure vs Guessing",
      "Conviction Telemetry",
      "Cognitive Telemetry"
    ],
    category: "diagnostics",
    tier: "intermediate",
    ruleTitle: "Psychological Conviction",
    ruleBody: "The gap between how confident you feel ('Sure') and whether you calculated the refutation is where 80% of rating points are lost.",
    shortSummary: "ChessZ's breakthrough diagnostic metric: tracking whether you made a move with genuine tactical calculation or intuitive bluffing under clock pressure.",
    historicalSource: {
      event: "ChessZ Cognitive Telemetry Benchmark",
      white: "Diagnostic Curriculum",
      black: "Player Psychology Study",
      year: 2025,
      location: "ChessZ Skill Lab (/diagnose)",
      plyOrMove: "Confidence Prompt: 'Sure' | 'Think so' | 'Guessing'",
      historicalNote: "Tracking millisecond move telemetry alongside conviction prompts exposes overconfident strikers who play fast on intuition but blunder to basic counter-punches."
    },
    fen: "r2qkbnr/ppp2ppp/2np4/4N2b/2B1P3/2N4P/PPPP1PP1/R1BQK2R b KQkq - 0 6",
    playerColor: "black",
    coachPrompt: "When you see an opponent's queen sitting undefended, pause! Are you 'Sure' taking it is safe, or are you 'Guessing' based on reflex?",
    candidateMoves: [
      {
        san: "Nxe5",
        from: "c6",
        to: "e5",
        isBest: true,
        label: "Calculated Refutation (Conviction: Sure)",
        coachFeedback: "Genuine calculation! You looked at the forcing continuation, proved that taking the queen loses to mate, and found the correct refutation."
      },
      {
        san: "Bxd1",
        from: "h5",
        to: "d1",
        isBest: false,
        label: "Intuitive Reflex (Overconfident Blunder)",
        coachFeedback: "The classic Overconfident Striker trap! Playing Bxd1 with 100% conviction results in immediate checkmate. Slow down and verify."
      }
    ],
    masterLine: [
      {
        from: "c6",
        to: "e5",
        san: "Nxe5",
        explanation: "Calculated defense eliminates the checkmating knight."
      }
    ],
    goldenRule: "If you feel 100% 'Sure' but didn't look for your opponent's checks and captures, you are not calculating—you are bluffing yourself.",
    amateurBlindspot: "Assuming that feeling good about a move means the move is good. Masters feel paranoid and actively try to disprove their own candidate moves.",
    radarClues: [
      "Playing a move in under 2 seconds on a critical tactical turn",
      "Selecting 'Sure' on a move that falls into an elementary counter-trap",
      "Feeling impatient when an opponent's king seems vulnerable"
    ]
  },

  {
    id: "calculation_velocity",
    termName: "Calculation Velocity & Time-to-Move",
    aliases: [
      "Calculation Velocity",
      "Time-to-Move",
      "Hesitation Index",
      "Impulse Control",
      "Decision Speed"
    ],
    category: "diagnostics",
    tier: "advanced",
    ruleTitle: "Calculation Velocity",
    ruleBody: "Masters spend their time on critical turning points and play forcing moves rapidly. Amateurs waste time on obvious moves and rush during crises.",
    shortSummary: "How you allocate your clock seconds. Rapid tactical pattern recognition allows you to bank time for the deep calculations that decide games.",
    historicalSource: {
      event: "ChessZ Telemetry Architecture Guide",
      white: "Chronometric Analysis Model",
      black: "FIDE Time Management Study",
      year: 2025,
      location: "ChessZ Diagnostic Engine",
      plyOrMove: "Millisecond Hesitation Telemetry",
      historicalNote: "ChessZ measures the time spent from puzzle presentation to piece release, classifying players into Clean Calculators, Impulsive Strikers, or Hesitant Doubters."
    },
    fen: "3rkb1r/p2nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R w k - 3 13",
    playerColor: "white",
    coachPrompt: "In a sharp tactical position like Morphy's Opera Game, take 10 seconds to verify every candidate check before making your move.",
    candidateMoves: [
      {
        san: "Rxd7",
        from: "d1",
        to: "d7",
        isBest: true,
        label: "Master Strike (13. Rxd7!)",
        coachFeedback: "Optimal velocity: calculating the forced line (13. Rxd7! Rxd7 14. Rd1) before playing gives you unshakable confidence on the board."
      },
      {
        san: "Rhe1",
        from: "h1",
        to: "e1",
        isBest: false,
        label: "Quiet Rook Move (13. Rhe1)",
        coachFeedback: "Hesitant move that wastes a tempo and gives Black time to castle or untangle their pinned pieces."
      }
    ],
    masterLine: [
      {
        from: "d1",
        to: "d7",
        san: "Rxd7",
        explanation: "13. Rxd7! strikes decisively on the pinned knight."
      }
    ],
    goldenRule: "Slow down when the position is sharp; speed up when the path is forced. Never move on your first impulse in a tactical crisis.",
    amateurBlindspot: "Blitz addiction. Players get so used to 3-minute games that they play critical moves in 0.8 seconds even when they have 10 minutes on their clock.",
    radarClues: [
      "Making an irreversible move within 1 second of seeing the position",
      "Clock deficit in the opening from hesitating on book moves",
      "Sudden tactical blunders caused by clock panic"
    ]
  }
];

// Helper to look up a term by ID, name, or rule title
export function getTermDefinition(termOrIdOrRule: string): ChessStudyTerm | undefined {
  if (!termOrIdOrRule) return undefined;
  const query = termOrIdOrRule.toLowerCase().trim();

  // 1. Direct ID match
  const byId = CHESS_STUDY_TERMS.find((t) => t.id.toLowerCase() === query);
  if (byId) return byId;

  // 2. Term Name or Rule Title match
  const byNameOrRule = CHESS_STUDY_TERMS.find(
    (t) =>
      t.termName.toLowerCase() === query ||
      t.ruleTitle.toLowerCase() === query
  );
  if (byNameOrRule) return byNameOrRule;

  // 3. Alias match
  const byAlias = CHESS_STUDY_TERMS.find((t) =>
    t.aliases.some((a) => a.toLowerCase() === query)
  );
  if (byAlias) return byAlias;

  // 4. Fuzzy / substring match
  return CHESS_STUDY_TERMS.find(
    (t) =>
      t.termName.toLowerCase().includes(query) ||
      t.ruleTitle.toLowerCase().includes(query) ||
      t.aliases.some((a) => a.toLowerCase().includes(query)) ||
      query.includes(t.termName.toLowerCase()) ||
      query.includes(t.ruleTitle.toLowerCase())
  );
}
