import { Chess } from 'chess.js';

export type MaiaRatingTier = 1100 | 1300 | 1500 | 1700 | 1900;

export interface MaiaCandidateMove {
  san: string;
  uci: string;
  probability: number; // Share of games in this rating band, 0 - 100
  gamesCount?: number;
  winRate?: number;    // Empirical win rate for the side to move, 0 - 100
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
  /**
   * Share of games in this rating band that actually played the diagnosed move.
   * Measured from the Lichess explorer sample, never estimated.
   */
  humanTrapRate: number;
}

export interface MaiaAnalysisResult {
  fen: string;
  ratingTier: MaiaRatingTier;
  /**
   * False when the explorer has no games for this position at this rating band.
   * Consumers must render an empty state rather than inventing a distribution.
   */
  hasData: boolean;
  /** Total games in the explorer sample for this position + rating band. */
  totalGames: number;
  /** Share of those games covered by the returned candidate moves. */
  coveragePercent: number;
  candidateMoves: MaiaCandidateMove[];
  topHumanMove: MaiaCandidateMove | null;
  isHumanTrap: boolean;
  miaiDilemma: MiaiDilemma;
  cognitiveDiagnosis: CognitiveDiagnosis | null;
  /**
   * 'no_data'     - explorer answered, but has no games for this position.
   * 'unavailable' - explorer could not be reached (network, timeout, non-200).
   * These are different facts and the UI must not conflate them.
   */
  source: 'lichess_explorer' | 'no_data' | 'unavailable';
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
 * Describes *why* a move is attractive to human players at this tier.
 *
 * This is a qualitative label only. The quantitative part of the diagnosis
 * (`humanTrapRate`) is always the measured share of games from the explorer
 * sample, passed in by the caller - it is never estimated here.
 */
export function diagnosePsychology(
  chess: InstanceType<typeof Chess>,
  playedSan: string,
  tier: MaiaRatingTier,
  measuredRate: number
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
        humanTrapRate: measuredRate,
      };
    }

    // Greed Trap: Captured poisoned pawn or piece
    if (isCapture) {
      return {
        blunderCategory: 'Greed Trap',
        explanation: 'Attracted by free or hanging material while neglecting king safety and opponent tactical counter-punches.',
        humanTrapRate: measuredRate,
      };
    }

    // Queen early sortie / overextension
    if (isQueenMove && chess.history().length <= 14) {
      return {
        blunderCategory: 'Tunnel Vision',
        explanation: 'Premature queen sortie in the opening, inviting minor piece tempo attacks.',
        humanTrapRate: measuredRate,
      };
    }

    // Passive waiting move
    if (playedSan.startsWith('a') || playedSan.startsWith('h')) {
      return {
        blunderCategory: 'Passive Waiting',
        explanation: 'Relieving tension with a slow flank pawn push when concrete central action was required.',
        humanTrapRate: measuredRate,
      };
    }

    // Default Prophylactic Blindness
    return {
      blunderCategory: 'Prophylactic Blindness',
      explanation: 'Executing own tactical idea without anticipating the opponent’s concrete next move.',
      humanTrapRate: measuredRate,
    };
  } catch {
    return {
      blunderCategory: 'Prophylactic Blindness',
      explanation: 'Tactical oversight common under time pressure or calculation fatigue.',
      humanTrapRate: measuredRate,
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

function emptyResult(
  fen: string,
  tier: MaiaRatingTier,
  source: 'no_data' | 'unavailable'
): MaiaAnalysisResult {
  return {
    fen,
    ratingTier: tier,
    hasData: false,
    totalGames: 0,
    coveragePercent: 0,
    candidateMoves: [],
    topHumanMove: null,
    isHumanTrap: false,
    miaiDilemma: detectMiaiDilemma(fen, []),
    cognitiveDiagnosis: null,
    source,
  };
}

/**
 * Fetches the empirical human move distribution for a position at a given
 * rating band, from the Lichess opening explorer.
 *
 * When the explorer has no games for the position, this returns an empty
 * result (`hasData: false`). It deliberately does not synthesise a fallback
 * distribution: once a guessed distribution reaches the UI it is
 * indistinguishable from a measured one.
 */
export async function fetchMaiaAnalysis(
  fen: string,
  tier: MaiaRatingTier = 1500,
  stockfishBestMove?: string
): Promise<MaiaAnalysisResult> {
  const chess = new Chess(fen);
  const ratings = getLichessRatingsForTier(tier);

  const url = `https://explorer.lichess.ovh/lichess?fen=${encodeURIComponent(
    fen
  )}&ratings=${ratings}&speeds=bullet,blitz,rapid,classical&moves=6`;

  let data: {
    white?: number;
    draws?: number;
    black?: number;
    moves?: { san: string; uci: string; white: number; draws: number; black: number }[];
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return emptyResult(fen, tier, 'unavailable');
    data = await res.json();
  } catch {
    return emptyResult(fen, tier, 'unavailable');
  }

  const rawMoves = data?.moves || [];
  if (rawMoves.length === 0) return emptyResult(fen, tier, 'no_data');

  const shownGames = rawMoves.reduce(
    (acc, cur) => acc + cur.white + cur.draws + cur.black,
    0
  );

  // The denominator is every game in the sample for this position, not just
  // the handful of moves the explorer returned. Probabilities therefore sum
  // to less than 100 whenever there is a long tail of rarer moves, which is
  // the honest reading of the data.
  const totalGames =
    (data.white ?? 0) + (data.draws ?? 0) + (data.black ?? 0) || shownGames;

  if (totalGames === 0) return emptyResult(fen, tier, 'no_data');

  const candidateMoves: MaiaCandidateMove[] = rawMoves.map((m) => {
    const games = m.white + m.draws + m.black;
    const winRate =
      games > 0
        ? Math.round((((chess.turn() === 'w' ? m.white : m.black) + 0.5 * m.draws) / games) * 100)
        : 50;

    return {
      san: m.san,
      uci: m.uci,
      probability: Math.round((games / totalGames) * 100),
      gamesCount: games,
      winRate,
      isStockfishBest: stockfishBestMove
        ? m.san === stockfishBestMove || m.uci === stockfishBestMove
        : false,
    };
  });

  const coveragePercent = Math.min(100, Math.round((shownGames / totalGames) * 100));

  const topHuman = candidateMoves[0];
  const isHumanTrap = Boolean(
    stockfishBestMove &&
    topHuman.san !== stockfishBestMove &&
    topHuman.probability >= 40
  );

  return {
    fen,
    ratingTier: tier,
    hasData: true,
    totalGames,
    coveragePercent,
    candidateMoves,
    topHumanMove: topHuman,
    isHumanTrap,
    miaiDilemma: detectMiaiDilemma(fen, candidateMoves),
    // Only diagnose when the crowd move actually diverges from the engine move.
    // Otherwise there is no trap to explain.
    cognitiveDiagnosis: isHumanTrap
      ? diagnosePsychology(chess, topHuman.san, tier, topHuman.probability)
      : null,
    source: 'lichess_explorer',
  };
}
