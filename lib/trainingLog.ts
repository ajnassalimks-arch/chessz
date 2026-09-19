'use client';

import { openDb, promisify } from './gameLibrary';
import { supabase, isSupabaseConfigured } from './supabase';
import { ensureAuthenticatedSession } from './supabaseWeakness';

/**
 * The real record of what a player has trained.
 *
 * This replaces `chessz_mastered_blunders`, a single localStorage array of
 * puzzle ids with no timestamp, no record of a failed attempt, and no
 * account scoping. A player could not answer "have I gotten better at knight
 * forks" from that array -- it could not even answer "when did I fix this,"
 * because nothing was ever removed or dated.
 *
 * Every attempt is appended here, correct or not. Nothing is ever mutated:
 * "is this puzzle mastered" is a query over the log (does a correct attempt
 * exist), not a stored flag, so the log stays the one source of truth for
 * whatever later reads it -- a curriculum, a trend, a "did the training
 * actually work" comparison.
 */

const ATTEMPTS_STORE = 'attempts';

export type AttemptSource = 'blunder' | 'curated' | 'diagnose';

export interface AttemptRecord {
  id?: number;
  /** Lowercased Lichess username, or '' for a session with no connected account. */
  user: string;
  puzzleId: string;
  gameId?: string;
  ply?: number;
  /** mistakeClassifier category id, when the puzzle carries one. */
  category?: string;
  tier?: string;
  track: 'tactical' | 'positional';
  source: AttemptSource;
  correct: boolean;
  /** Whether the engine bar was visible before this attempt was made. */
  usedEngine: boolean;
  timeSpentMs?: number;
  attemptedAt: number;
}

export interface MasteryInfo {
  attempts: number;
  correct: number;
  everCorrect: boolean;
  lastAttemptedAt: number;
}

const LEGACY_MASTERED_KEY = 'chessz_mastered_blunders';
let legacyMigrated = false;

/**
 * One-time import of the old mastered-ids array into the attempt log, so a
 * returning player does not see puzzles they already fixed snap back to
 * "unfixed". The old key was never scoped to an account -- it was a single
 * global list regardless of which Lichess username was connected -- so this
 * migration attributes it to whichever username is active when it runs and
 * removes the key, matching the blast radius the old code already had rather
 * than widening it.
 */
async function migrateLegacyMastery(user: string, db: IDBDatabase): Promise<void> {
  if (typeof localStorage === 'undefined') return;

  let raw: string | null = null;
  try {
    raw = localStorage.getItem(LEGACY_MASTERED_KEY);
  } catch {
    return;
  }
  if (!raw) return;

  let ids: string[] = [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) ids = parsed.filter((x) => typeof x === 'string');
  } catch {}

  if (ids.length > 0) {
    const now = Date.now();
    await new Promise<void>((resolve) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction(ATTEMPTS_STORE, 'readwrite');
      } catch {
        resolve();
        return;
      }
      const store = tx.objectStore(ATTEMPTS_STORE);
      for (const puzzleId of ids) {
        const record: AttemptRecord = {
          user,
          puzzleId,
          track: 'tactical',
          source: puzzleId.startsWith('lichess_') ? 'blunder' : 'curated',
          correct: true,
          usedEngine: false,
          attemptedAt: now,
        };
        try {
          store.add(record);
        } catch {}
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  }

  try {
    localStorage.removeItem(LEGACY_MASTERED_KEY);
  } catch {}
}

async function ensureReady(user: string): Promise<IDBDatabase | null> {
  const db = await openDb();
  if (!db) return null;
  if (!legacyMigrated) {
    legacyMigrated = true;
    try {
      await migrateLegacyMastery(user, db);
    } catch {}
  }
  return db;
}

/**
 * Logs one attempt, correct or not. Writes locally first and always -- an
 * attempt the player just made must never be lost to a network hiccup -- then
 * best-effort mirrors it to Supabase under the same silent-degrade contract
 * as the game library: a sync failure here must never surface as an error to
 * someone who just solved (or missed) a puzzle.
 */
export async function recordAttempt(
  username: string,
  input: {
    puzzleId: string;
    gameId?: string;
    ply?: number;
    category?: string;
    tier?: string;
    track?: 'tactical' | 'positional';
    source: AttemptSource;
    correct: boolean;
    usedEngine: boolean;
    timeSpentMs?: number;
  }
): Promise<void> {
  const user = username.trim().toLowerCase();
  const record: AttemptRecord = {
    user,
    puzzleId: input.puzzleId,
    gameId: input.gameId,
    ply: input.ply,
    category: input.category,
    tier: input.tier,
    track: input.track || 'tactical',
    source: input.source,
    correct: input.correct,
    usedEngine: input.usedEngine,
    timeSpentMs: input.timeSpentMs,
    attemptedAt: Date.now(),
  };

  const db = await ensureReady(user);
  if (db) {
    await new Promise<void>((resolve) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction(ATTEMPTS_STORE, 'readwrite');
      } catch {
        resolve();
        return;
      }
      try {
        tx.objectStore(ATTEMPTS_STORE).add(record);
      } catch {}
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  }

  if (!isSupabaseConfigured || !supabase) return;
  try {
    const userId = await ensureAuthenticatedSession();
    if (!userId) return;
    await supabase.from('puzzle_history').insert({
      user_id: userId,
      puzzle_id: record.puzzleId,
      track: record.track,
      is_correct: record.correct,
      category: record.category || null,
      tier: record.tier || null,
      game_id: record.gameId || null,
      ply: record.ply ?? null,
      time_spent_ms: record.timeSpentMs ?? null,
      used_engine: record.usedEngine,
      source: record.source,
      solved_at: new Date(record.attemptedAt).toISOString(),
    });
  } catch (err) {
    console.warn('Supabase sync notice (puzzle_history):', err);
  }
}

/** Every logged attempt for this account, newest first. */
export async function getAttempts(username: string): Promise<AttemptRecord[]> {
  const user = username.trim().toLowerCase();
  if (!user) return [];
  const db = await ensureReady(user);
  if (!db) return [];
  try {
    const tx = db.transaction(ATTEMPTS_STORE, 'readonly');
    const index = tx.objectStore(ATTEMPTS_STORE).index('user');
    const rows = await promisify<AttemptRecord[]>(index.getAll(user) as IDBRequest<AttemptRecord[]>);
    return (rows || []).sort((a, b) => b.attemptedAt - a.attemptedAt);
  } catch {
    return [];
  }
}

/**
 * Per-puzzle attempt history, derived from the log rather than stored
 * separately -- so it can never disagree with getAttempts().
 */
export async function getMasteryMap(username: string): Promise<Map<string, MasteryInfo>> {
  const attempts = await getAttempts(username);
  const map = new Map<string, MasteryInfo>();
  for (const a of attempts) {
    const cur = map.get(a.puzzleId) || {
      attempts: 0,
      correct: 0,
      everCorrect: false,
      lastAttemptedAt: 0,
    };
    cur.attempts += 1;
    if (a.correct) {
      cur.correct += 1;
      cur.everCorrect = true;
    }
    cur.lastAttemptedAt = Math.max(cur.lastAttemptedAt, a.attemptedAt);
    map.set(a.puzzleId, cur);
  }
  return map;
}

/** Test seam: drops the one-shot legacy-migration guard between test runs. */
export function __resetTrainingLogForTests(): void {
  legacyMigrated = false;
}
