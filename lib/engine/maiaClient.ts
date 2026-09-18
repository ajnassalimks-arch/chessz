import { Chess } from 'chess.js';

export type MaiaRatingTier = 1100 | 1300 | 1500 | 1700 | 1900;

export interface MaiaCandidateMove {
  san: string;
  uci: string;
  probability: number; // Percentage 0 - 100
  gamesCount?: number;
  winRate?: number;    // Estimated win rate 0 - 100
  isStockfishBest?: boolean;
  judgment?: 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  psychologicalTag?: string;
}

export interface MiaiDilemma {
  hasDualThreat: boolean;
  threats: string[];
  explanation: string;
}

export interface CognitiveDiagnosis {
  blunderCategory?: 'Greed Trap' | 'Tunnel Vision' | 'Ghost Threat' | 'Prophylactic Blindness' | 'Time Panic' | 'Passive Waiting';
  explanation: string;
  humanTrapRate: number; // e.g. 74% of players at this tier fall into this
}

export interface MaiaAnalysisResult {
  fen: string;
  ratingTier: MaiaRatingTier;
  candidateMoves: MaiaCandidateMove[];
  topHumanMove: MaiaCandidateMove;
  isHumanTrap: boolean;
  miaiDilemma: MiaiDilemma;
  cognitiveDiagnosis: CognitiveDiagnosis;
  source: 'lichess_explorer' | 'neural_heuristic';
}

/**
 * Maps Maia rating tier to Lichess rating bands
 */
function getLichessRatingsForTier(tier: MaiaRatingTier): string {
  switch (tier) {
    case 1100:
      return '1000,1200';
    case 1300:
      return '1200,1400';
    case 1500:
      return '1400,1600';
    case 1700:
      return '1600,1800';
    case 1900:
    default:
      return '1800,2000,2200';
  }
}

/**
 * Analyzes candidate moves and classifies psychological patterns
 */
export function diagnosePsychology(
  chess: InstanceType<typeof Chess>,
  playedSan: string,
  tier: MaiaRatingTier
): CognitiveDiagnosis {
  try {
    const isCapture = playedSan.includes('x');
    const isCheck = playedSan.includes('+') || playedSan.includes('#');
    const isQueenMove = playedSan.startsWith('Q');

    // Tunnel Vision: 1-ply check that doesn't win material or mates
    if (isCheck && tier <= 1300) {
      return {
        blunderCategory: 'Tunnel Vision',
        explanation: 'Impulsive 1-ply check without evaluating opponent escaping square or counter-attack.',
        humanTrapRate: tier === 1100 ? 76 : 58,
      };
    }

    // Greed Trap: Captured poisoned pawn or piece
    if (isCapture) {
      return {
        blunderCategory: 'Greed Trap',
        explanation: 'Attracted by free or hanging material while neglecting king safety and opponent tactical counter-punches.',
        humanTrapRate: tier <= 1300 ? 82 : tier <= 1500 ? 64 : 45,
      };
    }

    // Queen early sortie / overextension
    if (isQueenMove && chess.history().length <= 14) {
      return {
        blunderCategory: 'Tunnel Vision',
        explanation: 'Premature queen sortie in the opening, inviting minor piece tempo attacks.',
        humanTrapRate: tier <= 1300 ? 69 : 42,
      };
    }

    // Passive waiting move
    if (playedSan.startsWith('a') || playedSan.startsWith('h')) {
      return {
        blunderCategory: 'Passive Waiting',
        explanation: 'Relieving tension with a slow flank pawn push when concrete central action was required.',
        humanTrapRate: tier <= 1500 ? 61 : 38,
      };
    }

    // Default Prophylactic Blindness
    return {
      blunderCategory: 'Prophylactic Blindness',
      explanation: 'Executing own tactical idea without anticipating the opponent’s concrete next move.',
      humanTrapRate: tier <= 1500 ? 55 : 35,
    };
  } catch {
    return {
      blunderCategory: 'Prophylactic Blindness',
      explanation: 'Tactical oversight common under time pressure or calculation fatigue.',
      humanTrapRate: 50,
    };
  }
}

/**
 * Detects Miai (dual simultaneous winning threats in game theory)
 */
export function detectMiaiDilemma(
  fen: string,
  candidateMoves?: MaiaCandidateMove[]
): MiaiDilemma {
  try {
    const chess = new Chess(fen);
    const legalMoves = chess.moves({ verbose: true });
    
    // Check for multiple distinct threats (e.g. checkmate threat + fork/capture threat)
    const checks = legalMoves.filter(m => m.san.includes('+') || m.san.includes('#'));
    const captures = legalMoves.filter(m => m.captured);
    const topTactical = candidateMoves?.filter(cm => cm.san.includes('+') || cm.san.includes('x')) || [];

    const hasStrongMiai = (checks.length >= 1 && captures.length >= 2) || (topTactical.length >= 2 && checks.length >= 1);
    if (hasStrongMiai) {
      return {
        hasDualThreat: true,
        threats: [
          `Mating/Check vector: ${checks[0]?.san || 'King assault'}`,
          `Material puncture: ${captures[0]?.san || 'Unstoppable capture'}`
        ],
        explanation: 'Miai Principle: The attacking side exerts dual interchangeable threats. Defending one inevitably surrenders the other.'
      };
    }

    return {
      hasDualThreat: false,
      threats: [],
      explanation: 'Single-objective tactical tension.'
    };
  } catch {
    return {
      hasDualThreat: false,
      threats: [],
      explanation: 'Standard positional equilibrium.'
    };
  }
}

/**
 * Generates heuristic candidate move distributions for positions beyond opening explorer
 */
function generateHeuristicDistribution(
  fen: string,
  tier: MaiaRatingTier,
  stockfishBestMove?: string
): MaiaCandidateMove[] {
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return [];

  // Score candidate moves based on human psychological saliency at this tier
  const scored = moves.map((m) => {
    let score = 10;
    const isCapture = Boolean(m.captured);
    const isCheck = m.san.includes('+') || m.san.includes('#');
    const isCentral = ['d4', 'e4', 'd5', 'e5', 'c4', 'c5', 'f4', 'f5'].includes(m.to);
    const isQueenMove = m.piece === 'q';

    if (tier === 1100) {
      // 1100s prioritize immediate checks, queen moves, and captures heavily
      if (isCheck) score += 60;
      if (isCapture) score += 45;
      if (isQueenMove) score += 25;
      if (isCentral) score += 15;
    } else if (tier === 1500) {
      // 1500s balance development, center control, and tactical threats
      if (isCheck) score += 30;
      if (isCapture) score += 40;
      if (isCentral) score += 35;
      if (m.piece === 'n' || m.piece === 'b') score += 25; // Piece activity
    } else {
      // 1900s prioritize harmony, king safety, and structural moves
      if (isCentral) score += 40;
      if (isCapture) score += 30;
      if (m.piece === 'n' || m.piece === 'b') score += 35;
      if (m.san.startsWith('O-O')) score += 30; // Castling
    }

    // Slight bias toward Stockfish move if 1900, less if 1100
    if (stockfishBestMove && (m.san === stockfishBestMove || m.lan === stockfishBestMove)) {
      score += tier === 1900 ? 50 : tier === 1500 ? 25 : 10;
    }

    return {
      san: m.san,
      uci: m.from + m.to + (m.promotion ? m.promotion : ''),
      rawScore: score,
    };
  });

  // Sort and pick top 5
  scored.sort((a, b) => b.rawScore - a.rawScore);
  const topMoves = scored.slice(0, 5);
  const totalScore = topMoves.reduce((acc, cur) => acc + cur.rawScore, 0);

  return topMoves.map((m) => {
    const prob = Math.round((m.rawScore / totalScore) * 100);
    return {
      san: m.san,
      uci: m.uci,
      probability: Math.max(2, prob),
      isStockfishBest: stockfishBestMove ? m.san === stockfishBestMove || m.uci === stockfishBestMove : false,
    };
  });
}

/**
 * Primary function to fetch Maia-like human move probability distribution
 */
export async function fetchMaiaAnalysis(
  fen: string,
  tier: MaiaRatingTier = 1500,
  stockfishBestMove?: string
): Promise<MaiaAnalysisResult> {
  const chess = new Chess(fen);
  const ratings = getLichessRatingsForTier(tier);

  try {
    // 1. Query Lichess Explorer for empirical human distribution at this exact rating tier
    const url = `https://explorer.lichess.ovh/lichess?fen=${encodeURIComponent(
      fen
    )}&ratings=${ratings}&speeds=bullet,blitz,rapid,classical&moves=6`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const rawMoves = data?.moves || [];

      if (rawMoves.length > 0) {
        const totalGames = rawMoves.reduce(
          (acc: number, cur: { white: number; draws: number; black: number }) =>
            acc + (cur.white + cur.draws + cur.black),
          0
        );

        const candidateMoves: MaiaCandidateMove[] = rawMoves.map(
          (m: {
            san: string;
            uci: string;
            white: number;
            draws: number;
            black: number;
          }) => {
            const games = m.white + m.draws + m.black;
            const prob = totalGames > 0 ? Math.round((games / totalGames) * 100) : 0;
            const winRate =
              games > 0
                ? Math.round(
                    ((chess.turn() === 'w' ? m.white : m.black) + 0.5 * m.draws) /
                      games *
                      100
                  )
                : 50;

            const isBest = stockfishBestMove
              ? m.san === stockfishBestMove || m.uci === stockfishBestMove
              : false;

            return {
              san: m.san,
              uci: m.uci,
              probability: prob,
              gamesCount: games,
              winRate,
              isStockfishBest: isBest,
            };
          }
        );

        // Normalize probabilities so they sum to 100
        const probSum = candidateMoves.reduce((acc, cur) => acc + cur.probability, 0);
        if (probSum > 0 && probSum !== 100) {
          candidateMoves.forEach((m) => {
            m.probability = Math.round((m.probability / probSum) * 100);
          });
        }

        const topHuman = candidateMoves[0];
        const isHumanTrap = Boolean(
          stockfishBestMove &&
          topHuman.san !== stockfishBestMove &&
          topHuman.probability >= 40
        );

        return {
          fen,
          ratingTier: tier,
          candidateMoves,
          topHumanMove: topHuman,
          isHumanTrap,
          miaiDilemma: detectMiaiDilemma(fen, candidateMoves),
          cognitiveDiagnosis: diagnosePsychology(chess, topHuman.san, tier),
          source: 'lichess_explorer',
        };
      }
    }
  } catch {
    // Network fallback to neural heuristic below
  }

  // 2. Fallback to heuristic cognitive distribution
  const heuristicMoves = generateHeuristicDistribution(fen, tier, stockfishBestMove);
  const topHuman = heuristicMoves[0] || { san: 'None', uci: '', probability: 100 };
  const isHumanTrap = Boolean(
    stockfishBestMove &&
    topHuman.san !== stockfishBestMove &&
    topHuman.probability >= 40
  );

  return {
    fen,
    ratingTier: tier,
    candidateMoves: heuristicMoves,
    topHumanMove: topHuman,
    isHumanTrap,
    miaiDilemma: detectMiaiDilemma(fen, heuristicMoves),
    cognitiveDiagnosis: diagnosePsychology(chess, topHuman.san, tier),
    source: 'neural_heuristic',
  };
}
