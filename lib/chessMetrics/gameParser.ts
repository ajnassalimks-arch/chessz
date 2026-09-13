import {
  Color,
  GamePhase,
  MoveToken,
  MoveAnalysis,
  CriticalMoment,
  GameDerivedStats,
  PhaseMetrics,
  OpeningStats,
  UserAggregateStats,
} from './types';
import {
  evalToWinPct,
  calculateWinPctLost,
  getJudgment,
  calculateAccuracy,
  wilsonScoreInterval,
} from './math';
import { parsePgn } from './tokenizer';

export interface LichessRawGame {
  id: string;
  rated?: boolean;
  speed?: string;
  status?: string;
  createdAt?: number;
  lastMoveAt?: number;
  winner?: 'white' | 'black';
  players?: {
    white?: {
      user?: { name: string; id: string };
      rating?: number;
      ratingDiff?: number;
      analysis?: { inaccuracy: number; mistake: number; blunder: number; acpl: number; accuracy?: number };
    };
    black?: {
      user?: { name: string; id: string };
      rating?: number;
      ratingDiff?: number;
      analysis?: { inaccuracy: number; mistake: number; blunder: number; acpl: number; accuracy?: number };
    };
  };
  opening?: {
    eco?: string;
    name?: string;
    ply?: number;
  };
  clock?: {
    initial?: number; // seconds
    increment?: number; // seconds
  };
  pgn?: string;
}

/**
 * Determine exact game phase from ply index, opening ply threshold, and remaining piece count.
 * Phase detection:
 * - Opening: up to opening.ply from API, or ply 16 if absent
 * - Endgame: piece count <= 12
 * - Middlegame: everything else
 */
export function getGamePhase(
  ply: number,
  openingPly: number = 16,
  pieceCount: number = 32
): GamePhase {
  if (ply <= openingPly) {
    return 'opening';
  }
  if (pieceCount <= 12) {
    return 'endgame';
  }
  return 'middlegame';
}

/**
 * Parse an individual game's movetext into full move analyses, phase metrics, and critical moments.
 */
export function parseGameMoves(
  moves: MoveToken[],
  openingPly: number = 16,
  initialClockSeconds?: number,
  clockIncrementSeconds: number = 0
): MoveAnalysis[] {
  const result: MoveAnalysis[] = [];
  let pieceCount = 32;

  // Previous clocks for time-per-move calculation
  let prevWhiteClock = initialClockSeconds;
  let prevBlackClock = initialClockSeconds;

  // Track previous evaluation: starts at White +0.15 (+15 centipawns)
  let lastEval: { cp?: number; mate?: number } = { cp: 15 };

  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];

    // 1. Piece count tracking: captures contain 'x'
    if (m.san.includes('x')) {
      pieceCount = Math.max(2, pieceCount - 1);
    }

    const phase = getGamePhase(m.ply, openingPly, pieceCount);

    // 2. Eval semantics:
    // Eval before ply n is the eval after ply n-1.
    // For ply 1, use +0.15 (+15 cp).
    const evalBefore = { ...lastEval };
    const evalAfter = m.eval ? { ...m.eval } : { ...evalBefore };
    lastEval = { ...evalAfter };

    // 3. Win percentage calculation from mover's perspective
    const winPctBefore = evalToWinPct(evalBefore, m.color);
    const winPctAfter = evalToWinPct(evalAfter, m.color);
    const winPctLost = calculateWinPctLost(winPctBefore, winPctAfter);
    const judgment = getJudgment(winPctLost);
    const accuracy = calculateAccuracy(winPctLost);

    // 4. Time spent calculation
    let timeSpentSeconds: number | undefined = undefined;
    if (m.clockSeconds !== undefined) {
      const prevClock = m.color === 'white' ? prevWhiteClock : prevBlackClock;
      if (prevClock !== undefined) {
        timeSpentSeconds = Math.max(0, prevClock - m.clockSeconds + clockIncrementSeconds);
      }
      if (m.color === 'white') {
        prevWhiteClock = m.clockSeconds;
      } else {
        prevBlackClock = m.clockSeconds;
      }
    }

    result.push({
      ply: m.ply,
      moveNumber: m.moveNumber,
      color: m.color,
      san: m.san,
      evalBefore,
      evalAfter,
      winPctBefore,
      winPctAfter,
      winPctLost,
      judgment,
      accuracy,
      phase,
      pieceCount,
      clockRemaining: m.clockSeconds,
      timeSpentSeconds,
    });
  }

  return result;
}

/**
 * Derives comprehensive stats from a raw Lichess game
 */
export function deriveGameStats(
  rawGame: LichessRawGame,
  targetUsername: string
): GameDerivedStats | null {
  const normTarget = targetUsername.toLowerCase().trim();
  const whiteName = rawGame.players?.white?.user?.name?.toLowerCase() || '';
  const blackName = rawGame.players?.black?.user?.name?.toLowerCase() || '';

  let userColor: Color = 'white';
  if (whiteName === normTarget) {
    userColor = 'white';
  } else if (blackName === normTarget) {
    userColor = 'black';
  } else {
    // If username is not directly matched (e.g. anonymous or mock), check if white or fallback
    userColor = 'white';
  }

  const opponentColor: Color = userColor === 'white' ? 'black' : 'white';
  const userPlayer = rawGame.players?.[userColor];
  const opponentPlayer = rawGame.players?.[opponentColor];

  // Result calculation
  let result: 'win' | 'loss' | 'draw' = 'draw';
  if (rawGame.winner === userColor) {
    result = 'win';
  } else if (rawGame.winner) {
    result = 'loss';
  } else {
    result = 'draw';
  }

  // Parse moves from PGN
  const parsedPgn = rawGame.pgn ? parsePgn(rawGame.pgn) : { headers: {}, movetext: '', moves: [] };
  const openingPly = rawGame.opening?.ply || 16;
  const initialClock = rawGame.clock?.initial;
  const clockIncrement = rawGame.clock?.increment || 0;

  const analyzedMoves = parseGameMoves(
    parsedPgn.moves,
    openingPly,
    initialClock,
    clockIncrement
  );

  // Filter moves by player color
  const userMoves = analyzedMoves.filter((m) => m.color === userColor);
  const opponentMoves = analyzedMoves.filter((m) => m.color === opponentColor);

  // Check if evals exist
  const hasEvals = analyzedMoves.some((m) => m.evalAfter.cp !== undefined || m.evalAfter.mate !== undefined);
  const evalSource: 'lichess' | 'local' | 'none' = hasEvals
    ? 'lichess'
    : 'none';

  // Compute judgments and win% lost per phase
  let winpctLostOpening = 0;
  let winpctLostMiddlegame = 0;
  let winpctLostEndgame = 0;
  let inaccuracies = 0;
  let mistakes = 0;
  let blunders = 0;

  for (const m of userMoves) {
    if (m.phase === 'opening') winpctLostOpening += m.winPctLost;
    else if (m.phase === 'middlegame') winpctLostMiddlegame += m.winPctLost;
    else if (m.phase === 'endgame') winpctLostEndgame += m.winPctLost;

    if (m.judgment === 'inaccuracy') inaccuracies++;
    else if (m.judgment === 'mistake') mistakes++;
    else if (m.judgment === 'blunder') blunders++;
  }

  // Accuracy: prefer API provided accuracy if present
  let accuracy = userPlayer?.analysis?.accuracy;
  if (accuracy === undefined || accuracy === null) {
    if (userMoves.length > 0) {
      const sumAcc = userMoves.reduce((acc, m) => acc + m.accuracy, 0);
      accuracy = Math.round((sumAcc / userMoves.length) * 10) / 10;
    } else {
      accuracy = 100;
    }
  }

  const opponentAccuracy = opponentPlayer?.analysis?.accuracy;

  // Peak & Trough Eval from White's perspective
  let peakEvalWhite = 15;
  let troughEvalWhite = 15;
  for (const m of analyzedMoves) {
    const cp = m.evalAfter.mate !== undefined
      ? m.evalAfter.mate > 0 ? 10000 : -10000
      : (m.evalAfter.cp || 0);
    if (cp > peakEvalWhite) peakEvalWhite = cp;
    if (cp < troughEvalWhite) troughEvalWhite = cp;
  }

  // Conversion failure: player eval reached >= +300 and did not win
  // Rescue: player eval fell <= -300 and drew or won
  const userPeakEval = userColor === 'white' ? peakEvalWhite : -troughEvalWhite;
  const userTroughEval = userColor === 'white' ? troughEvalWhite : -peakEvalWhite;

  const converted = userPeakEval >= 300 ? result === 'win' : true;
  const rescued = userTroughEval <= -300 ? (result === 'win' || result === 'draw') : false;

  // Missed Punishments:
  // When opponent loses >= 20 win% and the user fails to regain at least half of it on their next move
  let missedPunishments = 0;
  for (let i = 0; i < analyzedMoves.length; i++) {
    const oppMove = analyzedMoves[i];
    if (oppMove.color === opponentColor && oppMove.winPctLost >= 20) {
      const nextUserMove = analyzedMoves[i + 1];
      if (nextUserMove && nextUserMove.color === userColor) {
        // If user also loses win%, or doesn't retain the advantage
        if (nextUserMove.winPctLost > oppMove.winPctLost * 0.5) {
          missedPunishments++;
        }
      }
    }
  }

  // Critical Moments: Capped at 10 worst moves per game, sorted by winPctLost descending
  const criticalMoments: CriticalMoment[] = userMoves
    .filter((m) => m.judgment === 'blunder' || m.judgment === 'mistake' || m.winPctLost >= 15)
    .sort((a, b) => b.winPctLost - a.winPctLost)
    .slice(0, 10)
    .map((m) => ({
      gameId: rawGame.id,
      ply: m.ply,
      moveNumber: m.moveNumber,
      san: m.san,
      color: m.color,
      evalBefore: m.evalBefore.mate ? m.evalBefore.mate * 1000 : (m.evalBefore.cp || 0),
      evalAfter: m.evalAfter.mate ? m.evalAfter.mate * 1000 : (m.evalAfter.cp || 0),
      winPctLost: m.winPctLost,
      judgment: m.judgment,
      phase: m.phase,
      clockRemaining: m.clockRemaining,
      timeSpentSeconds: m.timeSpentSeconds,
      deepLink: `https://lichess.org/${rawGame.id}/${userColor}#${m.ply}`,
    }));

  return {
    gameId: rawGame.id,
    playedAt: rawGame.createdAt || rawGame.lastMoveAt || Date.now(),
    color: userColor,
    result,
    status: rawGame.status || 'unknown',
    speed: rawGame.speed || 'rapid',
    eco: rawGame.opening?.eco,
    openingName: rawGame.opening?.name,
    openingPly,
    clockInitial: initialClock,
    clockIncrement,
    userRating: userPlayer?.rating,
    opponentRating: opponentPlayer?.rating,
    ratingDiff: userPlayer?.ratingDiff,
    accuracy,
    opponentAccuracy,
    acpl: userPlayer?.analysis?.acpl,
    winpctLostOpening: Math.round(winpctLostOpening * 10) / 10,
    winpctLostMiddlegame: Math.round(winpctLostMiddlegame * 10) / 10,
    winpctLostEndgame: Math.round(winpctLostEndgame * 10) / 10,
    inaccuracies,
    mistakes,
    blunders,
    peakEvalWhite,
    troughEvalWhite,
    converted,
    rescued,
    missedPunishments,
    evalSource,
    moves: analyzedMoves,
    criticalMoments,
  };
}

/**
 * Aggregates multiple games into full User Weakness Dashboard metrics
 */
export function aggregateUserStats(
  games: GameDerivedStats[],
  targetUsername: string
): UserAggregateStats {
  const whiteRecord = { games: 0, wins: 0, draws: 0, losses: 0, score: 0 };
  const blackRecord = { games: 0, wins: 0, draws: 0, losses: 0, score: 0 };
  const speedRecord: Record<string, { games: number; wins: number; draws: number; losses: number; score: number }> = {};

  const phaseOpening: PhaseMetrics = { winPctLost: 0, movesCount: 0, avgWinPctLostPerMove: 0, inaccuracies: 0, mistakes: 0, blunders: 0 };
  const phaseMiddlegame: PhaseMetrics = { winPctLost: 0, movesCount: 0, avgWinPctLostPerMove: 0, inaccuracies: 0, mistakes: 0, blunders: 0 };
  const phaseEndgame: PhaseMetrics = { winPctLost: 0, movesCount: 0, avgWinPctLostPerMove: 0, inaccuracies: 0, mistakes: 0, blunders: 0 };

  let totalAnalyzedGames = 0;
  let totalInaccuracies = 0;
  let totalMistakes = 0;
  let totalBlunders = 0;
  let totalUserMoves = 0;

  let sumAccuracy = 0;
  let accuracyCount = 0;

  let conversionFailuresCount = 0;
  let rescuesCount = 0;
  let missedPunishmentsTotal = 0;
  let timePressureBlundersCount = 0;

  const openingsMap: Record<string, { eco: string; name: string; color: Color; wins: number; draws: number; losses: number; totalGames: number; sumWinPctLost16: number; count16: number }> = {};
  const allCriticalMoments: CriticalMoment[] = [];

  // Track average move time per speed to detect time pressure blunders (< half average)
  const moveTimesBySpeed: Record<string, number[]> = {};

  for (const g of games) {
    // 1. Record by color
    const rec = g.color === 'white' ? whiteRecord : blackRecord;
    rec.games++;
    if (g.result === 'win') rec.wins++;
    else if (g.result === 'draw') rec.draws++;
    else rec.losses++;
    rec.score = Math.round(((rec.wins + 0.5 * rec.draws) / rec.games) * 100);

    // 2. Record by speed
    if (!speedRecord[g.speed]) {
      speedRecord[g.speed] = { games: 0, wins: 0, draws: 0, losses: 0, score: 0 };
    }
    const sp = speedRecord[g.speed];
    sp.games++;
    if (g.result === 'win') sp.wins++;
    else if (g.result === 'draw') sp.draws++;
    else sp.losses++;
    sp.score = Math.round(((sp.wins + 0.5 * sp.draws) / sp.games) * 100);

    if (g.evalSource !== 'none') {
      totalAnalyzedGames++;
    }

    sumAccuracy += g.accuracy;
    accuracyCount++;

    if (!g.converted) conversionFailuresCount++;
    if (g.rescued) rescuesCount++;
    missedPunishmentsTotal += g.missedPunishments;

    // Collect user move times
    if (!moveTimesBySpeed[g.speed]) moveTimesBySpeed[g.speed] = [];
    for (const m of g.moves) {
      if (m.color === g.color && m.timeSpentSeconds !== undefined) {
        moveTimesBySpeed[g.speed].push(m.timeSpentSeconds);
      }
    }

    // Phase metrics
    for (const m of g.moves) {
      if (m.color === g.color) {
        totalUserMoves++;
        if (m.judgment === 'inaccuracy') totalInaccuracies++;
        else if (m.judgment === 'mistake') totalMistakes++;
        else if (m.judgment === 'blunder') totalBlunders++;

        const targetPhase =
          m.phase === 'opening'
            ? phaseOpening
            : m.phase === 'middlegame'
            ? phaseMiddlegame
            : phaseEndgame;

        targetPhase.winPctLost += m.winPctLost;
        targetPhase.movesCount++;
        if (m.judgment === 'inaccuracy') targetPhase.inaccuracies++;
        else if (m.judgment === 'mistake') targetPhase.mistakes++;
        else if (m.judgment === 'blunder') targetPhase.blunders++;
      }
    }

    // Opening grouping
    const ecoKey = `${g.color}_${g.eco || 'Unknown'}_${g.openingName || 'General'}`;
    if (!openingsMap[ecoKey]) {
      openingsMap[ecoKey] = {
        eco: g.eco || 'A00',
        name: g.openingName || 'Standard Opening',
        color: g.color,
        wins: 0,
        draws: 0,
        losses: 0,
        totalGames: 0,
        sumWinPctLost16: 0,
        count16: 0,
      };
    }
    const op = openingsMap[ecoKey];
    op.totalGames++;
    if (g.result === 'win') op.wins++;
    else if (g.result === 'draw') op.draws++;
    else op.losses++;

    // Calculate win% lost in first 16 plies
    for (const m of g.moves) {
      if (m.color === g.color && m.ply <= 16) {
        op.sumWinPctLost16 += m.winPctLost;
        op.count16++;
      }
    }

    // Accumulate critical moments
    allCriticalMoments.push(...g.criticalMoments);
  }

  // Calculate speed average move times
  const avgMoveTimeBySpeed: Record<string, number> = {};
  for (const speed in moveTimesBySpeed) {
    const times = moveTimesBySpeed[speed];
    if (times.length > 0) {
      avgMoveTimeBySpeed[speed] = times.reduce((a, b) => a + b, 0) / times.length;
    }
  }

  // Check for time pressure blunders: blunder played faster than half average move time or low clock
  for (const g of games) {
    const avgTime = avgMoveTimeBySpeed[g.speed] || 10;
    for (const m of g.moves) {
      if (m.color === g.color && m.judgment === 'blunder') {
        if (
          (m.timeSpentSeconds !== undefined && m.timeSpentSeconds < avgTime * 0.5) ||
          (m.clockRemaining !== undefined && m.clockRemaining <= 30)
        ) {
          timePressureBlundersCount++;
        }
      }
    }
  }

  // Finalize phase averages
  if (phaseOpening.movesCount > 0) {
    phaseOpening.avgWinPctLostPerMove = Math.round((phaseOpening.winPctLost / phaseOpening.movesCount) * 100) / 100;
  }
  if (phaseMiddlegame.movesCount > 0) {
    phaseMiddlegame.avgWinPctLostPerMove = Math.round((phaseMiddlegame.winPctLost / phaseMiddlegame.movesCount) * 100) / 100;
  }
  if (phaseEndgame.movesCount > 0) {
    phaseEndgame.avgWinPctLostPerMove = Math.round((phaseEndgame.winPctLost / phaseEndgame.movesCount) * 100) / 100;
  }

  // Finalize judgments per 100 moves
  const moveMultiplier = totalUserMoves > 0 ? 100 / totalUserMoves : 0;
  const judgmentCountsPer100 = {
    inaccuracies: Math.round(totalInaccuracies * moveMultiplier * 10) / 10,
    mistakes: Math.round(totalMistakes * moveMultiplier * 10) / 10,
    blunders: Math.round(totalBlunders * moveMultiplier * 10) / 10,
  };

  // Finalize openings with Wilson score intervals
  const openings: OpeningStats[] = Object.values(openingsMap).map((op) => {
    const score = (op.wins + 0.5 * op.draws) / op.totalGames;
    const wilson = wilsonScoreInterval(op.wins + 0.5 * op.draws, op.totalGames);
    return {
      eco: op.eco,
      name: op.name,
      color: op.color,
      totalGames: op.totalGames,
      wins: op.wins,
      draws: op.draws,
      losses: op.losses,
      score: Math.round(score * 1000) / 10,
      winRate: Math.round((op.wins / op.totalGames) * 1000) / 10,
      wilsonLower: Math.round(wilson.lower * 100),
      wilsonUpper: Math.round(wilson.upper * 100),
      avgWinPctLostFirst16: op.count16 > 0 ? Math.round((op.sumWinPctLost16 / op.count16) * 10) / 10 : 0,
    };
  });

  // Sort critical moments by win% lost descending
  allCriticalMoments.sort((a, b) => b.winPctLost - a.winPctLost);

  return {
    username: targetUsername,
    totalGames: games.length,
    totalAnalyzedGames,
    totalUnanalyzedGames: games.length - totalAnalyzedGames,
    colorRecord: {
      white: whiteRecord,
      black: blackRecord,
    },
    speedRecord,
    phaseMetrics: {
      opening: phaseOpening,
      middlegame: phaseMiddlegame,
      endgame: phaseEndgame,
    },
    judgmentCountsPer100,
    overallAccuracy: accuracyCount > 0 ? Math.round((sumAccuracy / accuracyCount) * 10) / 10 : 100,
    conversionFailuresCount,
    rescuesCount,
    missedPunishmentsTotal,
    openings: openings.sort((a, b) => b.totalGames - a.totalGames),
    criticalMoments: allCriticalMoments.slice(0, 50),
    timePressureBlundersCount,
  };
}
