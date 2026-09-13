import { Color, JudgmentType } from './types';

/**
 * Exact Lichess Win Percentage Formula (from White's perspective)
 * winPct = 50 + 50 * (2 / (1 + exp(-0.00368208 * cp)) - 1)
 * cp is clamped to [-1000, 1000]
 */
export function calculateWinPctFromCp(cp: number): number {
  const clampedCp = Math.max(-1000, Math.min(1000, cp));
  const raw = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * clampedCp)) - 1);
  return Math.round(raw * 10000) / 10000;
}

/**
 * Converts an evaluation ({ cp?: number, mate?: number }) to win percentage (0 - 100).
 * Perspective can be 'white' or 'black'.
 * Mate for White is 100, mate against White is 0.
 */
export function evalToWinPct(
  evalObj: { cp?: number; mate?: number },
  perspective: Color = 'white'
): number {
  let whiteWinPct = 50;

  if (evalObj.mate !== undefined && evalObj.mate !== null) {
    whiteWinPct = evalObj.mate >= 0 ? 100 : 0;
  } else if (evalObj.cp !== undefined && evalObj.cp !== null) {
    whiteWinPct = calculateWinPctFromCp(evalObj.cp);
  }

  return perspective === 'white' ? whiteWinPct : Math.round((100 - whiteWinPct) * 10000) / 10000;
}

/**
 * Win percentage lost by a move:
 * The mover's win% before minus their win% after.
 * Negative values mean the move gained; floored at 0.
 */
export function calculateWinPctLost(winPctBefore: number, winPctAfter: number): number {
  const lost = winPctBefore - winPctAfter;
  return lost > 0 ? Math.round(lost * 10000) / 10000 : 0;
}

/**
 * Lichess Judgment thresholds based on win% lost:
 * < 10: none
 * 10 to < 20: inaccuracy
 * 20 to < 30: mistake
 * >= 30: blunder
 */
export function getJudgment(winPctLost: number): JudgmentType {
  if (winPctLost < 10) return 'none';
  if (winPctLost < 20) return 'inaccuracy';
  if (winPctLost < 30) return 'mistake';
  return 'blunder';
}

/**
 * Lichess Per-move accuracy formula:
 * accuracy = 103.1668 * exp(-0.04354 * winPctLost) - 3.1669
 * Clamped to [0, 100]
 */
export function calculateAccuracy(winPctLost: number): number {
  if (winPctLost <= 0) return 100;
  const raw = 103.1668 * Math.exp(-0.04354 * winPctLost) - 3.1669;
  const clamped = Math.max(0, Math.min(100, raw));
  return Math.round(clamped * 100) / 100;
}

/**
 * Wilson Score Interval for binomial proportion confidence (e.g. Opening Win Rate)
 * @param wins Number of positive outcomes
 * @param total Total number of trials
 * @param z Z-score (defaults to 1.96 for 95% confidence)
 */
export function wilsonScoreInterval(
  wins: number,
  total: number,
  z: number = 1.96
): { lower: number; upper: number; center: number } {
  if (total <= 0) {
    return { lower: 0, upper: 0, center: 0 };
  }

  const p = Math.max(0, Math.min(1, wins / total));
  const z2 = z * z;
  const denom = 1 + z2 / total;
  const center = (p + z2 / (2 * total)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / total + z2 / (4 * total * total))) / denom;

  return {
    lower: Math.max(0, Math.round((center - margin) * 1000) / 1000),
    upper: Math.min(1, Math.round((center + margin) * 1000) / 1000),
    center: Math.round(center * 1000) / 1000,
  };
}

/**
 * Parse a clock string like "0:03:00", "0:02:45.3", or "12:30" into total seconds
 */
export function parseClockToSeconds(clk: string): number {
  if (!clk) return 0;
  const parts = clk.trim().split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return minutes * 60 + seconds;
  }
  return parseFloat(clk) || 0;
}
