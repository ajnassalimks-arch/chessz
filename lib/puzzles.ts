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

export const DIAGNOSTIC_PUZZLES: Record<string, ChessPuzzle> = {
  // Tier 1: Beginner
  "beginner_1a": {
    id: "beginner_1a",
    tier: "beginner",
    track: "tactical",
    branch: "1A",
    title: "The Hanging Knight",
    ratingBadge: "Chess.com: ~500",
    initialFen: "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
    playerColor: "white",
    prompt: "White to move: Black forgot their bodyguard! Find the free piece with zero defense.",
    ruleTitle: "The 2-Second Bodyguard Rule",
    ruleBody: "Before touching any piece, scan: Does this piece have a teammate protecting it? If not, it's a free gift.",
    solutionMoves: [
      { from: "d3", to: "e4", san: "dxe4", explanation: "You snapped up the unguarded knight for free!" }
    ],
    defaultRefutation: {
      from: "e4",
      to: "f6",
      san: "Nf6",
      coachExplanation: "Black played Nf6! Because you didn't grab the hanging piece, Black's knight sprinted back to safety. Scan the board for free unprotected pieces first!"
    },
    successExplanation: "Boom! You captured the unguarded knight on e4. Black forgot their bodyguard, giving you a completely free +3 point advantage!"
  },
  "beginner_1b": {
    id: "beginner_1b",
    tier: "beginner",
    track: "tactical",
    branch: "1B",
    title: "The Unshielded Battery",
    ratingBadge: "Chess.com: ~600",
    initialFen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
    playerColor: "white",
    prompt: "White to move: Black left their King completely vulnerable on f7. Deliver the knockout!",
    ruleTitle: "Look at Their Last Move First",
    ruleBody: "Never ask 'What do I want to do?' until you ask: 'Why did my opponent move there and what did they leave open?'",
    solutionMoves: [
      { from: "f3", to: "f7", san: "Qxf7#", explanation: "Checkmate on the f7 square!" }
    ],
    defaultRefutation: {
      from: "g8",
      to: "f6",
      san: "Nf6",
      coachExplanation: "Black played Nf6! By delaying, you let Black's knight jump in and shield the f7 weakness. When you have a direct mate-in-1, execute it immediately!"
    },
    successExplanation: "CHECKMATE! The Queen and Bishop battery strikes on f7. Black's king had nowhere to hide. Brilliant checkmate radar!"
  },
  "beginner_1c": {
    id: "beginner_1c",
    tier: "beginner",
    track: "tactical",
    branch: "1C",
    title: "The High-Value Target",
    ratingBadge: "Chess.com: ~700",
    initialFen: "r1bqkb1r/pppp1Npp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 1 6",
    playerColor: "white",
    prompt: "White to move: Your Knight forks both the Queen and the Rook. Pick the bigger prize!",
    ruleTitle: "The Piece Price Tag Rule",
    ruleBody: "Queen = 9 points, Rook = 5, Bishop/Knight = 3, Pawn = 1. Always prioritize winning the highest-value piece.",
    solutionMoves: [
      { from: "f7", to: "d8", san: "Nxd8", explanation: "You won the 9-point Queen!" }
    ],
    defaultRefutation: {
      from: "d8",
      to: "e7",
      san: "Qe7",
      coachExplanation: "Black played Qe7 to escape! If you took the Rook on h8 instead of the Queen, you left 4 extra points on the table. Always target the 9-point Queen first!"
    },
    successExplanation: "Tremendous trade! You captured Black's 9-point Queen for your 3-point Knight. That's a +6 point swing that wins the game easily."
  },

  // Tier 2: Advanced Beginner
  "adv_beginner_2a": {
    id: "adv_beginner_2a",
    tier: "adv_beginner",
    track: "tactical",
    branch: "2A",
    title: "The Same-Color Royal Fork",
    ratingBadge: "Chess.com: ~1000",
    initialFen: "r1b1k2r/pppp1ppp/2n5/3Np1q1/4P3/8/PPPP1PPP/R1BQKBNR w KQkq - 2 6",
    playerColor: "white",
    prompt: "White to move: Notice King (e8) and Rook (a8) on dark squares. Launch the royal fork!",
    ruleTitle: "The Same-Color Radar Rule",
    ruleBody: "Knights can only fork pieces standing on the EXACT same color square. When King and Rook share square color, strike!",
    solutionMoves: [
      { from: "d5", to: "c7", san: "Nxc7+", explanation: "Double attack on King and Rook!" }
    ],
    defaultRefutation: {
      from: "g5",
      to: "d8",
      san: "Qd8",
      coachExplanation: "Black retreated their Queen to d8 to guard c7! When two heavy pieces stand on the same color, strike instantly before they can react."
    },
    successExplanation: "Royal Fork! 1. Nxc7+ checks the King on e8 and hits the corner Rook on a8 simultaneously. Both were on dark squares — the radar was spot-on!"
  },
  "adv_beginner_2b": {
    id: "adv_beginner_2b",
    tier: "adv_beginner",
    track: "tactical",
    branch: "2B",
    title: "The Counter-Threat Strike",
    ratingBadge: "Chess.com: ~1100",
    initialFen: "r1b1kb1r/ppp2ppp/2n5/3q4/4n3/8/PPP2PPP/RNBQR1K1 w kq - 0 8",
    playerColor: "white",
    prompt: "White to move: Don't retreat passively! Find the active counter-attack on Black's Queen.",
    ruleTitle: "Counter-Threat Before Retreat",
    ruleBody: "Before retreating backwards when attacked, ask: 'Can I attack an even bigger target first?' Steal the tempo!",
    solutionMoves: [
      { from: "b1", to: "c3", san: "Nc3", explanation: "Attacking Black's Queen while the e4-knight is pinned!" }
    ],
    defaultRefutation: {
      from: "c8",
      to: "e6",
      san: "Be6",
      coachExplanation: "Black played Be6! Because you didn't counter-attack Black's Queen, Black protected their pinned piece. Always look for a counter-threat before retreating!"
    },
    successExplanation: "Masterclass! 1. Nc3! attacks Black's Queen. Because Black's e4-knight is pinned to their King by the Rook on e1, it cannot capture on c3. You win a piece next move!"
  },
  "adv_beginner_2c": {
    id: "adv_beginner_2c",
    tier: "adv_beginner",
    track: "tactical",
    branch: "2C",
    title: "Forcing Checks, Captures, Threats",
    ratingBadge: "Chess.com: ~1150",
    initialFen: "r2qk2r/ppp2ppp/2np4/2b1p3/2B1P1b1/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 1 7",
    playerColor: "white",
    prompt: "White to move: Black just pinned your knight with ...Bg4. Break the pin with a forcing C-C-T check!",
    ruleTitle: "The C-C-T Checklist",
    ruleBody: "Never make moves hoping for a mistake. Always calculate forcing Checks, Captures, and direct Threats first.",
    solutionMoves: [
      { from: "c4", to: "f7", san: "Bxf7+", explanation: "Sacrificing on f7 to strip Black's king of castling!" }
    ],
    defaultRefutation: {
      from: "c6",
      to: "d4",
      san: "Nd4",
      coachExplanation: "Black played Nd4! Piling unbearable pressure onto your pinned f3-knight. Forcing tactical checks like Bxf7+ solve the pressure proactively!"
    },
    successExplanation: "Sharp tactics! 1. Bxf7+! strips Black of castling rights. After 1... Kxf7 2. Ng5+ Ke8 3. Qxg4, White wins a healthy pawn and destroys Black's king safety."
  },

  // Tier 3: Intermediate
  "intermediate_3a": {
    id: "intermediate_3a",
    tier: "intermediate",
    track: "positional",
    branch: "3A",
    title: "Steinitz's Piece Rerouting",
    ratingBadge: "Chess.com: ~1400",
    initialFen: "r1b2rk1/pp3ppp/2n5/q2p4/3N4/2PB4/P1PQ1PPP/R3R1K1 w - - 0 1",
    playerColor: "white",
    prompt: "White to move: Refuse to push random pawns. Reroute with tempo against Black's Queen!",
    ruleTitle: "Steinitz's Worst-Placed Piece Principle",
    ruleBody: "When direct tactics are absent, identify your least active piece and reposition it with tempo to dominate the center.",
    solutionMoves: [
      { from: "d4", to: "b3", san: "Nb3", explanation: "Hitting Black's Queen with tempo and establishing control!" }
    ],
    defaultRefutation: {
      from: "c6",
      to: "d4",
      san: "Nxd4",
      coachExplanation: "Black initiated Nxd4, trading off your proud central piece and equalizing. Always reposition with tempo before Black simplifies the position!"
    },
    successExplanation: "Superb positional play! 1. Nb3! kicks Black's Queen from a5 with tempo, opens the d-file, and prevents Black from trading down on d4."
  },
  "intermediate_3b": {
    id: "intermediate_3b",
    tier: "intermediate",
    track: "tactical",
    branch: "3B",
    title: "The Classical Greek Gift",
    ratingBadge: "Chess.com: ~1500",
    initialFen: "r2q1rk1/pb1nbppp/1p2p3/2ppP3/3P4/2PB1N2/PP1NQPPP/R4RK1 w - - 0 12",
    playerColor: "white",
    prompt: "White to move: Black's king is undefended on the h-file. Trigger the Greek Gift sacrifice!",
    ruleTitle: "The Greek Gift Sacrifice Principle",
    ruleBody: "When your Queen and Knight are poised to invade on g5 and h5, sacrifice the Bishop on h7 to shatter the enemy king shield.",
    solutionMoves: [
      { from: "d3", to: "h7", san: "Bxh7+", explanation: "The Greek Gift bishop sacrifice on h7!" }
    ],
    defaultRefutation: {
      from: "h7",
      to: "h6",
      san: "h6",
      coachExplanation: "Black played h6! By hesitating with a quiet move, Black created an escape shelter on h7. Strike with Bxh7+ before the defender shuts the door!"
    },
    successExplanation: "The Greek Gift explodes! 1. Bxh7+! Kxh7 2. Ng5+ Kg8 3. Qh5 completely opens the kingside files for a forced mate attack."
  },
  "intermediate_3c": {
    id: "intermediate_3c",
    tier: "intermediate",
    track: "tactical",
    branch: "3C",
    title: "The Elephant Trap Zwischenzug",
    ratingBadge: "Chess.com: ~1550",
    initialFen: "r1bBkb1r/pppn1ppp/8/3n4/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 7",
    playerColor: "black",
    prompt: "Black to move: White just captured your Queen with Bxd8. DO NOT recapture automatically! Find the in-between check.",
    ruleTitle: "The 'Zwischenzug' Reflex",
    ruleBody: "Never recapture automatically. Always pause and calculate whether an intermediate check or threat wins material first.",
    solutionMoves: [
      { from: "f8", to: "b4", san: "Bb4+", explanation: "Crushing intermediate check forcing White's Queen to block!" }
    ],
    defaultRefutation: {
      from: "e2",
      to: "e4",
      san: "e4",
      coachExplanation: "If you played 7... Kxd8 automatically, White plays 8. e4! kicking your knight and seizing complete central dominance. Bb4+ forces White's Queen to fall!"
    },
    successExplanation: "Brilliant Zwischenzug! Instead of recapturing on d8, 7... Bb4+! forced White to surrender their own Queen with 8. Qd2 Bxd2+, leaving you a whole piece ahead."
  },

  // Tier 4: Advanced
  "advanced_4a": {
    id: "advanced_4a",
    tier: "advanced",
    track: "positional",
    branch: "4A",
    title: "Dvoretsky's Prophylactic Test",
    ratingBadge: "FIDE: ~1800+",
    initialFen: "2r2rk1/1bqnbppp/p2pp3/1p4PP/2n1PP2/1NN1B3/PPP2Q2/2KR1B1R w - - 0 1",
    playerColor: "white",
    prompt: "White to move: Before launching your kingside storm, neutralize Black's only active counter-attacking piece.",
    ruleTitle: "Dvoretsky's Prophylaxis Test",
    ruleBody: "Once you calculate a promising attack, pause and ask: 'What is my opponent's only active defensive or counter-attacking resource?' Eliminate it first.",
    solutionMoves: [
      { from: "f1", to: "c4", san: "Bxc4", explanation: "Eliminating the active knight on c4 before pressing on the kingside!" }
    ],
    defaultRefutation: {
      from: "c4",
      to: "b2",
      san: "Nxb2",
      coachExplanation: "If you rushed forward with g6, Black strikes with Nxb2! shattering your king safety. Eliminating Black's active piece with Bxc4 maintains total control."
    },
    successExplanation: "Flawless prophylaxis! By playing 1. Bxc4!, you strip Black of their only active counter-play on the queenside, making White's kingside attack completely unstoppable."
  },
  "advanced_4b": {
    id: "advanced_4b",
    tier: "advanced",
    track: "positional",
    branch: "4B",
    title: "The Sicilian Pawn Lever",
    ratingBadge: "FIDE: ~1900+",
    initialFen: "r1b2rk1/1pq1bppp/p1nppn2/8/3NP3/2N1BP2/PPPQB1PP/2KR3R w - - 1 11",
    playerColor: "white",
    prompt: "White to move: Initiate the pawn storm lever that dislodges Black's kingside defenders.",
    ruleTitle: "The Pawn Lever Trigger",
    ruleBody: "Maneuvering without pawn breaks is cosmetic. In opposite-side castling positions, strike immediately with the pawn lever.",
    solutionMoves: [
      { from: "g2", to: "g4", san: "g4", explanation: "Preparing the crushing g5 pawn lever!" }
    ],
    defaultRefutation: {
      from: "b7",
      to: "b5",
      san: "b5",
      coachExplanation: "If White plays a slow move like a3, Black beats you to the punch with b5! launching their queenside attack first. 1. g4! seizes the initiative."
    },
    successExplanation: "High-level initiative! 1. g4! establishes the g5 pawn lever, forcing Black's key defensive knight off f6 and tearing open the h-file."
  },
  "advanced_4c": {
    id: "advanced_4c",
    tier: "advanced",
    track: "positional",
    branch: "4C",
    title: "Petrosian's Positional Imbalance",
    ratingBadge: "FIDE: ~2000+",
    initialFen: "4r1k1/1p1q1ppp/p2p1b2/2pP4/2P2B2/1P3Q2/P4PPP/R3R1K1 b - - 0 1",
    playerColor: "black",
    prompt: "Black to move: Recognize that Black's bishop can trade for the inactive rook to dominate the dark squares.",
    ruleTitle: "Petrosian's Dynamic Imbalance",
    ruleBody: "A minor piece dominating an open or outpost square often outperforms a passive heavy piece. Emphasize square control over nominal point values.",
    solutionMoves: [
      { from: "f6", to: "a1", san: "Bxa1", explanation: "Winning the corner rook and cementing positional dark-square control!" }
    ],
    defaultRefutation: {
      from: "e1",
      to: "e8",
      san: "Rxe8+",
      coachExplanation: "If Black hesitates, White plays Rxe8+ controlling the e-file and neutralizing Black's dark-square edge. Cash in on the tactical opportunity on a1!"
    },
    successExplanation: "Grandmaster calculation! Capturing on a1 establishes permanent pressure across the long diagonal while neutralizing White's back-rank coordination."
  }
};

// Continuous Puzzles for Endless Training (Tactical & Positional)
export const CONTINUOUS_PUZZLES: ChessPuzzle[] = [
  {
    id: "cont_beg_01",
    tier: "beginner",
    track: "tactical",
    title: "Back Rank Corridor Checkmate",
    ratingBadge: "Chess.com: ~550",
    initialFen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    playerColor: "white",
    prompt: "White to move: Black's king has no breathing room (luft). Deliver the back-rank checkmate!",
    ruleTitle: "The Back-Rank Weakness",
    ruleBody: "When enemy pawns block their own king on the 8th rank, a single Rook delivers instant checkmate.",
    solutionMoves: [
      { from: "a1", to: "a8", san: "Ra8#", explanation: "Corridor checkmate!" }
    ],
    defaultRefutation: {
      from: "g8",
      to: "f8",
      san: "Kf8",
      coachExplanation: "If you hesitate, Black's king steps out of the trap. Look for forcing back-rank mates immediately!"
    },
    successExplanation: "Checkmate! Black was trapped by their own f7, g7, and h7 pawns. A classic corridor checkmate!"
  },
  {
    id: "cont_adv_01",
    tier: "adv_beginner",
    track: "tactical",
    title: "Pin and Win",
    ratingBadge: "Chess.com: ~1050",
    initialFen: "r1b1kb1r/pppp1ppp/8/4q3/4n3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 7",
    playerColor: "white",
    prompt: "White to move: Black's knight on e4 is pinned against their King. Exploit the pin!",
    ruleTitle: "Target the Pinned Piece",
    ruleBody: "A pinned piece cannot move without exposing a greater target. Pile pressure on it until it falls.",
    solutionMoves: [
      { from: "d1", to: "e2", san: "Qe2", explanation: "Pinning the knight to King on e8!" }
    ],
    defaultRefutation: {
      from: "e4",
      to: "f6",
      san: "Nf6",
      coachExplanation: "If you don't exploit the pin right away, Black unpins their piece and escapes. Pin and win!"
    },
    successExplanation: "Pinned! 1. Qe2 completely paralyzes Black's e4 knight. Because the knight is pinned to the e8 king, Black loses the piece next move!"
  },
  {
    id: "cont_int_01",
    tier: "intermediate",
    track: "tactical",
    title: "Smothered Mate Pattern",
    ratingBadge: "Chess.com: ~1450",
    initialFen: "6k1/5ppp/8/8/8/8/8/4Q1K1 w - - 0 1",
    playerColor: "white",
    prompt: "White to move: Spot the single forcing move that ends the game on the spot.",
    ruleTitle: "Back-Rank Dominance",
    ruleBody: "Always calculate forcing checks first before considering defensive moves.",
    solutionMoves: [
      { from: "e1", to: "e8", san: "Qe8#", explanation: "Checkmate on e8!" }
    ],
    defaultRefutation: {
      from: "g8",
      to: "h8",
      san: "Kh8",
      coachExplanation: "Hesitation allows Black defensive breathing room. Finish with the forcing check!"
    },
    successExplanation: "Checkmate! Clean, ruthless calculation of forcing checks."
  },
  {
    id: "cont_beg_pawn_fork",
    tier: "beginner",
    track: "tactical",
    title: "The Center Strike",
    ratingBadge: "Chess.com: ~650",
    initialFen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/3P4/4PN2/PPP2PPP/RNBQKB1R w KQkq - 1 4",
    playerColor: "white",
    prompt: "White to move: Strike the center and rupture Black's knight outpost!",
    ruleTitle: "Pawn Forks Strike Hard",
    ruleBody: "Pawns are the cheapest attackers. A pawn advance challenges higher-value minor pieces.",
    solutionMoves: [{ from: "d4", to: "e5", san: "dxe5", explanation: "Snapping the central pawn and opening threats!" }],
    defaultRefutation: { from: "e5", to: "d4", san: "exd4", coachExplanation: "By playing passively, you let Black shatter your center with exd4!" },
    successExplanation: "Boom! dxe5 claims the center and knocks Black off balance!"
  },
  {
    id: "cont_beg_open_d_file",
    tier: "beginner",
    track: "positional",
    title: "Seize the Open Highway",
    ratingBadge: "Chess.com: ~700",
    initialFen: "2r2rk1/pp1b1ppp/1qn1pn2/3p4/3P4/1PN1PN2/P2QBPPP/R4RK1 w - - 3 13",
    playerColor: "white",
    prompt: "White to move: The c-file is wide open. Claim it with your Rook!",
    ruleTitle: "Rooks Belong on Open Files",
    ruleBody: "An open file without pawns is a highway for your Rook. Seize it before your opponent does.",
    solutionMoves: [{ from: "f1", to: "c1", san: "Rfc1", explanation: "Seizing the open c-file highway!" }],
    defaultRefutation: { from: "c8", to: "c7", san: "Rc7", coachExplanation: "When you hesitate with h3, Black prepares to double rooks with Rc7!" },
    successExplanation: "Excellent! 1. Rfc1 seizes control of the open c-file with absolute initiative."
  },
  {
    id: "cont_adv_knight_fork",
    tier: "adv_beginner",
    track: "tactical",
    title: "Loose Pieces Drop Off",
    ratingBadge: "Chess.com: ~1050",
    initialFen: "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
    playerColor: "white",
    prompt: "White to move: Black's knight is hanging on e4. Take the free material!",
    ruleTitle: "Scan For Unguarded Pieces",
    ruleBody: "Before looking for quiet moves, check if an enemy piece is undefended.",
    solutionMoves: [{ from: "d3", to: "e4", san: "dxe4", explanation: "Winning the knight clean!" }],
    defaultRefutation: { from: "e4", to: "f6", san: "Nf6", coachExplanation: "Your passive move let Black retreat their knight to f6 safely!" },
    successExplanation: "Solid calculation! Capturing on e4 wins a clean piece."
  },
  {
    id: "cont_adv_outpost_knight",
    tier: "adv_beginner",
    track: "positional",
    title: "Clarifying the Center",
    ratingBadge: "Chess.com: ~1100",
    initialFen: "r2q1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R1BQ1RK1 w - - 4 9",
    playerColor: "white",
    prompt: "White to move: Open lines in the center to activate your pieces.",
    ruleTitle: "Central Tension & Breaks",
    ruleBody: "When your development is ahead, challenge the center to unlock piece activity.",
    solutionMoves: [{ from: "c4", to: "d5", san: "cxd5", explanation: "Clarifying the central tension!" }],
    defaultRefutation: { from: "d5", to: "c4", san: "dxc4", coachExplanation: "Black seized the initiative on c4 because of slow play!" },
    successExplanation: "Strong play! 1. cxd5 fixes the pawn structure in White favor."
  },
  {
    id: "cont_int_backrank_mate",
    tier: "intermediate",
    track: "tactical",
    title: "The Back-Rank Knockout",
    ratingBadge: "Chess.com: ~1450",
    initialFen: "3r2k1/p4ppp/1p2p3/8/8/1P2P3/P4PPP/3R2K1 w - - 0 22",
    playerColor: "white",
    prompt: "White to move: Black's back rank is completely undefended. Punish it!",
    ruleTitle: "Back-Rank Decoy & Mate",
    ruleBody: "When the king is trapped behind its own pawns, a single rook strike is decisive.",
    solutionMoves: [{ from: "d1", to: "d8", san: "Rxd8#", explanation: "Devastating back-rank mate!" }],
    defaultRefutation: { from: "d8", to: "d1", san: "Rxd1+", coachExplanation: "If you fail to deliver mate, Black turns the tables with Rxd1+!" },
    successExplanation: "Checkmate! 1. Rxd8# ends the game instantly on the vulnerable 8th rank."
  },
  {
    id: "cont_int_rooks_7th_rank",
    tier: "intermediate",
    track: "positional",
    title: "Pigs on the Seventh",
    ratingBadge: "Chess.com: ~1500",
    initialFen: "5rk1/pp3ppp/8/8/8/1R6/P1P2PPP/1R4K1 w - - 0 20",
    playerColor: "white",
    prompt: "White to move: Invade Black's 7th rank and start harvesting pawns!",
    ruleTitle: "Nimzowitsch 7th Rank Dominance",
    ruleBody: "A Rook on the 7th rank cuts off the king and sweeps undefended base pawns.",
    solutionMoves: [{ from: "b3", to: "b7", san: "Rxb7", explanation: "Invading the 7th rank!" }],
    defaultRefutation: { from: "f8", to: "c8", san: "Rc8", coachExplanation: "Delaying allows Black to contest the files with Rc8!" },
    successExplanation: "Devastating! 1. Rxb7 establishes dominant pressure on Black base pawns."
  },
  {
    id: "cont_adv_clearance",
    tier: "advanced",
    track: "tactical",
    title: "The Greek Gift Knockout",
    ratingBadge: "Chess.com: ~1950",
    initialFen: "r4rk1/pp3ppp/2n5/3p4/3P4/2PB1N2/P4PPP/R2Q1RK1 w - - 0 14",
    playerColor: "white",
    prompt: "White to move: Black's h7 square is weak. Strike with the classical sacrifice!",
    ruleTitle: "The Classical Greek Gift",
    ruleBody: "Bxh7+ tears open the h-file and king safety, followed up by Ng5+ and Qh5.",
    solutionMoves: [{ from: "d3", to: "h7", san: "Bxh7+", explanation: "The Greek Gift strikes h7!" }],
    defaultRefutation: { from: "c6", to: "e7", san: "Ne7", coachExplanation: "Waiting allowed Black to reroute defensive support to their kingside!" },
    successExplanation: "Masterful attack! 1. Bxh7+ initiates the unstoppable kingside demolition."
  },
  {
    id: "cont_adv_majority_push",
    tier: "advanced",
    track: "positional",
    title: "Mobilizing the Queenside Majority",
    ratingBadge: "Chess.com: ~2000",
    initialFen: "2r2rk1/1p1b1ppp/p3pn2/3p4/2PP4/1PN1PN2/P2QBPPP/2R2RK1 w - - 1 14",
    playerColor: "white",
    prompt: "White to move: Create a passed pawn on the queenside by advancing your majority.",
    ruleTitle: "Capablanca Queenside Majority Rule",
    ruleBody: "Advance the pawn that has no opposing pawn first to prevent your opponent blockading.",
    solutionMoves: [{ from: "c4", to: "c5", san: "c5", explanation: "Fixing the queenside pawn structure!" }],
    defaultRefutation: { from: "f6", to: "e4", san: "Ne4", coachExplanation: "Passive play lets Black seize e4 with their knight!" },
    successExplanation: "Strategic perfection! 1. c5 creates an enduring queenside pawn lever."
  }
];

export const ALL_PUZZLES_MAP: Record<string, ChessPuzzle> = {
  ...DIAGNOSTIC_PUZZLES,
  ...Object.fromEntries(CONTINUOUS_PUZZLES.map((p) => [p.id, p])),
};

export function getCuratedDiagnosisPlaylist(
  calibratedRating: number,
  leakIndex: number,
  strategyIndex: number = 0
): ChessPuzzle[] {
  let ids: string[] = [];

  if (calibratedRating < 750) {
    // Beginner Tier (~500)
    if (leakIndex === 0) {
      ids = strategyIndex >= 2
        ? ["beginner_1a", "cont_beg_pawn_fork", "cont_beg_open_d_file", "beginner_1c", "beginner_1b"]
        : ["beginner_1a", "beginner_1c", "cont_beg_pawn_fork", "cont_beg_01", "beginner_1b"];
    } else if (leakIndex === 1) {
      ids = strategyIndex >= 2
        ? ["beginner_1c", "cont_beg_pawn_fork", "cont_beg_open_d_file", "beginner_1a", "beginner_1b"]
        : ["beginner_1c", "cont_beg_pawn_fork", "beginner_1a", "cont_beg_01", "beginner_1b"];
    } else if (leakIndex === 2) {
      ids = strategyIndex >= 2
        ? ["cont_beg_01", "cont_beg_open_d_file", "beginner_1a", "beginner_1c", "beginner_1b"]
        : ["cont_beg_01", "beginner_1a", "cont_beg_pawn_fork", "beginner_1c", "beginner_1b"];
    } else {
      ids = strategyIndex >= 2
        ? ["cont_beg_open_d_file", "beginner_1a", "beginner_1c", "cont_beg_pawn_fork", "beginner_1b"]
        : ["cont_beg_open_d_file", "beginner_1a", "cont_beg_pawn_fork", "cont_beg_01", "beginner_1c"];
    }
  } else if (calibratedRating < 1150) {
    // Advanced Beginner Tier (~900 - 1100)
    if (leakIndex === 0) {
      ids = strategyIndex >= 2
        ? ["cont_adv_knight_fork", "adv_beginner_2a", "cont_adv_outpost_knight", "adv_beginner_2b", "adv_beginner_2c"]
        : ["cont_adv_knight_fork", "adv_beginner_2a", "adv_beginner_2b", "cont_adv_01", "adv_beginner_2c"];
    } else if (leakIndex === 1) {
      ids = strategyIndex >= 2
        ? ["adv_beginner_2a", "cont_adv_01", "cont_adv_outpost_knight", "adv_beginner_2b", "adv_beginner_2c"]
        : ["adv_beginner_2a", "cont_adv_01", "adv_beginner_2b", "cont_adv_knight_fork", "adv_beginner_2c"];
    } else if (leakIndex === 2) {
      ids = strategyIndex >= 2
        ? ["cont_beg_01", "cont_adv_outpost_knight", "adv_beginner_2a", "adv_beginner_2b", "adv_beginner_2c"]
        : ["cont_beg_01", "adv_beginner_2a", "cont_adv_01", "adv_beginner_2b", "adv_beginner_2c"];
    } else {
      ids = strategyIndex >= 2
        ? ["cont_adv_outpost_knight", "adv_beginner_2b", "adv_beginner_2a", "cont_adv_01", "adv_beginner_2c"]
        : ["cont_adv_outpost_knight", "adv_beginner_2b", "cont_adv_knight_fork", "adv_beginner_2a", "adv_beginner_2c"];
    }
  } else if (calibratedRating < 1550) {
    // Intermediate Tier (~1200 - 1500)
    if (leakIndex === 0) {
      ids = strategyIndex >= 2
        ? ["intermediate_3c", "intermediate_3a", "cont_int_rooks_7th_rank", "cont_int_backrank_mate", "intermediate_3b"]
        : ["intermediate_3c", "cont_int_01", "intermediate_3a", "cont_int_backrank_mate", "intermediate_3b"];
    } else if (leakIndex === 1) {
      ids = strategyIndex >= 2
        ? ["intermediate_3b", "intermediate_3c", "cont_int_rooks_7th_rank", "intermediate_3a", "cont_int_backrank_mate"]
        : ["intermediate_3b", "intermediate_3c", "cont_int_rooks_7th_rank", "cont_int_backrank_mate", "intermediate_3a"];
    } else if (leakIndex === 2) {
      ids = strategyIndex >= 2
        ? ["cont_int_rooks_7th_rank", "intermediate_3a", "cont_int_backrank_mate", "intermediate_3c", "intermediate_3b"]
        : ["cont_int_rooks_7th_rank", "cont_int_backrank_mate", "intermediate_3a", "intermediate_3c", "intermediate_3b"];
    } else {
      ids = strategyIndex >= 2
        ? ["intermediate_3a", "cont_int_rooks_7th_rank", "intermediate_3c", "intermediate_3b", "cont_int_backrank_mate"]
        : ["intermediate_3a", "cont_int_backrank_mate", "intermediate_3c", "intermediate_3b", "cont_int_rooks_7th_rank"];
    }
  } else {
    // Advanced / Master Tier (~1700+)
    ids = strategyIndex >= 2
      ? ["advanced_4a", "advanced_4b", "cont_adv_majority_push", "advanced_4c", "cont_adv_clearance"]
      : ["advanced_4a", "cont_adv_clearance", "advanced_4b", "advanced_4c", "cont_adv_majority_push"];
  }

  return ids.map((id) => ALL_PUZZLES_MAP[id] || DIAGNOSTIC_PUZZLES["beginner_1a"]);
}
