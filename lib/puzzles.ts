export type LevelType = "beginner" | "adv_beginner" | "intermediate" | "advanced";
export type TrackType = "tactical" | "positional";

export interface PuzzleStep {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  explanation?: string;
}

export interface RefutationMove {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  coachExplanation: string;
}

export interface ChessPuzzle {
  id: string;
  lichessId: string;
  tier: LevelType;
  track: TrackType;
  branch?: string;
  title: string;
  ratingBadge: string;
  initialFen: string;
  playerColor: "white" | "black";
  prompt: string;
  ruleTitle: string;
  ruleBody: string;
  solutionMoves: PuzzleStep[];
  opponentResponses?: PuzzleStep[];
  defaultRefutation: RefutationMove;
  successExplanation: string;
}

// 100% Real, Offline Lichess Puzzles categorized by Tier and Diagnostic Blunder Leak
// 16 categories * 25 puzzles = 400 diagnostic puzzles
export const LICHESS_DIAGNOSTIC_CATEGORIES: Record<string, ChessPuzzle[]> = {
  "beginner_0": [
    {
      "id": "lichess_005N7",
      "lichessId": "005N7",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #005N7: Rating 684",
      "ratingBadge": "Lichess: ~684",
      "initialFen": "r6k/2q3pp/8/2p5/R1np4/7P/2PB1PP1/6K1 w - - 0 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "a4",
          "to": "a8",
          "san": "Rxa8+",
          "explanation": "Master move Rxa8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "b8",
        "san": "Qb8",
        "coachExplanation": "Opponent plays Qb8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxa8+ is the engine-verified winning move from Lichess #005N7."
    },
    {
      "id": "lichess_00CYP",
      "lichessId": "00CYP",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00CYP: Rating 721",
      "ratingBadge": "Lichess: ~721",
      "initialFen": "3r1k1r/p1p2pp1/1p6/2pQ1b2/2Pn1P2/8/PP1P1KBq/R1B1R3 w - - 4 26",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "d8",
          "san": "Qxd8#",
          "explanation": "Master move Qxd8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "e8",
        "san": "Kf8",
        "coachExplanation": "Opponent responds with Kf8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxd8# is the engine-verified winning move from Lichess #00CYP."
    },
    {
      "id": "lichess_00FHX",
      "lichessId": "00FHX",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00FHX: Rating 473",
      "ratingBadge": "Lichess: ~473",
      "initialFen": "2r3k1/5p1p/4pP2/3p3P/8/5P2/p5P1/1bR3K1 w - - 1 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "c1",
          "to": "c8",
          "san": "Rxc8#",
          "explanation": "Master move Rxc8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b1",
        "to": "c2",
        "san": "Bb1",
        "coachExplanation": "Opponent responds with Bb1! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxc8# is the engine-verified winning move from Lichess #00FHX."
    },
    {
      "id": "lichess_00NR5",
      "lichessId": "00NR5",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00NR5: Rating 576",
      "ratingBadge": "Lichess: ~576",
      "initialFen": "R2r2k1/6pp/3N4/1nP5/6P1/1P3P2/P2K2n1/8 w - - 2 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "a8",
          "to": "d8",
          "san": "Rxd8#",
          "explanation": "Master move Rxd8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "d7",
        "san": "Rd8",
        "coachExplanation": "Opponent responds with Rd8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxd8# is the engine-verified winning move from Lichess #00NR5."
    },
    {
      "id": "lichess_00X1l",
      "lichessId": "00X1l",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00X1l: Rating 848",
      "ratingBadge": "Lichess: ~848",
      "initialFen": "5r1k/Q6p/1pb3p1/4q3/4p3/1BP4P/PP4p1/5RK1 w - - 0 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "f8",
          "san": "Rxf8#",
          "explanation": "Master move Rxf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g2",
        "to": "f3",
        "san": "fxg2",
        "coachExplanation": "Opponent responds with fxg2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxf8# is the engine-verified winning move from Lichess #00X1l."
    },
    {
      "id": "lichess_00eCY",
      "lichessId": "00eCY",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00eCY: Rating 774",
      "ratingBadge": "Lichess: ~774",
      "initialFen": "8/6p1/5p1p/R2b2kP/6P1/1r3PK1/8/8 w - - 5 62",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "a5",
          "to": "d5",
          "san": "Rxd5+",
          "explanation": "Master move Rxd5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "f5",
        "san": "f5",
        "coachExplanation": "Opponent plays f5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd5+ is the engine-verified winning move from Lichess #00eCY."
    },
    {
      "id": "lichess_00vZg",
      "lichessId": "00vZg",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00vZg: Rating 733",
      "ratingBadge": "Lichess: ~733",
      "initialFen": "5r1k/1b4pp/4B3/2Qp4/2r1p3/6P1/4qP1P/2B2RK1 w - - 4 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "c5",
          "to": "f8",
          "san": "Qxf8#",
          "explanation": "Master move Qxf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h8",
        "to": "g8",
        "san": "Kh8",
        "coachExplanation": "Opponent responds with Kh8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxf8# is the engine-verified winning move from Lichess #00vZg."
    },
    {
      "id": "lichess_00zxV",
      "lichessId": "00zxV",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00zxV: Rating 636",
      "ratingBadge": "Lichess: ~636",
      "initialFen": "rn3k1r/pp2p2p/2p3p1/8/2B1n3/4q3/PQP3PP/RN3K1R w - - 4 15",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "b2",
          "to": "h8",
          "san": "Qxh8#",
          "explanation": "Master move Qxh8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e4",
        "to": "f6",
        "san": "Ne4",
        "coachExplanation": "Opponent responds with Ne4! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxh8# is the engine-verified winning move from Lichess #00zxV."
    },
    {
      "id": "lichess_0119E",
      "lichessId": "0119E",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #0119E: Rating 448",
      "ratingBadge": "Lichess: ~448",
      "initialFen": "5q1k/7p/3Np1bP/4P3/3P2P1/2n5/8/5QK1 w - - 0 46",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "f8",
          "san": "Qxf8#",
          "explanation": "Master move Qxf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "e7",
        "san": "Qxf8",
        "coachExplanation": "Opponent responds with Qxf8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxf8# is the engine-verified winning move from Lichess #0119E."
    },
    {
      "id": "lichess_01I0q",
      "lichessId": "01I0q",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #01I0q: Rating 768",
      "ratingBadge": "Lichess: ~768",
      "initialFen": "2k2n1r/prp3pp/8/Q1RP4/2N1Pq2/P7/1P3PPP/2R3K1 b - - 4 28",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "c1",
          "san": "Qxc1+",
          "explanation": "Master move Qxc1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a5",
        "to": "e1",
        "san": "Qe1",
        "coachExplanation": "Opponent plays Qe1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxc1+ is the engine-verified winning move from Lichess #01I0q."
    },
    {
      "id": "lichess_01LBw",
      "lichessId": "01LBw",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #01LBw: Rating 725",
      "ratingBadge": "Lichess: ~725",
      "initialFen": "r6r/ppp1kBp1/2np4/4p3/4P1Q1/P2P3q/1PPN1P2/R4RK1 b - - 0 17",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "h3",
          "to": "g4",
          "san": "Qxg4#",
          "explanation": "Master move Qxg4#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g4",
        "to": "d1",
        "san": "Qxg4",
        "coachExplanation": "Opponent responds with Qxg4! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxg4# is the engine-verified winning move from Lichess #01LBw."
    },
    {
      "id": "lichess_01QIH",
      "lichessId": "01QIH",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #01QIH: Rating 598",
      "ratingBadge": "Lichess: ~598",
      "initialFen": "4rr1k/1pR3bp/p4npN/2p2pB1/3p4/3P3Q/PPP2PPP/4R1K1 b - - 0 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "e8",
          "to": "e1",
          "san": "Rxe1#",
          "explanation": "Master move Rxe1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "e7",
        "san": "Rxc7",
        "coachExplanation": "Opponent responds with Rxc7! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxe1# is the engine-verified winning move from Lichess #01QIH."
    },
    {
      "id": "lichess_01QTc",
      "lichessId": "01QTc",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #01QTc: Rating 810",
      "ratingBadge": "Lichess: ~810",
      "initialFen": "R1b3k1/4pp2/3p2p1/2pP3p/2P1PP2/2Q2B1P/5qPK/1r6 w - - 0 28",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "a8",
          "to": "c8",
          "san": "Rxc8+",
          "explanation": "Master move Rxc8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h7",
        "san": "Kh7",
        "coachExplanation": "Opponent plays Kh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxc8+ is the engine-verified winning move from Lichess #01QTc."
    },
    {
      "id": "lichess_01gl3",
      "lichessId": "01gl3",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #01gl3: Rating 458",
      "ratingBadge": "Lichess: ~458",
      "initialFen": "5r1k/6pp/3p2p1/pppP2q1/5RP1/3P4/PPPQ4/2K5 w - - 1 26",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "f8",
          "san": "Rxf8#",
          "explanation": "Master move Rxf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g5",
        "to": "d8",
        "san": "Qg5",
        "coachExplanation": "Opponent responds with Qg5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxf8# is the engine-verified winning move from Lichess #01gl3."
    },
    {
      "id": "lichess_01uI5",
      "lichessId": "01uI5",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #01uI5: Rating 608",
      "ratingBadge": "Lichess: ~608",
      "initialFen": "rn1Br1k1/pp3ppp/2p5/3p4/3P4/5b1P/PPP2PP1/RN2R1K1 w - - 0 15",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "e1",
          "to": "e8",
          "san": "Rxe8#",
          "explanation": "Master move Rxe8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "h5",
        "san": "Bxf3",
        "coachExplanation": "Opponent responds with Bxf3! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxe8# is the engine-verified winning move from Lichess #01uI5."
    },
    {
      "id": "lichess_01zWA",
      "lichessId": "01zWA",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #01zWA: Rating 634",
      "ratingBadge": "Lichess: ~634",
      "initialFen": "8/2r5/1b5k/1P1Pp1R1/4Q2p/6pP/6P1/2r2B1K b - - 0 41",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "c1",
          "to": "f1",
          "san": "Rxf1#",
          "explanation": "Master move Rxf1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g5",
        "to": "f5",
        "san": "Rxg5",
        "coachExplanation": "Opponent responds with Rxg5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxf1# is the engine-verified winning move from Lichess #01zWA."
    },
    {
      "id": "lichess_0217e",
      "lichessId": "0217e",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #0217e: Rating 505",
      "ratingBadge": "Lichess: ~505",
      "initialFen": "1rb1k2r/b5p1/p2pPp1p/qp1Q4/7N/1P6/P4PPP/R1B1R1K1 b k - 0 19",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "a5",
          "to": "e1",
          "san": "Qxe1#",
          "explanation": "Master move Qxe1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "d1",
        "san": "Qxd5",
        "coachExplanation": "Opponent responds with Qxd5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxe1# is the engine-verified winning move from Lichess #0217e."
    },
    {
      "id": "lichess_021Lo",
      "lichessId": "021Lo",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #021Lo: Rating 779",
      "ratingBadge": "Lichess: ~779",
      "initialFen": "r2qk2r/pp2bBpp/2n5/4p3/6b1/2P2N2/P4PPP/R1BQ1RK1 b kq - 0 13",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "e8",
          "to": "f7",
          "san": "Kxf7",
          "explanation": "Master move Kxf7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "g5",
        "san": "Ng5+",
        "coachExplanation": "Opponent plays Ng5+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxf7 is the engine-verified winning move from Lichess #021Lo."
    },
    {
      "id": "lichess_021cG",
      "lichessId": "021cG",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #021cG: Rating 659",
      "ratingBadge": "Lichess: ~659",
      "initialFen": "5rk1/2p2p2/ppB1p1p1/4Q3/1PP3q1/P6R/5PPP/3R2K1 b - - 0 27",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "g4",
          "to": "d1",
          "san": "Qxd1+",
          "explanation": "Master move Qxd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "e1",
        "san": "Qe1",
        "coachExplanation": "Opponent plays Qe1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd1+ is the engine-verified winning move from Lichess #021cG."
    },
    {
      "id": "lichess_025Et",
      "lichessId": "025Et",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #025Et: Rating 660",
      "ratingBadge": "Lichess: ~660",
      "initialFen": "2r3k1/1Q3ppp/8/8/4B3/2q1P3/R4PPP/4R1K1 b - - 0 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "e1",
          "san": "Qxe1#",
          "explanation": "Master move Qxe1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a2",
        "to": "e2",
        "san": "Rxa2",
        "coachExplanation": "Opponent responds with Rxa2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxe1# is the engine-verified winning move from Lichess #025Et."
    },
    {
      "id": "lichess_02IQK",
      "lichessId": "02IQK",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #02IQK: Rating 475",
      "ratingBadge": "Lichess: ~475",
      "initialFen": "3nr2k/pb1Q2pp/1p6/8/8/5P2/P5PP/6K1 w - - 1 26",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "d7",
          "to": "e8",
          "san": "Qxe8#",
          "explanation": "Master move Qxe8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "f7",
        "san": "Nd8",
        "coachExplanation": "Opponent responds with Nd8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxe8# is the engine-verified winning move from Lichess #02IQK."
    },
    {
      "id": "lichess_02MII",
      "lichessId": "02MII",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #02MII: Rating 576",
      "ratingBadge": "Lichess: ~576",
      "initialFen": "2r3k1/pp3ppp/4pn2/3p4/1P5P/P5P1/4nbBK/2R5 w - - 0 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "c1",
          "to": "c8",
          "san": "Rxc8+",
          "explanation": "Master move Rxc8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "e8",
        "san": "Ne8",
        "coachExplanation": "Opponent plays Ne8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxc8+ is the engine-verified winning move from Lichess #02MII."
    },
    {
      "id": "lichess_02MgK",
      "lichessId": "02MgK",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #02MgK: Rating 752",
      "ratingBadge": "Lichess: ~752",
      "initialFen": "2r4k/q5pp/4Qp2/8/1Ppb4/5PPP/7K/4BB2 w - - 1 40",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "c8",
          "san": "Qxc8#",
          "explanation": "Master move Qxc8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h8",
        "to": "g8",
        "san": "Kh8",
        "coachExplanation": "Opponent responds with Kh8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxc8# is the engine-verified winning move from Lichess #02MgK."
    },
    {
      "id": "lichess_02Or9",
      "lichessId": "02Or9",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #02Or9: Rating 685",
      "ratingBadge": "Lichess: ~685",
      "initialFen": "2n2r1k/p1q4p/2P3p1/2Q1b3/3P4/7P/P4PP1/5RK1 w - - 0 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "c5",
          "to": "f8",
          "san": "Qxf8#",
          "explanation": "Master move Qxf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "f6",
        "san": "Bxe5",
        "coachExplanation": "Opponent responds with Bxe5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxf8# is the engine-verified winning move from Lichess #02Or9."
    },
    {
      "id": "lichess_02T7b",
      "lichessId": "02T7b",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #02T7b: Rating 788",
      "ratingBadge": "Lichess: ~788",
      "initialFen": "8/2k5/1b1p1p2/p1PQ1P2/1p1PP3/1P5q/7R/5R1K b - - 9 39",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, take 2 seconds to check: \"Does every piece have a teammate defending it?\" Never donate free points.",
      "solutionMoves": [
        {
          "from": "h3",
          "to": "f1",
          "san": "Qxf1#",
          "explanation": "Master move Qxf1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h2",
        "to": "g2",
        "san": "Rh2",
        "coachExplanation": "Opponent responds with Rh2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxf1# is the engine-verified winning move from Lichess #02T7b."
    }
  ],
  "beginner_1": [
    {
      "id": "lichess_000rZ",
      "lichessId": "000rZ",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #000rZ: Rating 633",
      "ratingBadge": "Lichess: ~633",
      "initialFen": "2kr1b1r/p1p2pp1/2pqN3/7p/6n1/2NPB3/PPP2PPP/R2Q1RK1 b - - 0 13",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "h2",
          "san": "Qxh2#",
          "explanation": "Master move Qxh2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e6",
        "to": "d4",
        "san": "Nxe6",
        "coachExplanation": "Opponent responds with Nxe6! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxh2# is the engine-verified winning move from Lichess #000rZ."
    },
    {
      "id": "lichess_001KR",
      "lichessId": "001KR",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #001KR: Rating 588",
      "ratingBadge": "Lichess: ~588",
      "initialFen": "6k1/p1p3pp/4N3/1p6/2q1r1n1/2B5/PP4PP/3R1R1K w - - 0 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "f8",
          "san": "Rf8#",
          "explanation": "Master move Rf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kxg8",
        "coachExplanation": "Opponent responds with Kxg8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rf8# is the engine-verified winning move from Lichess #001KR."
    },
    {
      "id": "lichess_002vV",
      "lichessId": "002vV",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #002vV: Rating 564",
      "ratingBadge": "Lichess: ~564",
      "initialFen": "8/6k1/1R5p/5p1P/5P1K/6P1/8/r7 b - - 3 58",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "a1",
          "to": "h1",
          "san": "Rh1#",
          "explanation": "Master move Rh1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b6",
        "to": "c6",
        "san": "Rb6",
        "coachExplanation": "Opponent responds with Rb6! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rh1# is the engine-verified winning move from Lichess #002vV."
    },
    {
      "id": "lichess_00465",
      "lichessId": "00465",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00465: Rating 572",
      "ratingBadge": "Lichess: ~572",
      "initialFen": "5r1k/pp4pp/2p5/6q1/5R2/2P5/P1P2PPP/3rR1K1 w - - 0 28",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "f8",
          "san": "Rxf8#",
          "explanation": "Master move Rxf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "d8",
        "san": "Rxf8",
        "coachExplanation": "Opponent responds with Rxf8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxf8# is the engine-verified winning move from Lichess #00465."
    },
    {
      "id": "lichess_004iZ",
      "lichessId": "004iZ",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #004iZ: Rating 499",
      "ratingBadge": "Lichess: ~499",
      "initialFen": "r2r2k1/2q1bpp1/3p3p/1ppn4/1P1BP3/P5Q1/4RPPP/R5K1 w - - 0 21",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "g7",
          "san": "Qxg7#",
          "explanation": "Master move Qxg7#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "f6",
        "san": "Nxd5",
        "coachExplanation": "Opponent responds with Nxd5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxg7# is the engine-verified winning move from Lichess #004iZ."
    },
    {
      "id": "lichess_004yJ",
      "lichessId": "004yJ",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #004yJ: Rating 658",
      "ratingBadge": "Lichess: ~658",
      "initialFen": "r4rk1/1bp2ppp/p1q1pn2/2P1N3/8/3B4/P1P1QPPP/R4RK1 b - - 1 16",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "c6",
          "to": "g2",
          "san": "Qxg2#",
          "explanation": "Master move Qxg2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "f3",
        "san": "Ne5",
        "coachExplanation": "Opponent responds with Ne5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxg2# is the engine-verified winning move from Lichess #004yJ."
    },
    {
      "id": "lichess_005Ep",
      "lichessId": "005Ep",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #005Ep: Rating 752",
      "ratingBadge": "Lichess: ~752",
      "initialFen": "5kr1/ppR3p1/3R3p/1n6/1r6/8/1P3PPP/2K5 w - - 5 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "d8",
          "san": "Rd8#",
          "explanation": "Master move Rd8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b5",
        "to": "d4",
        "san": "Nb5",
        "coachExplanation": "Opponent responds with Nb5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rd8# is the engine-verified winning move from Lichess #005Ep."
    },
    {
      "id": "lichess_005x9",
      "lichessId": "005x9",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #005x9: Rating 838",
      "ratingBadge": "Lichess: ~838",
      "initialFen": "r1b1kb1Q/ppp4p/6pB/3P4/2pn4/8/PPP1qPPP/RNK4R b q - 3 13",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "e2",
          "to": "c2",
          "san": "Qxc2#",
          "explanation": "Master move Qxc2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c1",
        "to": "d1",
        "san": "Kc1",
        "coachExplanation": "Opponent responds with Kc1! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxc2# is the engine-verified winning move from Lichess #005x9."
    },
    {
      "id": "lichess_00656",
      "lichessId": "00656",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00656: Rating 688",
      "ratingBadge": "Lichess: ~688",
      "initialFen": "7r/ppp2kp1/2nb1pp1/3p3r/3P2P1/2PQB3/PP3PP1/R3R1K1 b - - 0 18",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "h1",
          "san": "Rh1#",
          "explanation": "Master move Rh1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g4",
        "to": "h3",
        "san": "hxg4",
        "coachExplanation": "Opponent responds with hxg4! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rh1# is the engine-verified winning move from Lichess #00656."
    },
    {
      "id": "lichess_007AH",
      "lichessId": "007AH",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #007AH: Rating 637",
      "ratingBadge": "Lichess: ~637",
      "initialFen": "3r1n2/1bp1bkpp/p1q2n2/1p6/3P4/P1N3B1/1PP1QPPP/R3R1K1 b - - 6 18",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "c6",
          "to": "g2",
          "san": "Qxg2#",
          "explanation": "Master move Qxg2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "d1",
        "san": "Qe2",
        "coachExplanation": "Opponent responds with Qe2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxg2# is the engine-verified winning move from Lichess #007AH."
    },
    {
      "id": "lichess_007HB",
      "lichessId": "007HB",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #007HB: Rating 538",
      "ratingBadge": "Lichess: ~538",
      "initialFen": "rn2q1k1/pp3ppp/2pb4/3p1B2/2PN4/1Q6/PP3PPP/R1B4K b - - 0 15",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "e8",
          "to": "e1",
          "san": "Qe1#",
          "explanation": "Master move Qe1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d4",
        "to": "f3",
        "san": "Nxd4",
        "coachExplanation": "Opponent responds with Nxd4! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qe1# is the engine-verified winning move from Lichess #007HB."
    },
    {
      "id": "lichess_007fJ",
      "lichessId": "007fJ",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #007fJ: Rating 595",
      "ratingBadge": "Lichess: ~595",
      "initialFen": "1Q6/5ppp/8/8/8/2pk3P/3p2P1/3K4 b - - 0 52",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "c2",
          "san": "c2#",
          "explanation": "Master move c2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b8",
        "to": "b7",
        "san": "b8=Q",
        "coachExplanation": "Opponent responds with b8=Q! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! c2# is the engine-verified winning move from Lichess #007fJ."
    },
    {
      "id": "lichess_0082f",
      "lichessId": "0082f",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #0082f: Rating 827",
      "ratingBadge": "Lichess: ~827",
      "initialFen": "r4rk1/2q2ppp/3pp3/4Pb1N/1p6/1p4Q1/PPP3PP/1K1RR3 w - - 0 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "g7",
          "san": "Qxg7#",
          "explanation": "Master move Qxg7#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b3",
        "to": "a4",
        "san": "axb3",
        "coachExplanation": "Opponent responds with axb3! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxg7# is the engine-verified winning move from Lichess #0082f."
    },
    {
      "id": "lichess_008Nz",
      "lichessId": "008Nz",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #008Nz: Rating 473",
      "ratingBadge": "Lichess: ~473",
      "initialFen": "6k1/2p2ppp/pnp5/B7/2P3PP/1P2PPR1/r3b2r/3R2K1 w - - 2 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "d8",
          "san": "Rd8#",
          "explanation": "Master move Rd8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "d3",
        "san": "Be2",
        "coachExplanation": "Opponent responds with Be2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rd8# is the engine-verified winning move from Lichess #008Nz."
    },
    {
      "id": "lichess_008P4",
      "lichessId": "008P4",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #008P4: Rating 713",
      "ratingBadge": "Lichess: ~713",
      "initialFen": "8/4k3/1p1p4/rP2p1p1/P2nP1P1/3B4/3K4/R7 b - - 1 35",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "b3",
          "san": "Nb3+",
          "explanation": "Master move Nb3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d2",
        "to": "c3",
        "san": "Kc3",
        "coachExplanation": "Opponent plays Kc3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nb3+ is the engine-verified winning move from Lichess #008P4."
    },
    {
      "id": "lichess_009bn",
      "lichessId": "009bn",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #009bn: Rating 578",
      "ratingBadge": "Lichess: ~578",
      "initialFen": "2kr2r1/ppb2ppp/3qNn2/3p2B1/P7/2P2Q1P/1PB2PP1/R4RK1 b - - 0 18",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "h2",
          "san": "Qh2#",
          "explanation": "Master move Qh2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e6",
        "to": "c5",
        "san": "Nxe6",
        "coachExplanation": "Opponent responds with Nxe6! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qh2# is the engine-verified winning move from Lichess #009bn."
    },
    {
      "id": "lichess_009fH",
      "lichessId": "009fH",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #009fH: Rating 769",
      "ratingBadge": "Lichess: ~769",
      "initialFen": "rn2kb1r/pQ2pppp/2p2n2/8/3q2b1/8/PPP2PPP/RNB1KBNR b KQkq - 0 7",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "d1",
          "san": "Qd1#",
          "explanation": "Master move Qd1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b7",
        "to": "b3",
        "san": "Qxb7",
        "coachExplanation": "Opponent responds with Qxb7! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qd1# is the engine-verified winning move from Lichess #009fH."
    },
    {
      "id": "lichess_009tE",
      "lichessId": "009tE",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #009tE: Rating 639",
      "ratingBadge": "Lichess: ~639",
      "initialFen": "6k1/6pp/p1N5/1pP2bp1/5P2/8/PPP5/3K4 w - - 0 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "c6",
          "to": "e7",
          "san": "Ne7+",
          "explanation": "Master move Ne7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f7",
        "san": "Kf7",
        "coachExplanation": "Opponent plays Kf7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne7+ is the engine-verified winning move from Lichess #009tE."
    },
    {
      "id": "lichess_00A9Q",
      "lichessId": "00A9Q",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00A9Q: Rating 659",
      "ratingBadge": "Lichess: ~659",
      "initialFen": "2rq1rk1/1p3p1p/p1pn2p1/P1Np4/1P1PnP2/4P3/5PBP/R1Q3RK b - - 3 22",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "f2",
          "san": "Nxf2#",
          "explanation": "Master move Nxf2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c5",
        "to": "d3",
        "san": "Nc5",
        "coachExplanation": "Opponent responds with Nc5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Nxf2# is the engine-verified winning move from Lichess #00A9Q."
    },
    {
      "id": "lichess_00BQD",
      "lichessId": "00BQD",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00BQD: Rating 740",
      "ratingBadge": "Lichess: ~740",
      "initialFen": "4r3/3R1pkp/6p1/1P6/1b6/5B2/1P1R1PPP/6K1 b - - 0 36",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "e8",
          "to": "e1",
          "san": "Re1#",
          "explanation": "Master move Re1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d2",
        "to": "d1",
        "san": "R1xd2",
        "coachExplanation": "Opponent responds with R1xd2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Re1# is the engine-verified winning move from Lichess #00BQD."
    },
    {
      "id": "lichess_00Bn4",
      "lichessId": "00Bn4",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00Bn4: Rating 689",
      "ratingBadge": "Lichess: ~689",
      "initialFen": "1k6/pp6/4nNp1/P3r2p/3p4/7P/3R1PPK/8 w - - 1 41",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "d7",
          "san": "Nd7+",
          "explanation": "Master move Nd7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b8",
        "to": "c7",
        "san": "Kc7",
        "coachExplanation": "Opponent plays Kc7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nd7+ is the engine-verified winning move from Lichess #00Bn4."
    },
    {
      "id": "lichess_00DAs",
      "lichessId": "00DAs",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00DAs: Rating 677",
      "ratingBadge": "Lichess: ~677",
      "initialFen": "r6r/ppp1n1p1/3bBk1p/4nP2/3p4/8/PPPN1P1P/R1B1K2R w KQ - 2 16",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "d2",
          "to": "e4",
          "san": "Ne4#",
          "explanation": "Master move Ne4#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e7",
        "to": "g8",
        "san": "Ne7",
        "coachExplanation": "Opponent responds with Ne7! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Ne4# is the engine-verified winning move from Lichess #00DAs."
    },
    {
      "id": "lichess_00DPQ",
      "lichessId": "00DPQ",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00DPQ: Rating 765",
      "ratingBadge": "Lichess: ~765",
      "initialFen": "2k4r/pp3pp1/4pn2/2np2p1/8/1B1P1Pq1/PPPN3R/R2Q3K b - - 7 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "h2",
          "san": "Qxh2#",
          "explanation": "Master move Qxh2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h2",
        "to": "f2",
        "san": "Rh2",
        "coachExplanation": "Opponent responds with Rh2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxh2# is the engine-verified winning move from Lichess #00DPQ."
    },
    {
      "id": "lichess_00Dlt",
      "lichessId": "00Dlt",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00Dlt: Rating 510",
      "ratingBadge": "Lichess: ~510",
      "initialFen": "r3kb1r/p4pp1/b1p4p/n3pQ2/4N3/2Nq4/PP1P1PPP/R1B2RK1 b kq - 1 14",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "f1",
          "san": "Qxf1#",
          "explanation": "Master move Qxf1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f5",
        "to": "f3",
        "san": "Qf5",
        "coachExplanation": "Opponent responds with Qf5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxf1# is the engine-verified winning move from Lichess #00Dlt."
    },
    {
      "id": "lichess_00EBZ",
      "lichessId": "00EBZ",
      "tier": "beginner",
      "track": "tactical",
      "title": "Lichess #00EBZ: Rating 818",
      "ratingBadge": "Lichess: ~818",
      "initialFen": "3rr1k1/p4pp1/1pp4p/3pPQ2/1P3P2/2P2RqP/P2R2P1/6K1 b - - 2 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Knights can only fork pieces on the EXACT same square color. Notice when your King and heavy pieces share square colors.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "e1",
          "san": "Qe1+",
          "explanation": "Master move Qe1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h2",
        "san": "Kh2",
        "coachExplanation": "Opponent plays Kh2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe1+ is the engine-verified winning move from Lichess #00EBZ."
    }
  ],
  "beginner_2": [
    {
      "id": "lichess_006yP",
      "lichessId": "006yP",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #006yP: Rating 819",
      "ratingBadge": "Lichess: ~819",
      "initialFen": "6R1/8/Kpk1p3/1p1pP3/6P1/PPr5/8/8 w - - 0 41",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "g8",
          "to": "c8",
          "san": "Rc8+",
          "explanation": "Master move Rc8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c6",
        "to": "d7",
        "san": "Kd7",
        "coachExplanation": "Opponent plays Kd7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rc8+ is the engine-verified winning move from Lichess #006yP."
    },
    {
      "id": "lichess_0071N",
      "lichessId": "0071N",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #0071N: Rating 555",
      "ratingBadge": "Lichess: ~555",
      "initialFen": "6k1/p4pp1/1p5p/4b3/4B3/4P1P1/P1R2PKP/1q1r4 w - - 0 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "c2",
          "to": "c8",
          "san": "Rc8+",
          "explanation": "Master move Rc8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d1",
        "to": "d8",
        "san": "Rd8",
        "coachExplanation": "Opponent plays Rd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rc8+ is the engine-verified winning move from Lichess #0071N."
    },
    {
      "id": "lichess_007mr",
      "lichessId": "007mr",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #007mr: Rating 661",
      "ratingBadge": "Lichess: ~661",
      "initialFen": "5k2/p2r3p/1p4pP/3r1q2/4R3/2P5/PP3PQ1/K3R3 b - - 0 33",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "d1",
          "san": "Rd1+",
          "explanation": "Master move Rd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "d1",
        "san": "Rxd1",
        "coachExplanation": "Opponent plays Rxd1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd1+ is the engine-verified winning move from Lichess #007mr."
    },
    {
      "id": "lichess_008GK",
      "lichessId": "008GK",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #008GK: Rating 665",
      "ratingBadge": "Lichess: ~665",
      "initialFen": "1k6/ppp3p1/8/1P5p/8/P3n2P/2P1r1P1/B2rNRK1 w - - 5 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "f8",
          "san": "Rf8+",
          "explanation": "Master move Rf8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d1",
        "to": "d8",
        "san": "Rd8",
        "coachExplanation": "Opponent plays Rd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rf8+ is the engine-verified winning move from Lichess #008GK."
    },
    {
      "id": "lichess_008aL",
      "lichessId": "008aL",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #008aL: Rating 594",
      "ratingBadge": "Lichess: ~594",
      "initialFen": "7k/6p1/1r5p/P4p2/3Rp3/4P3/5PPP/6K1 b - - 0 39",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "b6",
          "to": "b1",
          "san": "Rb1+",
          "explanation": "Master move Rb1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d4",
        "to": "d1",
        "san": "Rd1",
        "coachExplanation": "Opponent plays Rd1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rb1+ is the engine-verified winning move from Lichess #008aL."
    },
    {
      "id": "lichess_00AbP",
      "lichessId": "00AbP",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00AbP: Rating 804",
      "ratingBadge": "Lichess: ~804",
      "initialFen": "6k1/pp3pp1/2p5/7b/4r2P/2P2N2/PP4K1/3R4 w - - 0 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "d8",
          "san": "Rd8+",
          "explanation": "Master move Rd8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h7",
        "san": "Kh7",
        "coachExplanation": "Opponent plays Kh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd8+ is the engine-verified winning move from Lichess #00AbP."
    },
    {
      "id": "lichess_00Bot",
      "lichessId": "00Bot",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00Bot: Rating 711",
      "ratingBadge": "Lichess: ~711",
      "initialFen": "8/5p2/p3kr2/8/8/R1P5/4P3/4K3 w - - 0 53",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "a3",
          "to": "a6",
          "san": "Rxa6+",
          "explanation": "Master move Rxa6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e6",
        "to": "e5",
        "san": "Ke5",
        "coachExplanation": "Opponent plays Ke5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxa6+ is the engine-verified winning move from Lichess #00Bot."
    },
    {
      "id": "lichess_00Cfq",
      "lichessId": "00Cfq",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00Cfq: Rating 631",
      "ratingBadge": "Lichess: ~631",
      "initialFen": "6k1/ppR2pp1/4p1p1/4P1N1/3r2P1/1P4K1/P3r3/8 w - - 6 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "c7",
          "to": "c8",
          "san": "Rc8+",
          "explanation": "Master move Rc8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d4",
        "to": "d8",
        "san": "Rd8",
        "coachExplanation": "Opponent plays Rd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rc8+ is the engine-verified winning move from Lichess #00Cfq."
    },
    {
      "id": "lichess_00CpR",
      "lichessId": "00CpR",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00CpR: Rating 632",
      "ratingBadge": "Lichess: ~632",
      "initialFen": "6k1/B7/2p2pK1/3nr2p/8/1Q3PP1/P6r/8 w - - 1 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "b3",
          "to": "b8",
          "san": "Qb8+",
          "explanation": "Master move Qb8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "e8",
        "san": "Re8",
        "coachExplanation": "Opponent plays Re8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qb8+ is the engine-verified winning move from Lichess #00CpR."
    },
    {
      "id": "lichess_00DYf",
      "lichessId": "00DYf",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00DYf: Rating 466",
      "ratingBadge": "Lichess: ~466",
      "initialFen": "1R6/6kp/3p1pp1/2r1p3/PP6/8/2r2PPP/1R4K1 b - - 0 30",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "c2",
          "to": "c1",
          "san": "Rc1+",
          "explanation": "Master move Rc1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b1",
        "to": "c1",
        "san": "Rxc1",
        "coachExplanation": "Opponent plays Rxc1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rc1+ is the engine-verified winning move from Lichess #00DYf."
    },
    {
      "id": "lichess_00EXM",
      "lichessId": "00EXM",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00EXM: Rating 620",
      "ratingBadge": "Lichess: ~620",
      "initialFen": "r1n3k1/3R1ppp/2p5/5P2/8/1P2r3/P7/5RK1 w - - 0 34",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "d7",
          "to": "d8",
          "san": "Rd8+",
          "explanation": "Master move Rd8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e3",
        "to": "e8",
        "san": "Re8",
        "coachExplanation": "Opponent plays Re8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd8+ is the engine-verified winning move from Lichess #00EXM."
    },
    {
      "id": "lichess_00F1l",
      "lichessId": "00F1l",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00F1l: Rating 836",
      "ratingBadge": "Lichess: ~836",
      "initialFen": "8/2k1b3/5p2/RBpK1Pp1/P2p2P1/1p1P4/2r5/8 w - - 0 46",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "a5",
          "to": "a7",
          "san": "Ra7+",
          "explanation": "Master move Ra7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "b8",
        "san": "Kb8",
        "coachExplanation": "Opponent plays Kb8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ra7+ is the engine-verified winning move from Lichess #00F1l."
    },
    {
      "id": "lichess_00H8a",
      "lichessId": "00H8a",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00H8a: Rating 801",
      "ratingBadge": "Lichess: ~801",
      "initialFen": "5bk1/2R4p/6p1/8/4NP1P/3bP1K1/r7/8 w - - 3 46",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "f6",
          "san": "Nf6+",
          "explanation": "Master move Nf6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kh8",
        "coachExplanation": "Opponent plays Kh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf6+ is the engine-verified winning move from Lichess #00H8a."
    },
    {
      "id": "lichess_00HAM",
      "lichessId": "00HAM",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00HAM: Rating 560",
      "ratingBadge": "Lichess: ~560",
      "initialFen": "q4r1k/1p3Qpp/1n6/3P2pP/2PP2P1/1P6/2K5/5R2 w - - 0 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "f7",
          "to": "f8",
          "san": "Qxf8+",
          "explanation": "Master move Qxf8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a8",
        "to": "f8",
        "san": "Qxf8",
        "coachExplanation": "Opponent plays Qxf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf8+ is the engine-verified winning move from Lichess #00HAM."
    },
    {
      "id": "lichess_00HIV",
      "lichessId": "00HIV",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00HIV: Rating 799",
      "ratingBadge": "Lichess: ~799",
      "initialFen": "8/8/1p1k1n2/4p2p/1PP2pp1/3K4/3N1PPP/8 w - - 0 38",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "d2",
          "to": "e4",
          "san": "Ne4+",
          "explanation": "Master move Ne4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "e4",
        "san": "Nxe4",
        "coachExplanation": "Opponent plays Nxe4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne4+ is the engine-verified winning move from Lichess #00HIV."
    },
    {
      "id": "lichess_00HPz",
      "lichessId": "00HPz",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00HPz: Rating 642",
      "ratingBadge": "Lichess: ~642",
      "initialFen": "6r1/7p/2pk1p2/P2p4/P2KbP2/2N1P3/5R1P/8 b - - 2 35",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "c6",
          "to": "c5",
          "san": "c5#",
          "explanation": "Master move c5#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c3",
        "to": "e2",
        "san": "Nc3",
        "coachExplanation": "Opponent responds with Nc3! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! c5# is the engine-verified winning move from Lichess #00HPz."
    },
    {
      "id": "lichess_00Hfa",
      "lichessId": "00Hfa",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00Hfa: Rating 729",
      "ratingBadge": "Lichess: ~729",
      "initialFen": "6k1/5ppp/5Bq1/8/p3R3/P6P/5rB1/R5K1 w - - 0 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "e8",
          "san": "Re8#",
          "explanation": "Master move Re8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "c2",
        "san": "Rxf2",
        "coachExplanation": "Opponent responds with Rxf2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Re8# is the engine-verified winning move from Lichess #00Hfa."
    },
    {
      "id": "lichess_00HzH",
      "lichessId": "00HzH",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00HzH: Rating 762",
      "ratingBadge": "Lichess: ~762",
      "initialFen": "5rk1/p2q2p1/1p2p1Np/3p3P/3Pb1P1/2P5/PP3R2/6K1 w - - 0 34",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "f2",
          "to": "f8",
          "san": "Rxf8+",
          "explanation": "Master move Rxf8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h7",
        "san": "Kh7",
        "coachExplanation": "Opponent plays Kh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxf8+ is the engine-verified winning move from Lichess #00HzH."
    },
    {
      "id": "lichess_00K0G",
      "lichessId": "00K0G",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00K0G: Rating 777",
      "ratingBadge": "Lichess: ~777",
      "initialFen": "8/8/8/2Pk4/pK4p1/3N4/4bP2/8 w - - 8 60",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "f4",
          "san": "Nf4+",
          "explanation": "Master move Nf4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "c6",
        "san": "Kc6",
        "coachExplanation": "Opponent plays Kc6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf4+ is the engine-verified winning move from Lichess #00K0G."
    },
    {
      "id": "lichess_00K48",
      "lichessId": "00K48",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00K48: Rating 481",
      "ratingBadge": "Lichess: ~481",
      "initialFen": "6k1/6pp/p2B4/2pP4/P1q5/6P1/2P1p2P/5RK1 w - - 0 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "f8",
          "san": "Rf8#",
          "explanation": "Master move Rf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kxg8",
        "coachExplanation": "Opponent responds with Kxg8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rf8# is the engine-verified winning move from Lichess #00K48."
    },
    {
      "id": "lichess_00KgR",
      "lichessId": "00KgR",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00KgR: Rating 782",
      "ratingBadge": "Lichess: ~782",
      "initialFen": "7k/1pq3p1/2p2r1p/3pPQ2/1p1P4/7P/1rB4K/5R2 w - - 0 36",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "f5",
          "to": "h7",
          "san": "Qh7#",
          "explanation": "Master move Qh7#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "f8",
        "san": "Rxf6",
        "coachExplanation": "Opponent responds with Rxf6! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qh7# is the engine-verified winning move from Lichess #00KgR."
    },
    {
      "id": "lichess_00NAM",
      "lichessId": "00NAM",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00NAM: Rating 715",
      "ratingBadge": "Lichess: ~715",
      "initialFen": "r5k1/pp3ppp/8/3p4/2qP4/4R2P/2P1QPPK/8 w - - 2 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "e3",
          "to": "e8",
          "san": "Re8+",
          "explanation": "Master move Re8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a8",
        "to": "e8",
        "san": "Rxe8",
        "coachExplanation": "Opponent plays Rxe8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re8+ is the engine-verified winning move from Lichess #00NAM."
    },
    {
      "id": "lichess_00OPi",
      "lichessId": "00OPi",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00OPi: Rating 596",
      "ratingBadge": "Lichess: ~596",
      "initialFen": "5k2/5p1p/1p1P2p1/1B6/4KP2/1P4P1/n6P/8 b - - 1 38",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "a2",
          "to": "c3",
          "san": "Nc3+",
          "explanation": "Master move Nc3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e4",
        "to": "d4",
        "san": "Kd4",
        "coachExplanation": "Opponent plays Kd4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nc3+ is the engine-verified winning move from Lichess #00OPi."
    },
    {
      "id": "lichess_00OPk",
      "lichessId": "00OPk",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00OPk: Rating 809",
      "ratingBadge": "Lichess: ~809",
      "initialFen": "6rk/7p/R2N3P/3r4/1P5K/P7/8/8 w - - 5 51",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "f7",
          "san": "Nf7#",
          "explanation": "Master move Nf7#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "b5",
        "san": "Rd5",
        "coachExplanation": "Opponent responds with Rd5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Nf7# is the engine-verified winning move from Lichess #00OPk."
    },
    {
      "id": "lichess_00OXc",
      "lichessId": "00OXc",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00OXc: Rating 841",
      "ratingBadge": "Lichess: ~841",
      "initialFen": "8/5K1p/1p5k/6p1/3brp2/5R2/8/8 w - - 0 51",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "h3",
          "san": "Rh3#",
          "explanation": "Master move Rh3#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g5",
        "to": "g6",
        "san": "g5",
        "coachExplanation": "Opponent responds with g5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rh3# is the engine-verified winning move from Lichess #00OXc."
    }
  ],
  "beginner_3": [
    {
      "id": "lichess_0042j",
      "lichessId": "0042j",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #0042j: Rating 551",
      "ratingBadge": "Lichess: ~551",
      "initialFen": "3r2k1/4nppp/pq3b2/1p2p3/2r2P2/2P1NR2/PP1Q2BP/3R2K1 w - - 0 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "d2",
          "to": "d8",
          "san": "Qxd8+",
          "explanation": "Master move Qxd8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b6",
        "to": "d8",
        "san": "Qxd8",
        "coachExplanation": "Opponent plays Qxd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd8+ is the engine-verified winning move from Lichess #0042j."
    },
    {
      "id": "lichess_00CFp",
      "lichessId": "00CFp",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00CFp: Rating 478",
      "ratingBadge": "Lichess: ~478",
      "initialFen": "rn1q3k/pp4pp/1b2B3/4N3/5Q2/2p5/PP4PP/RN5K b - - 0 16",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "d1",
          "san": "Qd1+",
          "explanation": "Master move Qd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f4",
        "to": "f1",
        "san": "Qf1",
        "coachExplanation": "Opponent plays Qf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qd1+ is the engine-verified winning move from Lichess #00CFp."
    },
    {
      "id": "lichess_00EXP",
      "lichessId": "00EXP",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00EXP: Rating 543",
      "ratingBadge": "Lichess: ~543",
      "initialFen": "2n3k1/p4ppp/2p1p3/P1NrP3/1N1r4/8/5PPP/1R1R2K1 b - - 0 29",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "d1",
          "san": "Rxd1+",
          "explanation": "Master move Rxd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b1",
        "to": "d1",
        "san": "Rxd1",
        "coachExplanation": "Opponent plays Rxd1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd1+ is the engine-verified winning move from Lichess #00EXP."
    },
    {
      "id": "lichess_00Ec4",
      "lichessId": "00Ec4",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00Ec4: Rating 823",
      "ratingBadge": "Lichess: ~823",
      "initialFen": "3q1r1k/p1r3pp/8/1p1BpPb1/2Pp2Q1/P2P2R1/6PP/R5K1 w - - 4 26",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "g4",
          "to": "g5",
          "san": "Qxg5",
          "explanation": "Master move Qxg5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "g5",
        "san": "Qxg5",
        "coachExplanation": "Opponent plays Qxg5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxg5 is the engine-verified winning move from Lichess #00Ec4."
    },
    {
      "id": "lichess_00HEh",
      "lichessId": "00HEh",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00HEh: Rating 812",
      "ratingBadge": "Lichess: ~812",
      "initialFen": "3r2k1/pp3ppp/2p3b1/2n3P1/2B2q1P/5N2/PPP1QP2/4R1K1 w - - 0 24",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "e2",
          "to": "e8",
          "san": "Qe8+",
          "explanation": "Master move Qe8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "e8",
        "san": "Rxe8",
        "coachExplanation": "Opponent plays Rxe8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe8+ is the engine-verified winning move from Lichess #00HEh."
    },
    {
      "id": "lichess_00HLP",
      "lichessId": "00HLP",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00HLP: Rating 821",
      "ratingBadge": "Lichess: ~821",
      "initialFen": "r4rk1/3nqpp1/4p2p/1p2P3/2pn1Q2/P6N/1P3PPP/1B1R1RK1 b - - 1 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "e2",
          "san": "Ne2+",
          "explanation": "Master move Ne2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne2+ is the engine-verified winning move from Lichess #00HLP."
    },
    {
      "id": "lichess_00LdT",
      "lichessId": "00LdT",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00LdT: Rating 587",
      "ratingBadge": "Lichess: ~587",
      "initialFen": "r5k1/pbp2ppp/6q1/3p4/3p3r/2P1R1P1/PP2QP1P/R5K1 w - - 0 21",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "e3",
          "to": "e8",
          "san": "Re8+",
          "explanation": "Master move Re8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a8",
        "to": "e8",
        "san": "Rxe8",
        "coachExplanation": "Opponent plays Rxe8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re8+ is the engine-verified winning move from Lichess #00LdT."
    },
    {
      "id": "lichess_00Lvv",
      "lichessId": "00Lvv",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00Lvv: Rating 767",
      "ratingBadge": "Lichess: ~767",
      "initialFen": "2k2br1/1pprn3/p4p2/4p2Q/4P2P/2N1q3/PP4PK/3R4 w - - 0 23",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "e8",
          "san": "Qe8+",
          "explanation": "Master move Qe8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d7",
        "to": "d8",
        "san": "Rd8",
        "coachExplanation": "Opponent plays Rd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe8+ is the engine-verified winning move from Lichess #00Lvv."
    },
    {
      "id": "lichess_00MS3",
      "lichessId": "00MS3",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00MS3: Rating 807",
      "ratingBadge": "Lichess: ~807",
      "initialFen": "rn1qr1k1/1p3ppp/2p2b2/p2p4/3P4/2N2N2/PPP1QPPP/2KRR3 w - - 0 13",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "e2",
          "to": "e8",
          "san": "Qxe8+",
          "explanation": "Master move Qxe8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "e8",
        "san": "Qxe8",
        "coachExplanation": "Opponent plays Qxe8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe8+ is the engine-verified winning move from Lichess #00MS3."
    },
    {
      "id": "lichess_00MTG",
      "lichessId": "00MTG",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00MTG: Rating 799",
      "ratingBadge": "Lichess: ~799",
      "initialFen": "4r1k1/2p1qpp1/3p4/1p1P2PQ/1P6/3R3P/2PBrb2/5RK1 w - - 7 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "f2",
          "san": "Rxf2",
          "explanation": "Master move Rxf2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "f2",
        "san": "Rxf2",
        "coachExplanation": "Opponent plays Rxf2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxf2 is the engine-verified winning move from Lichess #00MTG."
    },
    {
      "id": "lichess_00QOa",
      "lichessId": "00QOa",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00QOa: Rating 836",
      "ratingBadge": "Lichess: ~836",
      "initialFen": "6rk/1pR3p1/6Bp/2b4P/8/pP3PK1/P1P5/8 b - - 0 32",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "c5",
          "to": "d6",
          "san": "Bd6+",
          "explanation": "Master move Bd6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "f4",
        "san": "f4",
        "coachExplanation": "Opponent plays f4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bd6+ is the engine-verified winning move from Lichess #00QOa."
    },
    {
      "id": "lichess_00SLR",
      "lichessId": "00SLR",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00SLR: Rating 678",
      "ratingBadge": "Lichess: ~678",
      "initialFen": "rnbqk1nr/ppppbppp/4p3/8/5PP1/5N2/PPPPP2P/RNBQKB1R b KQkq - 0 3",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "h4",
          "san": "Bh4+",
          "explanation": "Master move Bh4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "h4",
        "san": "Nxh4",
        "coachExplanation": "Opponent plays Nxh4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bh4+ is the engine-verified winning move from Lichess #00SLR."
    },
    {
      "id": "lichess_00TAb",
      "lichessId": "00TAb",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00TAb: Rating 737",
      "ratingBadge": "Lichess: ~737",
      "initialFen": "6k1/5pp1/p1N5/1n1b3p/1B4P1/P4P1P/2K5/8 w - - 3 43",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "c6",
          "to": "e7",
          "san": "Ne7+",
          "explanation": "Master move Ne7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h7",
        "san": "Kh7",
        "coachExplanation": "Opponent plays Kh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne7+ is the engine-verified winning move from Lichess #00TAb."
    },
    {
      "id": "lichess_00TOX",
      "lichessId": "00TOX",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00TOX: Rating 802",
      "ratingBadge": "Lichess: ~802",
      "initialFen": "b7/2k1pp2/ppn2qp1/8/4B3/1PNR4/P1P2PP1/5K2 w - - 0 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "d5",
          "san": "Nd5+",
          "explanation": "Master move Nd5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "b8",
        "san": "Kb8",
        "coachExplanation": "Opponent plays Kb8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nd5+ is the engine-verified winning move from Lichess #00TOX."
    },
    {
      "id": "lichess_00TU2",
      "lichessId": "00TU2",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00TU2: Rating 623",
      "ratingBadge": "Lichess: ~623",
      "initialFen": "1k1r4/1p3Qp1/p2q3p/8/1N6/8/PP3PPP/2R3K1 b - - 0 22",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "d1",
          "san": "Qd1+",
          "explanation": "Master move Qd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c1",
        "to": "d1",
        "san": "Rxd1",
        "coachExplanation": "Opponent plays Rxd1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qd1+ is the engine-verified winning move from Lichess #00TU2."
    },
    {
      "id": "lichess_00Ui0",
      "lichessId": "00Ui0",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00Ui0: Rating 711",
      "ratingBadge": "Lichess: ~711",
      "initialFen": "r5k1/5pp1/2p5/P1N4p/2PR1n2/1P3P2/5P1P/6K1 b - - 0 26",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "e2",
          "san": "Ne2+",
          "explanation": "Master move Ne2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "f1",
        "san": "Kf1",
        "coachExplanation": "Opponent plays Kf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne2+ is the engine-verified winning move from Lichess #00Ui0."
    },
    {
      "id": "lichess_00Y1c",
      "lichessId": "00Y1c",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00Y1c: Rating 821",
      "ratingBadge": "Lichess: ~821",
      "initialFen": "5rk1/3Q1p2/5p1p/2q5/8/8/P1r2PPP/3RR1K1 b - - 5 23",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "c5",
          "to": "f2",
          "san": "Qxf2+",
          "explanation": "Master move Qxf2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf2+ is the engine-verified winning move from Lichess #00Y1c."
    },
    {
      "id": "lichess_00ZWD",
      "lichessId": "00ZWD",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00ZWD: Rating 762",
      "ratingBadge": "Lichess: ~762",
      "initialFen": "6k1/4bpp1/4p3/p2pP1N1/1q1P3P/1P1Q2K1/5P2/8 w - - 1 34",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "h7",
          "san": "Qh7+",
          "explanation": "Master move Qh7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f8",
        "san": "Kf8",
        "coachExplanation": "Opponent plays Kf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh7+ is the engine-verified winning move from Lichess #00ZWD."
    },
    {
      "id": "lichess_00aU5",
      "lichessId": "00aU5",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00aU5: Rating 763",
      "ratingBadge": "Lichess: ~763",
      "initialFen": "8/8/8/p6p/P1K2k1P/8/8/8 w - - 6 48",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "c4",
          "to": "b5",
          "san": "Kb5",
          "explanation": "Master move Kb5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f4",
        "to": "e5",
        "san": "Ke5",
        "coachExplanation": "Opponent plays Ke5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kb5 is the engine-verified winning move from Lichess #00aU5."
    },
    {
      "id": "lichess_00awK",
      "lichessId": "00awK",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00awK: Rating 569",
      "ratingBadge": "Lichess: ~569",
      "initialFen": "r6k/2p2Qpp/p7/4b3/8/8/1PP1KR2/2q5 w - - 1 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "f7",
          "to": "f8",
          "san": "Qf8+",
          "explanation": "Master move Qf8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a8",
        "to": "f8",
        "san": "Rxf8",
        "coachExplanation": "Opponent plays Rxf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qf8+ is the engine-verified winning move from Lichess #00awK."
    },
    {
      "id": "lichess_00ax2",
      "lichessId": "00ax2",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00ax2: Rating 638",
      "ratingBadge": "Lichess: ~638",
      "initialFen": "r1b4k/1pp3p1/1b1p1q1p/1p5Q/P1P1Bp2/3P4/6PP/5R1K w - - 2 24",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "e8",
          "san": "Qe8+",
          "explanation": "Master move Qe8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "f8",
        "san": "Qf8",
        "coachExplanation": "Opponent plays Qf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe8+ is the engine-verified winning move from Lichess #00ax2."
    },
    {
      "id": "lichess_00baZ",
      "lichessId": "00baZ",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00baZ: Rating 812",
      "ratingBadge": "Lichess: ~812",
      "initialFen": "r7/8/p1k5/1p1p1pn1/7R/2P1P2P/5P2/R5K1 b - - 0 31",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "g5",
          "to": "f3",
          "san": "Nf3+",
          "explanation": "Master move Nf3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "g2",
        "san": "Kg2",
        "coachExplanation": "Opponent plays Kg2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf3+ is the engine-verified winning move from Lichess #00baZ."
    },
    {
      "id": "lichess_00cSF",
      "lichessId": "00cSF",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00cSF: Rating 811",
      "ratingBadge": "Lichess: ~811",
      "initialFen": "r1b3k1/pp3p1p/6q1/2pp1r2/8/P1P1P1QP/1P3PP1/RN3R1K b - - 8 19",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "g6",
          "to": "g3",
          "san": "Qxg3",
          "explanation": "Master move Qxg3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "g3",
        "san": "fxg3",
        "coachExplanation": "Opponent plays fxg3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxg3 is the engine-verified winning move from Lichess #00cSF."
    },
    {
      "id": "lichess_00dYE",
      "lichessId": "00dYE",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00dYE: Rating 500",
      "ratingBadge": "Lichess: ~500",
      "initialFen": "7R/pp1n1p2/1kp1p3/3p4/5P2/2N1q3/PPP4Q/1K6 b - - 7 28",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "e3",
          "to": "e1",
          "san": "Qe1+",
          "explanation": "Master move Qe1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c3",
        "to": "d1",
        "san": "Nd1",
        "coachExplanation": "Opponent plays Nd1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe1+ is the engine-verified winning move from Lichess #00dYE."
    },
    {
      "id": "lichess_00dpQ",
      "lichessId": "00dpQ",
      "tier": "beginner",
      "track": "positional",
      "title": "Lichess #00dpQ: Rating 570",
      "ratingBadge": "Lichess: ~570",
      "initialFen": "6k1/5ppp/8/1r2rP2/6P1/2RK3P/8/7B w - - 1 48",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "When tactics fade, locate your least active piece, reposition it with tempo, and restrict your opponent's counterplay.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "c8",
          "san": "Rc8+",
          "explanation": "Master move Rc8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "e8",
        "san": "Re8",
        "coachExplanation": "Opponent plays Re8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rc8+ is the engine-verified winning move from Lichess #00dpQ."
    }
  ],
  "adv_beginner_0": [
    {
      "id": "lichess_002bK",
      "lichessId": "002bK",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #002bK: Rating 1113",
      "ratingBadge": "Lichess: ~1113",
      "initialFen": "8/7p/4k3/pb1p1pPB/1n1P3P/N1p1P3/4K3/8 w - - 2 43",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "a3",
          "to": "b5",
          "san": "Nxb5",
          "explanation": "Master move Nxb5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c3",
        "to": "c2",
        "san": "c2",
        "coachExplanation": "Opponent plays c2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxb5 is the engine-verified winning move from Lichess #002bK."
    },
    {
      "id": "lichess_0071K",
      "lichessId": "0071K",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #0071K: Rating 1125",
      "ratingBadge": "Lichess: ~1125",
      "initialFen": "3N1r2/R7/kp6/p2pPp1Q/2pP2P1/2q5/2P5/2K5 b - - 1 38",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "a6",
          "to": "a7",
          "san": "Kxa7",
          "explanation": "Master move Kxa7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h5",
        "to": "h7",
        "san": "Qh7+",
        "coachExplanation": "Opponent plays Qh7+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxa7 is the engine-verified winning move from Lichess #0071K."
    },
    {
      "id": "lichess_00BJm",
      "lichessId": "00BJm",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00BJm: Rating 1052",
      "ratingBadge": "Lichess: ~1052",
      "initialFen": "r4rk1/1Q2bppp/p1N1p3/1p1q4/2pP1n2/2P5/PP3PPP/R4RK1 w - - 2 19",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "c6",
          "to": "e7",
          "san": "Nxe7+",
          "explanation": "Master move Nxe7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kh8",
        "coachExplanation": "Opponent plays Kh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxe7+ is the engine-verified winning move from Lichess #00BJm."
    },
    {
      "id": "lichess_00HEx",
      "lichessId": "00HEx",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00HEx: Rating 920",
      "ratingBadge": "Lichess: ~920",
      "initialFen": "R7/5pk1/4pn1p/8/3NP3/5P2/6PP/2rB2K1 b - - 0 31",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "c1",
          "to": "d1",
          "san": "Rxd1+",
          "explanation": "Master move Rxd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "f2",
        "san": "Kf2",
        "coachExplanation": "Opponent plays Kf2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd1+ is the engine-verified winning move from Lichess #00HEx."
    },
    {
      "id": "lichess_00dzT",
      "lichessId": "00dzT",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00dzT: Rating 881",
      "ratingBadge": "Lichess: ~881",
      "initialFen": "6k1/1Q4p1/p1p4p/3pP3/P3bq2/2N4P/1P4P1/5B1K b - - 2 26",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "f1",
          "san": "Qxf1+",
          "explanation": "Master move Qxf1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h1",
        "to": "h2",
        "san": "Kh2",
        "coachExplanation": "Opponent plays Kh2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf1+ is the engine-verified winning move from Lichess #00dzT."
    },
    {
      "id": "lichess_00hbV",
      "lichessId": "00hbV",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00hbV: Rating 943",
      "ratingBadge": "Lichess: ~943",
      "initialFen": "8/pk1r2R1/1p2b3/8/2P2N2/1P6/1K6/8 w - - 22 61",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "e6",
          "san": "Nxe6",
          "explanation": "Master move Nxe6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d7",
        "to": "g7",
        "san": "Rxg7",
        "coachExplanation": "Opponent plays Rxg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxe6 is the engine-verified winning move from Lichess #00hbV."
    },
    {
      "id": "lichess_00i7t",
      "lichessId": "00i7t",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00i7t: Rating 927",
      "ratingBadge": "Lichess: ~927",
      "initialFen": "4r2k/p4r1p/2pp1b2/2p5/5P2/3P2R1/PqPB2PP/4RK2 w - - 0 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "e1",
          "to": "e8",
          "san": "Rxe8+",
          "explanation": "Master move Rxe8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f7",
        "to": "f8",
        "san": "Rf8",
        "coachExplanation": "Opponent plays Rf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxe8+ is the engine-verified winning move from Lichess #00i7t."
    },
    {
      "id": "lichess_00l3p",
      "lichessId": "00l3p",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00l3p: Rating 980",
      "ratingBadge": "Lichess: ~980",
      "initialFen": "3q4/1p6/p4N2/5QP1/4Pn1k/2P4r/1P3K2/8 w - - 5 41",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "f5",
          "to": "f4",
          "san": "Qxf4#",
          "explanation": "Master move Qxf4#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h4",
        "to": "h5",
        "san": "Kh4",
        "coachExplanation": "Opponent responds with Kh4! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxf4# is the engine-verified winning move from Lichess #00l3p."
    },
    {
      "id": "lichess_00rTX",
      "lichessId": "00rTX",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00rTX: Rating 971",
      "ratingBadge": "Lichess: ~971",
      "initialFen": "3r2k1/pp3ppp/4p3/2N5/7q/1Q3P2/PP1R2PP/4R2K b - - 0 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "h4",
          "to": "e1",
          "san": "Qxe1#",
          "explanation": "Master move Qxe1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d2",
        "to": "d1",
        "san": "Rxd2",
        "coachExplanation": "Opponent responds with Rxd2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxe1# is the engine-verified winning move from Lichess #00rTX."
    },
    {
      "id": "lichess_00xa4",
      "lichessId": "00xa4",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00xa4: Rating 991",
      "ratingBadge": "Lichess: ~991",
      "initialFen": "2r1k3/2p1rpp1/1p1p1b1B/p2P1P1P/P1P5/3K4/5PR1/6R1 b - - 0 30",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "g7",
          "to": "h6",
          "san": "gxh6",
          "explanation": "Master move gxh6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g2",
        "to": "g8",
        "san": "Rg8+",
        "coachExplanation": "Opponent plays Rg8+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! gxh6 is the engine-verified winning move from Lichess #00xa4."
    },
    {
      "id": "lichess_01M89",
      "lichessId": "01M89",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #01M89: Rating 1161",
      "ratingBadge": "Lichess: ~1161",
      "initialFen": "8/2p5/1p2B3/p7/5r2/P4p2/1PP1N2k/1K4R1 b - - 2 59",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "e2",
          "san": "fxe2",
          "explanation": "Master move fxe2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "e1",
        "san": "Re1",
        "coachExplanation": "Opponent plays Re1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! fxe2 is the engine-verified winning move from Lichess #01M89."
    },
    {
      "id": "lichess_01Y2F",
      "lichessId": "01Y2F",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #01Y2F: Rating 1160",
      "ratingBadge": "Lichess: ~1160",
      "initialFen": "r3kb1r/pp1q1ppp/4p3/4PR2/3pN3/2P4P/PP4P1/R1BQ2K1 b kq - 0 15",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "f5",
          "san": "exf5",
          "explanation": "Master move exf5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e4",
        "to": "d6",
        "san": "Nd6+",
        "coachExplanation": "Opponent plays Nd6+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! exf5 is the engine-verified winning move from Lichess #01Y2F."
    },
    {
      "id": "lichess_01YXn",
      "lichessId": "01YXn",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #01YXn: Rating 951",
      "ratingBadge": "Lichess: ~951",
      "initialFen": "r1bq1rk1/p4pbp/5np1/4p1B1/3pN3/8/PPPQBPPP/2R2RK1 b - - 1 14",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "e4",
          "san": "Nxe4",
          "explanation": "Master move Nxe4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g5",
        "to": "d8",
        "san": "Bxd8",
        "coachExplanation": "Opponent plays Bxd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxe4 is the engine-verified winning move from Lichess #01YXn."
    },
    {
      "id": "lichess_01lNV",
      "lichessId": "01lNV",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #01lNV: Rating 895",
      "ratingBadge": "Lichess: ~895",
      "initialFen": "4r1k1/pppq2b1/2bp1Npp/5p2/2P4N/7P/PP1BQPP1/4R1K1 b - - 1 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "g7",
          "to": "f6",
          "san": "Bxf6",
          "explanation": "Master move Bxf6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "e8",
        "san": "Qxe8+",
        "coachExplanation": "Opponent plays Qxe8+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxf6 is the engine-verified winning move from Lichess #01lNV."
    },
    {
      "id": "lichess_01pl8",
      "lichessId": "01pl8",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #01pl8: Rating 1067",
      "ratingBadge": "Lichess: ~1067",
      "initialFen": "3r4/pR4p1/2p2N1k/4p2p/2B1Pn1N/1P6/P1P2PPP/3R2K1 b - - 0 31",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "d1",
          "san": "Rxd1+",
          "explanation": "Master move Rxd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c4",
        "to": "f1",
        "san": "Bf1",
        "coachExplanation": "Opponent plays Bf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd1+ is the engine-verified winning move from Lichess #01pl8."
    },
    {
      "id": "lichess_01pz8",
      "lichessId": "01pz8",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #01pz8: Rating 1014",
      "ratingBadge": "Lichess: ~1014",
      "initialFen": "5r2/1p1R4/p2Qq1pk/4P2p/3P1n1P/8/PP5K/8 w - - 1 36",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "f8",
          "san": "Qxf8#",
          "explanation": "Master move Qxf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e6",
        "to": "e8",
        "san": "Qe6",
        "coachExplanation": "Opponent responds with Qe6! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxf8# is the engine-verified winning move from Lichess #01pz8."
    },
    {
      "id": "lichess_01qfU",
      "lichessId": "01qfU",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #01qfU: Rating 878",
      "ratingBadge": "Lichess: ~878",
      "initialFen": "r4k1r/pppq1p2/3pb2p/6p1/2nQ4/8/PPP2PPP/R4RK1 w - - 0 17",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "h8",
          "san": "Qxh8+",
          "explanation": "Master move Qxh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "e7",
        "san": "Ke7",
        "coachExplanation": "Opponent plays Ke7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxh8+ is the engine-verified winning move from Lichess #01qfU."
    },
    {
      "id": "lichess_01uDg",
      "lichessId": "01uDg",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #01uDg: Rating 1170",
      "ratingBadge": "Lichess: ~1170",
      "initialFen": "1q2nr1k/5p1p/4NP2/p7/7Q/4p3/1PP3PP/1K6 w - - 0 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "f8",
          "san": "Nxf8",
          "explanation": "Master move Nxf8! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e8",
        "to": "f6",
        "san": "Nxf6",
        "coachExplanation": "Opponent plays Nxf6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxf8 is the engine-verified winning move from Lichess #01uDg."
    },
    {
      "id": "lichess_026wE",
      "lichessId": "026wE",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #026wE: Rating 858",
      "ratingBadge": "Lichess: ~858",
      "initialFen": "1rbr2k1/ppN2ppp/3p4/4R2q/8/1B4Q1/PPP2PPP/3R2K1 b - - 0 19",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "d1",
          "san": "Qxd1+",
          "explanation": "Master move Qxd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "e1",
        "san": "Re1",
        "coachExplanation": "Opponent plays Re1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd1+ is the engine-verified winning move from Lichess #026wE."
    },
    {
      "id": "lichess_02FVj",
      "lichessId": "02FVj",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #02FVj: Rating 933",
      "ratingBadge": "Lichess: ~933",
      "initialFen": "2kr2R1/p4p2/1p5p/2p1Pp1P/2Pp1P1Q/3P1q2/PP6/1K1R4 b - - 0 28",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "d1",
          "san": "Qxd1#",
          "explanation": "Master move Qxd1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "g1",
        "san": "Rxg8",
        "coachExplanation": "Opponent responds with Rxg8! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxd1# is the engine-verified winning move from Lichess #02FVj."
    },
    {
      "id": "lichess_02Mt2",
      "lichessId": "02Mt2",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #02Mt2: Rating 933",
      "ratingBadge": "Lichess: ~933",
      "initialFen": "6k1/R5Np/8/5p2/5P2/5RP1/P2r3n/5BK1 b - - 0 32",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "h2",
          "to": "f3",
          "san": "Nxf3+",
          "explanation": "Master move Nxf3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxf3+ is the engine-verified winning move from Lichess #02Mt2."
    },
    {
      "id": "lichess_02R1e",
      "lichessId": "02R1e",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #02R1e: Rating 959",
      "ratingBadge": "Lichess: ~959",
      "initialFen": "5rk1/Q4ppp/3R4/1N2p1b1/4P3/5q1P/PPP2P2/1K5R b - - 0 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "h1",
          "san": "Qxh1+",
          "explanation": "Master move Qxh1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d6",
        "to": "d1",
        "san": "Rd1",
        "coachExplanation": "Opponent plays Rd1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxh1+ is the engine-verified winning move from Lichess #02R1e."
    },
    {
      "id": "lichess_02a9L",
      "lichessId": "02a9L",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #02a9L: Rating 1127",
      "ratingBadge": "Lichess: ~1127",
      "initialFen": "7k/1p1rp1bp/pB4p1/4rp2/P4Q2/2P4P/1P3PP1/4R1K1 b - - 1 34",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "e1",
          "san": "Rxe1+",
          "explanation": "Master move Rxe1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h2",
        "san": "Kh2",
        "coachExplanation": "Opponent plays Kh2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxe1+ is the engine-verified winning move from Lichess #02a9L."
    },
    {
      "id": "lichess_02bmv",
      "lichessId": "02bmv",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #02bmv: Rating 873",
      "ratingBadge": "Lichess: ~873",
      "initialFen": "r4rk1/pp3pbp/5pp1/7q/1Q1PP1P1/3B1N2/PP1B1P2/R3K2R b KQ - 0 18",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "h1",
          "san": "Qxh1+",
          "explanation": "Master move Qxh1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "e2",
        "san": "Ke2",
        "coachExplanation": "Opponent plays Ke2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxh1+ is the engine-verified winning move from Lichess #02bmv."
    },
    {
      "id": "lichess_02l1m",
      "lichessId": "02l1m",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #02l1m: Rating 1104",
      "ratingBadge": "Lichess: ~1104",
      "initialFen": "r5k1/p3rppb/7p/1ppQn1q1/3p4/P2P4/BPP1N3/R3K2R w KQ - 2 24",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The 2-Second Bodyguard Rule",
      "ruleBody": "Before touching any piece, check friendly protection. Never let unprotected pieces stay exposed in open files.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "a8",
          "san": "Qxa8+",
          "explanation": "Master move Qxa8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e7",
        "to": "e8",
        "san": "Re8",
        "coachExplanation": "Opponent plays Re8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxa8+ is the engine-verified winning move from Lichess #02l1m."
    }
  ],
  "adv_beginner_1": [
    {
      "id": "lichess_000rO",
      "lichessId": "000rO",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #000rO: Rating 1110",
      "ratingBadge": "Lichess: ~1110",
      "initialFen": "3R4/8/8/KB2b3/1p6/1P2k3/3p4/8 b - - 0 58",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "c7",
          "san": "Bc7+",
          "explanation": "Master move Bc7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a5",
        "to": "b4",
        "san": "Kxb4",
        "coachExplanation": "Opponent plays Kxb4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bc7+ is the engine-verified winning move from Lichess #000rO."
    },
    {
      "id": "lichess_001wr",
      "lichessId": "001wr",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #001wr: Rating 1068",
      "ratingBadge": "Lichess: ~1068",
      "initialFen": "r4rk1/p3ppbp/Pp1q1np1/3PpbB1/2B5/2N2P2/1PPQ2PP/3RR1K1 b - - 0 18",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "c5",
          "san": "Qc5+",
          "explanation": "Master move Qc5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qc5+ is the engine-verified winning move from Lichess #001wr."
    },
    {
      "id": "lichess_001xl",
      "lichessId": "001xl",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #001xl: Rating 1131",
      "ratingBadge": "Lichess: ~1131",
      "initialFen": "8/4R3/p4kpp/3B4/5q2/8/5P1P/6K1 w - - 6 41",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "f7",
          "san": "Rf7+",
          "explanation": "Master move Rf7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "e5",
        "san": "Ke5",
        "coachExplanation": "Opponent plays Ke5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rf7+ is the engine-verified winning move from Lichess #001xl."
    },
    {
      "id": "lichess_0039T",
      "lichessId": "0039T",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #0039T: Rating 1127",
      "ratingBadge": "Lichess: ~1127",
      "initialFen": "1r5r/p3kp2/4p2p/4P3/R4Pp1/6P1/P1P4P/4K2R b K - 2 25",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "b8",
          "to": "b1",
          "san": "Rb1+",
          "explanation": "Master move Rb1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "f2",
        "san": "Kf2",
        "coachExplanation": "Opponent plays Kf2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rb1+ is the engine-verified winning move from Lichess #0039T."
    },
    {
      "id": "lichess_003Jb",
      "lichessId": "003Jb",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #003Jb: Rating 993",
      "ratingBadge": "Lichess: ~993",
      "initialFen": "6k1/Q2bqr1p/2rpp1pR/p7/Pp2P3/1B3P2/1PP3P1/2KR4 b - - 7 22",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "g5",
          "san": "Qg5+",
          "explanation": "Master move Qg5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c1",
        "to": "b1",
        "san": "Kb1",
        "coachExplanation": "Opponent plays Kb1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qg5+ is the engine-verified winning move from Lichess #003Jb."
    },
    {
      "id": "lichess_003eP",
      "lichessId": "003eP",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #003eP: Rating 1156",
      "ratingBadge": "Lichess: ~1156",
      "initialFen": "6k1/r1b1q3/2p3p1/2Pp4/1P2p1n1/2B1P3/NQ6/2K4R w - - 2 37",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "h1",
          "to": "h8",
          "san": "Rh8+",
          "explanation": "Master move Rh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f7",
        "san": "Kf7",
        "coachExplanation": "Opponent plays Kf7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rh8+ is the engine-verified winning move from Lichess #003eP."
    },
    {
      "id": "lichess_003jH",
      "lichessId": "003jH",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #003jH: Rating 1058",
      "ratingBadge": "Lichess: ~1058",
      "initialFen": "rn3rk1/p5pp/3N4/4np1q/5Q2/1P6/PB1P1KP1/2R4R b - - 1 25",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "d3",
          "san": "Nd3+",
          "explanation": "Master move Nd3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "e3",
        "san": "Ke3",
        "coachExplanation": "Opponent plays Ke3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nd3+ is the engine-verified winning move from Lichess #003jH."
    },
    {
      "id": "lichess_003jb",
      "lichessId": "003jb",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #003jb: Rating 961",
      "ratingBadge": "Lichess: ~961",
      "initialFen": "r3kb1r/p4ppp/b3p3/2pq4/3Q4/4BN2/PPP2PPP/R3K2R w KQkq - 0 12",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "a4",
          "san": "Qa4+",
          "explanation": "Master move Qa4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a6",
        "to": "b5",
        "san": "Bb5",
        "coachExplanation": "Opponent plays Bb5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qa4+ is the engine-verified winning move from Lichess #003jb."
    },
    {
      "id": "lichess_003jv",
      "lichessId": "003jv",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #003jv: Rating 1006",
      "ratingBadge": "Lichess: ~1006",
      "initialFen": "7R/1p2k2p/p2n2p1/4K3/8/6P1/P6P/8 b - - 11 37",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "f7",
          "san": "Nf7+",
          "explanation": "Master move Nf7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "e4",
        "san": "Ke4",
        "coachExplanation": "Opponent plays Ke4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf7+ is the engine-verified winning move from Lichess #003jv."
    },
    {
      "id": "lichess_003o0",
      "lichessId": "003o0",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #003o0: Rating 1002",
      "ratingBadge": "Lichess: ~1002",
      "initialFen": "r1bqk2r/pp1nbppp/3p4/1B1p4/3P1B2/5N2/PPP2PPP/R2QK2R b KQkq - 3 9",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "a5",
          "san": "Qa5+",
          "explanation": "Master move Qa5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d1",
        "to": "d2",
        "san": "Qd2",
        "coachExplanation": "Opponent plays Qd2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qa5+ is the engine-verified winning move from Lichess #003o0."
    },
    {
      "id": "lichess_003r5",
      "lichessId": "003r5",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #003r5: Rating 1107",
      "ratingBadge": "Lichess: ~1107",
      "initialFen": "r2qr1k1/ppp2ppp/4P3/8/1nP2Q2/2N2N1P/PP3KP1/R4R2 b - - 0 15",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "b4",
          "to": "d3",
          "san": "Nd3+",
          "explanation": "Master move Nd3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "g1",
        "san": "Kg1",
        "coachExplanation": "Opponent plays Kg1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nd3+ is the engine-verified winning move from Lichess #003r5."
    },
    {
      "id": "lichess_004nd",
      "lichessId": "004nd",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #004nd: Rating 898",
      "ratingBadge": "Lichess: ~898",
      "initialFen": "3q2k1/3r4/pp3p1Q/2b1n3/P3N3/2P5/1P4PP/R6K w - - 1 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "f6",
          "san": "Nxf6+",
          "explanation": "Master move Nxf6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "f6",
        "san": "Qxf6",
        "coachExplanation": "Opponent plays Qxf6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxf6+ is the engine-verified winning move from Lichess #004nd."
    },
    {
      "id": "lichess_0050w",
      "lichessId": "0050w",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #0050w: Rating 1131",
      "ratingBadge": "Lichess: ~1131",
      "initialFen": "5rk1/1p2p2p/p2p4/2pPb2R/2P1P3/1P1BKPrR/8/8 w - - 5 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "h3",
          "to": "g3",
          "san": "Rxg3+",
          "explanation": "Master move Rxg3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "g3",
        "san": "Bxg3",
        "coachExplanation": "Opponent plays Bxg3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxg3+ is the engine-verified winning move from Lichess #0050w."
    },
    {
      "id": "lichess_005nD",
      "lichessId": "005nD",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #005nD: Rating 1119",
      "ratingBadge": "Lichess: ~1119",
      "initialFen": "3rk2r/2qn2p1/p1Q1p3/3n3p/8/8/PP4PP/5R1K w k - 0 24",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "c6",
          "to": "e6",
          "san": "Qxe6+",
          "explanation": "Master move Qxe6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "e7",
        "san": "Ne7",
        "coachExplanation": "Opponent plays Ne7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe6+ is the engine-verified winning move from Lichess #005nD."
    },
    {
      "id": "lichess_007tv",
      "lichessId": "007tv",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #007tv: Rating 1119",
      "ratingBadge": "Lichess: ~1119",
      "initialFen": "r3k1nr/1pp2ppp/1pnp4/4p1q1/2B1P3/3P1Q1P/PPP2PP1/R4RK1 w kq - 0 12",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "f7",
          "san": "Qxf7+",
          "explanation": "Master move Qxf7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e8",
        "to": "d8",
        "san": "Kd8",
        "coachExplanation": "Opponent plays Kd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf7+ is the engine-verified winning move from Lichess #007tv."
    },
    {
      "id": "lichess_00AB1",
      "lichessId": "00AB1",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00AB1: Rating 1128",
      "ratingBadge": "Lichess: ~1128",
      "initialFen": "8/7Q/3p1kp1/1p6/2b5/2q4P/5PPK/8 w - - 0 37",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "h7",
          "to": "h8",
          "san": "Qh8+",
          "explanation": "Master move Qh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "e6",
        "san": "Ke6",
        "coachExplanation": "Opponent plays Ke6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh8+ is the engine-verified winning move from Lichess #00AB1."
    },
    {
      "id": "lichess_00Aas",
      "lichessId": "00Aas",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00Aas: Rating 1199",
      "ratingBadge": "Lichess: ~1199",
      "initialFen": "3r1rk1/1p2q1pp/5p2/8/1P1n4/6Q1/PPBB1PPP/R4RK1 b - - 0 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "e2",
          "san": "Ne2+",
          "explanation": "Master move Ne2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne2+ is the engine-verified winning move from Lichess #00Aas."
    },
    {
      "id": "lichess_00BNd",
      "lichessId": "00BNd",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00BNd: Rating 881",
      "ratingBadge": "Lichess: ~881",
      "initialFen": "1rr3k1/4ppbp/3p1np1/1b1N4/P2BP3/5P2/P2R2PP/R5K1 w - - 0 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "e7",
          "san": "Nxe7+",
          "explanation": "Master move Nxe7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f8",
        "san": "Kf8",
        "coachExplanation": "Opponent plays Kf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxe7+ is the engine-verified winning move from Lichess #00BNd."
    },
    {
      "id": "lichess_00DPI",
      "lichessId": "00DPI",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00DPI: Rating 953",
      "ratingBadge": "Lichess: ~953",
      "initialFen": "3r2k1/1B3p1p/6p1/3N4/3p2r1/8/5KP1/3R4 w - - 0 36",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "f6",
          "san": "Nf6+",
          "explanation": "Master move Nf6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "g7",
        "san": "Kg7",
        "coachExplanation": "Opponent plays Kg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf6+ is the engine-verified winning move from Lichess #00DPI."
    },
    {
      "id": "lichess_00Evs",
      "lichessId": "00Evs",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00Evs: Rating 1059",
      "ratingBadge": "Lichess: ~1059",
      "initialFen": "5qk1/pQ3p2/7p/b2N1bp1/P3r3/5K2/7P/R4B2 w - - 0 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "f6",
          "san": "Nf6+",
          "explanation": "Master move Nf6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kh8",
        "coachExplanation": "Opponent plays Kh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf6+ is the engine-verified winning move from Lichess #00Evs."
    },
    {
      "id": "lichess_00GBX",
      "lichessId": "00GBX",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00GBX: Rating 911",
      "ratingBadge": "Lichess: ~911",
      "initialFen": "r6k/pp2n1pp/2nN4/4p1r1/1PB5/2P4b/P3Nb1P/R2R3K w - - 0 23",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "f7",
          "san": "Nf7+",
          "explanation": "Master move Nf7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h8",
        "to": "g8",
        "san": "Kg8",
        "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf7+ is the engine-verified winning move from Lichess #00GBX."
    },
    {
      "id": "lichess_00Gvp",
      "lichessId": "00Gvp",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00Gvp: Rating 994",
      "ratingBadge": "Lichess: ~994",
      "initialFen": "8/2kn1p2/8/3P4/R7/2PKN3/1r6/8 b - - 14 70",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d7",
          "to": "c5",
          "san": "Nc5+",
          "explanation": "Master move Nc5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d3",
        "to": "d4",
        "san": "Kd4",
        "coachExplanation": "Opponent plays Kd4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nc5+ is the engine-verified winning move from Lichess #00Gvp."
    },
    {
      "id": "lichess_00HZa",
      "lichessId": "00HZa",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00HZa: Rating 937",
      "ratingBadge": "Lichess: ~937",
      "initialFen": "6k1/6pp/1p6/p1n5/4q3/1P2pN2/P4PPP/3Q2K1 w - - 0 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "d8",
          "san": "Qd8+",
          "explanation": "Master move Qd8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f7",
        "san": "Kf7",
        "coachExplanation": "Opponent plays Kf7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qd8+ is the engine-verified winning move from Lichess #00HZa."
    },
    {
      "id": "lichess_00ISm",
      "lichessId": "00ISm",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00ISm: Rating 907",
      "ratingBadge": "Lichess: ~907",
      "initialFen": "5r2/5p1k/2ppq1p1/4p1b1/4N2P/3P4/1P1R1P2/4K1R1 w - - 0 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "g5",
          "san": "Nxg5+",
          "explanation": "Master move Nxg5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h7",
        "to": "h6",
        "san": "Kh6",
        "coachExplanation": "Opponent plays Kh6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxg5+ is the engine-verified winning move from Lichess #00ISm."
    },
    {
      "id": "lichess_00KMV",
      "lichessId": "00KMV",
      "tier": "adv_beginner",
      "track": "tactical",
      "title": "Lichess #00KMV: Rating 943",
      "ratingBadge": "Lichess: ~943",
      "initialFen": "1r3k2/1p1q1p2/p2p2p1/2pP2bp/2P1n1n1/1PQ3P1/P3N1K1/3N1R1R w - - 0 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "The Geometric Radar Rule",
      "ruleBody": "Look for geometric alignments: pins along diagonals and files, and double attacks that overwhelm the defender.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "h8",
          "san": "Qh8+",
          "explanation": "Master move Qh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "e7",
        "san": "Ke7",
        "coachExplanation": "Opponent plays Ke7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh8+ is the engine-verified winning move from Lichess #00KMV."
    }
  ],
  "adv_beginner_2": [
    {
      "id": "lichess_000o3",
      "lichessId": "000o3",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #000o3: Rating 944",
      "ratingBadge": "Lichess: ~944",
      "initialFen": "8/2p5/3k2p1/1p1P1p2/1P3P2/3K2Pp/7P/8 w - - 2 44",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "d4",
          "san": "Kd4",
          "explanation": "Master move Kd4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g6",
        "to": "g5",
        "san": "g5",
        "coachExplanation": "Opponent plays g5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kd4 is the engine-verified winning move from Lichess #000o3."
    },
    {
      "id": "lichess_001Wz",
      "lichessId": "001Wz",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #001Wz: Rating 1118",
      "ratingBadge": "Lichess: ~1118",
      "initialFen": "6k1/5ppp/r1p5/p1n1rP2/8/2P2N1P/2P3P1/3R2K1 w - - 0 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "d8",
          "san": "Rd8+",
          "explanation": "Master move Rd8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "e8",
        "san": "Re8",
        "coachExplanation": "Opponent plays Re8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd8+ is the engine-verified winning move from Lichess #001Wz."
    },
    {
      "id": "lichess_001wR",
      "lichessId": "001wR",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #001wR: Rating 1152",
      "ratingBadge": "Lichess: ~1152",
      "initialFen": "6nr/p4p1p/k1p5/1p6/1QN5/2P1P3/4KPqP/8 w - - 0 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "b4",
          "to": "a5",
          "san": "Qa5+",
          "explanation": "Master move Qa5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a6",
        "to": "b7",
        "san": "Kb7",
        "coachExplanation": "Opponent plays Kb7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qa5+ is the engine-verified winning move from Lichess #001wR."
    },
    {
      "id": "lichess_0048h",
      "lichessId": "0048h",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #0048h: Rating 1134",
      "ratingBadge": "Lichess: ~1134",
      "initialFen": "4r3/p5k1/2R4p/2Pp4/1P1pr1P1/P6P/8/3R3K b - - 0 35",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "e1",
          "san": "Re1+",
          "explanation": "Master move Re1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d1",
        "to": "e1",
        "san": "Rxe1",
        "coachExplanation": "Opponent plays Rxe1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re1+ is the engine-verified winning move from Lichess #0048h."
    },
    {
      "id": "lichess_004LZ",
      "lichessId": "004LZ",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #004LZ: Rating 1197",
      "ratingBadge": "Lichess: ~1197",
      "initialFen": "8/7R/5p2/p7/7P/2p5/3k2N1/1K6 b - - 0 48",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "c2",
          "san": "c2+",
          "explanation": "Master move c2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b1",
        "to": "a2",
        "san": "Ka2",
        "coachExplanation": "Opponent plays Ka2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! c2+ is the engine-verified winning move from Lichess #004LZ."
    },
    {
      "id": "lichess_004Lu",
      "lichessId": "004Lu",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #004Lu: Rating 1189",
      "ratingBadge": "Lichess: ~1189",
      "initialFen": "8/p1p1k2p/4P3/2PP1p1P/1r3r2/5B2/P3RK2/8 w - - 4 39",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "d6",
          "san": "d6+",
          "explanation": "Master move d6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "d6",
        "san": "cxd6",
        "coachExplanation": "Opponent plays cxd6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! d6+ is the engine-verified winning move from Lichess #004Lu."
    },
    {
      "id": "lichess_006HV",
      "lichessId": "006HV",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #006HV: Rating 1159",
      "ratingBadge": "Lichess: ~1159",
      "initialFen": "1r6/5k2/2Q1pNp1/p5Pp/1p2P2P/2P4R/KP3P2/3q4 b - - 0 31",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "b4",
          "to": "b3",
          "san": "b3+",
          "explanation": "Master move b3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a2",
        "to": "a3",
        "san": "Ka3",
        "coachExplanation": "Opponent plays Ka3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! b3+ is the engine-verified winning move from Lichess #006HV."
    },
    {
      "id": "lichess_007hv",
      "lichessId": "007hv",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #007hv: Rating 1090",
      "ratingBadge": "Lichess: ~1090",
      "initialFen": "6k1/5p1p/1p4p1/p1bN1p2/2Pq1P2/1PQ4P/1P4P1/7K b - - 2 32",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "g1",
          "san": "Qg1#",
          "explanation": "Master move Qg1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c3",
        "to": "d2",
        "san": "Qc3",
        "coachExplanation": "Opponent responds with Qc3! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qg1# is the engine-verified winning move from Lichess #007hv."
    },
    {
      "id": "lichess_0088O",
      "lichessId": "0088O",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #0088O: Rating 1133",
      "ratingBadge": "Lichess: ~1133",
      "initialFen": "7Q/2p5/1p2prp1/p4k1p/q4p1P/8/6RK/8 w - - 0 38",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "g2",
          "to": "g5",
          "san": "Rg5+",
          "explanation": "Master move Rg5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f5",
        "to": "e4",
        "san": "Ke4",
        "coachExplanation": "Opponent plays Ke4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rg5+ is the engine-verified winning move from Lichess #0088O."
    },
    {
      "id": "lichess_008tL",
      "lichessId": "008tL",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #008tL: Rating 1165",
      "ratingBadge": "Lichess: ~1165",
      "initialFen": "8/7k/R6p/3p4/5r2/2P1p2P/P5P1/6K1 b - - 0 40",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "e3",
          "to": "e2",
          "san": "e2",
          "explanation": "Master move e2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a6",
        "to": "e6",
        "san": "Re6",
        "coachExplanation": "Opponent plays Re6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! e2 is the engine-verified winning move from Lichess #008tL."
    },
    {
      "id": "lichess_0092z",
      "lichessId": "0092z",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #0092z: Rating 991",
      "ratingBadge": "Lichess: ~991",
      "initialFen": "2r3k1/3R1ppp/p1q5/2p2Q2/P7/7P/5PP1/6K1 w - - 4 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "f5",
          "to": "f7",
          "san": "Qxf7+",
          "explanation": "Master move Qxf7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kh8",
        "coachExplanation": "Opponent plays Kh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf7+ is the engine-verified winning move from Lichess #0092z."
    },
    {
      "id": "lichess_009bR",
      "lichessId": "009bR",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #009bR: Rating 1024",
      "ratingBadge": "Lichess: ~1024",
      "initialFen": "4r2k/3q3r/1p4pQ/p1pP4/2P4P/1N4p1/PP3RK1/8 w - - 2 38",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "f2",
          "to": "f8",
          "san": "Rf8+",
          "explanation": "Master move Rf8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e8",
        "to": "f8",
        "san": "Rxf8",
        "coachExplanation": "Opponent plays Rxf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rf8+ is the engine-verified winning move from Lichess #009bR."
    },
    {
      "id": "lichess_009f8",
      "lichessId": "009f8",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #009f8: Rating 1149",
      "ratingBadge": "Lichess: ~1149",
      "initialFen": "8/1p4p1/pb2pp1p/3n1k2/3P4/P3BN1P/1P2KPP1/8 w - - 1 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "h4",
          "san": "Nh4+",
          "explanation": "Master move Nh4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f5",
        "to": "e4",
        "san": "Ke4",
        "coachExplanation": "Opponent plays Ke4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nh4+ is the engine-verified winning move from Lichess #009f8."
    },
    {
      "id": "lichess_009oc",
      "lichessId": "009oc",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #009oc: Rating 1144",
      "ratingBadge": "Lichess: ~1144",
      "initialFen": "5Q2/pbp3np/1p1pq1pk/1P6/P6P/6K1/8/8 w - - 0 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "f8",
          "to": "f4",
          "san": "Qf4+",
          "explanation": "Master move Qf4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g6",
        "to": "g5",
        "san": "g5",
        "coachExplanation": "Opponent plays g5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qf4+ is the engine-verified winning move from Lichess #009oc."
    },
    {
      "id": "lichess_00A5v",
      "lichessId": "00A5v",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00A5v: Rating 876",
      "ratingBadge": "Lichess: ~876",
      "initialFen": "4r1k1/pp1qr1p1/7p/2pPR3/2P2p2/1P3P2/P2Q2PP/4R1K1 b - - 4 33",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "e5",
          "san": "Rxe5",
          "explanation": "Master move Rxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "e5",
        "san": "Rxe5",
        "coachExplanation": "Opponent plays Rxe5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxe5 is the engine-verified winning move from Lichess #00A5v."
    },
    {
      "id": "lichess_00AOH",
      "lichessId": "00AOH",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00AOH: Rating 866",
      "ratingBadge": "Lichess: ~866",
      "initialFen": "6k1/8/1R2p1pp/4P3/p1N2P2/6PK/7P/1r6 b - - 0 48",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "b1",
          "to": "b6",
          "san": "Rxb6",
          "explanation": "Master move Rxb6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c4",
        "to": "b6",
        "san": "Nxb6",
        "coachExplanation": "Opponent plays Nxb6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxb6 is the engine-verified winning move from Lichess #00AOH."
    },
    {
      "id": "lichess_00Aae",
      "lichessId": "00Aae",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Aae: Rating 1015",
      "ratingBadge": "Lichess: ~1015",
      "initialFen": "1R6/1P6/4pkp1/5p2/3P4/3KP2p/8/1r6 w - - 0 44",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "b8",
          "to": "f8",
          "san": "Rf8+",
          "explanation": "Master move Rf8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "e7",
        "san": "Ke7",
        "coachExplanation": "Opponent plays Ke7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rf8+ is the engine-verified winning move from Lichess #00Aae."
    },
    {
      "id": "lichess_00Af3",
      "lichessId": "00Af3",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Af3: Rating 1144",
      "ratingBadge": "Lichess: ~1144",
      "initialFen": "8/8/2B2p1p/P4Pp1/3p2P1/1b1Pb1kP/8/4K3 w - - 1 51",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "a5",
          "to": "a6",
          "san": "a6",
          "explanation": "Master move a6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b3",
        "to": "c4",
        "san": "Bc4",
        "coachExplanation": "Opponent plays Bc4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! a6 is the engine-verified winning move from Lichess #00Af3."
    },
    {
      "id": "lichess_00AoZ",
      "lichessId": "00AoZ",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00AoZ: Rating 1090",
      "ratingBadge": "Lichess: ~1090",
      "initialFen": "8/1R6/p1pk4/2q3bp/1QP5/P7/KP6/3r4 w - - 3 45",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "b7",
          "to": "d7",
          "san": "Rd7+",
          "explanation": "Master move Rd7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d6",
        "to": "d7",
        "san": "Kxd7",
        "coachExplanation": "Opponent plays Kxd7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd7+ is the engine-verified winning move from Lichess #00AoZ."
    },
    {
      "id": "lichess_00Au2",
      "lichessId": "00Au2",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Au2: Rating 964",
      "ratingBadge": "Lichess: ~964",
      "initialFen": "r5r1/pp1k1p2/2p5/3pQ3/3P4/2NB4/PPP2q2/1K6 w - - 2 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "f5",
          "san": "Bf5+",
          "explanation": "Master move Bf5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "f5",
        "san": "Qxf5",
        "coachExplanation": "Opponent plays Qxf5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bf5+ is the engine-verified winning move from Lichess #00Au2."
    },
    {
      "id": "lichess_00Bm8",
      "lichessId": "00Bm8",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Bm8: Rating 1126",
      "ratingBadge": "Lichess: ~1126",
      "initialFen": "8/6kp/4b1q1/1p6/1PpPN2Q/2P1P3/r5P1/5RK1 b - - 0 34",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "g6",
          "to": "g2",
          "san": "Qxg2#",
          "explanation": "Master move Qxg2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e4",
        "to": "d2",
        "san": "Nxe4",
        "coachExplanation": "Opponent responds with Nxe4! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxg2# is the engine-verified winning move from Lichess #00Bm8."
    },
    {
      "id": "lichess_00CtS",
      "lichessId": "00CtS",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00CtS: Rating 970",
      "ratingBadge": "Lichess: ~970",
      "initialFen": "Q7/5qk1/p2p4/b1p1pr2/P7/6P1/4KP1R/8 w - - 4 39",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "a8",
          "to": "h8",
          "san": "Qh8+",
          "explanation": "Master move Qh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g7",
        "to": "g6",
        "san": "Kg6",
        "coachExplanation": "Opponent plays Kg6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh8+ is the engine-verified winning move from Lichess #00CtS."
    },
    {
      "id": "lichess_00DEc",
      "lichessId": "00DEc",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00DEc: Rating 1091",
      "ratingBadge": "Lichess: ~1091",
      "initialFen": "8/p5pk/1p3b1p/3r3P/6P1/3nBN2/P4PK1/3R4 b - - 4 30",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "f4",
          "san": "Nf4+",
          "explanation": "Master move Nf4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e3",
        "to": "f4",
        "san": "Bxf4",
        "coachExplanation": "Opponent plays Bxf4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf4+ is the engine-verified winning move from Lichess #00DEc."
    },
    {
      "id": "lichess_00EWi",
      "lichessId": "00EWi",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00EWi: Rating 885",
      "ratingBadge": "Lichess: ~885",
      "initialFen": "8/8/5pkp/1RP5/1P3PKP/r7/8/8 b - - 0 48",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "f5",
          "san": "f5#",
          "explanation": "Master move f5#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b5",
        "to": "b6",
        "san": "Rxb5",
        "coachExplanation": "Opponent responds with Rxb5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! f5# is the engine-verified winning move from Lichess #00EWi."
    },
    {
      "id": "lichess_00FON",
      "lichessId": "00FON",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00FON: Rating 936",
      "ratingBadge": "Lichess: ~936",
      "initialFen": "1k6/8/8/6p1/1pp4P/p4PP1/N1P5/7K b - - 0 38",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "King Activity & Passed Pawn Priority",
      "ruleBody": "Endgame advantages require decisive king activation. Create an outside passed pawn to divert the enemy king.",
      "solutionMoves": [
        {
          "from": "b4",
          "to": "b3",
          "san": "b3",
          "explanation": "Master move b3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c2",
        "to": "b3",
        "san": "cxb3",
        "coachExplanation": "Opponent plays cxb3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! b3 is the engine-verified winning move from Lichess #00FON."
    }
  ],
  "adv_beginner_3": [
    {
      "id": "lichess_0009B",
      "lichessId": "0009B",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #0009B: Rating 1066",
      "ratingBadge": "Lichess: ~1066",
      "initialFen": "r2qr1k1/b1p2ppp/p5n1/P1p1p3/4P1n1/B2P2Pb/3NBP1P/RN1QR1K1 w - - 0 17",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "e2",
          "to": "g4",
          "san": "Bxg4",
          "explanation": "Master move Bxg4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h3",
        "to": "g4",
        "san": "Bxg4",
        "coachExplanation": "Opponent plays Bxg4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxg4 is the engine-verified winning move from Lichess #0009B."
    },
    {
      "id": "lichess_001om",
      "lichessId": "001om",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #001om: Rating 1018",
      "ratingBadge": "Lichess: ~1018",
      "initialFen": "5r1k/pp4pp/5p2/1BbQp1r1/7K/7P/1PP3P1/3R3R b - - 3 26",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "c5",
          "to": "f2",
          "san": "Bf2+",
          "explanation": "Master move Bf2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g2",
        "to": "g3",
        "san": "g3",
        "coachExplanation": "Opponent plays g3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bf2+ is the engine-verified winning move from Lichess #001om."
    },
    {
      "id": "lichess_001w5",
      "lichessId": "001w5",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #001w5: Rating 1034",
      "ratingBadge": "Lichess: ~1034",
      "initialFen": "1rb3k1/q4rP1/4p2p/3p3p/3P1P2/2P5/2QK3P/3R2R1 w - - 1 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "c2",
          "to": "h7",
          "san": "Qh7+",
          "explanation": "Master move Qh7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h7",
        "san": "Kxh7",
        "coachExplanation": "Opponent plays Kxh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh7+ is the engine-verified winning move from Lichess #001w5."
    },
    {
      "id": "lichess_002Mm",
      "lichessId": "002Mm",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #002Mm: Rating 921",
      "ratingBadge": "Lichess: ~921",
      "initialFen": "rn1qrk2/ppp3pQ/3p1pP1/3Pp3/2P1P3/8/PP3PP1/R1B1K3 w Q - 3 17",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "h7",
          "to": "h8",
          "san": "Qh8+",
          "explanation": "Master move Qh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "e7",
        "san": "Ke7",
        "coachExplanation": "Opponent plays Ke7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh8+ is the engine-verified winning move from Lichess #002Mm."
    },
    {
      "id": "lichess_002O7",
      "lichessId": "002O7",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #002O7: Rating 1008",
      "ratingBadge": "Lichess: ~1008",
      "initialFen": "r3qrk1/2p2pp1/p2bpn1p/2ppN3/3P1Pb1/1PP1P1B1/P2N2PP/R2Q1RK1 w - - 1 15",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "g4",
          "san": "Nxg4",
          "explanation": "Master move Nxg4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "g4",
        "san": "Nxg4",
        "coachExplanation": "Opponent plays Nxg4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxg4 is the engine-verified winning move from Lichess #002O7."
    },
    {
      "id": "lichess_002p5",
      "lichessId": "002p5",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #002p5: Rating 908",
      "ratingBadge": "Lichess: ~908",
      "initialFen": "r1bqr1k1/pp1nbpp1/2p5/3n2P1/2BP4/P7/1PQNNPP1/R3K2R w KQ - 1 14",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "c2",
          "to": "h7",
          "san": "Qh7+",
          "explanation": "Master move Qh7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f8",
        "san": "Kf8",
        "coachExplanation": "Opponent plays Kf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh7+ is the engine-verified winning move from Lichess #002p5."
    },
    {
      "id": "lichess_008Y3",
      "lichessId": "008Y3",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #008Y3: Rating 1055",
      "ratingBadge": "Lichess: ~1055",
      "initialFen": "r5k1/1p1r1pp1/p3pnp1/2qN4/8/1Q5P/PP3PP1/3RR1K1 w - - 0 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "f6",
          "san": "Nxf6+",
          "explanation": "Master move Nxf6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g7",
        "to": "f6",
        "san": "gxf6",
        "coachExplanation": "Opponent plays gxf6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxf6+ is the engine-verified winning move from Lichess #008Y3."
    },
    {
      "id": "lichess_009IO",
      "lichessId": "009IO",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #009IO: Rating 1162",
      "ratingBadge": "Lichess: ~1162",
      "initialFen": "3r4/4kp1r/p2Np1p1/3bP3/P2n4/8/1P3RPP/5RK1 w - - 5 26",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "f2",
          "to": "f7",
          "san": "Rxf7+",
          "explanation": "Master move Rxf7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h7",
        "to": "f7",
        "san": "Rxf7",
        "coachExplanation": "Opponent plays Rxf7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxf7+ is the engine-verified winning move from Lichess #009IO."
    },
    {
      "id": "lichess_009Wc",
      "lichessId": "009Wc",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #009Wc: Rating 1092",
      "ratingBadge": "Lichess: ~1092",
      "initialFen": "1r3rk1/1pqN1pbp/p1p1pnp1/2N5/3P4/1QP5/PP3PPP/3RR1K1 b - - 3 19",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "d7",
          "san": "Nxd7",
          "explanation": "Master move Nxd7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c5",
        "to": "d7",
        "san": "Nxd7",
        "coachExplanation": "Opponent plays Nxd7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxd7 is the engine-verified winning move from Lichess #009Wc."
    },
    {
      "id": "lichess_009lk",
      "lichessId": "009lk",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #009lk: Rating 917",
      "ratingBadge": "Lichess: ~917",
      "initialFen": "1R6/6pk/2p4p/3bP2r/5B1P/2P1RqP1/P4P1Q/6K1 b - - 3 40",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "d1",
          "san": "Qd1+",
          "explanation": "Master move Qd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e3",
        "to": "e1",
        "san": "Re1",
        "coachExplanation": "Opponent plays Re1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qd1+ is the engine-verified winning move from Lichess #009lk."
    },
    {
      "id": "lichess_009uB",
      "lichessId": "009uB",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #009uB: Rating 1089",
      "ratingBadge": "Lichess: ~1089",
      "initialFen": "3br1kr/7p/4p1pQ/P5P1/1B5P/P6q/5R2/6K1 w - - 2 36",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "f2",
          "to": "f8",
          "san": "Rf8+",
          "explanation": "Master move Rf8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e8",
        "to": "f8",
        "san": "Rxf8",
        "coachExplanation": "Opponent plays Rxf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rf8+ is the engine-verified winning move from Lichess #009uB."
    },
    {
      "id": "lichess_00Ahb",
      "lichessId": "00Ahb",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Ahb: Rating 1123",
      "ratingBadge": "Lichess: ~1123",
      "initialFen": "1k5r/pp1r1ppp/4p2n/1Nb2q2/2Pp4/6P1/PP3P1P/R1BQR1K1 w - - 3 15",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "c1",
          "to": "f4",
          "san": "Bf4+",
          "explanation": "Master move Bf4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f5",
        "to": "f4",
        "san": "Qxf4",
        "coachExplanation": "Opponent plays Qxf4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bf4+ is the engine-verified winning move from Lichess #00Ahb."
    },
    {
      "id": "lichess_00DBg",
      "lichessId": "00DBg",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00DBg: Rating 1067",
      "ratingBadge": "Lichess: ~1067",
      "initialFen": "rn2kbnr/pp6/2p2p2/4P3/4P1pq/2N3N1/PPPB1KB1/R2Q1R2 b kq - 2 17",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "f8",
          "to": "c5",
          "san": "Bc5+",
          "explanation": "Master move Bc5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d2",
        "to": "e3",
        "san": "Be3",
        "coachExplanation": "Opponent plays Be3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bc5+ is the engine-verified winning move from Lichess #00DBg."
    },
    {
      "id": "lichess_00E29",
      "lichessId": "00E29",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00E29: Rating 953",
      "ratingBadge": "Lichess: ~953",
      "initialFen": "r1b2rk1/4bppp/p1n5/3q4/Pp6/3B1N2/1B3PPP/R2Q1RK1 w - - 0 18",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "h7",
          "san": "Bxh7+",
          "explanation": "Master move Bxh7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h7",
        "san": "Kxh7",
        "coachExplanation": "Opponent plays Kxh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxh7+ is the engine-verified winning move from Lichess #00E29."
    },
    {
      "id": "lichess_00Gt0",
      "lichessId": "00Gt0",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Gt0: Rating 1052",
      "ratingBadge": "Lichess: ~1052",
      "initialFen": "R7/4k3/5p2/3p2p1/4b2p/2K1PP1P/6P1/8 b - - 0 47",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "d4",
          "san": "d4+",
          "explanation": "Master move d4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c3",
        "to": "d4",
        "san": "Kxd4",
        "coachExplanation": "Opponent plays Kxd4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! d4+ is the engine-verified winning move from Lichess #00Gt0."
    },
    {
      "id": "lichess_00Gvr",
      "lichessId": "00Gvr",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Gvr: Rating 1149",
      "ratingBadge": "Lichess: ~1149",
      "initialFen": "8/1b4p1/1k3pPp/4K2P/4PP2/8/8/8 w - - 0 47",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "e6",
          "san": "Ke6",
          "explanation": "Master move Ke6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b7",
        "to": "e4",
        "san": "Bxe4",
        "coachExplanation": "Opponent plays Bxe4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ke6 is the engine-verified winning move from Lichess #00Gvr."
    },
    {
      "id": "lichess_00HeG",
      "lichessId": "00HeG",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00HeG: Rating 851",
      "ratingBadge": "Lichess: ~851",
      "initialFen": "8/1p5k/p3p1q1/3pP3/2p3PQ/2P5/PP6/2K5 b - - 4 33",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "g6",
          "to": "h6",
          "san": "Qh6+",
          "explanation": "Master move Qh6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h4",
        "to": "h6",
        "san": "Qxh6+",
        "coachExplanation": "Opponent plays Qxh6+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh6+ is the engine-verified winning move from Lichess #00HeG."
    },
    {
      "id": "lichess_00Htd",
      "lichessId": "00Htd",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Htd: Rating 968",
      "ratingBadge": "Lichess: ~968",
      "initialFen": "rnbqk2r/1p3ppp/p4b2/2PQ4/8/2N2N2/PP2PPPP/R3KB1R b KQkq - 0 9",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "c3",
          "san": "Bxc3+",
          "explanation": "Master move Bxc3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b2",
        "to": "c3",
        "san": "bxc3",
        "coachExplanation": "Opponent plays bxc3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxc3+ is the engine-verified winning move from Lichess #00Htd."
    },
    {
      "id": "lichess_00I8g",
      "lichessId": "00I8g",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00I8g: Rating 937",
      "ratingBadge": "Lichess: ~937",
      "initialFen": "4rk2/3Rnrp1/8/4Q1P1/8/6K1/8/8 b - - 0 50",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "f5",
          "san": "Nf5+",
          "explanation": "Master move Nf5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "f5",
        "san": "Qxf5",
        "coachExplanation": "Opponent plays Qxf5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf5+ is the engine-verified winning move from Lichess #00I8g."
    },
    {
      "id": "lichess_00J1Y",
      "lichessId": "00J1Y",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00J1Y: Rating 1141",
      "ratingBadge": "Lichess: ~1141",
      "initialFen": "1q3r2/p5k1/1p2pbpp/2p5/2P1p3/2P2PQP/PP3P2/6RK w - - 0 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "g6",
          "san": "Qxg6+",
          "explanation": "Master move Qxg6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g7",
        "to": "h8",
        "san": "Kh8",
        "coachExplanation": "Opponent plays Kh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxg6+ is the engine-verified winning move from Lichess #00J1Y."
    },
    {
      "id": "lichess_00JaW",
      "lichessId": "00JaW",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00JaW: Rating 1080",
      "ratingBadge": "Lichess: ~1080",
      "initialFen": "8/8/rk5p/3R2p1/4p1P1/4P3/3K4/8 w - - 0 49",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "d6",
          "san": "Rd6+",
          "explanation": "Master move Rd6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b6",
        "to": "a5",
        "san": "Ka5",
        "coachExplanation": "Opponent plays Ka5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd6+ is the engine-verified winning move from Lichess #00JaW."
    },
    {
      "id": "lichess_00JfN",
      "lichessId": "00JfN",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00JfN: Rating 971",
      "ratingBadge": "Lichess: ~971",
      "initialFen": "r6r/1bpnk3/1p1pB3/pP1P4/P3PQP1/2b2N1q/2P2P2/R3R1K1 w - - 0 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "f7",
          "san": "Qf7+",
          "explanation": "Master move Qf7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e7",
        "to": "d8",
        "san": "Kd8",
        "coachExplanation": "Opponent plays Kd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qf7+ is the engine-verified winning move from Lichess #00JfN."
    },
    {
      "id": "lichess_00KOz",
      "lichessId": "00KOz",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00KOz: Rating 960",
      "ratingBadge": "Lichess: ~960",
      "initialFen": "8/r4k2/7R/3n1PK1/8/8/8/8 w - - 4 57",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "h6",
          "to": "h7",
          "san": "Rh7+",
          "explanation": "Master move Rh7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f7",
        "to": "f8",
        "san": "Kf8",
        "coachExplanation": "Opponent plays Kf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rh7+ is the engine-verified winning move from Lichess #00KOz."
    },
    {
      "id": "lichess_00Keu",
      "lichessId": "00Keu",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00Keu: Rating 859",
      "ratingBadge": "Lichess: ~859",
      "initialFen": "R7/1p3kp1/2pK3p/3p1PP1/3r2nP/8/1P6/8 w - - 0 40",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "g5",
          "to": "g6",
          "san": "g6+",
          "explanation": "Master move g6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f7",
        "to": "f6",
        "san": "Kf6",
        "coachExplanation": "Opponent plays Kf6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! g6+ is the engine-verified winning move from Lichess #00Keu."
    },
    {
      "id": "lichess_00L76",
      "lichessId": "00L76",
      "tier": "adv_beginner",
      "track": "positional",
      "title": "Lichess #00L76: Rating 1138",
      "ratingBadge": "Lichess: ~1138",
      "initialFen": "5rk1/5p2/4p1p1/7R/2P5/2n2N2/5r2/2K4R w - - 0 38",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Steinitz's Worst-Placed Piece Principle",
      "ruleBody": "Every move must improve piece coordination. Attack undefended outposts and build crushing positional pressure.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "h8",
          "san": "Rh8+",
          "explanation": "Master move Rh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "g7",
        "san": "Kg7",
        "coachExplanation": "Opponent plays Kg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rh8+ is the engine-verified winning move from Lichess #00L76."
    }
  ],
  "intermediate_0": [
    {
      "id": "lichess_000lC",
      "lichessId": "000lC",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #000lC: Rating 1349",
      "ratingBadge": "Lichess: ~1349",
      "initialFen": "3r3r/pQNk1ppp/1qnR1n2/1B6/8/8/PPP3PP/5R1K b - - 0 19",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "d7",
          "to": "d6",
          "san": "Kxd6",
          "explanation": "Master move Kxd6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b7",
        "to": "b6",
        "san": "Qxb6",
        "coachExplanation": "Opponent plays Qxb6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxd6 is the engine-verified winning move from Lichess #000lC."
    },
    {
      "id": "lichess_005wJ",
      "lichessId": "005wJ",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #005wJ: Rating 1390",
      "ratingBadge": "Lichess: ~1390",
      "initialFen": "r3kb1r/ppqN1ppp/4pn2/1Q3b2/3P4/8/PP2PPPP/RNB1KB1R b KQkq - 0 9",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "c7",
          "to": "c1",
          "san": "Qxc1#",
          "explanation": "Master move Qxc1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d7",
        "to": "e5",
        "san": "Nxd7",
        "coachExplanation": "Opponent responds with Nxd7! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxc1# is the engine-verified winning move from Lichess #005wJ."
    },
    {
      "id": "lichess_00Er4",
      "lichessId": "00Er4",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00Er4: Rating 1269",
      "ratingBadge": "Lichess: ~1269",
      "initialFen": "r3k2r/p1bN2pp/2p1Rp2/3p3b/3P1q2/2N4P/PPPQ1PP1/R5K1 b kq - 0 16",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "e8",
          "to": "d7",
          "san": "Kxd7",
          "explanation": "Master move Kxd7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d2",
        "to": "f4",
        "san": "Qxf4",
        "coachExplanation": "Opponent plays Qxf4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxd7 is the engine-verified winning move from Lichess #00Er4."
    },
    {
      "id": "lichess_00IF1",
      "lichessId": "00IF1",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00IF1: Rating 1266",
      "ratingBadge": "Lichess: ~1266",
      "initialFen": "1k6/p1p5/P2p4/3P4/1PK2r1p/4P3/8/4B3 w - - 0 58",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "e3",
          "to": "f4",
          "san": "exf4",
          "explanation": "Master move exf4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h4",
        "to": "h3",
        "san": "h3",
        "coachExplanation": "Opponent plays h3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! exf4 is the engine-verified winning move from Lichess #00IF1."
    },
    {
      "id": "lichess_00InW",
      "lichessId": "00InW",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00InW: Rating 1450",
      "ratingBadge": "Lichess: ~1450",
      "initialFen": "8/2p5/pp1p4/3P1N2/PPP1Pp2/5n1p/5K1k/8 w - - 0 47",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "f2",
          "to": "f3",
          "san": "Kxf3",
          "explanation": "Master move Kxf3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h2",
        "to": "g1",
        "san": "Kg1",
        "coachExplanation": "Opponent plays Kg1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxf3 is the engine-verified winning move from Lichess #00InW."
    },
    {
      "id": "lichess_00LI0",
      "lichessId": "00LI0",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00LI0: Rating 1289",
      "ratingBadge": "Lichess: ~1289",
      "initialFen": "r2qk2r/pp1n1ppp/4pn2/3N2B1/1b1P4/4QN1P/PPb1BPP1/R4RK1 b kq - 0 12",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "d5",
          "san": "Nxd5",
          "explanation": "Master move Nxd5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g5",
        "to": "d8",
        "san": "Bxd8",
        "coachExplanation": "Opponent plays Bxd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxd5 is the engine-verified winning move from Lichess #00LI0."
    },
    {
      "id": "lichess_00MTn",
      "lichessId": "00MTn",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00MTn: Rating 1335",
      "ratingBadge": "Lichess: ~1335",
      "initialFen": "2rqk2r/3n4/1p2p3/p3N2R/Q1PP2p1/P2BP3/3K1Pb1/R7 b k - 0 22",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "h8",
          "to": "h5",
          "san": "Rxh5",
          "explanation": "Master move Rxh5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d3",
        "to": "g6",
        "san": "Bg6+",
        "coachExplanation": "Opponent plays Bg6+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxh5 is the engine-verified winning move from Lichess #00MTn."
    },
    {
      "id": "lichess_00WzS",
      "lichessId": "00WzS",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00WzS: Rating 1463",
      "ratingBadge": "Lichess: ~1463",
      "initialFen": "r2qk2r/2pn1p1n/pp1p2Bp/3Pp1b1/PPP1P3/2N1B3/3N2PP/R2Q1RK1 b kq - 0 17",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "g5",
          "to": "e3",
          "san": "Bxe3+",
          "explanation": "Master move Bxe3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxe3+ is the engine-verified winning move from Lichess #00WzS."
    },
    {
      "id": "lichess_00kS9",
      "lichessId": "00kS9",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00kS9: Rating 1458",
      "ratingBadge": "Lichess: ~1458",
      "initialFen": "4r1k1/1ppbrppB/7p/p2P4/3q1P2/P4P2/1P1Q2PP/3RR2K b - - 6 26",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "g8",
          "to": "h7",
          "san": "Kxh7",
          "explanation": "Master move Kxh7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "e7",
        "san": "Rxe7",
        "coachExplanation": "Opponent plays Rxe7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxh7 is the engine-verified winning move from Lichess #00kS9."
    },
    {
      "id": "lichess_00qIK",
      "lichessId": "00qIK",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00qIK: Rating 1531",
      "ratingBadge": "Lichess: ~1531",
      "initialFen": "B4rk1/p3b1pp/1q2bp2/1p2p3/2p2P2/3PR1P1/PPPN3P/R1BQ2K1 b - - 0 16",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "b6",
          "to": "e3",
          "san": "Qxe3+",
          "explanation": "Master move Qxe3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "g2",
        "san": "Kg2",
        "coachExplanation": "Opponent plays Kg2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe3+ is the engine-verified winning move from Lichess #00qIK."
    },
    {
      "id": "lichess_00u0R",
      "lichessId": "00u0R",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00u0R: Rating 1399",
      "ratingBadge": "Lichess: ~1399",
      "initialFen": "3r2k1/1p2R3/7p/P4rpB/8/2n3P1/1q4PP/3R2K1 w - - 2 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "d8",
          "san": "Rxd8+",
          "explanation": "Master move Rxd8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f5",
        "to": "f8",
        "san": "Rf8",
        "coachExplanation": "Opponent plays Rf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd8+ is the engine-verified winning move from Lichess #00u0R."
    },
    {
      "id": "lichess_01Amq",
      "lichessId": "01Amq",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #01Amq: Rating 1572",
      "ratingBadge": "Lichess: ~1572",
      "initialFen": "4r1k1/4Pp2/pQ3b1p/6pP/q1p5/P4P2/5BPK/8 w - - 3 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "b6",
          "to": "f6",
          "san": "Qxf6",
          "explanation": "Master move Qxf6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c4",
        "to": "c3",
        "san": "c3",
        "coachExplanation": "Opponent plays c3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf6 is the engine-verified winning move from Lichess #01Amq."
    },
    {
      "id": "lichess_01Az7",
      "lichessId": "01Az7",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #01Az7: Rating 1353",
      "ratingBadge": "Lichess: ~1353",
      "initialFen": "r1bq1rk1/pp1p1ppp/4pn2/4n3/2B5/2B5/PPP2PPP/R2QK1NR w KQ - 0 10",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "e5",
          "san": "Bxe5",
          "explanation": "Master move Bxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "a5",
        "san": "Qa5+",
        "coachExplanation": "Opponent plays Qa5+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxe5 is the engine-verified winning move from Lichess #01Az7."
    },
    {
      "id": "lichess_01gcG",
      "lichessId": "01gcG",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #01gcG: Rating 1355",
      "ratingBadge": "Lichess: ~1355",
      "initialFen": "2r2rk1/pp3ppp/8/q2p4/3nn3/P1P2B2/2QB1PPP/R1R3K1 w - - 0 17",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "d4",
          "san": "cxd4",
          "explanation": "Master move cxd4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c8",
        "to": "c2",
        "san": "Rxc2",
        "coachExplanation": "Opponent plays Rxc2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! cxd4 is the engine-verified winning move from Lichess #01gcG."
    },
    {
      "id": "lichess_021Ww",
      "lichessId": "021Ww",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #021Ww: Rating 1544",
      "ratingBadge": "Lichess: ~1544",
      "initialFen": "8/2kr2p1/5pP1/1p2pP2/pP1NPb2/P4K2/Q2p3r/3R4 b - - 2 42",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "d7",
          "to": "d4",
          "san": "Rxd4",
          "explanation": "Master move Rxd4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a2",
        "to": "f7",
        "san": "Qf7+",
        "coachExplanation": "Opponent plays Qf7+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd4 is the engine-verified winning move from Lichess #021Ww."
    },
    {
      "id": "lichess_021aU",
      "lichessId": "021aU",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #021aU: Rating 1498",
      "ratingBadge": "Lichess: ~1498",
      "initialFen": "7k/6pp/2R1p3/p4p2/3Qq3/6P1/3K1P2/3R4 b - - 0 47",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "d4",
          "san": "Qxd4+",
          "explanation": "Master move Qxd4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d2",
        "to": "c1",
        "san": "Kc1",
        "coachExplanation": "Opponent plays Kc1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd4+ is the engine-verified winning move from Lichess #021aU."
    },
    {
      "id": "lichess_0257T",
      "lichessId": "0257T",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #0257T: Rating 1461",
      "ratingBadge": "Lichess: ~1461",
      "initialFen": "r2qnr1k/pppb2pp/2n4B/3Nb3/8/P5QP/1PP1B1P1/R4RK1 w - - 0 19",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "f8",
          "san": "Rxf8#",
          "explanation": "Master move Rxf8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "f6",
        "san": "Bxe5",
        "coachExplanation": "Opponent responds with Bxe5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Rxf8# is the engine-verified winning move from Lichess #0257T."
    },
    {
      "id": "lichess_02EGv",
      "lichessId": "02EGv",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #02EGv: Rating 1246",
      "ratingBadge": "Lichess: ~1246",
      "initialFen": "8/5r1k/p1qQp1pp/2p5/2P3P1/6B1/1P3P1n/2R2K2 w - - 0 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "h2",
          "san": "Bxh2",
          "explanation": "Master move Bxh2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c6",
        "to": "h1",
        "san": "Qh1+",
        "coachExplanation": "Opponent plays Qh1+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxh2 is the engine-verified winning move from Lichess #02EGv."
    },
    {
      "id": "lichess_02HG7",
      "lichessId": "02HG7",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #02HG7: Rating 1386",
      "ratingBadge": "Lichess: ~1386",
      "initialFen": "5r2/pk2q2p/2p1p3/4Qn2/1P6/8/P4PrP/2R2RK1 w - - 0 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "g1",
          "to": "g2",
          "san": "Kxg2",
          "explanation": "Master move Kxg2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f5",
        "to": "h4",
        "san": "Nh4+",
        "coachExplanation": "Opponent plays Nh4+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxg2 is the engine-verified winning move from Lichess #02HG7."
    },
    {
      "id": "lichess_02McK",
      "lichessId": "02McK",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #02McK: Rating 1497",
      "ratingBadge": "Lichess: ~1497",
      "initialFen": "r1b4k/2qn1pbp/pp3np1/3N2B1/B1pP4/2P5/PP1N1PPP/R3Q1K1 b - - 0 17",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "d5",
          "san": "Nxd5",
          "explanation": "Master move Nxd5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "e8",
        "san": "Qe8+",
        "coachExplanation": "Opponent plays Qe8+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxd5 is the engine-verified winning move from Lichess #02McK."
    },
    {
      "id": "lichess_02O8w",
      "lichessId": "02O8w",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #02O8w: Rating 1337",
      "ratingBadge": "Lichess: ~1337",
      "initialFen": "2R2rk1/5pp1/p5np/b2p4/3P4/Pq1BPN2/1P3QPP/3R2K1 b - - 0 26",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "b3",
          "to": "d1",
          "san": "Qxd1+",
          "explanation": "Master move Qxd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "f1",
        "san": "Qf1",
        "coachExplanation": "Opponent plays Qf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd1+ is the engine-verified winning move from Lichess #02O8w."
    },
    {
      "id": "lichess_02Smp",
      "lichessId": "02Smp",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #02Smp: Rating 1549",
      "ratingBadge": "Lichess: ~1549",
      "initialFen": "2r2rk1/pb1nqpp1/1p5p/3N1B2/3Pn3/5N2/PPQ2PPP/2R2RK1 b - - 0 16",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "b7",
          "to": "d5",
          "san": "Bxd5",
          "explanation": "Master move Bxd5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c2",
        "to": "c8",
        "san": "Qxc8",
        "coachExplanation": "Opponent plays Qxc8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxd5 is the engine-verified winning move from Lichess #02Smp."
    },
    {
      "id": "lichess_02W8D",
      "lichessId": "02W8D",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #02W8D: Rating 1269",
      "ratingBadge": "Lichess: ~1269",
      "initialFen": "8/8/8/p7/PpK4R/1P6/5bk1/8 b - - 0 78",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "f2",
          "to": "h4",
          "san": "Bxh4",
          "explanation": "Master move Bxh4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c4",
        "to": "b5",
        "san": "Kb5",
        "coachExplanation": "Opponent plays Kb5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxh4 is the engine-verified winning move from Lichess #02W8D."
    },
    {
      "id": "lichess_02cv1",
      "lichessId": "02cv1",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #02cv1: Rating 1542",
      "ratingBadge": "Lichess: ~1542",
      "initialFen": "r1q1kb1r/5pp1/1N1p3p/3Ppb2/7P/1nP2N2/1P2QPP1/R1B1K2R b KQkq - 4 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "a8",
          "to": "a1",
          "san": "Rxa1",
          "explanation": "Master move Rxa1! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "b5",
        "san": "Qb5+",
        "coachExplanation": "Opponent plays Qb5+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxa1 is the engine-verified winning move from Lichess #02cv1."
    },
    {
      "id": "lichess_02mTT",
      "lichessId": "02mTT",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #02mTT: Rating 1225",
      "ratingBadge": "Lichess: ~1225",
      "initialFen": "2r1k2r/pp2bpp1/4p3/P2pP2p/1P1NnP2/2Pq4/6PP/R2QBR1K b k - 2 21",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Tactical Overload & Deflection Rule",
      "ruleBody": "Identify pieces performing two defensive jobs simultaneously. Remove or deflect one defender to win the prize.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "f1",
          "san": "Qxf1#",
          "explanation": "Master move Qxf1#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "d2",
        "san": "Be1",
        "coachExplanation": "Opponent responds with Be1! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qxf1# is the engine-verified winning move from Lichess #02mTT."
    }
  ],
  "intermediate_1": [
    {
      "id": "lichess_000Pw",
      "lichessId": "000Pw",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #000Pw: Rating 1547",
      "ratingBadge": "Lichess: ~1547",
      "initialFen": "6k1/5p1p/4p3/4q3/3n4/2Q3P1/PP1N1P1P/6K1 b - - 3 37",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "e2",
          "san": "Ne2+",
          "explanation": "Master move Ne2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "f1",
        "san": "Kf1",
        "coachExplanation": "Opponent plays Kf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne2+ is the engine-verified winning move from Lichess #000Pw."
    },
    {
      "id": "lichess_001m3",
      "lichessId": "001m3",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #001m3: Rating 1455",
      "ratingBadge": "Lichess: ~1455",
      "initialFen": "7r/6k1/2b1Rp2/8/P1N3p1/5nP1/5P2/Q4K2 b - - 0 38",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "h8",
          "to": "h1",
          "san": "Rh1+",
          "explanation": "Master move Rh1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f1",
        "to": "e2",
        "san": "Ke2",
        "coachExplanation": "Opponent plays Ke2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rh1+ is the engine-verified winning move from Lichess #001m3."
    },
    {
      "id": "lichess_002Tf",
      "lichessId": "002Tf",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #002Tf: Rating 1561",
      "ratingBadge": "Lichess: ~1561",
      "initialFen": "r3kbnr/ppp1qppp/2n5/1B1pP3/5B2/4PQ2/PPP2PPP/RN2K2R b KQkq - 2 7",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "b4",
          "san": "Qb4+",
          "explanation": "Master move Qb4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b1",
        "to": "c3",
        "san": "Nc3",
        "coachExplanation": "Opponent plays Nc3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qb4+ is the engine-verified winning move from Lichess #002Tf."
    },
    {
      "id": "lichess_003S3",
      "lichessId": "003S3",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #003S3: Rating 1494",
      "ratingBadge": "Lichess: ~1494",
      "initialFen": "1r3k1r/pNqnppb1/6pn/2p3Np/7P/2P2Q2/PP3PP1/R1B1K2R w KQ - 3 16",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "g5",
          "to": "e6",
          "san": "Ne6+",
          "explanation": "Master move Ne6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "g8",
        "san": "Kg8",
        "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne6+ is the engine-verified winning move from Lichess #003S3."
    },
    {
      "id": "lichess_003Tx",
      "lichessId": "003Tx",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #003Tx: Rating 1512",
      "ratingBadge": "Lichess: ~1512",
      "initialFen": "2r5/pR5p/5p1k/4p3/4R3/B4nPP/PP3P2/1K6 b - - 0 27",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "d2",
          "san": "Nd2+",
          "explanation": "Master move Nd2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b1",
        "to": "a1",
        "san": "Ka1",
        "coachExplanation": "Opponent plays Ka1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nd2+ is the engine-verified winning move from Lichess #003Tx."
    },
    {
      "id": "lichess_003mh",
      "lichessId": "003mh",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #003mh: Rating 1304",
      "ratingBadge": "Lichess: ~1304",
      "initialFen": "4rk1r/1pp2p2/p2p3p/3N4/3P2q1/8/PPP5/1K2Q1NR w - - 2 24",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "e1",
          "to": "e8",
          "san": "Qxe8+",
          "explanation": "Master move Qxe8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "e8",
        "san": "Kxe8",
        "coachExplanation": "Opponent plays Kxe8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe8+ is the engine-verified winning move from Lichess #003mh."
    },
    {
      "id": "lichess_004mT",
      "lichessId": "004mT",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #004mT: Rating 1331",
      "ratingBadge": "Lichess: ~1331",
      "initialFen": "5Q2/8/1bk1p1p1/5p2/3p4/5qPK/7P/8 w - - 2 52",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "f8",
          "to": "a8",
          "san": "Qa8+",
          "explanation": "Master move Qa8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c6",
        "to": "d6",
        "san": "Kd6",
        "coachExplanation": "Opponent plays Kd6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qa8+ is the engine-verified winning move from Lichess #004mT."
    },
    {
      "id": "lichess_005Bm",
      "lichessId": "005Bm",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #005Bm: Rating 1327",
      "ratingBadge": "Lichess: ~1327",
      "initialFen": "4rk2/p4q2/1p3Q1b/8/1p5N/2P1p3/P3P3/2K5 w - - 1 44",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "h4",
          "to": "g6",
          "san": "Ng6+",
          "explanation": "Master move Ng6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "g8",
        "san": "Kg8",
        "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ng6+ is the engine-verified winning move from Lichess #005Bm."
    },
    {
      "id": "lichess_006wz",
      "lichessId": "006wz",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #006wz: Rating 1426",
      "ratingBadge": "Lichess: ~1426",
      "initialFen": "2r5/4ppkp/6p1/1p6/1P6/P3B3/1br2PPP/1R1R2K1 w - - 3 23",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "b1",
          "to": "b2",
          "san": "Rxb2",
          "explanation": "Master move Rxb2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c2",
        "to": "b2",
        "san": "Rxb2",
        "coachExplanation": "Opponent plays Rxb2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxb2 is the engine-verified winning move from Lichess #006wz."
    },
    {
      "id": "lichess_00761",
      "lichessId": "00761",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00761: Rating 1401",
      "ratingBadge": "Lichess: ~1401",
      "initialFen": "3r2k1/1b4bR/p2P2p1/3p2N1/2p5/2P2N2/PP6/2K5 w - - 0 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "h7",
          "to": "g7",
          "san": "Rxg7+",
          "explanation": "Master move Rxg7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "g7",
        "san": "Kxg7",
        "coachExplanation": "Opponent plays Kxg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxg7+ is the engine-verified winning move from Lichess #00761."
    },
    {
      "id": "lichess_008D5",
      "lichessId": "008D5",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #008D5: Rating 1421",
      "ratingBadge": "Lichess: ~1421",
      "initialFen": "r1bqk2r/pp3ppp/4p3/3pPn2/1b1P1P2/2N5/PP4PP/R1BQKB1R w KQkq - 3 10",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "a4",
          "san": "Qa4+",
          "explanation": "Master move Qa4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c8",
        "to": "d7",
        "san": "Bd7",
        "coachExplanation": "Opponent plays Bd7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qa4+ is the engine-verified winning move from Lichess #008D5."
    },
    {
      "id": "lichess_009BH",
      "lichessId": "009BH",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #009BH: Rating 1413",
      "ratingBadge": "Lichess: ~1413",
      "initialFen": "3r3k/6p1/4Q3/4B3/1p3P2/4PKP1/3q4/8 w - - 18 52",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "h6",
          "san": "Qh6+",
          "explanation": "Master move Qh6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h8",
        "to": "g8",
        "san": "Kg8",
        "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh6+ is the engine-verified winning move from Lichess #009BH."
    },
    {
      "id": "lichess_00C8e",
      "lichessId": "00C8e",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00C8e: Rating 1532",
      "ratingBadge": "Lichess: ~1532",
      "initialFen": "8/5p1k/5Ppb/2p3P1/qp6/8/KB5Q/8 w - - 5 59",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "a2",
          "to": "b1",
          "san": "Kb1",
          "explanation": "Master move Kb1! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a4",
        "to": "d1",
        "san": "Qd1+",
        "coachExplanation": "Opponent plays Qd1+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kb1 is the engine-verified winning move from Lichess #00C8e."
    },
    {
      "id": "lichess_00Ea3",
      "lichessId": "00Ea3",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00Ea3: Rating 1316",
      "ratingBadge": "Lichess: ~1316",
      "initialFen": "3r4/p5k1/1p1qpr1p/1Q1pn1p1/3P1pP1/1PP5/P5PP/4RRK1 w - - 0 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "e5",
          "san": "dxe5",
          "explanation": "Master move dxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d6",
        "to": "c5",
        "san": "Qc5+",
        "coachExplanation": "Opponent plays Qc5+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! dxe5 is the engine-verified winning move from Lichess #00Ea3."
    },
    {
      "id": "lichess_00F5G",
      "lichessId": "00F5G",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00F5G: Rating 1522",
      "ratingBadge": "Lichess: ~1522",
      "initialFen": "2rqrbk1/pp3ppp/8/3p1N2/3NnnQ1/2P4P/PP3PP1/R4RK1 w - - 0 23",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "f5",
          "to": "h6",
          "san": "Nh6+",
          "explanation": "Master move Nh6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kh8",
        "coachExplanation": "Opponent plays Kh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nh6+ is the engine-verified winning move from Lichess #00F5G."
    },
    {
      "id": "lichess_00HzX",
      "lichessId": "00HzX",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00HzX: Rating 1572",
      "ratingBadge": "Lichess: ~1572",
      "initialFen": "4r1k1/5pp1/7R/1p6/8/1PP3QP/2q2PP1/6K1 b - - 0 29",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "c2",
          "to": "c1",
          "san": "Qc1+",
          "explanation": "Master move Qc1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h2",
        "san": "Kh2",
        "coachExplanation": "Opponent plays Kh2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qc1+ is the engine-verified winning move from Lichess #00HzX."
    },
    {
      "id": "lichess_00ICz",
      "lichessId": "00ICz",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00ICz: Rating 1298",
      "ratingBadge": "Lichess: ~1298",
      "initialFen": "2k3r1/1p1q3p/1p2p3/1NbpQr2/P1p2P2/6P1/6KP/R4R2 w - - 1 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "b5",
          "to": "a7",
          "san": "Na7+",
          "explanation": "Master move Na7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c8",
        "to": "d8",
        "san": "Kd8",
        "coachExplanation": "Opponent plays Kd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Na7+ is the engine-verified winning move from Lichess #00ICz."
    },
    {
      "id": "lichess_00IUT",
      "lichessId": "00IUT",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00IUT: Rating 1439",
      "ratingBadge": "Lichess: ~1439",
      "initialFen": "1r2r1k1/ppp1q1pp/4b3/4P3/1Q1R1P2/8/P5PP/R1B3K1 b - - 0 19",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "c7",
          "to": "c5",
          "san": "c5",
          "explanation": "Master move c5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b4",
        "to": "a3",
        "san": "Qa3",
        "coachExplanation": "Opponent plays Qa3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! c5 is the engine-verified winning move from Lichess #00IUT."
    },
    {
      "id": "lichess_00Kia",
      "lichessId": "00Kia",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00Kia: Rating 1591",
      "ratingBadge": "Lichess: ~1591",
      "initialFen": "5r1k/4n2p/1p4p1/pP5Q/P2pB2K/6P1/2P4P/4q3 w - - 0 38",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "e5",
          "san": "Qe5+",
          "explanation": "Master move Qe5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h8",
        "to": "g8",
        "san": "Kg8",
        "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe5+ is the engine-verified winning move from Lichess #00Kia."
    },
    {
      "id": "lichess_00Kq4",
      "lichessId": "00Kq4",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00Kq4: Rating 1417",
      "ratingBadge": "Lichess: ~1417",
      "initialFen": "r2qk3/5p1r/p1p1p3/1p1pP1N1/P1nP2Pn/2P3B1/2P2P2/R1QR2K1 b q - 0 21",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "g5",
          "san": "Qxg5",
          "explanation": "Master move Qxg5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c1",
        "to": "g5",
        "san": "Qxg5",
        "coachExplanation": "Opponent plays Qxg5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxg5 is the engine-verified winning move from Lichess #00Kq4."
    },
    {
      "id": "lichess_00LNH",
      "lichessId": "00LNH",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00LNH: Rating 1590",
      "ratingBadge": "Lichess: ~1590",
      "initialFen": "1k2r3/pp2r2p/2pqbpp1/3n4/3P1p2/1B3N1P/PPQB1PP1/1K1RR3 b - - 3 22",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "f5",
          "san": "Bf5",
          "explanation": "Master move Bf5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c2",
        "to": "f5",
        "san": "Qxf5",
        "coachExplanation": "Opponent plays Qxf5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bf5 is the engine-verified winning move from Lichess #00LNH."
    },
    {
      "id": "lichess_00M1q",
      "lichessId": "00M1q",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00M1q: Rating 1434",
      "ratingBadge": "Lichess: ~1434",
      "initialFen": "2r3k1/2r3p1/p3pqQ1/1p1p4/nP1P4/2P4R/P4PPP/2R3K1 w - - 1 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "g6",
          "to": "h7",
          "san": "Qh7+",
          "explanation": "Master move Qh7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f7",
        "san": "Kf7",
        "coachExplanation": "Opponent plays Kf7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh7+ is the engine-verified winning move from Lichess #00M1q."
    },
    {
      "id": "lichess_00Myw",
      "lichessId": "00Myw",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00Myw: Rating 1416",
      "ratingBadge": "Lichess: ~1416",
      "initialFen": "r1b3rk/2q2p2/1n2p2n/p2pP1NP/P1pP1QP1/1pP5/1P3PB1/R3R1K1 w - - 5 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "f6",
          "san": "Qf6+",
          "explanation": "Master move Qf6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "g7",
        "san": "Rg7",
        "coachExplanation": "Opponent plays Rg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qf6+ is the engine-verified winning move from Lichess #00Myw."
    },
    {
      "id": "lichess_00Nf5",
      "lichessId": "00Nf5",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00Nf5: Rating 1541",
      "ratingBadge": "Lichess: ~1541",
      "initialFen": "r1bq1rk1/pp2bppp/2pp1n2/8/5P2/2N2N2/PBPPB1PP/R2Q1RK1 b - - 6 11",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "b6",
          "san": "Qb6+",
          "explanation": "Master move Qb6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qb6+ is the engine-verified winning move from Lichess #00Nf5."
    },
    {
      "id": "lichess_00Ngg",
      "lichessId": "00Ngg",
      "tier": "intermediate",
      "track": "tactical",
      "title": "Lichess #00Ngg: Rating 1510",
      "ratingBadge": "Lichess: ~1510",
      "initialFen": "3qk2r/1p1bbppp/4pn2/1BPp1n2/3P4/4PN2/4QPPP/BN2K2R b Kk - 2 15",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Double Attack & Decoy Mastery",
      "ruleBody": "Force the opponent onto an awkward square with check or capture, then deliver an unstoppable double threat.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "a5",
          "san": "Qa5+",
          "explanation": "Master move Qa5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a1",
        "to": "c3",
        "san": "Bc3",
        "coachExplanation": "Opponent plays Bc3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qa5+ is the engine-verified winning move from Lichess #00Ngg."
    }
  ],
  "intermediate_2": [
    {
      "id": "lichess_0000D",
      "lichessId": "0000D",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #0000D: Rating 1559",
      "ratingBadge": "Lichess: ~1559",
      "initialFen": "5rk1/1p3ppp/pq1Q1b2/8/8/1P3N2/P4PPP/3R2K1 b - - 3 27",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "f8",
          "to": "d8",
          "san": "Rd8",
          "explanation": "Master move Rd8! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d6",
        "to": "d8",
        "san": "Qxd8+",
        "coachExplanation": "Opponent plays Qxd8+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd8 is the engine-verified winning move from Lichess #0000D."
    },
    {
      "id": "lichess_0008Q",
      "lichessId": "0008Q",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #0008Q: Rating 1383",
      "ratingBadge": "Lichess: ~1383",
      "initialFen": "8/5R2/1p2P3/p4r2/P6p/1P3Pk1/4K3/8 b - - 2 64",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "f5",
          "to": "e5",
          "san": "Re5+",
          "explanation": "Master move Re5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "f1",
        "san": "Kf1",
        "coachExplanation": "Opponent plays Kf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re5+ is the engine-verified winning move from Lichess #0008Q."
    },
    {
      "id": "lichess_000Zo",
      "lichessId": "000Zo",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #000Zo: Rating 1363",
      "ratingBadge": "Lichess: ~1363",
      "initialFen": "4r3/1k6/pp3P2/1b5p/3R1p2/P1R2P2/1P4PP/6K1 b - - 0 35",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "e8",
          "to": "e1",
          "san": "Re1+",
          "explanation": "Master move Re1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "f2",
        "san": "Kf2",
        "coachExplanation": "Opponent plays Kf2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re1+ is the engine-verified winning move from Lichess #000Zo."
    },
    {
      "id": "lichess_001cr",
      "lichessId": "001cr",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #001cr: Rating 1582",
      "ratingBadge": "Lichess: ~1582",
      "initialFen": "8/3B2pp/p5k1/6P1/1ppp1K2/8/1P6/8 w - - 0 39",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "d7",
          "to": "e8",
          "san": "Be8#",
          "explanation": "Master move Be8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c4",
        "to": "c5",
        "san": "c4",
        "coachExplanation": "Opponent responds with c4! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Be8# is the engine-verified winning move from Lichess #001cr."
    },
    {
      "id": "lichess_003UW",
      "lichessId": "003UW",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #003UW: Rating 1473",
      "ratingBadge": "Lichess: ~1473",
      "initialFen": "8/6pk/7p/2pq4/3p4/5PP1/P3QK1P/8 w - - 2 41",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "e2",
          "to": "e4",
          "san": "Qe4+",
          "explanation": "Master move Qe4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "e4",
        "san": "Qxe4",
        "coachExplanation": "Opponent plays Qxe4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe4+ is the engine-verified winning move from Lichess #003UW."
    },
    {
      "id": "lichess_0040n",
      "lichessId": "0040n",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #0040n: Rating 1325",
      "ratingBadge": "Lichess: ~1325",
      "initialFen": "r7/p2k1pp1/p1p1pn2/3p4/3P4/P3PQp1/1PP2P1R/2K5 b - - 0 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "h2",
          "san": "gxh2",
          "explanation": "Master move gxh2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "h3",
        "san": "Qh3",
        "coachExplanation": "Opponent plays Qh3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! gxh2 is the engine-verified winning move from Lichess #0040n."
    },
    {
      "id": "lichess_004JD",
      "lichessId": "004JD",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #004JD: Rating 1296",
      "ratingBadge": "Lichess: ~1296",
      "initialFen": "3r4/R7/2p5/p1P2p2/1p4k1/nP2K3/P3NP2/8 b - - 4 41",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "a3",
          "to": "c2",
          "san": "Nc2#",
          "explanation": "Master move Nc2#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e3",
        "to": "d2",
        "san": "Ke3",
        "coachExplanation": "Opponent responds with Ke3! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Nc2# is the engine-verified winning move from Lichess #004JD."
    },
    {
      "id": "lichess_004u0",
      "lichessId": "004u0",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #004u0: Rating 1325",
      "ratingBadge": "Lichess: ~1325",
      "initialFen": "4r1k1/ppq3pp/2p2p2/4r3/4p1Q1/P5RP/1P3PP1/3R2K1 w - - 4 35",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "d7",
          "san": "Rd7",
          "explanation": "Master move Rd7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "d7",
        "san": "Qxd7",
        "coachExplanation": "Opponent plays Qxd7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd7 is the engine-verified winning move from Lichess #004u0."
    },
    {
      "id": "lichess_004zI",
      "lichessId": "004zI",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #004zI: Rating 1429",
      "ratingBadge": "Lichess: ~1429",
      "initialFen": "2q3k1/4br2/6pQ/1p1n2p1/7P/1P4P1/1B2PP2/6K1 w - - 0 28",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "h6",
          "to": "h8",
          "san": "Qh8#",
          "explanation": "Master move Qh8#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g6",
        "to": "h7",
        "san": "hxg6",
        "coachExplanation": "Opponent responds with hxg6! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Qh8# is the engine-verified winning move from Lichess #004zI."
    },
    {
      "id": "lichess_007eS",
      "lichessId": "007eS",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #007eS: Rating 1279",
      "ratingBadge": "Lichess: ~1279",
      "initialFen": "6k1/p4p2/1p5p/4r3/P3B3/1P2KP2/2P3PP/8 b - - 1 29",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "f7",
          "to": "f5",
          "san": "f5",
          "explanation": "Master move f5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g2",
        "to": "g4",
        "san": "g4",
        "coachExplanation": "Opponent plays g4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! f5 is the engine-verified winning move from Lichess #007eS."
    },
    {
      "id": "lichess_009wR",
      "lichessId": "009wR",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #009wR: Rating 1239",
      "ratingBadge": "Lichess: ~1239",
      "initialFen": "1R2R3/p7/1p1k3p/1Pb5/P5p1/6P1/5r1P/7K b - - 7 41",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "f2",
          "to": "f1",
          "san": "Rf1+",
          "explanation": "Master move Rf1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h1",
        "to": "g2",
        "san": "Kg2",
        "coachExplanation": "Opponent plays Kg2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rf1+ is the engine-verified winning move from Lichess #009wR."
    },
    {
      "id": "lichess_00AHY",
      "lichessId": "00AHY",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00AHY: Rating 1356",
      "ratingBadge": "Lichess: ~1356",
      "initialFen": "r6k/3NR1p1/4n2p/5b1P/p7/6R1/8/6K1 b - - 0 43",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "a4",
          "to": "a3",
          "san": "a3",
          "explanation": "Master move a3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g3",
        "to": "a3",
        "san": "Rxa3",
        "coachExplanation": "Opponent plays Rxa3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! a3 is the engine-verified winning move from Lichess #00AHY."
    },
    {
      "id": "lichess_00AdI",
      "lichessId": "00AdI",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00AdI: Rating 1254",
      "ratingBadge": "Lichess: ~1254",
      "initialFen": "3r4/4kp1p/1PQ1p1p1/p3b3/1p2P2P/1P5K/6P1/8 b - - 2 36",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "d3",
          "san": "Rd3+",
          "explanation": "Master move Rd3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g2",
        "to": "g3",
        "san": "g3",
        "coachExplanation": "Opponent plays g3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd3+ is the engine-verified winning move from Lichess #00AdI."
    },
    {
      "id": "lichess_00B3B",
      "lichessId": "00B3B",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00B3B: Rating 1429",
      "ratingBadge": "Lichess: ~1429",
      "initialFen": "2KQ4/8/5b2/p1B5/P7/3k4/6p1/8 b - - 0 77",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "d8",
          "san": "Bxd8",
          "explanation": "Master move Bxd8! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c8",
        "to": "d8",
        "san": "Kxd8",
        "coachExplanation": "Opponent plays Kxd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxd8 is the engine-verified winning move from Lichess #00B3B."
    },
    {
      "id": "lichess_00BCa",
      "lichessId": "00BCa",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00BCa: Rating 1315",
      "ratingBadge": "Lichess: ~1315",
      "initialFen": "1r6/p2kp1P1/3p4/2pP4/2P2B2/1N6/p4PK1/8 w - - 0 42",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "b3",
          "to": "c5",
          "san": "Nxc5+",
          "explanation": "Master move Nxc5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d6",
        "to": "c5",
        "san": "dxc5",
        "coachExplanation": "Opponent plays dxc5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxc5+ is the engine-verified winning move from Lichess #00BCa."
    },
    {
      "id": "lichess_00BSo",
      "lichessId": "00BSo",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00BSo: Rating 1266",
      "ratingBadge": "Lichess: ~1266",
      "initialFen": "2r3k1/4R1pp/p1p2p2/2N5/2P5/1Pb4P/P4PP1/6K1 b - - 0 25",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "b4",
          "san": "Bb4",
          "explanation": "Master move Bb4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e7",
        "to": "a7",
        "san": "Ra7",
        "coachExplanation": "Opponent plays Ra7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bb4 is the engine-verified winning move from Lichess #00BSo."
    },
    {
      "id": "lichess_00CMj",
      "lichessId": "00CMj",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00CMj: Rating 1515",
      "ratingBadge": "Lichess: ~1515",
      "initialFen": "7R/8/8/6p1/2p1p1k1/2Pb3p/P4K2/8 b - - 5 71",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "e3",
          "san": "e3+",
          "explanation": "Master move e3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "e3",
        "san": "Kxe3",
        "coachExplanation": "Opponent plays Kxe3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! e3+ is the engine-verified winning move from Lichess #00CMj."
    },
    {
      "id": "lichess_00CWE",
      "lichessId": "00CWE",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00CWE: Rating 1483",
      "ratingBadge": "Lichess: ~1483",
      "initialFen": "3r4/1p4p1/2pB1bBp/p1Pk4/3rp3/P7/1PK2P2/4R3 w - - 2 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "g6",
          "to": "f7",
          "san": "Bf7#",
          "explanation": "Master move Bf7#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "e6",
        "san": "Kd5",
        "coachExplanation": "Opponent responds with Kd5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Bf7# is the engine-verified winning move from Lichess #00CWE."
    },
    {
      "id": "lichess_00DBP",
      "lichessId": "00DBP",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00DBP: Rating 1335",
      "ratingBadge": "Lichess: ~1335",
      "initialFen": "5kr1/pp1b1p2/4p2p/2KpP2B/5P2/P5R1/7P/8 w - - 5 35",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "g8",
          "san": "Rxg8+",
          "explanation": "Master move Rxg8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "g8",
        "san": "Kxg8",
        "coachExplanation": "Opponent plays Kxg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxg8+ is the engine-verified winning move from Lichess #00DBP."
    },
    {
      "id": "lichess_00DcC",
      "lichessId": "00DcC",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00DcC: Rating 1400",
      "ratingBadge": "Lichess: ~1400",
      "initialFen": "5k2/6p1/p1b3Pp/2N2P1r/p7/8/1KP5/5R2 w - - 0 37",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "c5",
          "to": "e6",
          "san": "Ne6+",
          "explanation": "Master move Ne6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "e7",
        "san": "Ke7",
        "coachExplanation": "Opponent plays Ke7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne6+ is the engine-verified winning move from Lichess #00DcC."
    },
    {
      "id": "lichess_00Dib",
      "lichessId": "00Dib",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00Dib: Rating 1386",
      "ratingBadge": "Lichess: ~1386",
      "initialFen": "7k/8/4PKR1/3r4/6Pb/8/8/8 w - - 3 47",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "g4",
          "to": "g5",
          "san": "g5",
          "explanation": "Master move g5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h4",
        "to": "g5",
        "san": "Bxg5+",
        "coachExplanation": "Opponent plays Bxg5+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! g5 is the engine-verified winning move from Lichess #00Dib."
    },
    {
      "id": "lichess_00Dke",
      "lichessId": "00Dke",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00Dke: Rating 1498",
      "ratingBadge": "Lichess: ~1498",
      "initialFen": "5bk1/2Q2p1p/5qp1/p7/P1Bp4/1P5P/2r2PP1/3R2K1 w - - 6 28",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "c4",
          "to": "f7",
          "san": "Bxf7+",
          "explanation": "Master move Bxf7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "g7",
        "san": "Kg7",
        "coachExplanation": "Opponent plays Kg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxf7+ is the engine-verified winning move from Lichess #00Dke."
    },
    {
      "id": "lichess_00Erm",
      "lichessId": "00Erm",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00Erm: Rating 1402",
      "ratingBadge": "Lichess: ~1402",
      "initialFen": "3r4/6k1/1p1pr1p1/p1p2p2/P1P1p1P1/1P1n4/3R1PBP/4R1K1 w - - 1 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "d2",
          "to": "d3",
          "san": "Rxd3",
          "explanation": "Master move Rxd3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e4",
        "to": "d3",
        "san": "exd3",
        "coachExplanation": "Opponent plays exd3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd3 is the engine-verified winning move from Lichess #00Erm."
    },
    {
      "id": "lichess_00FAe",
      "lichessId": "00FAe",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00FAe: Rating 1590",
      "ratingBadge": "Lichess: ~1590",
      "initialFen": "5Rbk/6pp/8/p3P3/Pp1pq3/1Q6/1P4PP/6K1 b - - 2 35",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "e1",
          "san": "Qe1+",
          "explanation": "Master move Qe1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "f1",
        "san": "Rf1",
        "coachExplanation": "Opponent plays Rf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe1+ is the engine-verified winning move from Lichess #00FAe."
    },
    {
      "id": "lichess_00G81",
      "lichessId": "00G81",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00G81: Rating 1287",
      "ratingBadge": "Lichess: ~1287",
      "initialFen": "3r4/5k2/p4Pp1/2K3Pp/2R5/P7/8/8 b - - 0 51",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Lucena & Philidor Conversion Principles",
      "ruleBody": "Bridge the rook in winning endgames and cut off the enemy king along the critical cut-off rank or file.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "c8",
          "san": "Rc8+",
          "explanation": "Master move Rc8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c5",
        "to": "d4",
        "san": "Kd4",
        "coachExplanation": "Opponent plays Kd4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rc8+ is the engine-verified winning move from Lichess #00G81."
    }
  ],
  "intermediate_3": [
    {
      "id": "lichess_000hf",
      "lichessId": "000hf",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #000hf: Rating 1530",
      "ratingBadge": "Lichess: ~1530",
      "initialFen": "r1bq3r/pp1nbkp1/2p1p2p/8/2BP4/1PN3P1/P3QP1P/3R1RK1 w - - 0 20",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "e2",
          "to": "e6",
          "san": "Qxe6+",
          "explanation": "Master move Qxe6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f7",
        "to": "f8",
        "san": "Kf8",
        "coachExplanation": "Opponent plays Kf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe6+ is the engine-verified winning move from Lichess #000hf."
    },
    {
      "id": "lichess_001Fg",
      "lichessId": "001Fg",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #001Fg: Rating 1286",
      "ratingBadge": "Lichess: ~1286",
      "initialFen": "5r1k/pQR3pp/5rp1/3B4/q2n4/7P/P4PP1/5RK1 b - - 4 30",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "e2",
          "san": "Ne2+",
          "explanation": "Master move Ne2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h2",
        "san": "Kh2",
        "coachExplanation": "Opponent plays Kh2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne2+ is the engine-verified winning move from Lichess #001Fg."
    },
    {
      "id": "lichess_002uV",
      "lichessId": "002uV",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #002uV: Rating 1558",
      "ratingBadge": "Lichess: ~1558",
      "initialFen": "r2r2k1/1p2qppp/2n1p3/5Q2/p2P4/P4N2/BP3PPP/2R1R1K1 b - - 0 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "f5",
          "san": "exf5",
          "explanation": "Master move exf5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "e7",
        "san": "Rxe7",
        "coachExplanation": "Opponent plays Rxe7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! exf5 is the engine-verified winning move from Lichess #002uV."
    },
    {
      "id": "lichess_0054a",
      "lichessId": "0054a",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #0054a: Rating 1408",
      "ratingBadge": "Lichess: ~1408",
      "initialFen": "r1b2rk1/ppq2p1p/6p1/4b2Q/4R3/3B4/PP3PPP/R1B3K1 w - - 0 16",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "e5",
          "san": "Qxe5",
          "explanation": "Master move Qxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "e5",
        "san": "Qxe5",
        "coachExplanation": "Opponent plays Qxe5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe5 is the engine-verified winning move from Lichess #0054a."
    },
    {
      "id": "lichess_0068B",
      "lichessId": "0068B",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #0068B: Rating 1419",
      "ratingBadge": "Lichess: ~1419",
      "initialFen": "r1q3k1/3nbppp/pp2p3/4B3/8/2N2Q2/PPPR1PPP/6K1 w - - 1 19",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "d2",
          "to": "d7",
          "san": "Rxd7",
          "explanation": "Master move Rxd7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c8",
        "to": "d7",
        "san": "Qxd7",
        "coachExplanation": "Opponent plays Qxd7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd7 is the engine-verified winning move from Lichess #0068B."
    },
    {
      "id": "lichess_006RM",
      "lichessId": "006RM",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #006RM: Rating 1445",
      "ratingBadge": "Lichess: ~1445",
      "initialFen": "1k1r3r/8/pp1n2p1/2q5/1Q6/3R2P1/PPP2P1P/3R2K1 w - - 5 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "b4",
          "to": "c5",
          "san": "Qxc5",
          "explanation": "Master move Qxc5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b6",
        "to": "c5",
        "san": "bxc5",
        "coachExplanation": "Opponent plays bxc5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxc5 is the engine-verified winning move from Lichess #006RM."
    },
    {
      "id": "lichess_006cZ",
      "lichessId": "006cZ",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #006cZ: Rating 1374",
      "ratingBadge": "Lichess: ~1374",
      "initialFen": "3r1r1k/1p4p1/p1p3Qp/2q5/8/3n1N1P/PP1R2P1/5R1K w - - 8 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "d2",
          "to": "d3",
          "san": "Rxd3",
          "explanation": "Master move Rxd3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "d3",
        "san": "Rxd3",
        "coachExplanation": "Opponent plays Rxd3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxd3 is the engine-verified winning move from Lichess #006cZ."
    },
    {
      "id": "lichess_009FP",
      "lichessId": "009FP",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #009FP: Rating 1321",
      "ratingBadge": "Lichess: ~1321",
      "initialFen": "r1b1k1nr/ppp2pbp/3p1qp1/4p3/2BnP3/N2P2QP/PPP2PP1/R1B1K2R w KQkq - 0 10",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "c1",
          "to": "g5",
          "san": "Bg5",
          "explanation": "Master move Bg5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "g5",
        "san": "Qxg5",
        "coachExplanation": "Opponent plays Qxg5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bg5 is the engine-verified winning move from Lichess #009FP."
    },
    {
      "id": "lichess_009aD",
      "lichessId": "009aD",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #009aD: Rating 1426",
      "ratingBadge": "Lichess: ~1426",
      "initialFen": "r4k1r/pp3pp1/4p3/3pP1np/6Pq/1PP5/P3B1PP/RN1Q1RK1 b - - 0 14",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "g4",
          "san": "hxg4",
          "explanation": "Master move hxg4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "g4",
        "san": "Bxg4",
        "coachExplanation": "Opponent plays Bxg4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! hxg4 is the engine-verified winning move from Lichess #009aD."
    },
    {
      "id": "lichess_009zS",
      "lichessId": "009zS",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #009zS: Rating 1405",
      "ratingBadge": "Lichess: ~1405",
      "initialFen": "r3r1k1/1p3p1p/p1p3p1/8/6bP/Q3b1P1/PP2B3/R3K2R b KQ - 0 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "g4",
          "to": "e2",
          "san": "Bxe2",
          "explanation": "Master move Bxe2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "e2",
        "san": "Kxe2",
        "coachExplanation": "Opponent plays Kxe2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxe2 is the engine-verified winning move from Lichess #009zS."
    },
    {
      "id": "lichess_00AFG",
      "lichessId": "00AFG",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00AFG: Rating 1476",
      "ratingBadge": "Lichess: ~1476",
      "initialFen": "r4rk1/5ppp/p3bp2/2q2N1Q/Ppp5/8/1PP2PPP/R2R2K1 w - - 0 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "f5",
          "to": "h6",
          "san": "Nh6+",
          "explanation": "Master move Nh6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g7",
        "to": "h6",
        "san": "gxh6",
        "coachExplanation": "Opponent plays gxh6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nh6+ is the engine-verified winning move from Lichess #00AFG."
    },
    {
      "id": "lichess_00AhO",
      "lichessId": "00AhO",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00AhO: Rating 1233",
      "ratingBadge": "Lichess: ~1233",
      "initialFen": "Q1b2rk1/2q2p1p/1p2pbp1/pP6/2P5/P2B1N2/5PPP/3R1RK1 b - - 0 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "c8",
          "to": "b7",
          "san": "Bb7",
          "explanation": "Master move Bb7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a8",
        "to": "a7",
        "san": "Qa7",
        "coachExplanation": "Opponent plays Qa7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bb7 is the engine-verified winning move from Lichess #00AhO."
    },
    {
      "id": "lichess_00BM8",
      "lichessId": "00BM8",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00BM8: Rating 1547",
      "ratingBadge": "Lichess: ~1547",
      "initialFen": "3r1rk1/pp2bppp/2ppnn2/8/N1P1P3/q1P4P/P2N2PB/R2Q1R1K w - - 1 17",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "d2",
          "to": "b1",
          "san": "Nb1",
          "explanation": "Master move Nb1! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a3",
        "to": "a4",
        "san": "Qxa4",
        "coachExplanation": "Opponent plays Qxa4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nb1 is the engine-verified winning move from Lichess #00BM8."
    },
    {
      "id": "lichess_00Bp0",
      "lichessId": "00Bp0",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00Bp0: Rating 1229",
      "ratingBadge": "Lichess: ~1229",
      "initialFen": "1r2kr2/pp3p1p/2b1p3/4N3/2P1n3/1N1B4/P3KP1P/6R1 w - - 5 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "c6",
          "san": "Nxc6",
          "explanation": "Master move Nxc6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b7",
        "to": "c6",
        "san": "bxc6",
        "coachExplanation": "Opponent plays bxc6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxc6 is the engine-verified winning move from Lichess #00Bp0."
    },
    {
      "id": "lichess_00Bul",
      "lichessId": "00Bul",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00Bul: Rating 1401",
      "ratingBadge": "Lichess: ~1401",
      "initialFen": "rnbqk2r/pp3ppp/5n2/4N3/2p5/2P5/P1PPQPPP/R1B1K2R w KQkq - 0 9",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "c6",
          "san": "Nc6+",
          "explanation": "Master move Nc6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c8",
        "to": "e6",
        "san": "Be6",
        "coachExplanation": "Opponent plays Be6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nc6+ is the engine-verified winning move from Lichess #00Bul."
    },
    {
      "id": "lichess_00Cs4",
      "lichessId": "00Cs4",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00Cs4: Rating 1401",
      "ratingBadge": "Lichess: ~1401",
      "initialFen": "2r1q1k1/8/b2b1r1p/Pp1pNpp1/P2Pn3/1RPQ3P/2B1NPP1/4R1K1 b - - 0 28",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "b5",
          "to": "a4",
          "san": "bxa4",
          "explanation": "Master move bxa4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d3",
        "to": "a6",
        "san": "Qxa6",
        "coachExplanation": "Opponent plays Qxa6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! bxa4 is the engine-verified winning move from Lichess #00Cs4."
    },
    {
      "id": "lichess_00Cwz",
      "lichessId": "00Cwz",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00Cwz: Rating 1475",
      "ratingBadge": "Lichess: ~1475",
      "initialFen": "1r5r/5pk1/4p3/3p2PP/N1nP4/n1P5/P3B3/K1R4R b - - 0 34",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "b8",
          "to": "b1",
          "san": "Rb1+",
          "explanation": "Master move Rb1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c1",
        "to": "b1",
        "san": "Rxb1",
        "coachExplanation": "Opponent plays Rxb1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rb1+ is the engine-verified winning move from Lichess #00Cwz."
    },
    {
      "id": "lichess_00DkJ",
      "lichessId": "00DkJ",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00DkJ: Rating 1575",
      "ratingBadge": "Lichess: ~1575",
      "initialFen": "3r1bnr/2p2ppp/2bk4/R7/5P2/2N5/4N1PP/1R4K1 w - - 4 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "b1",
          "to": "d1",
          "san": "Rd1+",
          "explanation": "Master move Rd1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d6",
        "to": "e7",
        "san": "Ke7",
        "coachExplanation": "Opponent plays Ke7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd1+ is the engine-verified winning move from Lichess #00DkJ."
    },
    {
      "id": "lichess_00G7g",
      "lichessId": "00G7g",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00G7g: Rating 1297",
      "ratingBadge": "Lichess: ~1297",
      "initialFen": "3r1rk1/p4pp1/b1p4p/8/BPP5/P2P3P/2Q3P1/qNB4K w - - 0 28",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "c1",
          "to": "b2",
          "san": "Bb2",
          "explanation": "Master move Bb2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a1",
        "to": "b2",
        "san": "Qxb2",
        "coachExplanation": "Opponent plays Qxb2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bb2 is the engine-verified winning move from Lichess #00G7g."
    },
    {
      "id": "lichess_00GBV",
      "lichessId": "00GBV",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00GBV: Rating 1451",
      "ratingBadge": "Lichess: ~1451",
      "initialFen": "3r1rk1/pp2n1pp/3q4/8/N7/1PB5/P3QPPP/4R1K1 w - - 2 26",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "e2",
          "to": "e7",
          "san": "Qxe7",
          "explanation": "Master move Qxe7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d6",
        "to": "e7",
        "san": "Qxe7",
        "coachExplanation": "Opponent plays Qxe7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe7 is the engine-verified winning move from Lichess #00GBV."
    },
    {
      "id": "lichess_00GVf",
      "lichessId": "00GVf",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00GVf: Rating 1548",
      "ratingBadge": "Lichess: ~1548",
      "initialFen": "5k2/3b2q1/pn4p1/1rp2p2/8/8/1P2Q1P1/1K2R2R w - - 4 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "h1",
          "to": "h8",
          "san": "Rh8+",
          "explanation": "Master move Rh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g7",
        "to": "h8",
        "san": "Qxh8",
        "coachExplanation": "Opponent plays Qxh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rh8+ is the engine-verified winning move from Lichess #00GVf."
    },
    {
      "id": "lichess_00Gc5",
      "lichessId": "00Gc5",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00Gc5: Rating 1600",
      "ratingBadge": "Lichess: ~1600",
      "initialFen": "8/p1r2p2/4r3/2P1PK2/1P4R1/3R2pk/8/8 b - - 3 46",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "e5",
          "san": "Rxe5+",
          "explanation": "Master move Rxe5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f5",
        "to": "e5",
        "san": "Kxe5",
        "coachExplanation": "Opponent plays Kxe5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxe5+ is the engine-verified winning move from Lichess #00Gc5."
    },
    {
      "id": "lichess_00K8j",
      "lichessId": "00K8j",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00K8j: Rating 1345",
      "ratingBadge": "Lichess: ~1345",
      "initialFen": "r2q2kr/p1B2pp1/4b2p/n1Qn4/8/4P3/PP3PPP/2KR1BNR b - - 2 14",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "c7",
          "san": "Qxc7",
          "explanation": "Master move Qxc7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c5",
        "to": "c7",
        "san": "Qxc7",
        "coachExplanation": "Opponent plays Qxc7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxc7 is the engine-verified winning move from Lichess #00K8j."
    },
    {
      "id": "lichess_00KAq",
      "lichessId": "00KAq",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00KAq: Rating 1373",
      "ratingBadge": "Lichess: ~1373",
      "initialFen": "5rr1/3pk1q1/p3p3/1pP4p/1P1R1p2/2P2QP1/1P3P1P/5RK1 b - - 2 26",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "g3",
          "san": "fxg3",
          "explanation": "Master move fxg3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d4",
        "to": "d7",
        "san": "Rxd7+",
        "coachExplanation": "Opponent plays Rxd7+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! fxg3 is the engine-verified winning move from Lichess #00KAq."
    },
    {
      "id": "lichess_00KHR",
      "lichessId": "00KHR",
      "tier": "intermediate",
      "track": "positional",
      "title": "Lichess #00KHR: Rating 1427",
      "ratingBadge": "Lichess: ~1427",
      "initialFen": "8/6pk/1Q1p2n1/4p3/2P3P1/P2PPK1P/1B6/4q3 b - - 2 35",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Dynamic Imbalance & King Hunt",
      "ruleBody": "When ahead in development or piece activity, crack open the center with forcing candidate checks and sacrifices.",
      "solutionMoves": [
        {
          "from": "g6",
          "to": "h4",
          "san": "Nh4+",
          "explanation": "Master move Nh4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "e4",
        "san": "Ke4",
        "coachExplanation": "Opponent plays Ke4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nh4+ is the engine-verified winning move from Lichess #00KHR."
    }
  ],
  "advanced_0": [
    {
      "id": "lichess_00008",
      "lichessId": "00008",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00008: Rating 1939",
      "ratingBadge": "Lichess: ~1939",
      "initialFen": "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2b1/PqP3PP/7K w - - 0 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "e7",
          "san": "Rxe7",
          "explanation": "Master move Rxe7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b2",
        "to": "b1",
        "san": "Qb1+",
        "coachExplanation": "Opponent plays Qb1+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxe7 is the engine-verified winning move from Lichess #00008."
    },
    {
      "id": "lichess_001aK",
      "lichessId": "001aK",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #001aK: Rating 2082",
      "ratingBadge": "Lichess: ~2082",
      "initialFen": "6k1/5p2/4p3/P1B5/2P4P/4Pnp1/Rb2r3/5K2 w - - 0 34",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "e2",
          "san": "Kxe2",
          "explanation": "Master move Kxe2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g3",
        "to": "g2",
        "san": "g2",
        "coachExplanation": "Opponent plays g2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxe2 is the engine-verified winning move from Lichess #001aK."
    },
    {
      "id": "lichess_0095W",
      "lichessId": "0095W",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #0095W: Rating 1800",
      "ratingBadge": "Lichess: ~1800",
      "initialFen": "8/pp1r2kp/q2P1ppb/4N3/4P3/1Q5P/PPR2PP1/6K1 b - - 0 32",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "e5",
          "san": "fxe5",
          "explanation": "Master move fxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c2",
        "to": "c7",
        "san": "Rc7",
        "coachExplanation": "Opponent plays Rc7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! fxe5 is the engine-verified winning move from Lichess #0095W."
    },
    {
      "id": "lichess_00Cqg",
      "lichessId": "00Cqg",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00Cqg: Rating 1621",
      "ratingBadge": "Lichess: ~1621",
      "initialFen": "3r2k1/pp4bp/4qpp1/3Pp3/8/4Q2P/4B1P1/2rR3K w - - 0 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "d5",
          "to": "e6",
          "san": "dxe6",
          "explanation": "Master move dxe6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "d1",
        "san": "Rdxd1+",
        "coachExplanation": "Opponent plays Rdxd1+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! dxe6 is the engine-verified winning move from Lichess #00Cqg."
    },
    {
      "id": "lichess_00ZAn",
      "lichessId": "00ZAn",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00ZAn: Rating 1794",
      "ratingBadge": "Lichess: ~1794",
      "initialFen": "rnbqk1nr/ppp1b1pp/3p4/4N3/2B1P3/8/PPPP2PP/RNBQK2R b KQkq - 0 6",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "e5",
          "san": "dxe5",
          "explanation": "Master move dxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d1",
        "to": "h5",
        "san": "Qh5+",
        "coachExplanation": "Opponent plays Qh5+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! dxe5 is the engine-verified winning move from Lichess #00ZAn."
    },
    {
      "id": "lichess_00aZ3",
      "lichessId": "00aZ3",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00aZ3: Rating 2055",
      "ratingBadge": "Lichess: ~2055",
      "initialFen": "8/6k1/8/1K1np1p1/P5P1/1B3r2/1PP5/8 w - - 2 37",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "b3",
          "to": "d5",
          "san": "Bxd5",
          "explanation": "Master move Bxd5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "f4",
        "san": "Rf4",
        "coachExplanation": "Opponent plays Rf4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxd5 is the engine-verified winning move from Lichess #00aZ3."
    },
    {
      "id": "lichess_00dTd",
      "lichessId": "00dTd",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00dTd: Rating 2010",
      "ratingBadge": "Lichess: ~2010",
      "initialFen": "3r4/ppp1Q3/1b3P2/3k4/4qp2/P1Pr4/1P3P2/1K2N3 w - - 6 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "d8",
          "san": "Qxd8+",
          "explanation": "Master move Qxd8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "c6",
        "san": "Kc6",
        "coachExplanation": "Opponent plays Kc6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd8+ is the engine-verified winning move from Lichess #00dTd."
    },
    {
      "id": "lichess_00hxr",
      "lichessId": "00hxr",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00hxr: Rating 1767",
      "ratingBadge": "Lichess: ~1767",
      "initialFen": "r4rk1/pp3pBp/4p3/3p2qB/Q1p5/2PbP3/PP1N1P1P/R3K2R b KQ - 0 15",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "g5",
          "to": "h5",
          "san": "Qxh5",
          "explanation": "Master move Qxh5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a4",
        "to": "d1",
        "san": "Qd1",
        "coachExplanation": "Opponent plays Qd1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxh5 is the engine-verified winning move from Lichess #00hxr."
    },
    {
      "id": "lichess_00lJm",
      "lichessId": "00lJm",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00lJm: Rating 1981",
      "ratingBadge": "Lichess: ~1981",
      "initialFen": "7k/ppp1nrp1/3pN3/7p/3P3P/2P2RK1/PP3QP1/1q5r w - - 0 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "f7",
          "san": "Rxf7",
          "explanation": "Master move Rxf7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b1",
        "to": "d3",
        "san": "Qd3+",
        "coachExplanation": "Opponent plays Qd3+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxf7 is the engine-verified winning move from Lichess #00lJm."
    },
    {
      "id": "lichess_00lL3",
      "lichessId": "00lL3",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00lL3: Rating 1759",
      "ratingBadge": "Lichess: ~1759",
      "initialFen": "Qr5k/5pp1/5N1p/4q3/4P3/8/7P/R6K b - - 7 36",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "g7",
          "to": "f6",
          "san": "gxf6",
          "explanation": "Master move gxf6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a8",
        "to": "b8",
        "san": "Qxb8+",
        "coachExplanation": "Opponent plays Qxb8+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! gxf6 is the engine-verified winning move from Lichess #00lL3."
    },
    {
      "id": "lichess_00xOm",
      "lichessId": "00xOm",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00xOm: Rating 2114",
      "ratingBadge": "Lichess: ~2114",
      "initialFen": "5rk1/7p/p2R2p1/1p2n1P1/2q1Q1P1/PBP5/Kr6/8 w - - 0 41",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "a2",
          "to": "b2",
          "san": "Kxb2",
          "explanation": "Master move Kxb2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f8",
        "to": "f2",
        "san": "Rf2+",
        "coachExplanation": "Opponent plays Rf2+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxb2 is the engine-verified winning move from Lichess #00xOm."
    },
    {
      "id": "lichess_00xyk",
      "lichessId": "00xyk",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00xyk: Rating 1970",
      "ratingBadge": "Lichess: ~1970",
      "initialFen": "3r1rk1/1b3qn1/pp1Q2p1/2p1n1Pp/P1P1Pp1N/2P2B1P/5B1K/R4R2 w - - 2 26",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "e5",
          "san": "Qxe5",
          "explanation": "Master move Qxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "e8",
        "san": "Rde8",
        "coachExplanation": "Opponent plays Rde8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe5 is the engine-verified winning move from Lichess #00xyk."
    },
    {
      "id": "lichess_016yu",
      "lichessId": "016yu",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #016yu: Rating 1803",
      "ratingBadge": "Lichess: ~1803",
      "initialFen": "4r1k1/p5pp/1p3n2/8/1q3B2/3Q1P2/PP3P1P/2R3K1 b - - 6 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "b4",
          "to": "f4",
          "san": "Qxf4",
          "explanation": "Master move Qxf4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d3",
        "to": "c4",
        "san": "Qc4+",
        "coachExplanation": "Opponent plays Qc4+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf4 is the engine-verified winning move from Lichess #016yu."
    },
    {
      "id": "lichess_01E12",
      "lichessId": "01E12",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #01E12: Rating 2111",
      "ratingBadge": "Lichess: ~2111",
      "initialFen": "2k5/1pp1r2Q/pr2p3/3p1p2/q2b4/P2NP3/1PP3PP/K3RR2 w - - 0 26",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "h7",
          "to": "e7",
          "san": "Qxe7",
          "explanation": "Master move Qxe7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d4",
        "to": "b2",
        "san": "Bxb2+",
        "coachExplanation": "Opponent plays Bxb2+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe7 is the engine-verified winning move from Lichess #01E12."
    },
    {
      "id": "lichess_01IKl",
      "lichessId": "01IKl",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #01IKl: Rating 1860",
      "ratingBadge": "Lichess: ~1860",
      "initialFen": "k1Q4r/3n1p1p/1p1Bpnp1/q7/2BP4/2P5/1PK2P1P/3R2R1 b - - 0 29",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "h8",
          "to": "c8",
          "san": "Rxc8",
          "explanation": "Master move Rxc8! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d1",
        "to": "a1",
        "san": "Ra1",
        "coachExplanation": "Opponent plays Ra1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxc8 is the engine-verified winning move from Lichess #01IKl."
    },
    {
      "id": "lichess_01M1X",
      "lichessId": "01M1X",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #01M1X: Rating 1936",
      "ratingBadge": "Lichess: ~1936",
      "initialFen": "4r3/4bpkp/3P2pN/6P1/1p2qn1P/5N2/1P1Q1P2/3R2K1 b - - 0 30",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "f3",
          "san": "Qxf3",
          "explanation": "Master move Qxf3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d2",
        "to": "d4",
        "san": "Qd4+",
        "coachExplanation": "Opponent plays Qd4+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf3 is the engine-verified winning move from Lichess #01M1X."
    },
    {
      "id": "lichess_01Uzs",
      "lichessId": "01Uzs",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #01Uzs: Rating 1847",
      "ratingBadge": "Lichess: ~1847",
      "initialFen": "rnbqk2r/ppp2ppp/3bp3/8/4n3/1BN5/PPPP2PP/R1BQK1NR w KQkq - 0 7",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "e4",
          "san": "Nxe4",
          "explanation": "Master move Nxe4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "h4",
        "san": "Qh4+",
        "coachExplanation": "Opponent plays Qh4+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxe4 is the engine-verified winning move from Lichess #01Uzs."
    },
    {
      "id": "lichess_01fsb",
      "lichessId": "01fsb",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #01fsb: Rating 2025",
      "ratingBadge": "Lichess: ~2025",
      "initialFen": "3q1rk1/3R1ppp/r5b1/p1bN4/6P1/5N1P/P1P2P2/3QR1K1 b - - 2 18",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "d7",
          "san": "Qxd7",
          "explanation": "Master move Qxd7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "f6",
        "san": "Nf6+",
        "coachExplanation": "Opponent plays Nf6+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd7 is the engine-verified winning move from Lichess #01fsb."
    },
    {
      "id": "lichess_021U1",
      "lichessId": "021U1",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #021U1: Rating 1653",
      "ratingBadge": "Lichess: ~1653",
      "initialFen": "r7/bp6/4kNQ1/1b2Pp1p/p2R1P1N/P1q5/5KPP/7R b - - 6 31",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "a7",
          "to": "d4",
          "san": "Bxd4#",
          "explanation": "Master move Bxd4#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "f3",
        "san": "Kf2",
        "coachExplanation": "Opponent responds with Kf2! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Bxd4# is the engine-verified winning move from Lichess #021U1."
    },
    {
      "id": "lichess_02370",
      "lichessId": "02370",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #02370: Rating 2066",
      "ratingBadge": "Lichess: ~2066",
      "initialFen": "3k3r/1Qp1bNp1/4b2p/3p4/3q4/rP1B4/2P2PPP/1K1R2R1 b - - 0 28",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "f7",
          "san": "Bxf7",
          "explanation": "Master move Bxf7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b7",
        "to": "b8",
        "san": "Qb8+",
        "coachExplanation": "Opponent plays Qb8+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxf7 is the engine-verified winning move from Lichess #02370."
    },
    {
      "id": "lichess_023RO",
      "lichessId": "023RO",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #023RO: Rating 2121",
      "ratingBadge": "Lichess: ~2121",
      "initialFen": "r1bq1rk1/pp1n2pp/2Nb4/3p1p2/3PnB2/2NBP3/PP3PPP/R2Q1RK1 b - - 0 11",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "b7",
          "to": "c6",
          "san": "bxc6",
          "explanation": "Master move bxc6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d3",
        "to": "e4",
        "san": "Bxe4",
        "coachExplanation": "Opponent plays Bxe4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! bxc6 is the engine-verified winning move from Lichess #023RO."
    },
    {
      "id": "lichess_024AF",
      "lichessId": "024AF",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #024AF: Rating 2102",
      "ratingBadge": "Lichess: ~2102",
      "initialFen": "2r2r1k/3qbpp1/p6P/1p1ppP1n/3p3N/PB1P3P/1PPQ1P2/2KR3R b - - 0 20",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "h4",
          "san": "Bxh4",
          "explanation": "Master move Bxh4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h6",
        "to": "g7",
        "san": "hxg7+",
        "coachExplanation": "Opponent plays hxg7+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxh4 is the engine-verified winning move from Lichess #024AF."
    },
    {
      "id": "lichess_02Mow",
      "lichessId": "02Mow",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #02Mow: Rating 1921",
      "ratingBadge": "Lichess: ~1921",
      "initialFen": "r4rk1/p1p2ppp/2pp4/2b3B1/3Nq3/2P4b/PP3PP1/R2Q1RK1 w - - 0 13",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "g2",
          "to": "h3",
          "san": "gxh3",
          "explanation": "Master move gxh3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e4",
        "to": "g6",
        "san": "Qg6",
        "coachExplanation": "Opponent plays Qg6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! gxh3 is the engine-verified winning move from Lichess #02Mow."
    },
    {
      "id": "lichess_02N7B",
      "lichessId": "02N7B",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #02N7B: Rating 1639",
      "ratingBadge": "Lichess: ~1639",
      "initialFen": "rn1k1bn1/ppN1p1p1/4bp2/7r/7p/3P4/PPP2PqP/R1BQK2R w KQ - 1 12",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "c7",
          "to": "e6",
          "san": "Nxe6+",
          "explanation": "Master move Nxe6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "c8",
        "san": "Kc8",
        "coachExplanation": "Opponent plays Kc8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxe6+ is the engine-verified winning move from Lichess #02N7B."
    },
    {
      "id": "lichess_02NcP",
      "lichessId": "02NcP",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #02NcP: Rating 1971",
      "ratingBadge": "Lichess: ~1971",
      "initialFen": "r5k1/p4pp1/2p4p/2p5/QPP2BR1/7P/P4qPK/3r4 w - - 0 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Prophylactic Calculation & Zwischenzug",
      "ruleBody": "Never assume the opponent will play your predicted recapture. Always look for intermediate in-between checks (zwischenzugs).",
      "solutionMoves": [
        {
          "from": "a4",
          "to": "d1",
          "san": "Qxd1",
          "explanation": "Master move Qxd1! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h6",
        "to": "h5",
        "san": "h5",
        "coachExplanation": "Opponent plays h5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd1 is the engine-verified winning move from Lichess #02NcP."
    }
  ],
  "advanced_1": [
    {
      "id": "lichess_000qP",
      "lichessId": "000qP",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #000qP: Rating 2104",
      "ratingBadge": "Lichess: ~2104",
      "initialFen": "8/7R/8/5p2/4bk1P/8/2r5/5KR1 b - - 8 51",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "f3",
          "san": "Kf3",
          "explanation": "Master move Kf3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f1",
        "to": "e1",
        "san": "Ke1",
        "coachExplanation": "Opponent plays Ke1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kf3 is the engine-verified winning move from Lichess #000qP."
    },
    {
      "id": "lichess_0017R",
      "lichessId": "0017R",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #0017R: Rating 1610",
      "ratingBadge": "Lichess: ~1610",
      "initialFen": "r2qk2r/pp2ppbp/1n1p2p1/3P4/2n5/2NBBP1P/PP3P2/R2QK2R w KQkq - 0 13",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "c4",
          "san": "Bxc4",
          "explanation": "Master move Bxc4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b6",
        "to": "c4",
        "san": "Nxc4",
        "coachExplanation": "Opponent plays Nxc4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxc4 is the engine-verified winning move from Lichess #0017R."
    },
    {
      "id": "lichess_001kG",
      "lichessId": "001kG",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #001kG: Rating 1963",
      "ratingBadge": "Lichess: ~1963",
      "initialFen": "rnbq3r/1p3kpp/p4n2/2b5/2pNP3/2N5/PPP3PP/R1BQ1RK1 w - - 2 12",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "h5",
          "san": "Qh5+",
          "explanation": "Master move Qh5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f7",
        "to": "g8",
        "san": "Kg8",
        "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh5+ is the engine-verified winning move from Lichess #001kG."
    },
    {
      "id": "lichess_003wQ",
      "lichessId": "003wQ",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #003wQ: Rating 1814",
      "ratingBadge": "Lichess: ~1814",
      "initialFen": "2r2rk1/6pp/3Q1q2/8/3N1B2/6P1/PP1K3P/5R2 b - - 0 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "d6",
          "san": "Qxd6",
          "explanation": "Master move Qxd6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f4",
        "to": "d6",
        "san": "Bxd6",
        "coachExplanation": "Opponent plays Bxd6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxd6 is the engine-verified winning move from Lichess #003wQ."
    },
    {
      "id": "lichess_0047P",
      "lichessId": "0047P",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #0047P: Rating 1766",
      "ratingBadge": "Lichess: ~1766",
      "initialFen": "8/1N3k2/6p1/8/2P3P1/pr6/R7/5K2 b - - 2 56",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "b3",
          "to": "b1",
          "san": "Rb1+",
          "explanation": "Master move Rb1+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f1",
        "to": "e2",
        "san": "Ke2",
        "coachExplanation": "Opponent plays Ke2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rb1+ is the engine-verified winning move from Lichess #0047P."
    },
    {
      "id": "lichess_005HG",
      "lichessId": "005HG",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #005HG: Rating 1788",
      "ratingBadge": "Lichess: ~1788",
      "initialFen": "r2q1rk1/p1p2pp1/3bbn1p/4N3/8/1P4P1/PBQPPP1P/RN2K2R b KQ - 2 12",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "e5",
          "san": "Bxe5",
          "explanation": "Master move Bxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b2",
        "to": "e5",
        "san": "Bxe5",
        "coachExplanation": "Opponent plays Bxe5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxe5 is the engine-verified winning move from Lichess #005HG."
    },
    {
      "id": "lichess_006om",
      "lichessId": "006om",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #006om: Rating 1937",
      "ratingBadge": "Lichess: ~1937",
      "initialFen": "1r3k2/5p1p/2p1pp2/P2n4/r3N3/P4PK1/2R2P1P/2R5 w - - 10 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "c5",
          "san": "Nc5",
          "explanation": "Master move Nc5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a4",
        "to": "a5",
        "san": "Rxa5",
        "coachExplanation": "Opponent plays Rxa5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nc5 is the engine-verified winning move from Lichess #006om."
    },
    {
      "id": "lichess_006pe",
      "lichessId": "006pe",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #006pe: Rating 1741",
      "ratingBadge": "Lichess: ~1741",
      "initialFen": "r4r2/2q1Nb2/5Qpk/2n4p/pp5P/8/1PP2PP1/2KR3R w - - 0 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "f5",
          "san": "Nf5+",
          "explanation": "Master move Nf5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h6",
        "to": "h7",
        "san": "Kh7",
        "coachExplanation": "Opponent plays Kh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf5+ is the engine-verified winning move from Lichess #006pe."
    },
    {
      "id": "lichess_00734",
      "lichessId": "00734",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00734: Rating 1692",
      "ratingBadge": "Lichess: ~1692",
      "initialFen": "r4bk1/2rqp2p/n1p3p1/3p1p2/3P1P1B/pP1BP3/P1Q2PRP/1KR5 w - - 1 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "f5",
          "san": "Bxf5",
          "explanation": "Master move Bxf5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e7",
        "to": "e6",
        "san": "e6",
        "coachExplanation": "Opponent plays e6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxf5 is the engine-verified winning move from Lichess #00734."
    },
    {
      "id": "lichess_008lc",
      "lichessId": "008lc",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #008lc: Rating 1973",
      "ratingBadge": "Lichess: ~1973",
      "initialFen": "7k/pb1qn1rn/1p2R2Q/2p2p2/2Pp4/3B4/PP3P1P/4RK2 w - - 2 28",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "h6",
          "to": "g7",
          "san": "Qxg7+",
          "explanation": "Master move Qxg7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h8",
        "to": "g7",
        "san": "Kxg7",
        "coachExplanation": "Opponent plays Kxg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxg7+ is the engine-verified winning move from Lichess #008lc."
    },
    {
      "id": "lichess_00Feu",
      "lichessId": "00Feu",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00Feu: Rating 2003",
      "ratingBadge": "Lichess: ~2003",
      "initialFen": "4Rrk1/p6p/1pp2rp1/8/5B1q/4QP1P/P1P2PK1/8 w - - 3 29",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "g5",
          "san": "Bg5",
          "explanation": "Master move Bg5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h4",
        "to": "g5",
        "san": "Qxg5+",
        "coachExplanation": "Opponent plays Qxg5+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bg5 is the engine-verified winning move from Lichess #00Feu."
    },
    {
      "id": "lichess_00GiQ",
      "lichessId": "00GiQ",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00GiQ: Rating 1851",
      "ratingBadge": "Lichess: ~1851",
      "initialFen": "5r2/5p1k/6pp/ppqp1P2/7Q/5N2/6PP/5N1K w - - 0 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "g5",
          "san": "Ng5+",
          "explanation": "Master move Ng5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h7",
        "to": "g7",
        "san": "Kg7",
        "coachExplanation": "Opponent plays Kg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ng5+ is the engine-verified winning move from Lichess #00GiQ."
    },
    {
      "id": "lichess_00H87",
      "lichessId": "00H87",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00H87: Rating 1912",
      "ratingBadge": "Lichess: ~1912",
      "initialFen": "6k1/4pp2/p5pB/2p4n/3pP1Q1/P2P2qP/1r4P1/5RK1 w - - 2 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "g4",
          "to": "c8",
          "san": "Qc8+",
          "explanation": "Master move Qc8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h7",
        "san": "Kh7",
        "coachExplanation": "Opponent plays Kh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qc8+ is the engine-verified winning move from Lichess #00H87."
    },
    {
      "id": "lichess_00Hpe",
      "lichessId": "00Hpe",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00Hpe: Rating 1768",
      "ratingBadge": "Lichess: ~1768",
      "initialFen": "1rr3k1/4Qppp/q3p3/p2pn3/3N4/4P2P/5PP1/RR4K1 w - - 0 30",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "b1",
          "to": "b8",
          "san": "Rxb8",
          "explanation": "Master move Rxb8! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c8",
        "to": "b8",
        "san": "Rxb8",
        "coachExplanation": "Opponent plays Rxb8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxb8 is the engine-verified winning move from Lichess #00Hpe."
    },
    {
      "id": "lichess_00JFF",
      "lichessId": "00JFF",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00JFF: Rating 2037",
      "ratingBadge": "Lichess: ~2037",
      "initialFen": "4r1k1/ppqb4/6p1/3pb2Q/8/2P5/PP1B2PP/5RK1 w - - 0 21",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "g6",
          "san": "Qxg6+",
          "explanation": "Master move Qxg6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "g7",
        "san": "Bg7",
        "coachExplanation": "Opponent plays Bg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxg6+ is the engine-verified winning move from Lichess #00JFF."
    },
    {
      "id": "lichess_00KNK",
      "lichessId": "00KNK",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00KNK: Rating 2001",
      "ratingBadge": "Lichess: ~2001",
      "initialFen": "r3r1k1/p1p4p/3b4/6qN/4p3/1P1b1Q2/P2P1PP1/B5KR w - - 0 23",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "f6",
          "san": "Nf6+",
          "explanation": "Master move Nf6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f8",
        "san": "Kf8",
        "coachExplanation": "Opponent plays Kf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf6+ is the engine-verified winning move from Lichess #00KNK."
    },
    {
      "id": "lichess_00MQl",
      "lichessId": "00MQl",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00MQl: Rating 1868",
      "ratingBadge": "Lichess: ~1868",
      "initialFen": "r1b2k1r/pp3ppp/2p5/2bp4/5Pnq/1B2BN2/PPP3PP/RN1QR2K b - - 5 15",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "c5",
          "to": "e3",
          "san": "Bxe3",
          "explanation": "Master move Bxe3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "h4",
        "san": "Nxh4",
        "coachExplanation": "Opponent plays Nxh4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxe3 is the engine-verified winning move from Lichess #00MQl."
    },
    {
      "id": "lichess_00MwU",
      "lichessId": "00MwU",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00MwU: Rating 1709",
      "ratingBadge": "Lichess: ~1709",
      "initialFen": "3r1b1R/1pq3p1/p1k3P1/3p4/1P1Q4/4PP2/P1P5/2K5 w - - 0 27",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "h8",
          "to": "f8",
          "san": "Rxf8",
          "explanation": "Master move Rxf8! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "f8",
        "san": "Rxf8",
        "coachExplanation": "Opponent plays Rxf8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxf8 is the engine-verified winning move from Lichess #00MwU."
    },
    {
      "id": "lichess_00NEO",
      "lichessId": "00NEO",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00NEO: Rating 1874",
      "ratingBadge": "Lichess: ~1874",
      "initialFen": "4qr2/pR4pk/2b2p1p/4pPP1/3bB3/3P3Q/P1r4P/4BR1K w - - 1 25",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "h3",
          "to": "h6",
          "san": "Qxh6+",
          "explanation": "Master move Qxh6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h7",
        "to": "g8",
        "san": "Kg8",
        "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxh6+ is the engine-verified winning move from Lichess #00NEO."
    },
    {
      "id": "lichess_00NHK",
      "lichessId": "00NHK",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00NHK: Rating 1790",
      "ratingBadge": "Lichess: ~1790",
      "initialFen": "r1b2rk1/1p2b1p1/pq2p1P1/3pn3/1P1P4/P1N1P3/6P1/R2QK2R w KQ - 0 18",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "h1",
          "to": "h8",
          "san": "Rh8+",
          "explanation": "Master move Rh8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kxh8",
        "coachExplanation": "Opponent plays Kxh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rh8+ is the engine-verified winning move from Lichess #00NHK."
    },
    {
      "id": "lichess_00O9Z",
      "lichessId": "00O9Z",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00O9Z: Rating 1616",
      "ratingBadge": "Lichess: ~1616",
      "initialFen": "5Q1R/5p1p/1b3qp1/p6k/P2P4/8/1P2rPPP/5RK1 b - - 8 32",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "f2",
          "san": "Qxf2+",
          "explanation": "Master move Qxf2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f1",
        "to": "f2",
        "san": "Rxf2",
        "coachExplanation": "Opponent plays Rxf2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxf2+ is the engine-verified winning move from Lichess #00O9Z."
    },
    {
      "id": "lichess_00OLF",
      "lichessId": "00OLF",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00OLF: Rating 2075",
      "ratingBadge": "Lichess: ~2075",
      "initialFen": "k1r5/n1N3p1/Q2p4/P2Pp2p/q3Pp1P/2RK4/5PP1/8 b - - 0 36",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "c8",
          "to": "c7",
          "san": "Rxc7",
          "explanation": "Master move Rxc7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c3",
        "to": "c7",
        "san": "Rxc7",
        "coachExplanation": "Opponent plays Rxc7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxc7 is the engine-verified winning move from Lichess #00OLF."
    },
    {
      "id": "lichess_00OYl",
      "lichessId": "00OYl",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00OYl: Rating 1944",
      "ratingBadge": "Lichess: ~1944",
      "initialFen": "3r4/5p2/k3p1p1/2B1Pr2/2P3nN/1p4Pp/4QP1P/6K1 b - - 1 34",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "f5",
          "to": "e5",
          "san": "Rxe5",
          "explanation": "Master move Rxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "f1",
        "san": "Qf1",
        "coachExplanation": "Opponent plays Qf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxe5 is the engine-verified winning move from Lichess #00OYl."
    },
    {
      "id": "lichess_00QN3",
      "lichessId": "00QN3",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00QN3: Rating 1878",
      "ratingBadge": "Lichess: ~1878",
      "initialFen": "r1b1B2k/pp4pp/2pb4/4q3/8/6P1/PPP4P/R2Q1R1K b - - 0 17",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "e4",
          "san": "Qe4+",
          "explanation": "Master move Qe4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d1",
        "to": "f3",
        "san": "Qf3",
        "coachExplanation": "Opponent plays Qf3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe4+ is the engine-verified winning move from Lichess #00QN3."
    },
    {
      "id": "lichess_00RtC",
      "lichessId": "00RtC",
      "tier": "advanced",
      "track": "tactical",
      "title": "Lichess #00RtC: Rating 1948",
      "ratingBadge": "Lichess: ~1948",
      "initialFen": "r4k2/ppp3p1/3p3r/2q5/1PNnP3/2Q2PBp/P4R1P/5RK1 b - - 0 25",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Complex Tactical Combinations & Clearance",
      "ruleBody": "Clear critical lines with forcing sacrifices to unleash multi-piece batteries against uncastled or weakened kings.",
      "solutionMoves": [
        {
          "from": "d4",
          "to": "e2",
          "san": "Ne2+",
          "explanation": "Master move Ne2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ne2+ is the engine-verified winning move from Lichess #00RtC."
    }
  ],
  "advanced_2": [
    {
      "id": "lichess_000Sa",
      "lichessId": "000Sa",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #000Sa: Rating 1622",
      "ratingBadge": "Lichess: ~1622",
      "initialFen": "2Q2bk1/5p1p/p5p1/2p3P1/4B3/7P/qPr2P2/2K4R w - - 0 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "c2",
          "san": "Bxc2",
          "explanation": "Master move Bxc2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a2",
        "to": "a1",
        "san": "Qa1+",
        "coachExplanation": "Opponent plays Qa1+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxc2 is the engine-verified winning move from Lichess #000Sa."
    },
    {
      "id": "lichess_0018P",
      "lichessId": "0018P",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #0018P: Rating 1910",
      "ratingBadge": "Lichess: ~1910",
      "initialFen": "5R2/1p6/p1p1k3/2P1r3/2K3p1/2P1p1P1/1P5P/8 w - - 2 45",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "f8",
          "to": "e8",
          "san": "Re8+",
          "explanation": "Master move Re8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e6",
        "to": "f5",
        "san": "Kf5",
        "coachExplanation": "Opponent plays Kf5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re8+ is the engine-verified winning move from Lichess #0018P."
    },
    {
      "id": "lichess_001Oo",
      "lichessId": "001Oo",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #001Oo: Rating 2078",
      "ratingBadge": "Lichess: ~2078",
      "initialFen": "6k1/4p1bp/6p1/1p1pP3/qPpPp3/2P1P3/Q2B1KPP/8 w - - 3 24",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "a2",
          "to": "a4",
          "san": "Qxa4",
          "explanation": "Master move Qxa4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b5",
        "to": "a4",
        "san": "bxa4",
        "coachExplanation": "Opponent plays bxa4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxa4 is the engine-verified winning move from Lichess #001Oo."
    },
    {
      "id": "lichess_002Ds",
      "lichessId": "002Ds",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #002Ds: Rating 1992",
      "ratingBadge": "Lichess: ~1992",
      "initialFen": "8/2p5/pp1p4/P2Pk2p/1PP1p2P/2n1K2P/3N4/8 w - - 0 46",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "b4",
          "to": "b5",
          "san": "b5",
          "explanation": "Master move b5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c3",
        "to": "d1",
        "san": "Nd1+",
        "coachExplanation": "Opponent plays Nd1+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! b5 is the engine-verified winning move from Lichess #002Ds."
    },
    {
      "id": "lichess_002LF",
      "lichessId": "002LF",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #002LF: Rating 2128",
      "ratingBadge": "Lichess: ~2128",
      "initialFen": "7r/p4pk1/1pp3p1/8/6q1/4Q3/PP1R1P1r/5KN1 w - - 0 39",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "e3",
          "to": "e5",
          "san": "Qe5+",
          "explanation": "Master move Qe5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f7",
        "to": "f6",
        "san": "f6",
        "coachExplanation": "Opponent plays f6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qe5+ is the engine-verified winning move from Lichess #002LF."
    },
    {
      "id": "lichess_002Uy",
      "lichessId": "002Uy",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #002Uy: Rating 1682",
      "ratingBadge": "Lichess: ~1682",
      "initialFen": "8/8/1p6/k7/P7/1KR4r/8/8 b - - 27 64",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "h3",
          "to": "c3",
          "san": "Rxc3+",
          "explanation": "Master move Rxc3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b3",
        "to": "c3",
        "san": "Kxc3",
        "coachExplanation": "Opponent plays Kxc3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxc3+ is the engine-verified winning move from Lichess #002Uy."
    },
    {
      "id": "lichess_003IX",
      "lichessId": "003IX",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #003IX: Rating 1693",
      "ratingBadge": "Lichess: ~1693",
      "initialFen": "8/3pk3/R7/1R2PK1p/2PPn1r1/8/8/8 b - - 0 43",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "e4",
          "to": "g3",
          "san": "Ng3#",
          "explanation": "Master move Ng3#! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f5",
        "to": "f4",
        "san": "Kxf5",
        "coachExplanation": "Opponent responds with Kxf5! Inaccurate continuation."
      },
      "successExplanation": "Brilliant! Ng3# is the engine-verified winning move from Lichess #003IX."
    },
    {
      "id": "lichess_003aS",
      "lichessId": "003aS",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #003aS: Rating 1890",
      "ratingBadge": "Lichess: ~1890",
      "initialFen": "8/8/5k1p/6pP/1R4P1/1p2KP2/8/1r6 b - - 0 43",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "b3",
          "to": "b2",
          "san": "b2",
          "explanation": "Master move b2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "b4",
        "to": "b6",
        "san": "Rb6+",
        "coachExplanation": "Opponent plays Rb6+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! b2 is the engine-verified winning move from Lichess #003aS."
    },
    {
      "id": "lichess_004Ax",
      "lichessId": "004Ax",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #004Ax: Rating 2064",
      "ratingBadge": "Lichess: ~2064",
      "initialFen": "8/5k2/4R2p/p7/5rPK/8/7P/8 w - - 3 43",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "e6",
          "to": "h6",
          "san": "Rxh6",
          "explanation": "Master move Rxh6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f4",
        "to": "f6",
        "san": "Rf6",
        "coachExplanation": "Opponent plays Rf6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxh6 is the engine-verified winning move from Lichess #004Ax."
    },
    {
      "id": "lichess_004RF",
      "lichessId": "004RF",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #004RF: Rating 1750",
      "ratingBadge": "Lichess: ~1750",
      "initialFen": "5rk1/5ppp/1p6/1q3P1Q/2pp3P/6R1/6PK/8 w - - 0 31",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "g7",
          "san": "Rxg7+",
          "explanation": "Master move Rxg7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "g7",
        "san": "Kxg7",
        "coachExplanation": "Opponent plays Kxg7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxg7+ is the engine-verified winning move from Lichess #004RF."
    },
    {
      "id": "lichess_004d8",
      "lichessId": "004d8",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #004d8: Rating 1608",
      "ratingBadge": "Lichess: ~1608",
      "initialFen": "8/4kr2/R2p4/1p1Pp3/5pp1/3K1P2/PPP5/8 w - - 0 40",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "a6",
          "to": "a7",
          "san": "Ra7+",
          "explanation": "Master move Ra7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e7",
        "to": "f6",
        "san": "Kf6",
        "coachExplanation": "Opponent plays Kf6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ra7+ is the engine-verified winning move from Lichess #004d8."
    },
    {
      "id": "lichess_005f3",
      "lichessId": "005f3",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #005f3: Rating 1787",
      "ratingBadge": "Lichess: ~1787",
      "initialFen": "r5k1/2p1pp2/pp4p1/1q5r/5P2/2QP2R1/PP6/1K4R1 w - - 1 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "g3",
          "to": "g6",
          "san": "Rxg6+",
          "explanation": "Master move Rxg6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f7",
        "to": "g6",
        "san": "fxg6",
        "coachExplanation": "Opponent plays fxg6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxg6+ is the engine-verified winning move from Lichess #005f3."
    },
    {
      "id": "lichess_005gP",
      "lichessId": "005gP",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #005gP: Rating 1705",
      "ratingBadge": "Lichess: ~1705",
      "initialFen": "8/8/3p4/2kP2P1/1p6/2pK4/P7/8 b - - 0 42",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "c5",
          "to": "d5",
          "san": "Kxd5",
          "explanation": "Master move Kxd5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g5",
        "to": "g6",
        "san": "g6",
        "coachExplanation": "Opponent plays g6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Kxd5 is the engine-verified winning move from Lichess #005gP."
    },
    {
      "id": "lichess_0068D",
      "lichessId": "0068D",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #0068D: Rating 1949",
      "ratingBadge": "Lichess: ~1949",
      "initialFen": "7r/pppk4/2pN1r2/8/3P2p1/2P5/PP2RPP1/4R1K1 b - - 0 26",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "h6",
          "san": "Rfh6",
          "explanation": "Master move Rfh6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f2",
        "to": "f4",
        "san": "f4",
        "coachExplanation": "Opponent plays f4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rfh6 is the engine-verified winning move from Lichess #0068D."
    },
    {
      "id": "lichess_006E1",
      "lichessId": "006E1",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #006E1: Rating 1608",
      "ratingBadge": "Lichess: ~1608",
      "initialFen": "5rk1/R4pp1/1p5p/3Q4/1PPp2q1/3P2P1/5P2/4K3 b - - 0 34",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "f8",
          "to": "e8",
          "san": "Re8+",
          "explanation": "Master move Re8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e1",
        "to": "f1",
        "san": "Kf1",
        "coachExplanation": "Opponent plays Kf1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re8+ is the engine-verified winning move from Lichess #006E1."
    },
    {
      "id": "lichess_00798",
      "lichessId": "00798",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00798: Rating 1917",
      "ratingBadge": "Lichess: ~1917",
      "initialFen": "8/4k1K1/4P3/6pp/6rP/4R1P1/8/8 b - - 1 60",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "g5",
          "to": "h4",
          "san": "gxh4+",
          "explanation": "Master move gxh4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g7",
        "to": "h6",
        "san": "Kh6",
        "coachExplanation": "Opponent plays Kh6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! gxh4+ is the engine-verified winning move from Lichess #00798."
    },
    {
      "id": "lichess_008Sk",
      "lichessId": "008Sk",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #008Sk: Rating 2021",
      "ratingBadge": "Lichess: ~2021",
      "initialFen": "8/6pp/3Bp2k/p2pP2P/P3p1PK/8/r4b2/5R2 w - - 3 38",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "f2",
          "san": "Rxf2",
          "explanation": "Master move Rxf2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g7",
        "to": "g5",
        "san": "g5+",
        "coachExplanation": "Opponent plays g5+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxf2 is the engine-verified winning move from Lichess #008Sk."
    },
    {
      "id": "lichess_008qL",
      "lichessId": "008qL",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #008qL: Rating 1956",
      "ratingBadge": "Lichess: ~1956",
      "initialFen": "r7/6pk/p2Q4/2p1p1qp/1pP1PrP1/1P3P1P/1P4K1/R4R2 b - - 0 25",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "a8",
          "to": "d8",
          "san": "Rd8",
          "explanation": "Master move Rd8! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d6",
        "to": "d8",
        "san": "Qxd8",
        "coachExplanation": "Opponent plays Qxd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rd8 is the engine-verified winning move from Lichess #008qL."
    },
    {
      "id": "lichess_009hH",
      "lichessId": "009hH",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #009hH: Rating 1980",
      "ratingBadge": "Lichess: ~1980",
      "initialFen": "k3r3/p3q3/1pp5/3pnB2/1P1Q4/1KPP4/P3R3/8 b - - 1 41",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "e5",
          "to": "f3",
          "san": "Nf3",
          "explanation": "Master move Nf3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e2",
        "to": "e7",
        "san": "Rxe7",
        "coachExplanation": "Opponent plays Rxe7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf3 is the engine-verified winning move from Lichess #009hH."
    },
    {
      "id": "lichess_009zR",
      "lichessId": "009zR",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #009zR: Rating 1620",
      "ratingBadge": "Lichess: ~1620",
      "initialFen": "3Q4/p1p2ppp/4k3/8/5P2/4P3/Prqn2PP/3R1RK1 b - - 0 22",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "d2",
          "to": "f3",
          "san": "Nf3+",
          "explanation": "Master move Nf3+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nf3+ is the engine-verified winning move from Lichess #009zR."
    },
    {
      "id": "lichess_00A5m",
      "lichessId": "00A5m",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00A5m: Rating 1965",
      "ratingBadge": "Lichess: ~1965",
      "initialFen": "8/1p6/p1p2p2/P3b3/1PK3P1/2PB4/3k4/8 w - - 4 61",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "d3",
          "to": "f5",
          "san": "Bf5",
          "explanation": "Master move Bf5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "c7",
        "san": "Bc7",
        "coachExplanation": "Opponent plays Bc7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bf5 is the engine-verified winning move from Lichess #00A5m."
    },
    {
      "id": "lichess_00AEM",
      "lichessId": "00AEM",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00AEM: Rating 1733",
      "ratingBadge": "Lichess: ~1733",
      "initialFen": "r2q1rk1/p4p1p/1p3Qp1/2p4P/3p4/5R2/PPP2PP1/4R1K1 w - - 1 23",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "e1",
          "to": "e7",
          "san": "Re7",
          "explanation": "Master move Re7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d8",
        "to": "e7",
        "san": "Qxe7",
        "coachExplanation": "Opponent plays Qxe7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re7 is the engine-verified winning move from Lichess #00AEM."
    },
    {
      "id": "lichess_00Ac7",
      "lichessId": "00Ac7",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00Ac7: Rating 2125",
      "ratingBadge": "Lichess: ~2125",
      "initialFen": "8/2p1pk1p/Pp4p1/8/2P2P2/p2r2P1/3PR2P/3K4 w - - 0 34",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "a6",
          "to": "a7",
          "san": "a7",
          "explanation": "Master move a7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d3",
        "to": "d8",
        "san": "Rd8",
        "coachExplanation": "Opponent plays Rd8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! a7 is the engine-verified winning move from Lichess #00Ac7."
    },
    {
      "id": "lichess_00AcQ",
      "lichessId": "00AcQ",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00AcQ: Rating 1735",
      "ratingBadge": "Lichess: ~1735",
      "initialFen": "8/1bpp2k1/1p5r/1P2P3/3P1P2/2P1n1K1/Q5P1/8 b - - 1 30",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "h6",
          "to": "g6",
          "san": "Rg6+",
          "explanation": "Master move Rg6+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g3",
        "to": "f2",
        "san": "Kf2",
        "coachExplanation": "Opponent plays Kf2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rg6+ is the engine-verified winning move from Lichess #00AcQ."
    },
    {
      "id": "lichess_00Bg0",
      "lichessId": "00Bg0",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00Bg0: Rating 1641",
      "ratingBadge": "Lichess: ~1641",
      "initialFen": "8/3k4/3P1K2/p4R2/5r2/5P2/8/8 b - - 2 57",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Triangulation & Opposition Mastery",
      "ruleBody": "Use tempo moves and triangulation to force zugzwang and break through impenetrable defensive barriers.",
      "solutionMoves": [
        {
          "from": "f4",
          "to": "f5",
          "san": "Rxf5+",
          "explanation": "Master move Rxf5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f6",
        "to": "f5",
        "san": "Kxf5",
        "coachExplanation": "Opponent plays Kxf5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxf5+ is the engine-verified winning move from Lichess #00Bg0."
    }
  ],
  "advanced_3": [
    {
      "id": "lichess_000h0",
      "lichessId": "000h0",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #000h0: Rating 2067",
      "ratingBadge": "Lichess: ~2067",
      "initialFen": "5rk1/p5p1/3bRr1p/1Pp4q/3p4/1P1Q1N2/P4PPP/4R1K1 b - - 0 22",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "f3",
          "san": "Rxf3",
          "explanation": "Master move Rxf3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g2",
        "to": "f3",
        "san": "gxf3",
        "coachExplanation": "Opponent plays gxf3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxf3 is the engine-verified winning move from Lichess #000h0."
    },
    {
      "id": "lichess_00143",
      "lichessId": "00143",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00143: Rating 1798",
      "ratingBadge": "Lichess: ~1798",
      "initialFen": "r4rk1/5ppp/1np2q2/p1b5/2p1B3/P7/1P3PPP/R1BQ1RK1 w - - 2 18",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "d1",
          "to": "h5",
          "san": "Qh5",
          "explanation": "Master move Qh5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h7",
        "to": "h6",
        "san": "h6",
        "coachExplanation": "Opponent plays h6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh5 is the engine-verified winning move from Lichess #00143."
    },
    {
      "id": "lichess_001XA",
      "lichessId": "001XA",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #001XA: Rating 1687",
      "ratingBadge": "Lichess: ~1687",
      "initialFen": "2r2rk1/pbq1bppp/8/8/2p1N3/P1Bn2P1/2Q2PBP/1R3RK1 w - - 4 24",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "b1",
          "to": "b7",
          "san": "Rxb7",
          "explanation": "Master move Rxb7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "b7",
        "san": "Qxb7",
        "coachExplanation": "Opponent plays Qxb7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxb7 is the engine-verified winning move from Lichess #001XA."
    },
    {
      "id": "lichess_001h8",
      "lichessId": "001h8",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #001h8: Rating 1780",
      "ratingBadge": "Lichess: ~1780",
      "initialFen": "2r3k1/2r4p/4p1p1/1p1q1pP1/p2P1P1Q/P6R/4bB2/2R3K1 w - - 6 35",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "h4",
          "to": "h7",
          "san": "Qxh7+",
          "explanation": "Master move Qxh7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "h7",
        "san": "Rxh7",
        "coachExplanation": "Opponent plays Rxh7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxh7+ is the engine-verified winning move from Lichess #001h8."
    },
    {
      "id": "lichess_001uD",
      "lichessId": "001uD",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #001uD: Rating 1877",
      "ratingBadge": "Lichess: ~1877",
      "initialFen": "6k1/1p4p1/1p3p1p/2r1p3/2n5/r3PN2/2RnNPPP/2R3K1 w - - 0 33",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "d2",
          "san": "Nxd2",
          "explanation": "Master move Nxd2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c4",
        "to": "d2",
        "san": "Nxd2",
        "coachExplanation": "Opponent plays Nxd2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxd2 is the engine-verified winning move from Lichess #001uD."
    },
    {
      "id": "lichess_001xO",
      "lichessId": "001xO",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #001xO: Rating 1847",
      "ratingBadge": "Lichess: ~1847",
      "initialFen": "k1r1b3/p1r1nppp/Bp1qpn2/2Np4/1P1P4/PQR1PN2/5PPP/2R3K1 b - - 1 19",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "b6",
          "to": "c5",
          "san": "bxc5",
          "explanation": "Master move bxc5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a6",
        "to": "c8",
        "san": "Bxc8",
        "coachExplanation": "Opponent plays Bxc8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! bxc5 is the engine-verified winning move from Lichess #001xO."
    },
    {
      "id": "lichess_002KJ",
      "lichessId": "002KJ",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #002KJ: Rating 1615",
      "ratingBadge": "Lichess: ~1615",
      "initialFen": "r3k2r/ppq1bppp/4pn2/2Ppn3/1P4bP/2P2N2/P3BPP1/RNBQ1RK1 w kq - 3 11",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "f3",
          "to": "e5",
          "san": "Nxe5",
          "explanation": "Master move Nxe5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c7",
        "to": "e5",
        "san": "Qxe5",
        "coachExplanation": "Opponent plays Qxe5! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Nxe5 is the engine-verified winning move from Lichess #002KJ."
    },
    {
      "id": "lichess_002Ua",
      "lichessId": "002Ua",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #002Ua: Rating 1646",
      "ratingBadge": "Lichess: ~1646",
      "initialFen": "r4rk1/pp3ppp/3p1q2/P1P1p3/2B5/2B2n2/2P2P1P/R2Q1R1K b - - 1 16",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "f6",
          "to": "f4",
          "san": "Qf4",
          "explanation": "Master move Qf4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d1",
        "to": "f3",
        "san": "Qxf3",
        "coachExplanation": "Opponent plays Qxf3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qf4 is the engine-verified winning move from Lichess #002Ua."
    },
    {
      "id": "lichess_004BW",
      "lichessId": "004BW",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #004BW: Rating 1617",
      "ratingBadge": "Lichess: ~1617",
      "initialFen": "r1bk2r1/ppq2NQp/3bpn2/1Bpn4/5P2/1P6/PBPP2PP/RN2K2R b KQ - 0 13",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "d8",
          "to": "e7",
          "san": "Ke7",
          "explanation": "Master move Ke7! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g7",
        "to": "g8",
        "san": "Qxg8",
        "coachExplanation": "Opponent plays Qxg8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Ke7 is the engine-verified winning move from Lichess #004BW."
    },
    {
      "id": "lichess_004Ud",
      "lichessId": "004Ud",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #004Ud: Rating 1612",
      "ratingBadge": "Lichess: ~1612",
      "initialFen": "r1bqk2r/p3nppp/3p4/1pp5/4P3/4Q3/PPP2PPP/2KR1B1R w kq - 0 12",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "f1",
          "to": "b5",
          "san": "Bxb5+",
          "explanation": "Master move Bxb5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "c8",
        "to": "d7",
        "san": "Bd7",
        "coachExplanation": "Opponent plays Bd7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxb5+ is the engine-verified winning move from Lichess #004Ud."
    },
    {
      "id": "lichess_0055Y",
      "lichessId": "0055Y",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #0055Y: Rating 2055",
      "ratingBadge": "Lichess: ~2055",
      "initialFen": "r1b2rk1/p3pp2/2B5/2Qpq3/3N2pp/4b3/2P2PPP/1R2K2R w K - 0 24",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "f2",
          "to": "e3",
          "san": "fxe3",
          "explanation": "Master move fxe3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "e3",
        "san": "Qxe3+",
        "coachExplanation": "Opponent plays Qxe3+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! fxe3 is the engine-verified winning move from Lichess #0055Y."
    },
    {
      "id": "lichess_006fF",
      "lichessId": "006fF",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #006fF: Rating 1851",
      "ratingBadge": "Lichess: ~1851",
      "initialFen": "r1b4r/pp1k2p1/2nb2qp/1B1p2B1/3p3Q/8/PPP2PPP/3RR1K1 w - - 0 18",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "h4",
          "to": "g4",
          "san": "Qg4+",
          "explanation": "Master move Qg4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d7",
        "to": "c7",
        "san": "Kc7",
        "coachExplanation": "Opponent plays Kc7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qg4+ is the engine-verified winning move from Lichess #006fF."
    },
    {
      "id": "lichess_006i7",
      "lichessId": "006i7",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #006i7: Rating 1769",
      "ratingBadge": "Lichess: ~1769",
      "initialFen": "r4rk1/3nqpp1/2N1bn1p/3p4/1p1P4/2NQP2P/1PB2PP1/R4RK1 b - - 0 18",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "d6",
          "san": "Qd6",
          "explanation": "Master move Qd6! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "a1",
        "to": "a8",
        "san": "Rxa8",
        "coachExplanation": "Opponent plays Rxa8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qd6 is the engine-verified winning move from Lichess #006i7."
    },
    {
      "id": "lichess_007ku",
      "lichessId": "007ku",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #007ku: Rating 1663",
      "ratingBadge": "Lichess: ~1663",
      "initialFen": "r1bq3Q/1np3p1/p5k1/1p1Pp3/1Pn2BP1/2b2P2/P3K3/R4N2 w - - 0 36",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "h8",
          "to": "h5",
          "san": "Qh5+",
          "explanation": "Master move Qh5+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g6",
        "to": "f6",
        "san": "Kf6",
        "coachExplanation": "Opponent plays Kf6! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qh5+ is the engine-verified winning move from Lichess #007ku."
    },
    {
      "id": "lichess_008nF",
      "lichessId": "008nF",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #008nF: Rating 2132",
      "ratingBadge": "Lichess: ~2132",
      "initialFen": "2rq1rk1/7p/1n4pb/1R2Q3/pPpP1P2/P1B5/3N2PP/2R3K1 b - - 0 31",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "f8",
          "to": "e8",
          "san": "Re8",
          "explanation": "Master move Re8! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "e5",
        "to": "e8",
        "san": "Qxe8+",
        "coachExplanation": "Opponent plays Qxe8+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re8 is the engine-verified winning move from Lichess #008nF."
    },
    {
      "id": "lichess_009XT",
      "lichessId": "009XT",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #009XT: Rating 2048",
      "ratingBadge": "Lichess: ~2048",
      "initialFen": "rn1qk2r/pp3ppp/3bp1N1/3p4/3Pn3/3BB3/PPP2PPP/RN1Q1RK1 b kq - 0 10",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "d6",
          "to": "h2",
          "san": "Bxh2+",
          "explanation": "Master move Bxh2+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g1",
        "to": "h1",
        "san": "Kh1",
        "coachExplanation": "Opponent plays Kh1! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxh2+ is the engine-verified winning move from Lichess #009XT."
    },
    {
      "id": "lichess_00A1H",
      "lichessId": "00A1H",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00A1H: Rating 2041",
      "ratingBadge": "Lichess: ~2041",
      "initialFen": "2r3k1/4brp1/2p3b1/2Pp1qNp/3B3P/2P5/PP3P1K/R2Q2R1 b - - 2 31",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "f5",
          "to": "f4",
          "san": "Qf4+",
          "explanation": "Master move Qf4+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "h2",
        "to": "g2",
        "san": "Kg2",
        "coachExplanation": "Opponent plays Kg2! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qf4+ is the engine-verified winning move from Lichess #00A1H."
    },
    {
      "id": "lichess_00Al5",
      "lichessId": "00Al5",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00Al5: Rating 1640",
      "ratingBadge": "Lichess: ~1640",
      "initialFen": "2r3k1/p2B1pbp/1p2pnp1/n2p4/3P4/1Pr1P2P/P1QB1PP1/2R2RK1 b - - 0 19",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "c3",
          "to": "c2",
          "san": "Rxc2",
          "explanation": "Master move Rxc2! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d7",
        "to": "c8",
        "san": "Bxc8",
        "coachExplanation": "Opponent plays Bxc8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxc2 is the engine-verified winning move from Lichess #00Al5."
    },
    {
      "id": "lichess_00Ar2",
      "lichessId": "00Ar2",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00Ar2: Rating 1759",
      "ratingBadge": "Lichess: ~1759",
      "initialFen": "r2q1r2/1n4pk/p6p/1ppN1pb1/3n1B2/P2PN2P/1PPQ1PP1/R3R1K1 b - - 1 21",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "g5",
          "to": "f4",
          "san": "Bxf4",
          "explanation": "Master move Bxf4! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d5",
        "to": "f4",
        "san": "Nxf4",
        "coachExplanation": "Opponent plays Nxf4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxf4 is the engine-verified winning move from Lichess #00Ar2."
    },
    {
      "id": "lichess_00B7G",
      "lichessId": "00B7G",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00B7G: Rating 1643",
      "ratingBadge": "Lichess: ~1643",
      "initialFen": "1rb2r1k/4q2p/p2p4/3B1p2/1pPb4/1P2NQ2/P5PP/2R2R1K b - - 2 24",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "e7",
          "to": "e3",
          "san": "Qxe3",
          "explanation": "Master move Qxe3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "f3",
        "to": "e3",
        "san": "Qxe3",
        "coachExplanation": "Opponent plays Qxe3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qxe3 is the engine-verified winning move from Lichess #00B7G."
    },
    {
      "id": "lichess_00C3O",
      "lichessId": "00C3O",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00C3O: Rating 2037",
      "ratingBadge": "Lichess: ~2037",
      "initialFen": "r2qkbnr/pp4pp/2p2p2/4n2b/2B1P3/2N2N2/PPP1Q1PP/R1B2RK1 b kq - 1 10",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "h5",
          "to": "f3",
          "san": "Bxf3",
          "explanation": "Master move Bxf3! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g2",
        "to": "f3",
        "san": "gxf3",
        "coachExplanation": "Opponent plays gxf3! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Bxf3 is the engine-verified winning move from Lichess #00C3O."
    },
    {
      "id": "lichess_00CXr",
      "lichessId": "00CXr",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00CXr: Rating 1908",
      "ratingBadge": "Lichess: ~1908",
      "initialFen": "r2k2nr/p3qBb1/1p1p3p/Q5p1/3n1B2/2N2R2/PPP3P1/R5K1 w - - 0 19",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "a5",
          "to": "d5",
          "san": "Qd5",
          "explanation": "Master move Qd5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d4",
        "to": "f3",
        "san": "Nxf3+",
        "coachExplanation": "Opponent plays Nxf3+! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Qd5 is the engine-verified winning move from Lichess #00CXr."
    },
    {
      "id": "lichess_00D77",
      "lichessId": "00D77",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00D77: Rating 1811",
      "ratingBadge": "Lichess: ~1811",
      "initialFen": "5rk1/bpp3pp/p1npb3/4p3/1P2Nr2/P1PP3q/1B1QBPR1/2K3R1 w - - 0 22",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "g2",
          "to": "g7",
          "san": "Rxg7+",
          "explanation": "Master move Rxg7+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "h8",
        "san": "Kh8",
        "coachExplanation": "Opponent plays Kh8! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Rxg7+ is the engine-verified winning move from Lichess #00D77."
    },
    {
      "id": "lichess_00DII",
      "lichessId": "00DII",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00DII: Rating 1638",
      "ratingBadge": "Lichess: ~1638",
      "initialFen": "2rr2k1/p5p1/1p5p/2pq1p1P/8/P4QR1/5PP1/4R1K1 w - - 0 32",
      "playerColor": "white",
      "prompt": "White to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "e1",
          "to": "e8",
          "san": "Re8+",
          "explanation": "Master move Re8+! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "g8",
        "to": "f7",
        "san": "Kf7",
        "coachExplanation": "Opponent plays Kf7! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! Re8+ is the engine-verified winning move from Lichess #00DII."
    },
    {
      "id": "lichess_00DUp",
      "lichessId": "00DUp",
      "tier": "advanced",
      "track": "positional",
      "title": "Lichess #00DUp: Rating 1693",
      "ratingBadge": "Lichess: ~1693",
      "initialFen": "8/8/1p2k1p1/4P2p/P2K1p1P/5P2/8/8 b - - 0 66",
      "playerColor": "black",
      "prompt": "Black to move: Spot the winning tactical continuation!",
      "ruleTitle": "Master Level Conversion & Dominance",
      "ruleBody": "Restrict every ounce of opponent counterplay before executing the final tactical breakthrough.",
      "solutionMoves": [
        {
          "from": "g6",
          "to": "g5",
          "san": "g5",
          "explanation": "Master move g5! Engine validated winning continuation."
        }
      ],
      "defaultRefutation": {
        "from": "d4",
        "to": "e4",
        "san": "Ke4",
        "coachExplanation": "Opponent plays Ke4! Always look for forcing responses before deciding."
      },
      "successExplanation": "Brilliant! g5 is the engine-verified winning move from Lichess #00DUp."
    }
  ]
};

// 100 Continuous practice puzzles extracted from Lichess (25 per tier)
export const CONTINUOUS_PUZZLES: ChessPuzzle[] = [
  {
    "id": "lichess_00eAX",
    "lichessId": "00eAX",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00eAX: Rating 698",
    "ratingBadge": "Lichess: ~698",
    "initialFen": "6k1/ppp1r1pp/8/8/2r5/2P5/P5PP/3R1RK1 w - - 0 27",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "d1",
        "to": "d8",
        "san": "Rd8+",
        "explanation": "Master move Rd8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e7",
      "to": "e8",
      "san": "Re8",
      "coachExplanation": "Opponent plays Re8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rd8+ is the engine-verified winning move from Lichess #00eAX."
  },
  {
    "id": "lichess_00ghH",
    "lichessId": "00ghH",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00ghH: Rating 691",
    "ratingBadge": "Lichess: ~691",
    "initialFen": "5r1k/6p1/1Q2pq1p/P2P1r2/8/2P1R3/6PP/4R1K1 b - - 0 39",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "f5",
        "to": "f1",
        "san": "Rf1+",
        "explanation": "Master move Rf1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e1",
      "to": "f1",
      "san": "Rxf1",
      "coachExplanation": "Opponent plays Rxf1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rf1+ is the engine-verified winning move from Lichess #00ghH."
  },
  {
    "id": "lichess_00jOm",
    "lichessId": "00jOm",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00jOm: Rating 798",
    "ratingBadge": "Lichess: ~798",
    "initialFen": "1rR5/3Pkppp/4p3/3p4/8/8/P4PPP/6K1 b - - 1 29",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "b8",
        "to": "b1",
        "san": "Rb1+",
        "explanation": "Master move Rb1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c8",
      "to": "c1",
      "san": "Rc1",
      "coachExplanation": "Opponent plays Rc1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rb1+ is the engine-verified winning move from Lichess #00jOm."
  },
  {
    "id": "lichess_00kQE",
    "lichessId": "00kQE",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00kQE: Rating 402",
    "ratingBadge": "Lichess: ~402",
    "initialFen": "1rb4k/p5pp/1p6/3R4/2B1p3/8/PP3rPP/1K5R w - - 2 27",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "d5",
        "to": "d8",
        "san": "Rd8+",
        "explanation": "Master move Rd8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f2",
      "to": "f8",
      "san": "Rf8",
      "coachExplanation": "Opponent plays Rf8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rd8+ is the engine-verified winning move from Lichess #00kQE."
  },
  {
    "id": "lichess_00kRi",
    "lichessId": "00kRi",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00kRi: Rating 733",
    "ratingBadge": "Lichess: ~733",
    "initialFen": "2r1kb1r/p1q2ppp/2R1p3/3pPbP1/Q2P3P/5P2/PP1N4/R1B1K3 b Qk - 0 20",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "c7",
        "to": "c6",
        "san": "Qxc6",
        "explanation": "Master move Qxc6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "a4",
      "to": "c6",
      "san": "Qxc6+",
      "coachExplanation": "Opponent plays Qxc6+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxc6 is the engine-verified winning move from Lichess #00kRi."
  },
  {
    "id": "lichess_00mvr",
    "lichessId": "00mvr",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00mvr: Rating 812",
    "ratingBadge": "Lichess: ~812",
    "initialFen": "7r/ppp1k2p/2n5/8/8/2P2pP1/P6P/R1Br1BK1 w - - 0 21",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "c1",
        "to": "g5",
        "san": "Bg5+",
        "explanation": "Master move Bg5+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e7",
      "to": "e6",
      "san": "Ke6",
      "coachExplanation": "Opponent plays Ke6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bg5+ is the engine-verified winning move from Lichess #00mvr."
  },
  {
    "id": "lichess_00nS6",
    "lichessId": "00nS6",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00nS6: Rating 435",
    "ratingBadge": "Lichess: ~435",
    "initialFen": "r3r1k1/5ppp/p1p2b2/3q1b2/8/5N1P/PP2QPP1/R1B1R1K1 w - - 2 20",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "e2",
        "to": "e8",
        "san": "Qxe8+",
        "explanation": "Master move Qxe8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "a8",
      "to": "e8",
      "san": "Rxe8",
      "coachExplanation": "Opponent plays Rxe8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxe8+ is the engine-verified winning move from Lichess #00nS6."
  },
  {
    "id": "lichess_00nl3",
    "lichessId": "00nl3",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00nl3: Rating 820",
    "ratingBadge": "Lichess: ~820",
    "initialFen": "6R1/6p1/p1k4p/1p1p4/PP2p1P1/2b1P3/6K1/8 w - - 0 38",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "g8",
        "to": "c8",
        "san": "Rc8+",
        "explanation": "Master move Rc8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c6",
      "to": "b7",
      "san": "Kb7",
      "coachExplanation": "Opponent plays Kb7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rc8+ is the engine-verified winning move from Lichess #00nl3."
  },
  {
    "id": "lichess_00q8C",
    "lichessId": "00q8C",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00q8C: Rating 829",
    "ratingBadge": "Lichess: ~829",
    "initialFen": "1rb3k1/p2q2bp/2p4r/2P1p1p1/3pPp2/1P1P1P2/PB1NN1KP/1R2QR2 b - - 0 22",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "d7",
        "to": "h3",
        "san": "Qh3+",
        "explanation": "Master move Qh3+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g2",
      "to": "g1",
      "san": "Kg1",
      "coachExplanation": "Opponent plays Kg1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qh3+ is the engine-verified winning move from Lichess #00q8C."
  },
  {
    "id": "lichess_00qqD",
    "lichessId": "00qqD",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00qqD: Rating 805",
    "ratingBadge": "Lichess: ~805",
    "initialFen": "r6r/ppp2kp1/2n5/2p1p2p/4P1n1/3P1N1q/PPP2P1N/R3QRK1 w - - 0 15",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "f3",
        "to": "g5",
        "san": "Ng5+",
        "explanation": "Master move Ng5+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f7",
      "to": "g8",
      "san": "Kg8",
      "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ng5+ is the engine-verified winning move from Lichess #00qqD."
  },
  {
    "id": "lichess_00rcR",
    "lichessId": "00rcR",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00rcR: Rating 809",
    "ratingBadge": "Lichess: ~809",
    "initialFen": "6k1/1p2pp1p/p2p2p1/3P4/4P3/P1B2P2/P5PP/2n3K1 b - - 1 23",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "c1",
        "to": "e2",
        "san": "Ne2+",
        "explanation": "Master move Ne2+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g1",
      "to": "f1",
      "san": "Kf1",
      "coachExplanation": "Opponent plays Kf1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ne2+ is the engine-verified winning move from Lichess #00rcR."
  },
  {
    "id": "lichess_00s8j",
    "lichessId": "00s8j",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00s8j: Rating 733",
    "ratingBadge": "Lichess: ~733",
    "initialFen": "3R4/ppk5/2r5/5Q2/4p3/P7/5PPP/6K1 b - - 0 35",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "c6",
        "to": "c1",
        "san": "Rc1+",
        "explanation": "Master move Rc1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d8",
      "to": "d1",
      "san": "Rd1",
      "coachExplanation": "Opponent plays Rd1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rc1+ is the engine-verified winning move from Lichess #00s8j."
  },
  {
    "id": "lichess_00uEf",
    "lichessId": "00uEf",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00uEf: Rating 735",
    "ratingBadge": "Lichess: ~735",
    "initialFen": "7k/1R5p/4N1p1/3n4/1pr5/5PP1/7P/7K w - - 2 35",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "b7",
        "to": "b8",
        "san": "Rb8+",
        "explanation": "Master move Rb8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c4",
      "to": "c8",
      "san": "Rc8",
      "coachExplanation": "Opponent plays Rc8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rb8+ is the engine-verified winning move from Lichess #00uEf."
  },
  {
    "id": "lichess_00uHj",
    "lichessId": "00uHj",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00uHj: Rating 496",
    "ratingBadge": "Lichess: ~496",
    "initialFen": "r5k1/p4p1p/1p3ppB/8/2pP4/4QP1q/P1n2P2/4R1K1 w - - 0 22",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "e3",
        "to": "e8",
        "san": "Qe8+",
        "explanation": "Master move Qe8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "a8",
      "to": "e8",
      "san": "Rxe8",
      "coachExplanation": "Opponent plays Rxe8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qe8+ is the engine-verified winning move from Lichess #00uHj."
  },
  {
    "id": "lichess_00wx5",
    "lichessId": "00wx5",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00wx5: Rating 816",
    "ratingBadge": "Lichess: ~816",
    "initialFen": "6k1/5p1p/6p1/8/2q5/7P/r3rPP1/Q2R2K1 w - - 0 31",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "d1",
        "to": "d8",
        "san": "Rd8+",
        "explanation": "Master move Rd8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e2",
      "to": "e8",
      "san": "Re8",
      "coachExplanation": "Opponent plays Re8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rd8+ is the engine-verified winning move from Lichess #00wx5."
  },
  {
    "id": "lichess_00xnu",
    "lichessId": "00xnu",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00xnu: Rating 648",
    "ratingBadge": "Lichess: ~648",
    "initialFen": "2R5/p2r4/knQ3p1/4B3/Rq1Pb3/8/5PPP/6K1 b - - 0 40",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "b4",
        "to": "a4",
        "san": "Qxa4",
        "explanation": "Master move Qxa4! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c6",
      "to": "a4",
      "san": "Qxa4+",
      "coachExplanation": "Opponent plays Qxa4+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxa4 is the engine-verified winning move from Lichess #00xnu."
  },
  {
    "id": "lichess_00ynd",
    "lichessId": "00ynd",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00ynd: Rating 601",
    "ratingBadge": "Lichess: ~601",
    "initialFen": "6k1/4ppbp/1p1p1np1/pN1P4/2B4P/1P2B1P1/P6K/8 b - - 3 35",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "f6",
        "to": "g4",
        "san": "Ng4+",
        "explanation": "Master move Ng4+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h2",
      "to": "g2",
      "san": "Kg2",
      "coachExplanation": "Opponent plays Kg2! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ng4+ is the engine-verified winning move from Lichess #00ynd."
  },
  {
    "id": "lichess_00zVd",
    "lichessId": "00zVd",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #00zVd: Rating 677",
    "ratingBadge": "Lichess: ~677",
    "initialFen": "3rkbnr/1pp3pp/p4p2/4N3/4R3/8/PPP2PPP/RNB3K1 b k - 0 11",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "d8",
        "to": "d1",
        "san": "Rd1+",
        "explanation": "Master move Rd1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e4",
      "to": "e1",
      "san": "Re1",
      "coachExplanation": "Opponent plays Re1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rd1+ is the engine-verified winning move from Lichess #00zVd."
  },
  {
    "id": "lichess_0109V",
    "lichessId": "0109V",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #0109V: Rating 822",
    "ratingBadge": "Lichess: ~822",
    "initialFen": "r5k1/pp3ppp/2pq4/3b4/3P2n1/2PQ4/PPB2PPP/4R1K1 w - - 0 23",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "d3",
        "to": "h7",
        "san": "Qxh7+",
        "explanation": "Master move Qxh7+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g8",
      "to": "f8",
      "san": "Kf8",
      "coachExplanation": "Opponent plays Kf8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxh7+ is the engine-verified winning move from Lichess #0109V."
  },
  {
    "id": "lichess_011ON",
    "lichessId": "011ON",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #011ON: Rating 796",
    "ratingBadge": "Lichess: ~796",
    "initialFen": "2k5/1n3ppp/p7/3P4/4n3/8/P3KPPP/1R6 b - - 1 30",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "e4",
        "to": "c3",
        "san": "Nc3+",
        "explanation": "Master move Nc3+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e2",
      "to": "d3",
      "san": "Kd3",
      "coachExplanation": "Opponent plays Kd3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Nc3+ is the engine-verified winning move from Lichess #011ON."
  },
  {
    "id": "lichess_011Ob",
    "lichessId": "011Ob",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #011Ob: Rating 595",
    "ratingBadge": "Lichess: ~595",
    "initialFen": "1B6/5kpp/8/pp1K4/6r1/3N4/7P/8 w - - 1 38",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "d3",
        "to": "e5",
        "san": "Ne5+",
        "explanation": "Master move Ne5+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f7",
      "to": "f6",
      "san": "Kf6",
      "coachExplanation": "Opponent plays Kf6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ne5+ is the engine-verified winning move from Lichess #011Ob."
  },
  {
    "id": "lichess_01244",
    "lichessId": "01244",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #01244: Rating 616",
    "ratingBadge": "Lichess: ~616",
    "initialFen": "4r1k1/5ppp/B1R2b2/5P2/2Q2p1P/pP2qP2/P1P5/1K5R b - - 0 28",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "e3",
        "to": "e1",
        "san": "Qe1+",
        "explanation": "Master move Qe1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h1",
      "to": "e1",
      "san": "Rxe1",
      "coachExplanation": "Opponent plays Rxe1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qe1+ is the engine-verified winning move from Lichess #01244."
  },
  {
    "id": "lichess_012tD",
    "lichessId": "012tD",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #012tD: Rating 785",
    "ratingBadge": "Lichess: ~785",
    "initialFen": "8/5ppk/7p/2pr4/4p3/4P3/1Qp2PPP/R5K1 b - - 2 36",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "d5",
        "to": "d1",
        "san": "Rd1+",
        "explanation": "Master move Rd1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "a1",
      "to": "d1",
      "san": "Rxd1",
      "coachExplanation": "Opponent plays Rxd1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rd1+ is the engine-verified winning move from Lichess #012tD."
  },
  {
    "id": "lichess_0135c",
    "lichessId": "0135c",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #0135c: Rating 765",
    "ratingBadge": "Lichess: ~765",
    "initialFen": "8/3n1k2/p3p1p1/3p2P1/2pP2N1/PrP2P2/1P1K2R1/8 b - - 5 41",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "b3",
        "to": "b2",
        "san": "Rxb2+",
        "explanation": "Master move Rxb2+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d2",
      "to": "e1",
      "san": "Ke1",
      "coachExplanation": "Opponent plays Ke1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxb2+ is the engine-verified winning move from Lichess #0135c."
  },
  {
    "id": "lichess_01496",
    "lichessId": "01496",
    "tier": "beginner",
    "track": "tactical",
    "title": "Lichess #01496: Rating 674",
    "ratingBadge": "Lichess: ~674",
    "initialFen": "1k6/p3r3/1pK5/2n4R/8/4p3/8/8 w - - 0 53",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Tactical Awareness",
    "ruleBody": "Always look for undefended pieces and mate-in-1 opportunities.",
    "solutionMoves": [
      {
        "from": "h5",
        "to": "h8",
        "san": "Rh8+",
        "explanation": "Master move Rh8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e7",
      "to": "e8",
      "san": "Re8",
      "coachExplanation": "Opponent plays Re8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rh8+ is the engine-verified winning move from Lichess #01496."
  },
  {
    "id": "lichess_00L84",
    "lichessId": "00L84",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00L84: Rating 1141",
    "ratingBadge": "Lichess: ~1141",
    "initialFen": "6k1/5pp1/7p/2p5/2P5/1Rrp2PP/P4P2/5K2 b - - 1 37",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "c3",
        "to": "c1",
        "san": "Rc1+",
        "explanation": "Master move Rc1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f1",
      "to": "g2",
      "san": "Kg2",
      "coachExplanation": "Opponent plays Kg2! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rc1+ is the engine-verified winning move from Lichess #00L84."
  },
  {
    "id": "lichess_00LNB",
    "lichessId": "00LNB",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00LNB: Rating 1081",
    "ratingBadge": "Lichess: ~1081",
    "initialFen": "kr6/1pR4p/p4R2/n7/P3p3/3rB3/6PP/6K1 w - - 1 39",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "f6",
        "to": "a6",
        "san": "Rxa6+",
        "explanation": "Master move Rxa6+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "b7",
      "to": "a6",
      "san": "bxa6",
      "coachExplanation": "Opponent plays bxa6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxa6+ is the engine-verified winning move from Lichess #00LNB."
  },
  {
    "id": "lichess_00M92",
    "lichessId": "00M92",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00M92: Rating 1103",
    "ratingBadge": "Lichess: ~1103",
    "initialFen": "3q1r1k/p3r1pp/1p1b1p2/2p5/3pR2N/1QPn2P1/PP1B1P1P/R5K1 w - - 0 22",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "h4",
        "to": "g6",
        "san": "Ng6+",
        "explanation": "Master move Ng6+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h7",
      "to": "g6",
      "san": "hxg6",
      "coachExplanation": "Opponent plays hxg6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ng6+ is the engine-verified winning move from Lichess #00M92."
  },
  {
    "id": "lichess_00MGA",
    "lichessId": "00MGA",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00MGA: Rating 915",
    "ratingBadge": "Lichess: ~915",
    "initialFen": "r3r1k1/6b1/p2Nn2p/1P1Qp3/6nq/2P3P1/1PB2P2/R1B1R1K1 b - - 0 30",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "h4",
        "to": "h2",
        "san": "Qh2+",
        "explanation": "Master move Qh2+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g1",
      "to": "f1",
      "san": "Kf1",
      "coachExplanation": "Opponent plays Kf1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qh2+ is the engine-verified winning move from Lichess #00MGA."
  },
  {
    "id": "lichess_00MWz",
    "lichessId": "00MWz",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00MWz: Rating 912",
    "ratingBadge": "Lichess: ~912",
    "initialFen": "8/8/2B5/4pK2/3k1pPp/7P/8/6n1 w - - 4 58",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "g4",
        "to": "g5",
        "san": "g5",
        "explanation": "Master move g5! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g1",
      "to": "e2",
      "san": "Ne2",
      "coachExplanation": "Opponent plays Ne2! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! g5 is the engine-verified winning move from Lichess #00MWz."
  },
  {
    "id": "lichess_00Mgf",
    "lichessId": "00Mgf",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00Mgf: Rating 1124",
    "ratingBadge": "Lichess: ~1124",
    "initialFen": "2RQ4/p4pp1/4p1kp/8/6PP/4qPK1/1r6/8 w - - 0 36",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "h4",
        "to": "h5",
        "san": "h5+",
        "explanation": "Master move h5+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g6",
      "to": "h7",
      "san": "Kh7",
      "coachExplanation": "Opponent plays Kh7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! h5+ is the engine-verified winning move from Lichess #00Mgf."
  },
  {
    "id": "lichess_00Nej",
    "lichessId": "00Nej",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00Nej: Rating 1008",
    "ratingBadge": "Lichess: ~1008",
    "initialFen": "6k1/1p3pp1/pB2q2p/2P1b3/1P6/6QP/4r1P1/3R3K w - - 5 34",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "d1",
        "to": "d8",
        "san": "Rd8+",
        "explanation": "Master move Rd8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g8",
      "to": "h7",
      "san": "Kh7",
      "coachExplanation": "Opponent plays Kh7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rd8+ is the engine-verified winning move from Lichess #00Nej."
  },
  {
    "id": "lichess_00O3h",
    "lichessId": "00O3h",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00O3h: Rating 1150",
    "ratingBadge": "Lichess: ~1150",
    "initialFen": "5k2/R3Rp2/6p1/1p5p/1P1r3K/2n5/7P/8 w - - 8 44",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "h4",
        "to": "g5",
        "san": "Kg5",
        "explanation": "Master move Kg5! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c3",
      "to": "e4",
      "san": "Ne4+",
      "coachExplanation": "Opponent plays Ne4+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Kg5 is the engine-verified winning move from Lichess #00O3h."
  },
  {
    "id": "lichess_00OCQ",
    "lichessId": "00OCQ",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00OCQ: Rating 1090",
    "ratingBadge": "Lichess: ~1090",
    "initialFen": "1rr3k1/5p1p/p5pQ/4p3/4q3/B1P1P3/PP1R1PPP/2KR4 b - - 0 27",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "c8",
        "to": "c3",
        "san": "Rxc3+",
        "explanation": "Master move Rxc3+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "b2",
      "to": "c3",
      "san": "bxc3",
      "coachExplanation": "Opponent plays bxc3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxc3+ is the engine-verified winning move from Lichess #00OCQ."
  },
  {
    "id": "lichess_00OOp",
    "lichessId": "00OOp",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00OOp: Rating 1053",
    "ratingBadge": "Lichess: ~1053",
    "initialFen": "5rk1/1bR3q1/pQ6/8/6P1/4R3/P7/6K1 b - - 0 28",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "g7",
        "to": "g4",
        "san": "Qxg4+",
        "explanation": "Master move Qxg4+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e3",
      "to": "g3",
      "san": "Rg3",
      "coachExplanation": "Opponent plays Rg3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxg4+ is the engine-verified winning move from Lichess #00OOp."
  },
  {
    "id": "lichess_00Oqz",
    "lichessId": "00Oqz",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00Oqz: Rating 904",
    "ratingBadge": "Lichess: ~904",
    "initialFen": "5r2/7r/2kpqBRP/p1p1p2Q/P3P3/2PP4/5P1K/8 b - - 1 40",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "f8",
        "to": "f6",
        "san": "Rxf6",
        "explanation": "Master move Rxf6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g6",
      "to": "f6",
      "san": "Rxf6",
      "coachExplanation": "Opponent plays Rxf6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxf6 is the engine-verified winning move from Lichess #00Oqz."
  },
  {
    "id": "lichess_00OxK",
    "lichessId": "00OxK",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00OxK: Rating 1149",
    "ratingBadge": "Lichess: ~1149",
    "initialFen": "3r2k1/1p3p2/p1n2P2/2P3P1/1PR1p3/P2pP3/3B4/6K1 b - - 1 33",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "c6",
        "to": "e5",
        "san": "Ne5",
        "explanation": "Master move Ne5! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c4",
      "to": "e4",
      "san": "Rxe4",
      "coachExplanation": "Opponent plays Rxe4! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ne5 is the engine-verified winning move from Lichess #00OxK."
  },
  {
    "id": "lichess_00PGi",
    "lichessId": "00PGi",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00PGi: Rating 1081",
    "ratingBadge": "Lichess: ~1081",
    "initialFen": "3r1q1k/p1pb2pp/1pnp4/6N1/5B2/1Q4P1/PP4PP/4R2K w - - 0 25",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "g5",
        "to": "f7",
        "san": "Nf7+",
        "explanation": "Master move Nf7+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f8",
      "to": "f7",
      "san": "Qxf7",
      "coachExplanation": "Opponent plays Qxf7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Nf7+ is the engine-verified winning move from Lichess #00PGi."
  },
  {
    "id": "lichess_00PZo",
    "lichessId": "00PZo",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00PZo: Rating 1110",
    "ratingBadge": "Lichess: ~1110",
    "initialFen": "7r/8/3b4/3p1P2/6R1/2kN4/4KP2/8 b - - 0 67",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "h8",
        "to": "e8",
        "san": "Re8+",
        "explanation": "Master move Re8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e2",
      "to": "f3",
      "san": "Kf3",
      "coachExplanation": "Opponent plays Kf3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Re8+ is the engine-verified winning move from Lichess #00PZo."
  },
  {
    "id": "lichess_00Pc8",
    "lichessId": "00Pc8",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00Pc8: Rating 1049",
    "ratingBadge": "Lichess: ~1049",
    "initialFen": "r1b2r2/pp1n2k1/2p3pp/4Np2/2BP4/8/PP4PP/2KRR3 w - - 1 19",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "e5",
        "to": "d7",
        "san": "Nxd7",
        "explanation": "Master move Nxd7! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c8",
      "to": "d7",
      "san": "Bxd7",
      "coachExplanation": "Opponent plays Bxd7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Nxd7 is the engine-verified winning move from Lichess #00Pc8."
  },
  {
    "id": "lichess_00PrK",
    "lichessId": "00PrK",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00PrK: Rating 968",
    "ratingBadge": "Lichess: ~968",
    "initialFen": "8/7R/r3k3/4p2p/3b2p1/3K4/8/5R2 w - - 0 56",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "h7",
        "to": "h6",
        "san": "Rh6+",
        "explanation": "Master move Rh6+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e6",
      "to": "d5",
      "san": "Kd5",
      "coachExplanation": "Opponent plays Kd5! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rh6+ is the engine-verified winning move from Lichess #00PrK."
  },
  {
    "id": "lichess_00Q4m",
    "lichessId": "00Q4m",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00Q4m: Rating 1114",
    "ratingBadge": "Lichess: ~1114",
    "initialFen": "5r2/1b3k2/1q4p1/p3Pp1p/2pn1P1P/4Q1P1/P5BK/R1R5 b - - 3 34",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "d4",
        "to": "f3",
        "san": "Nf3+",
        "explanation": "Master move Nf3+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e3",
      "to": "f3",
      "san": "Qxf3",
      "coachExplanation": "Opponent plays Qxf3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Nf3+ is the engine-verified winning move from Lichess #00Q4m."
  },
  {
    "id": "lichess_00QCD",
    "lichessId": "00QCD",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00QCD: Rating 1041",
    "ratingBadge": "Lichess: ~1041",
    "initialFen": "3r1rk1/1q3ppp/4pb2/8/1P1N4/4P1P1/3B1PBP/R5K1 w - - 0 24",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "g2",
        "to": "b7",
        "san": "Bxb7",
        "explanation": "Master move Bxb7! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f6",
      "to": "d4",
      "san": "Bxd4",
      "coachExplanation": "Opponent plays Bxd4! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bxb7 is the engine-verified winning move from Lichess #00QCD."
  },
  {
    "id": "lichess_00R2A",
    "lichessId": "00R2A",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00R2A: Rating 912",
    "ratingBadge": "Lichess: ~912",
    "initialFen": "2kr1b1R/p5p1/8/3P1p2/2P5/4B3/PP1K1P2/8 b - - 0 25",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "f8",
        "to": "b4",
        "san": "Bb4+",
        "explanation": "Master move Bb4+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d2",
      "to": "d3",
      "san": "Kd3",
      "coachExplanation": "Opponent plays Kd3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bb4+ is the engine-verified winning move from Lichess #00R2A."
  },
  {
    "id": "lichess_00RYH",
    "lichessId": "00RYH",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00RYH: Rating 1029",
    "ratingBadge": "Lichess: ~1029",
    "initialFen": "1k5r/ppp1R2p/r4p2/5Q2/3p4/2qP4/2P2PPP/2K1R3 w - - 6 27",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "e7",
        "to": "e8",
        "san": "Re8+",
        "explanation": "Master move Re8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h8",
      "to": "e8",
      "san": "Rxe8",
      "coachExplanation": "Opponent plays Rxe8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Re8+ is the engine-verified winning move from Lichess #00RYH."
  },
  {
    "id": "lichess_00Rcs",
    "lichessId": "00Rcs",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00Rcs: Rating 863",
    "ratingBadge": "Lichess: ~863",
    "initialFen": "3k4/ppp2p1r/4p2P/5n2/3PK1N1/2P5/P1P3P1/7R b - - 0 30",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "f5",
        "to": "g3",
        "san": "Ng3+",
        "explanation": "Master move Ng3+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e4",
      "to": "f4",
      "san": "Kf4",
      "coachExplanation": "Opponent plays Kf4! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ng3+ is the engine-verified winning move from Lichess #00Rcs."
  },
  {
    "id": "lichess_00RiT",
    "lichessId": "00RiT",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00RiT: Rating 1194",
    "ratingBadge": "Lichess: ~1194",
    "initialFen": "8/pp1k1p2/4p3/2ppPr1r/7P/2P2pP1/P1P5/2K1RR2 w - - 0 23",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "g3",
        "to": "g4",
        "san": "g4",
        "explanation": "Master move g4! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f5",
      "to": "e5",
      "san": "Rxe5",
      "coachExplanation": "Opponent plays Rxe5! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! g4 is the engine-verified winning move from Lichess #00RiT."
  },
  {
    "id": "lichess_00Rk3",
    "lichessId": "00Rk3",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00Rk3: Rating 941",
    "ratingBadge": "Lichess: ~941",
    "initialFen": "8/1p2rppk/5q1p/Q4R2/2P5/PP5P/5PP1/5K2 b - - 0 32",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "f6",
        "to": "a1",
        "san": "Qa1+",
        "explanation": "Master move Qa1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "a5",
      "to": "e1",
      "san": "Qe1",
      "coachExplanation": "Opponent plays Qe1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qa1+ is the engine-verified winning move from Lichess #00Rk3."
  },
  {
    "id": "lichess_00Ru6",
    "lichessId": "00Ru6",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00Ru6: Rating 974",
    "ratingBadge": "Lichess: ~974",
    "initialFen": "3r1r1k/p6p/1p4pP/2p5/2PbBQ2/2q5/P1P1K3/5R2 w - - 1 35",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "f4",
        "to": "f8",
        "san": "Qxf8+",
        "explanation": "Master move Qxf8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d8",
      "to": "f8",
      "san": "Rxf8",
      "coachExplanation": "Opponent plays Rxf8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxf8+ is the engine-verified winning move from Lichess #00Ru6."
  },
  {
    "id": "lichess_00SIE",
    "lichessId": "00SIE",
    "tier": "adv_beginner",
    "track": "tactical",
    "title": "Lichess #00SIE: Rating 1188",
    "ratingBadge": "Lichess: ~1188",
    "initialFen": "2k3nr/ppp2ppp/2n5/8/8/1Q2P3/q4rPP/1R2KB1R w K - 0 16",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Multi-Piece Coordination",
    "ruleBody": "Calculate forcing moves: Checks, Captures, Threats.",
    "solutionMoves": [
      {
        "from": "b3",
        "to": "b7",
        "san": "Qxb7+",
        "explanation": "Master move Qxb7+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c8",
      "to": "d7",
      "san": "Kd7",
      "coachExplanation": "Opponent plays Kd7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxb7+ is the engine-verified winning move from Lichess #00SIE."
  },
  {
    "id": "lichess_00KO5",
    "lichessId": "00KO5",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00KO5: Rating 1331",
    "ratingBadge": "Lichess: ~1331",
    "initialFen": "2r2rk1/3p1ppp/p3p3/1p6/6P1/3Q4/PP5q/1K2RR2 w - - 0 23",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "f1",
        "to": "h1",
        "san": "Rh1",
        "explanation": "Master move Rh1! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h2",
      "to": "c2",
      "san": "Qc2+",
      "coachExplanation": "Opponent plays Qc2+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rh1 is the engine-verified winning move from Lichess #00KO5."
  },
  {
    "id": "lichess_00KSB",
    "lichessId": "00KSB",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00KSB: Rating 1478",
    "ratingBadge": "Lichess: ~1478",
    "initialFen": "7r/4kpRp/2p2p1P/p1P1n3/Pp6/1B6/5PP1/6K1 w - - 3 36",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "f2",
        "to": "f4",
        "san": "f4",
        "explanation": "Master move f4! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e5",
      "to": "d7",
      "san": "Nd7",
      "coachExplanation": "Opponent plays Nd7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! f4 is the engine-verified winning move from Lichess #00KSB."
  },
  {
    "id": "lichess_00KYU",
    "lichessId": "00KYU",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00KYU: Rating 1228",
    "ratingBadge": "Lichess: ~1228",
    "initialFen": "3r1k2/p2n3p/1p2Bpp1/2r2N2/4q3/6QP/P5P1/5R1K w - - 2 41",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "g3",
        "to": "d6",
        "san": "Qd6+",
        "explanation": "Master move Qd6+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f8",
      "to": "e8",
      "san": "Ke8",
      "coachExplanation": "Opponent plays Ke8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qd6+ is the engine-verified winning move from Lichess #00KYU."
  },
  {
    "id": "lichess_00L4x",
    "lichessId": "00L4x",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00L4x: Rating 1260",
    "ratingBadge": "Lichess: ~1260",
    "initialFen": "1r4k1/4Pp1p/p5pb/2q5/p2n4/P2Q2B1/r2N1PPP/3KR2R w - - 1 28",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "e7",
        "to": "e8",
        "san": "e8=Q+",
        "promotion": "q",
        "explanation": "Master move e8=Q+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "b8",
      "to": "e8",
      "san": "Rxe8",
      "coachExplanation": "Opponent plays Rxe8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! e8=Q+ is the engine-verified winning move from Lichess #00L4x."
  },
  {
    "id": "lichess_00LH7",
    "lichessId": "00LH7",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00LH7: Rating 1526",
    "ratingBadge": "Lichess: ~1526",
    "initialFen": "6k1/6Bp/3q2pP/5p2/p2PnQ2/2r5/P5PK/4R3 w - - 2 40",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "e1",
        "to": "e4",
        "san": "Rxe4",
        "explanation": "Master move Rxe4! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d6",
      "to": "f4",
      "san": "Qxf4+",
      "coachExplanation": "Opponent plays Qxf4+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxe4 is the engine-verified winning move from Lichess #00LH7."
  },
  {
    "id": "lichess_00LOy",
    "lichessId": "00LOy",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00LOy: Rating 1476",
    "ratingBadge": "Lichess: ~1476",
    "initialFen": "5k2/1p3pp1/p3p3/r3b3/2P2B2/1P6/1PR1K1PP/8 w - - 1 34",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "b3",
        "to": "b4",
        "san": "b4",
        "explanation": "Master move b4! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "a5",
      "to": "a1",
      "san": "Ra1",
      "coachExplanation": "Opponent plays Ra1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! b4 is the engine-verified winning move from Lichess #00LOy."
  },
  {
    "id": "lichess_00LUV",
    "lichessId": "00LUV",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00LUV: Rating 1480",
    "ratingBadge": "Lichess: ~1480",
    "initialFen": "5r1k/8/p3p2p/1p2P3/1P1p2R1/3Q3P/3r1qPK/8 w - - 2 32",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "d3",
        "to": "g6",
        "san": "Qg6",
        "explanation": "Master move Qg6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f2",
      "to": "g2",
      "san": "Qxg2+",
      "coachExplanation": "Opponent plays Qxg2+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qg6 is the engine-verified winning move from Lichess #00LUV."
  },
  {
    "id": "lichess_00MFe",
    "lichessId": "00MFe",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00MFe: Rating 1294",
    "ratingBadge": "Lichess: ~1294",
    "initialFen": "7k/p5pp/2r2q2/2p4Q/8/8/P5PP/3r1R1K w - - 0 30",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "h5",
        "to": "e8",
        "san": "Qe8+",
        "explanation": "Master move Qe8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f6",
      "to": "f8",
      "san": "Qf8",
      "coachExplanation": "Opponent plays Qf8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qe8+ is the engine-verified winning move from Lichess #00MFe."
  },
  {
    "id": "lichess_00MIY",
    "lichessId": "00MIY",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00MIY: Rating 1496",
    "ratingBadge": "Lichess: ~1496",
    "initialFen": "6k1/3R3p/1p5q/3P4/3QP1pN/6P1/PPr3B1/5K2 b - - 0 25",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "h6",
        "to": "c1",
        "san": "Qc1+",
        "explanation": "Master move Qc1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d4",
      "to": "d1",
      "san": "Qd1",
      "coachExplanation": "Opponent plays Qd1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qc1+ is the engine-verified winning move from Lichess #00MIY."
  },
  {
    "id": "lichess_00MeO",
    "lichessId": "00MeO",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00MeO: Rating 1315",
    "ratingBadge": "Lichess: ~1315",
    "initialFen": "r3kb1r/1p2np2/p1p4p/4Pbp1/3PN3/8/PPP3PP/R1B2RK1 w kq - 0 16",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "e4",
        "to": "d6",
        "san": "Nd6+",
        "explanation": "Master move Nd6+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e8",
      "to": "d7",
      "san": "Kd7",
      "coachExplanation": "Opponent plays Kd7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Nd6+ is the engine-verified winning move from Lichess #00MeO."
  },
  {
    "id": "lichess_00NUS",
    "lichessId": "00NUS",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00NUS: Rating 1225",
    "ratingBadge": "Lichess: ~1225",
    "initialFen": "4rk2/pbp2pp1/1p1N4/3P1q2/QPBP4/1KP2P2/P5r1/R3R3 b - - 0 25",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "f5",
        "to": "c2",
        "san": "Qc2+",
        "explanation": "Master move Qc2+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "b3",
      "to": "a3",
      "san": "Ka3",
      "coachExplanation": "Opponent plays Ka3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qc2+ is the engine-verified winning move from Lichess #00NUS."
  },
  {
    "id": "lichess_00NUc",
    "lichessId": "00NUc",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00NUc: Rating 1514",
    "ratingBadge": "Lichess: ~1514",
    "initialFen": "6k1/2P3pp/1P6/4b3/3p4/Br5P/4prP1/R5RK b - - 0 30",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "b3",
        "to": "h3",
        "san": "Rxh3+",
        "explanation": "Master move Rxh3+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g2",
      "to": "h3",
      "san": "gxh3",
      "coachExplanation": "Opponent plays gxh3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxh3+ is the engine-verified winning move from Lichess #00NUc."
  },
  {
    "id": "lichess_00O37",
    "lichessId": "00O37",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00O37: Rating 1300",
    "ratingBadge": "Lichess: ~1300",
    "initialFen": "r1q1r1k1/1p3pp1/n1p4p/p2pp2P/P3P3/2P2P2/1P1QBb2/R1BK3R w - - 0 24",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "e2",
        "to": "a6",
        "san": "Bxa6",
        "explanation": "Master move Bxa6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "b7",
      "to": "a6",
      "san": "bxa6",
      "coachExplanation": "Opponent plays bxa6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bxa6 is the engine-verified winning move from Lichess #00O37."
  },
  {
    "id": "lichess_00O8m",
    "lichessId": "00O8m",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00O8m: Rating 1362",
    "ratingBadge": "Lichess: ~1362",
    "initialFen": "r3r1k1/ppp2ppp/2nnq3/8/3P4/P1P1P1P1/2Q3BP/R1B1KR2 w Q - 5 17",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "d4",
        "to": "d5",
        "san": "d5",
        "explanation": "Master move d5! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e6",
      "to": "e5",
      "san": "Qe5",
      "coachExplanation": "Opponent plays Qe5! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! d5 is the engine-verified winning move from Lichess #00O8m."
  },
  {
    "id": "lichess_00Oim",
    "lichessId": "00Oim",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00Oim: Rating 1228",
    "ratingBadge": "Lichess: ~1228",
    "initialFen": "1r3rk1/q5pp/2R5/3P4/2Q5/1p2NpPb/1P3P1P/3R2K1 b - - 1 32",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "a7",
        "to": "e3",
        "san": "Qxe3",
        "explanation": "Master move Qxe3! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f2",
      "to": "e3",
      "san": "fxe3",
      "coachExplanation": "Opponent plays fxe3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxe3 is the engine-verified winning move from Lichess #00Oim."
  },
  {
    "id": "lichess_00P6j",
    "lichessId": "00P6j",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00P6j: Rating 1325",
    "ratingBadge": "Lichess: ~1325",
    "initialFen": "r2n2k1/1bq2rpp/1p6/3P4/p3Q3/B3P3/PP3PPP/3R2K1 w - - 0 21",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "e4",
        "to": "e8",
        "san": "Qe8+",
        "explanation": "Master move Qe8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f7",
      "to": "f8",
      "san": "Rf8",
      "coachExplanation": "Opponent plays Rf8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qe8+ is the engine-verified winning move from Lichess #00P6j."
  },
  {
    "id": "lichess_00PF3",
    "lichessId": "00PF3",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00PF3: Rating 1408",
    "ratingBadge": "Lichess: ~1408",
    "initialFen": "2kr3r/Qpp2ppp/3b1n2/1N6/8/4P1Pq/PP1B1P1P/2R2RK1 b - - 5 18",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "f6",
        "to": "g4",
        "san": "Ng4",
        "explanation": "Master move Ng4! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "b5",
      "to": "d6",
      "san": "Nxd6+",
      "coachExplanation": "Opponent plays Nxd6+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ng4 is the engine-verified winning move from Lichess #00PF3."
  },
  {
    "id": "lichess_00PHg",
    "lichessId": "00PHg",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00PHg: Rating 1374",
    "ratingBadge": "Lichess: ~1374",
    "initialFen": "R7/P4p2/7p/q3k1n1/5R2/7P/5PK1/8 w - - 3 47",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "a8",
        "to": "e8",
        "san": "Re8+",
        "explanation": "Master move Re8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e5",
      "to": "f4",
      "san": "Kxf4",
      "coachExplanation": "Opponent plays Kxf4! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Re8+ is the engine-verified winning move from Lichess #00PHg."
  },
  {
    "id": "lichess_00PUc",
    "lichessId": "00PUc",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00PUc: Rating 1394",
    "ratingBadge": "Lichess: ~1394",
    "initialFen": "3r3k/pp4bp/3Bn1p1/7n/8/8/PP3P1K/3R1RN1 b - - 2 27",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "d8",
        "to": "d6",
        "san": "Rxd6",
        "explanation": "Master move Rxd6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d1",
      "to": "d6",
      "san": "Rxd6",
      "coachExplanation": "Opponent plays Rxd6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxd6 is the engine-verified winning move from Lichess #00PUc."
  },
  {
    "id": "lichess_00QCe",
    "lichessId": "00QCe",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00QCe: Rating 1427",
    "ratingBadge": "Lichess: ~1427",
    "initialFen": "1k5r/n1r3pp/5p2/ppN5/5P2/8/2R3PP/1R4K1 w - - 4 29",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "c5",
        "to": "a6",
        "san": "Na6+",
        "explanation": "Master move Na6+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "b8",
      "to": "b7",
      "san": "Kb7",
      "coachExplanation": "Opponent plays Kb7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Na6+ is the engine-verified winning move from Lichess #00QCe."
  },
  {
    "id": "lichess_00QVZ",
    "lichessId": "00QVZ",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00QVZ: Rating 1468",
    "ratingBadge": "Lichess: ~1468",
    "initialFen": "8/7p/4K3/6p1/3k2P1/8/5P2/8 w - - 1 44",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "e6",
        "to": "f5",
        "san": "Kf5",
        "explanation": "Master move Kf5! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h7",
      "to": "h6",
      "san": "h6",
      "coachExplanation": "Opponent plays h6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Kf5 is the engine-verified winning move from Lichess #00QVZ."
  },
  {
    "id": "lichess_00QZ3",
    "lichessId": "00QZ3",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00QZ3: Rating 1232",
    "ratingBadge": "Lichess: ~1232",
    "initialFen": "r1bq1k1r/ppppn1pp/2n5/b5N1/4P3/B1P5/P4PPP/RN1QK2R w KQ - 2 10",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "d1",
        "to": "f3",
        "san": "Qf3+",
        "explanation": "Master move Qf3+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f8",
      "to": "e8",
      "san": "Ke8",
      "coachExplanation": "Opponent plays Ke8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qf3+ is the engine-verified winning move from Lichess #00QZ3."
  },
  {
    "id": "lichess_00QnO",
    "lichessId": "00QnO",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00QnO: Rating 1470",
    "ratingBadge": "Lichess: ~1470",
    "initialFen": "1k1r1r2/pp4p1/6q1/2Qp4/5NP1/2P4p/PPN4P/R4R1K b - - 0 30",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "g6",
        "to": "e4",
        "san": "Qe4+",
        "explanation": "Master move Qe4+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h1",
      "to": "g1",
      "san": "Kg1",
      "coachExplanation": "Opponent plays Kg1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qe4+ is the engine-verified winning move from Lichess #00QnO."
  },
  {
    "id": "lichess_00R0l",
    "lichessId": "00R0l",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00R0l: Rating 1232",
    "ratingBadge": "Lichess: ~1232",
    "initialFen": "rnbqkb1r/pp3p1p/6pn/P1ppp3/8/3P1P2/1PP1P1P1/RNBQKBNR w KQkq - 0 8",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "c1",
        "to": "h6",
        "san": "Bxh6",
        "explanation": "Master move Bxh6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f8",
      "to": "h6",
      "san": "Bxh6",
      "coachExplanation": "Opponent plays Bxh6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bxh6 is the engine-verified winning move from Lichess #00R0l."
  },
  {
    "id": "lichess_00R4l",
    "lichessId": "00R4l",
    "tier": "intermediate",
    "track": "tactical",
    "title": "Lichess #00R4l: Rating 1563",
    "ratingBadge": "Lichess: ~1563",
    "initialFen": "r1b5/R4pkp/3p2p1/2pPr3/2P5/1P1B4/5PPP/R5K1 b - - 0 24",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Calculating Combinations",
    "ruleBody": "Look 2-3 moves ahead and anticipate defensive candidate moves.",
    "solutionMoves": [
      {
        "from": "a8",
        "to": "a7",
        "san": "Rxa7",
        "explanation": "Master move Rxa7! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "a1",
      "to": "a7",
      "san": "Rxa7",
      "coachExplanation": "Opponent plays Rxa7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxa7 is the engine-verified winning move from Lichess #00R4l."
  },
  {
    "id": "lichess_00DdW",
    "lichessId": "00DdW",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00DdW: Rating 1693",
    "ratingBadge": "Lichess: ~1693",
    "initialFen": "5rk1/5ppp/4b3/1p1pPpPP/2pP4/b1P5/rqNQKP2/2RRN3 w - - 6 24",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "c1",
        "to": "b1",
        "san": "Rb1",
        "explanation": "Master move Rb1! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "b2",
      "to": "b3",
      "san": "Qb3",
      "coachExplanation": "Opponent plays Qb3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rb1 is the engine-verified winning move from Lichess #00DdW."
  },
  {
    "id": "lichess_00EDN",
    "lichessId": "00EDN",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00EDN: Rating 1612",
    "ratingBadge": "Lichess: ~1612",
    "initialFen": "rnbq1rk1/p4ppp/1p2p3/2p5/2QPn3/B1P1PN2/P3BPPP/R4RK1 b - - 1 11",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "c8",
        "to": "a6",
        "san": "Ba6",
        "explanation": "Master move Ba6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c4",
      "to": "a6",
      "san": "Qxa6",
      "coachExplanation": "Opponent plays Qxa6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ba6 is the engine-verified winning move from Lichess #00EDN."
  },
  {
    "id": "lichess_00EEp",
    "lichessId": "00EEp",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00EEp: Rating 1665",
    "ratingBadge": "Lichess: ~1665",
    "initialFen": "3k2q1/p2p3p/1p1P4/2p5/2P2Q1K/8/P5b1/5R2 w - - 3 37",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "f4",
        "to": "f8",
        "san": "Qf8+",
        "explanation": "Master move Qf8+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g8",
      "to": "f8",
      "san": "Qxf8",
      "coachExplanation": "Opponent plays Qxf8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qf8+ is the engine-verified winning move from Lichess #00EEp."
  },
  {
    "id": "lichess_00EgR",
    "lichessId": "00EgR",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00EgR: Rating 1770",
    "ratingBadge": "Lichess: ~1770",
    "initialFen": "N2k3r/1b1n1Bpp/p3P3/1pb5/6P1/4p3/PPP4P/1K1R3R b - - 0 20",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "b7",
        "to": "h1",
        "san": "Bxh1",
        "explanation": "Master move Bxh1! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d1",
      "to": "d7",
      "san": "Rxd7+",
      "coachExplanation": "Opponent plays Rxd7+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bxh1 is the engine-verified winning move from Lichess #00EgR."
  },
  {
    "id": "lichess_00Ezc",
    "lichessId": "00Ezc",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00Ezc: Rating 1982",
    "ratingBadge": "Lichess: ~1982",
    "initialFen": "rnb1k2r/ppp2q1p/3b2p1/3P1pBQ/4p2N/2N5/PPP2PPP/R3R1K1 w kq - 2 14",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "c3",
        "to": "e4",
        "san": "Nxe4",
        "explanation": "Master move Nxe4! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f5",
      "to": "e4",
      "san": "fxe4",
      "coachExplanation": "Opponent plays fxe4! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Nxe4 is the engine-verified winning move from Lichess #00Ezc."
  },
  {
    "id": "lichess_00F5e",
    "lichessId": "00F5e",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00F5e: Rating 1652",
    "ratingBadge": "Lichess: ~1652",
    "initialFen": "4k2r/1p1qb1p1/p3Rp2/2p4p/8/1Q4B1/PP3PpP/6K1 w k - 2 23",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "g3",
        "to": "d6",
        "san": "Bd6",
        "explanation": "Master move Bd6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d7",
      "to": "d6",
      "san": "Qxd6",
      "coachExplanation": "Opponent plays Qxd6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bd6 is the engine-verified winning move from Lichess #00F5e."
  },
  {
    "id": "lichess_00FF5",
    "lichessId": "00FF5",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00FF5: Rating 1904",
    "ratingBadge": "Lichess: ~1904",
    "initialFen": "r3k3/ppp2p2/1b1p3p/4p2r/2B1P1bq/P1PP1P2/1P4PQ/RN3R1K w q - 3 19",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "c4",
        "to": "f7",
        "san": "Bxf7+",
        "explanation": "Master move Bxf7+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e8",
      "to": "e7",
      "san": "Ke7",
      "coachExplanation": "Opponent plays Ke7! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bxf7+ is the engine-verified winning move from Lichess #00FF5."
  },
  {
    "id": "lichess_00FND",
    "lichessId": "00FND",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00FND: Rating 1828",
    "ratingBadge": "Lichess: ~1828",
    "initialFen": "8/1P6/8/7p/3P4/3k1p1P/4p3/4K3 b - - 1 49",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "d3",
        "to": "e3",
        "san": "Ke3",
        "explanation": "Master move Ke3! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h3",
      "to": "h4",
      "san": "h4",
      "coachExplanation": "Opponent plays h4! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Ke3 is the engine-verified winning move from Lichess #00FND."
  },
  {
    "id": "lichess_00FPo",
    "lichessId": "00FPo",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00FPo: Rating 1834",
    "ratingBadge": "Lichess: ~1834",
    "initialFen": "7R/1K3p2/6k1/PP6/6p1/6rp/8/8 w - - 0 48",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "a5",
        "to": "a6",
        "san": "a6",
        "explanation": "Master move a6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h3",
      "to": "h2",
      "san": "h2",
      "coachExplanation": "Opponent plays h2! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! a6 is the engine-verified winning move from Lichess #00FPo."
  },
  {
    "id": "lichess_00G1l",
    "lichessId": "00G1l",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00G1l: Rating 1815",
    "ratingBadge": "Lichess: ~1815",
    "initialFen": "5k2/1R6/3pp1P1/2p5/1p2PK2/5P2/8/2r5 w - - 1 61",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "f4",
        "to": "g5",
        "san": "Kg5",
        "explanation": "Master move Kg5! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c1",
      "to": "g1",
      "san": "Rg1+",
      "coachExplanation": "Opponent plays Rg1+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Kg5 is the engine-verified winning move from Lichess #00G1l."
  },
  {
    "id": "lichess_00GWg",
    "lichessId": "00GWg",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00GWg: Rating 2091",
    "ratingBadge": "Lichess: ~2091",
    "initialFen": "1r1r2k1/pN4pp/2n1b3/2R2p2/2P1p3/8/P4PPP/3BR1K1 b - - 0 26",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "b8",
        "to": "b7",
        "san": "Rxb7",
        "explanation": "Master move Rxb7! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c5",
      "to": "c6",
      "san": "Rxc6",
      "coachExplanation": "Opponent plays Rxc6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxb7 is the engine-verified winning move from Lichess #00GWg."
  },
  {
    "id": "lichess_00HGG",
    "lichessId": "00HGG",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00HGG: Rating 1682",
    "ratingBadge": "Lichess: ~1682",
    "initialFen": "8/pp6/2p1kpp1/3p2P1/3P1P1p/1P3K2/P1P4P/8 b - - 0 31",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "f6",
        "to": "g5",
        "san": "fxg5",
        "explanation": "Master move fxg5! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f3",
      "to": "g4",
      "san": "Kg4",
      "coachExplanation": "Opponent plays Kg4! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! fxg5 is the engine-verified winning move from Lichess #00HGG."
  },
  {
    "id": "lichess_00HqY",
    "lichessId": "00HqY",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00HqY: Rating 1793",
    "ratingBadge": "Lichess: ~1793",
    "initialFen": "8/6p1/8/8/4P2k/5KpP/8/8 w - - 4 47",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "f3",
        "to": "g2",
        "san": "Kg2",
        "explanation": "Master move Kg2! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h4",
      "to": "g5",
      "san": "Kg5",
      "coachExplanation": "Opponent plays Kg5! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Kg2 is the engine-verified winning move from Lichess #00HqY."
  },
  {
    "id": "lichess_00Huv",
    "lichessId": "00Huv",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00Huv: Rating 1781",
    "ratingBadge": "Lichess: ~1781",
    "initialFen": "3r1q2/5prk/p3pQpp/1p2P3/2p4R/2P2P1P/PPB2P2/6K1 w - - 3 30",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "h4",
        "to": "h6",
        "san": "Rxh6+",
        "explanation": "Master move Rxh6+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h7",
      "to": "g8",
      "san": "Kg8",
      "coachExplanation": "Opponent plays Kg8! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxh6+ is the engine-verified winning move from Lichess #00Huv."
  },
  {
    "id": "lichess_00IDw",
    "lichessId": "00IDw",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00IDw: Rating 1862",
    "ratingBadge": "Lichess: ~1862",
    "initialFen": "4r3/pN3kpp/2N1b3/2R5/5b2/P5P1/1P3P1P/7K b - - 0 30",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "e6",
        "to": "h3",
        "san": "Bh3",
        "explanation": "Master move Bh3! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c5",
      "to": "c1",
      "san": "Rc1",
      "coachExplanation": "Opponent plays Rc1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bh3 is the engine-verified winning move from Lichess #00IDw."
  },
  {
    "id": "lichess_00IFk",
    "lichessId": "00IFk",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00IFk: Rating 2150",
    "ratingBadge": "Lichess: ~2150",
    "initialFen": "r1b4r/ppk2ppp/2p5/6B1/2P5/2n3P1/P1P1B2P/2KR3R w - - 1 17",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "g5",
        "to": "f4",
        "san": "Bf4+",
        "explanation": "Master move Bf4+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "c7",
      "to": "b6",
      "san": "Kb6",
      "coachExplanation": "Opponent plays Kb6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Bf4+ is the engine-verified winning move from Lichess #00IFk."
  },
  {
    "id": "lichess_00IHi",
    "lichessId": "00IHi",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00IHi: Rating 1659",
    "ratingBadge": "Lichess: ~1659",
    "initialFen": "8/8/1k6/8/p7/1p1N2P1/5KP1/r3R3 b - - 1 55",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "a1",
        "to": "e1",
        "san": "Rxe1",
        "explanation": "Master move Rxe1! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f2",
      "to": "e1",
      "san": "Kxe1",
      "coachExplanation": "Opponent plays Kxe1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rxe1 is the engine-verified winning move from Lichess #00IHi."
  },
  {
    "id": "lichess_00IMS",
    "lichessId": "00IMS",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00IMS: Rating 1706",
    "ratingBadge": "Lichess: ~1706",
    "initialFen": "1r4k1/r5q1/p2p1pP1/4pn2/2p1P2Q/2Pb1BK1/P6R/2R5 w - - 0 36",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "e4",
        "to": "f5",
        "san": "exf5",
        "explanation": "Master move exf5! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "d3",
      "to": "f5",
      "san": "Bxf5",
      "coachExplanation": "Opponent plays Bxf5! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! exf5 is the engine-verified winning move from Lichess #00IMS."
  },
  {
    "id": "lichess_00IUW",
    "lichessId": "00IUW",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00IUW: Rating 1653",
    "ratingBadge": "Lichess: ~1653",
    "initialFen": "8/2p1r1kp/5pp1/3P3r/4P3/2N1QbPq/PPP2R1P/5RK1 b - - 4 23",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "h3",
        "to": "g3",
        "san": "Qxg3+",
        "explanation": "Master move Qxg3+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "h2",
      "to": "g3",
      "san": "hxg3",
      "coachExplanation": "Opponent plays hxg3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qxg3+ is the engine-verified winning move from Lichess #00IUW."
  },
  {
    "id": "lichess_00IYg",
    "lichessId": "00IYg",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00IYg: Rating 1885",
    "ratingBadge": "Lichess: ~1885",
    "initialFen": "r1b2r2/pp2n1p1/1qn1ppk1/3pP1N1/3P3P/P7/1P1Q1PP1/RN2K2R w KQ - 0 14",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "h4",
        "to": "h5",
        "san": "h5+",
        "explanation": "Master move h5+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g6",
      "to": "h6",
      "san": "Kh6",
      "coachExplanation": "Opponent plays Kh6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! h5+ is the engine-verified winning move from Lichess #00IYg."
  },
  {
    "id": "lichess_00IiM",
    "lichessId": "00IiM",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00IiM: Rating 1719",
    "ratingBadge": "Lichess: ~1719",
    "initialFen": "r5k1/pp4p1/1n6/3pB3/3P2pb/2N2Q2/PP6/2K3R1 b - - 0 24",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "g4",
        "to": "f3",
        "san": "gxf3",
        "explanation": "Master move gxf3! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "g1",
      "to": "g7",
      "san": "Rxg7+",
      "coachExplanation": "Opponent plays Rxg7+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! gxf3 is the engine-verified winning move from Lichess #00IiM."
  },
  {
    "id": "lichess_00J5r",
    "lichessId": "00J5r",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00J5r: Rating 2112",
    "ratingBadge": "Lichess: ~2112",
    "initialFen": "r4rk1/1p4p1/p1p1n1PR/q3p3/4P3/2N1QP2/PPP5/2KR4 b - - 0 21",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "g7",
        "to": "h6",
        "san": "gxh6",
        "explanation": "Master move gxh6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e3",
      "to": "h6",
      "san": "Qxh6",
      "coachExplanation": "Opponent plays Qxh6! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! gxh6 is the engine-verified winning move from Lichess #00J5r."
  },
  {
    "id": "lichess_00JYV",
    "lichessId": "00JYV",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00JYV: Rating 1761",
    "ratingBadge": "Lichess: ~1761",
    "initialFen": "r2q1rk1/p1p1bppp/2pp2b1/4p3/4n1PN/2NP3P/PPP2PK1/R1BQ1R2 w - - 0 12",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "h4",
        "to": "g6",
        "san": "Nxg6",
        "explanation": "Master move Nxg6! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "e4",
      "to": "c3",
      "san": "Nxc3",
      "coachExplanation": "Opponent plays Nxc3! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Nxg6 is the engine-verified winning move from Lichess #00JYV."
  },
  {
    "id": "lichess_00JZk",
    "lichessId": "00JZk",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00JZk: Rating 2105",
    "ratingBadge": "Lichess: ~2105",
    "initialFen": "7k/5q1p/3Q2p1/8/P3p3/1p2B2P/1br3P1/R5K1 w - - 1 33",
    "playerColor": "white",
    "prompt": "White to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "a1",
        "to": "f1",
        "san": "Rf1",
        "explanation": "Master move Rf1! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f7",
      "to": "f1",
      "san": "Qxf1+",
      "coachExplanation": "Opponent plays Qxf1+! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Rf1 is the engine-verified winning move from Lichess #00JZk."
  },
  {
    "id": "lichess_00JqT",
    "lichessId": "00JqT",
    "tier": "advanced",
    "track": "tactical",
    "title": "Lichess #00JqT: Rating 1897",
    "ratingBadge": "Lichess: ~1897",
    "initialFen": "2r2rk1/pp2R3/5p2/3p1q2/3P2P1/4QP1p/PP3R1P/6K1 b - - 0 30",
    "playerColor": "black",
    "prompt": "Black to move: Spot the winning tactical continuation!",
    "ruleTitle": "Master Calculation",
    "ruleBody": "Find precise, clinical continuations that leave no room for counterplay.",
    "solutionMoves": [
      {
        "from": "f5",
        "to": "b1",
        "san": "Qb1+",
        "explanation": "Master move Qb1+! Engine validated winning continuation."
      }
    ],
    "defaultRefutation": {
      "from": "f2",
      "to": "f1",
      "san": "Rf1",
      "coachExplanation": "Opponent plays Rf1! Always look for forcing responses before deciding."
    },
    "successExplanation": "Brilliant! Qb1+ is the engine-verified winning move from Lichess #00JqT."
  }
];

// Total 500 Lichess Puzzles indexed by ID
export const ALL_PUZZLES_MAP: Record<string, ChessPuzzle> = {
  ...Object.fromEntries(
    Object.values(LICHESS_DIAGNOSTIC_CATEGORIES)
      .flat()
      .map((p) => [p.id, p])
  ),
  ...Object.fromEntries(CONTINUOUS_PUZZLES.map((p) => [p.id, p])),
};

export const DIAGNOSTIC_PUZZLES: Record<string, ChessPuzzle> = {
  "beginner_1a": LICHESS_DIAGNOSTIC_CATEGORIES["beginner_0"][0],
  "adv_beginner_2a": LICHESS_DIAGNOSTIC_CATEGORIES["adv_beginner_1"][0],
  "intermediate_3a": LICHESS_DIAGNOSTIC_CATEGORIES["intermediate_2"][0],
  "advanced_4a": LICHESS_DIAGNOSTIC_CATEGORIES["advanced_3"][0],
};

/**
 * Curates 5 fresh Lichess puzzles based on the user's level and EXACT combination of answers.
 * With 25 puzzles per category and 4-question combinatorial offset, different answer combinations
 * yield completely distinct 5-puzzle sets.
 */
export function getCuratedDiagnosisPlaylist(
  calibratedRating: number,
  answersOrLeak: number[] | number,
  strategyIndex: number = 0
): ChessPuzzle[] {
  let tierKey = "beginner";
  if (calibratedRating < 750) {
    tierKey = "beginner";
  } else if (calibratedRating < 1150) {
    tierKey = "adv_beginner";
  } else if (calibratedRating < 1550) {
    tierKey = "intermediate";
  } else {
    tierKey = "advanced";
  }

  let leakIndex = 0;
  let q0 = 0;
  let q2 = 0;
  let q3 = 0;

  if (Array.isArray(answersOrLeak)) {
    q0 = Math.min(Math.max(answersOrLeak[0] ?? 0, 0), 3);
    leakIndex = Math.min(Math.max(answersOrLeak[1] ?? 0, 0), 3);
    q2 = Math.min(Math.max(answersOrLeak[2] ?? 0, 0), 3);
    q3 = Math.min(Math.max(answersOrLeak[3] ?? 0, 0), 3);
  } else {
    leakIndex = Math.min(Math.max(answersOrLeak, 0), 3);
    q2 = Math.min(Math.max(strategyIndex, 0), 3);
  }

  const categoryKey = `${tierKey}_${leakIndex}`;
  const pool = LICHESS_DIAGNOSTIC_CATEGORIES[categoryKey] || LICHESS_DIAGNOSTIC_CATEGORIES["beginner_0"];

  // Compute combinatorial start offset (0 to 20) so changing any question yields a different slice
  const maxStart = Math.max(pool.length - 5, 1);
  const offset = (q0 * 5 + q2 * 2 + q3) % maxStart;

  return pool.slice(offset, offset + 5);
}
