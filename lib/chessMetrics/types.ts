export type Color = 'white' | 'black';

export type GamePhase = 'opening' | 'middlegame' | 'endgame';

export type JudgmentType = 'none' | 'inaccuracy' | 'mistake' | 'blunder';

export interface MoveToken {
  san: string;
  ply: number;
  moveNumber: number;
  color: Color;
  comment?: string;
  nags?: string[];
  eval?: {
    cp?: number;
    mate?: number; // positive = White wins in N moves, negative = Black wins
  };
  clockSeconds?: number;
}

export interface MoveAnalysis {
  ply: number;
  moveNumber: number;
  color: Color;
  san: string;
  fen?: string;
  evalBefore: { cp?: number; mate?: number };
  evalAfter: { cp?: number; mate?: number };
  winPctBefore: number; // Mover's perspective (0 - 100)
  winPctAfter: number;  // Mover's perspective (0 - 100)
  winPctLost: number;   // Floored at 0
  judgment: JudgmentType;
  accuracy: number;     // 0 - 100
  phase: GamePhase;
  pieceCount: number;
  clockRemaining?: number;
  timeSpentSeconds?: number;
}

export interface CriticalMoment {
  gameId: string;
  ply: number;
  moveNumber: number;
  san: string;
  color: Color;
  fen?: string;
  evalBefore: number; // Centipawns or ±10000 for mate
  evalAfter: number;
  winPctLost: number;
  judgment: JudgmentType;
  phase: GamePhase;
  clockRemaining?: number;
  timeSpentSeconds?: number;
  deepLink: string; // https://lichess.org/{gameId}/{color}#{ply}
}

export interface OpeningStats {
  eco: string;
  name: string;
  color: Color;
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
  score: number; // (wins + 0.5 * draws) / totalGames
  winRate: number; // wins / totalGames
  wilsonLower: number;
  wilsonUpper: number;
  avgWinPctLostFirst16: number;
}

export interface PhaseMetrics {
  winPctLost: number;
  movesCount: number;
  avgWinPctLostPerMove: number;
  inaccuracies: number;
  mistakes: number;
  blunders: number;
}

export interface GameDerivedStats {
  gameId: string;
  userId?: string;
  playedAt: number;
  color: Color;
  result: 'win' | 'loss' | 'draw';
  status: string;
  speed: string;
  eco?: string;
  openingName?: string;
  openingPly: number;
  clockInitial?: number;
  clockIncrement?: number;
  userRating?: number;
  opponentRating?: number;
  ratingDiff?: number;
  accuracy: number;
  opponentAccuracy?: number;
  acpl?: number;
  winpctLostOpening: number;
  winpctLostMiddlegame: number;
  winpctLostEndgame: number;
  inaccuracies: number;
  mistakes: number;
  blunders: number;
  peakEvalWhite: number;
  troughEvalWhite: number;
  converted: boolean; // eval reached >= +300 for player and won
  rescued: boolean;   // eval fell <= -300 for player and drew or won
  missedPunishments: number;
  evalSource: 'lichess' | 'local' | 'none';
  engineNodes?: number | null;
  moves: MoveAnalysis[];
  criticalMoments: CriticalMoment[];
}

export interface UserAggregateStats {
  username: string;
  totalGames: number;
  totalAnalyzedGames: number;
  totalUnanalyzedGames: number;
  colorRecord: {
    white: { games: number; wins: number; draws: number; losses: number; score: number };
    black: { games: number; wins: number; draws: number; losses: number; score: number };
  };
  speedRecord: Record<string, { games: number; wins: number; draws: number; losses: number; score: number }>;
  phaseMetrics: {
    opening: PhaseMetrics;
    middlegame: PhaseMetrics;
    endgame: PhaseMetrics;
  };
  judgmentCountsPer100: {
    inaccuracies: number;
    mistakes: number;
    blunders: number;
  };
  overallAccuracy: number;
  conversionFailuresCount: number;
  rescuesCount: number;
  missedPunishmentsTotal: number;
  openings: OpeningStats[];
  criticalMoments: CriticalMoment[];
  timePressureBlundersCount: number;
}
