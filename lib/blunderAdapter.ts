import { ChessPuzzle } from './puzzles';
import { CriticalMoment, GameDerivedStats } from './chessMetrics/types';
import { SkillTier, classifyMistake } from './mistakeClassifier';

/**
 * A critical moment dressed as a trainable puzzle.
 *
 * bestSan is intentionally absent. The old /api/lichess/blunders route got it
 * from Lichess's own analysis, which is exactly why that route could only see
 * pre-analyzed games. Here the Arena computes the refutation with the in-browser
 * engine once the position loads, so a moment needs no precomputed answer -- and
 * the player is asked to calculate rather than handed the move.
 */
export type BlunderPuzzle = ChessPuzzle & {
  gameId?: string;
  speed?: string;
  opponentName?: string;
  opponentRating?: number;
  moveNumber?: number;
  playedSan?: string;
  bestSan?: string;
  evalSwingPawns?: number;
  judgmentName?: string;
  category?: string;
  categoryTitle?: string;
  categoryBadge?: string;
  categoryIcon?: string;
  coachTip?: string;
  parentTip?: string;
};

/**
 * Centipawn loss from the player's point of view. Stored evals are always from
 * White's perspective, so Black's numbers run the other way.
 */
export function evalSwingForPlayer(moment: CriticalMoment): number {
  const raw =
    moment.color === 'white'
      ? moment.evalBefore - moment.evalAfter
      : moment.evalAfter - moment.evalBefore;
  return Math.max(0, Math.round((raw / 100) * 10) / 10);
}

/**
 * Recover the pre-move position and lead-up moves for a moment that predates FEN
 * retention, by walking the parent game's move list.
 */
function recoverPosition(moment: CriticalMoment, game?: GameDerivedStats) {
  const moves = game?.moves ?? [];
  const fen = moment.fen || moves.find((m) => m.ply === moment.ply)?.fen;

  let setupMoves = moment.setupMoves ?? [];
  if (setupMoves.length === 0 && moves.length > 0) {
    const idx = moves.findIndex((m) => m.ply === moment.ply);
    if (idx !== -1) {
      const back = Math.min(idx, 6);
      setupMoves = [];
      for (let step = idx - back; step < idx; step++) {
        const pm = moves[step];
        if (!pm?.fen) continue;
        const moveNum = Math.ceil(pm.ply / 2);
        setupMoves.push({
          ply: pm.ply,
          moveNumber: moveNum,
          turnPrefix: pm.ply % 2 === 1 ? `${moveNum}.` : `${moveNum}...`,
          san: pm.san,
          fen: pm.fen,
        });
      }
    }
  }

  return { fen, setupMoves };
}

/**
 * Convert a critical moment into the puzzle shape the blunder trainer renders.
 * Returns null when the position cannot be recovered at all, since a puzzle
 * without a board is not trainable.
 */
export function momentToBlunderPuzzle(
  moment: CriticalMoment,
  game: GameDerivedStats | undefined,
  tier: SkillTier
): BlunderPuzzle | null {
  const { fen, setupMoves } = recoverPosition(moment, game);
  if (!fen) return null;

  const evalSwingPawns = evalSwingForPlayer(moment);
  // classifyMistake takes the engine's best move as UCI to tell, for example, a
  // missed capture from a hung piece. We have no precomputed best move here, so
  // it classifies on position, ply and swing alone.
  const classified = classifyMistake(fen, moment.san, '', moment.ply, evalSwingPawns, tier);

  const opponentIsWhite = moment.color === 'black';

  return {
    id: `lichess_${moment.gameId}_p${moment.ply}`,
    lichessId: moment.gameId,
    tier: tier === 'beginner' ? 'beginner' : tier === 'adv_beginner' ? 'adv_beginner' : 'intermediate',
    track: 'tactical',
    title: `Move ${moment.moveNumber}: ${moment.san}`,
    ratingBadge: moment.judgment === 'blunder' ? 'Blunder' : 'Mistake',
    initialFen: fen,
    playerColor: moment.color,
    prompt: `${moment.color === 'white' ? 'White' : 'Black'} to move: in your game you played ${moment.san}. Find what wins instead.`,
    ruleTitle: `${classified.ruleTitle}: ${moment.san}`,
    ruleBody: classified.ruleBody,
    // Left empty on purpose: the Arena fills this from the in-browser engine.
    solutionMoves: [],
    defaultRefutation: {
      from: '',
      to: '',
      san: moment.san,
      coachExplanation: `In your game, ${moment.san} cost you ${moment.winPctLost.toFixed(0)}% win probability. Find the tactical alternative.`,
    },
    successExplanation: 'Exactly. That is the move that held the position together.',
    setupMoves,

    gameId: moment.gameId,
    speed: game?.speed,
    opponentRating: opponentIsWhite ? game?.opponentRating : game?.opponentRating,
    moveNumber: moment.moveNumber,
    playedSan: moment.san,
    evalSwingPawns,
    judgmentName: moment.judgment === 'blunder' ? 'Blunder' : 'Mistake',
    category: classified.categoryId,
    categoryTitle: classified.categoryTitle,
    categoryBadge: classified.badge,
    categoryIcon: classified.icon,
    coachTip: classified.coachTip,
    parentTip: classified.parentTip,
  };
}

/**
 * Map a whole scan into trainable puzzles, worst moment first.
 */
export function momentsToBlunderPuzzles(
  moments: CriticalMoment[],
  games: GameDerivedStats[],
  tier: SkillTier
): BlunderPuzzle[] {
  const byId = new Map(games.map((g) => [g.gameId, g]));
  return moments
    .map((m) => momentToBlunderPuzzle(m, byId.get(m.gameId), tier))
    .filter((p): p is BlunderPuzzle => p !== null);
}
