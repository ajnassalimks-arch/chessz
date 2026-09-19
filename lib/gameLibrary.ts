'use client';

import { GameDerivedStats } from './chessMetrics/types';

/**
 * The player's game library, stored on disk in the browser.
 *
 * This used to be a single localStorage key holding every game as one JSON
 * blob. Measured on a real account, one game with its move list costs ~23KB,
 * so that design met the ~5MB localStorage quota at roughly 200 games -- and
 * the engine sweep wrote a second full copy of each analyzed game under its
 * own `chessz_engine_ckpt_*` key, which halved the ceiling again. That limit,
 * not any product decision, is why the scan only ever asked Lichess for 50
 * games.
 *
 * IndexedDB is quota'd against free disk instead of a fixed few megabytes, and
 * holds one record per game, so saving a game no longer means re-serializing
 * the entire library.
 *
 * Everything here degrades to a no-op when there is no IndexedDB (server
 * rendering, node tests, a browser with storage blocked). Callers must treat
 * an empty library as "nothing saved yet", never as an error.
 */

const DB_NAME = 'chessz-library';
const DB_VERSION = 1;
const GAMES_STORE = 'games';
const META_STORE = 'meta';

const LEGACY_KEY_PREFIX = 'chessz_weakness_';
const LEGACY_CHECKPOINT_PREFIX = 'chessz_engine_ckpt_';

export interface LibraryMeta {
  /** Lowercased Lichess username this library belongs to. */
  user: string;
  /** When games were last pulled from Lichess, or null if never. */
  lastSyncedAt: number | null;
  /** playedAt of the newest game held, for incremental `since` syncs. */
  newestGameAt: number | null;
  /** playedAt of the oldest game held, the cursor for the backwards walk. */
  oldestGameAt: number | null;
  /** True once Lichess has returned nothing older than oldestGameAt. */
  historyComplete: boolean;
}

interface GameRecord {
  /** `${user}:${gameId}` -- a game is stored per account that scanned it. */
  key: string;
  user: string;
  gameId: string;
  playedAt: number;
  game: GameDerivedStats;
}

function emptyMeta(user: string): LibraryMeta {
  return {
    user,
    lastSyncedAt: null,
    newestGameAt: null,
    oldestGameAt: null,
    historyComplete: false,
  };
}

export function isLibraryAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (!isLibraryAvailable()) return Promise.resolve(null);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase | null>((resolve) => {
    let req: IDBOpenDBRequest;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch {
      resolve(null);
      return;
    }

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(GAMES_STORE)) {
        const store = db.createObjectStore(GAMES_STORE, { keyPath: 'key' });
        store.createIndex('user', 'user', { unique: false });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'user' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });

  return dbPromise;
}

function promisify<T>(req: IDBRequest<T>): Promise<T | null> {
  return new Promise((resolve) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

/**
 * One-time import of the old localStorage blob, so an existing player's saved
 * games survive the move and their quota is handed back. Runs at most once per
 * account: the legacy keys are removed on success.
 */
async function migrateLegacy(user: string, db: IDBDatabase): Promise<void> {
  if (typeof localStorage === 'undefined') return;

  const legacyKey = `${LEGACY_KEY_PREFIX}${user}`;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(legacyKey);
  } catch {
    return;
  }
  if (!raw) return;

  let parsed: GameDerivedStats[] = [];
  try {
    const value = JSON.parse(raw);
    if (Array.isArray(value)) parsed = value as GameDerivedStats[];
  } catch {}

  if (parsed.length > 0) {
    await writeGames(db, user, parsed);

    let legacySyncedAt: number | null = null;
    try {
      const ts = localStorage.getItem(`${legacyKey}_timestamp`);
      legacySyncedAt = ts ? parseInt(ts, 10) || null : null;
    } catch {}

    const times = parsed.map((g) => Number(g.playedAt)).filter((t) => Number.isFinite(t) && t > 0);
    await writeMeta(db, {
      ...emptyMeta(user),
      lastSyncedAt: legacySyncedAt,
      newestGameAt: times.length > 0 ? Math.max(...times) : null,
      oldestGameAt: times.length > 0 ? Math.min(...times) : null,
    });
  }

  // Reclaim the quota: the blob and every per-game engine checkpoint, which
  // the library now supersedes (an analyzed game is simply a saved game whose
  // evalSource is 'local').
  try {
    localStorage.removeItem(legacyKey);
    localStorage.removeItem(`${legacyKey}_timestamp`);
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LEGACY_CHECKPOINT_PREFIX)) stale.push(k);
    }
    for (const k of stale) localStorage.removeItem(k);
  } catch {}
}

const migrated = new Set<string>();

async function ready(username: string): Promise<{ db: IDBDatabase; user: string } | null> {
  const user = username.trim().toLowerCase();
  if (!user) return null;
  const db = await openDb();
  if (!db) return null;
  if (!migrated.has(user)) {
    migrated.add(user);
    try {
      await migrateLegacy(user, db);
    } catch {}
  }
  return { db, user };
}

function writeGames(db: IDBDatabase, user: string, games: GameDerivedStats[]): Promise<void> {
  return new Promise((resolve) => {
    let tx: IDBTransaction;
    try {
      tx = db.transaction(GAMES_STORE, 'readwrite');
    } catch {
      resolve();
      return;
    }
    const store = tx.objectStore(GAMES_STORE);
    for (const g of games) {
      if (!g || !g.gameId) continue;
      const record: GameRecord = {
        key: `${user}:${g.gameId}`,
        user,
        gameId: g.gameId,
        playedAt: Number(g.playedAt) || 0,
        game: g,
      };
      try {
        store.put(record);
      } catch {}
    }
    tx.oncomplete = () => resolve();
    // A quota or serialization failure must not take down the caller: the
    // library is a cache, and a scan that cannot save is still a valid scan.
    tx.onerror = () => resolve();
    tx.onabort = () => resolve();
  });
}

function writeMeta(db: IDBDatabase, meta: LibraryMeta): Promise<void> {
  return new Promise((resolve) => {
    let tx: IDBTransaction;
    try {
      tx = db.transaction(META_STORE, 'readwrite');
    } catch {
      resolve();
      return;
    }
    try {
      tx.objectStore(META_STORE).put(meta);
    } catch {}
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
    tx.onabort = () => resolve();
  });
}

/** Every saved game for this account, newest first. */
export async function getLibraryGames(username: string): Promise<GameDerivedStats[]> {
  const ctx = await ready(username);
  if (!ctx) return [];

  try {
    const tx = ctx.db.transaction(GAMES_STORE, 'readonly');
    const index = tx.objectStore(GAMES_STORE).index('user');
    const rows = await promisify<GameRecord[]>(index.getAll(ctx.user) as IDBRequest<GameRecord[]>);
    if (!rows) return [];
    return rows
      .map((r) => r.game)
      .filter((g): g is GameDerivedStats => Boolean(g && g.gameId))
      .sort((a, b) => b.playedAt - a.playedAt);
  } catch {
    return [];
  }
}

export async function getLibraryMeta(username: string): Promise<LibraryMeta> {
  const user = username.trim().toLowerCase();
  const ctx = await ready(username);
  if (!ctx) return emptyMeta(user);

  try {
    const tx = ctx.db.transaction(META_STORE, 'readonly');
    const row = await promisify<LibraryMeta>(
      tx.objectStore(META_STORE).get(ctx.user) as IDBRequest<LibraryMeta>
    );
    return row ? { ...emptyMeta(ctx.user), ...row } : emptyMeta(ctx.user);
  } catch {
    return emptyMeta(user);
  }
}

/**
 * Saves games and advances the sync cursors. newestGameAt and oldestGameAt
 * only ever widen: a backfill page must not make the library look like it
 * holds less recent history than it does, and an incremental sync must not
 * reset the backwards cursor.
 */
export async function saveLibraryGames(
  username: string,
  games: GameDerivedStats[],
  patch: Partial<Pick<LibraryMeta, 'lastSyncedAt' | 'historyComplete'>> = {}
): Promise<boolean> {
  const ctx = await ready(username);
  if (!ctx) return false;

  if (games.length > 0) {
    await writeGames(ctx.db, ctx.user, games);
  }

  const prev = await getLibraryMeta(ctx.user);
  const times = games.map((g) => Number(g.playedAt)).filter((t) => Number.isFinite(t) && t > 0);

  const next: LibraryMeta = {
    ...prev,
    ...patch,
    user: ctx.user,
    newestGameAt:
      times.length > 0
        ? Math.max(prev.newestGameAt ?? 0, ...times)
        : prev.newestGameAt,
    oldestGameAt:
      times.length > 0
        ? Math.min(prev.oldestGameAt ?? Number.POSITIVE_INFINITY, ...times)
        : prev.oldestGameAt,
  };
  if (next.oldestGameAt === Number.POSITIVE_INFINITY) next.oldestGameAt = null;

  await writeMeta(ctx.db, next);
  return true;
}

/**
 * Moves the backwards cursor further into the past without saving any games.
 * The walk needs this to step over a block of variant games: they are real
 * history, so Lichess keeps returning them, but none of them become a saved
 * game that could move the floor on its own.
 */
export async function advanceOldestCursor(username: string, playedAt: number): Promise<void> {
  const ctx = await ready(username);
  if (!ctx || !Number.isFinite(playedAt) || playedAt <= 0) return;
  const prev = await getLibraryMeta(ctx.user);
  if (prev.oldestGameAt !== null && prev.oldestGameAt <= playedAt) return;
  await writeMeta(ctx.db, { ...prev, oldestGameAt: playedAt });
}

/** Marks the backwards walk finished, so it is not retried on every visit. */
export async function markHistoryComplete(username: string): Promise<void> {
  const ctx = await ready(username);
  if (!ctx) return;
  const prev = await getLibraryMeta(ctx.user);
  await writeMeta(ctx.db, { ...prev, historyComplete: true });
}

export async function countLibraryGames(username: string): Promise<number> {
  const ctx = await ready(username);
  if (!ctx) return 0;
  try {
    const tx = ctx.db.transaction(GAMES_STORE, 'readonly');
    const index = tx.objectStore(GAMES_STORE).index('user');
    const n = await promisify<number>(index.count(ctx.user) as IDBRequest<number>);
    return n ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Union by gameId, newest first. A freshly streamed row never overwrites one
 * the local engine has already swept: Lichess reports evalSource 'none' for a
 * game it never analyzed, and taking that would silently discard work the
 * player's machine spent minutes on.
 */
export function mergeGames(
  existing: GameDerivedStats[],
  incoming: GameDerivedStats[]
): GameDerivedStats[] {
  const byId = new Map(existing.map((g) => [g.gameId, g]));
  for (const g of incoming) {
    const prev = byId.get(g.gameId);
    if (prev && prev.evalSource === 'local' && g.evalSource === 'none') continue;
    byId.set(g.gameId, g);
  }
  return Array.from(byId.values()).sort((a, b) => b.playedAt - a.playedAt);
}

export type BackfillStep =
  | { action: 'save' }
  | { action: 'advance'; to: number }
  | { action: 'complete' };

/**
 * What the backwards walk should do with a page it just received.
 *
 * The distinction that matters: a page with no standard games is not the same
 * as the end of the history. Lichess returns variant games too, and a run of
 * them yields nothing to save -- but they are real history, so stopping there
 * would silently truncate the library, and retrying the same cursor would loop
 * forever on the same block. Only a page with no rows at all means there is
 * nothing older left.
 */
export function decideBackfillStep(args: {
  /** Standard games derived from the page. */
  standardGames: number;
  /** Every NDJSON row the page contained, variants included. */
  rawGames: number;
  /** Oldest timestamp seen on any row, standard or not. */
  oldestRawAt: number;
  /** The cursor the page was requested with. */
  cursor: number;
}): BackfillStep {
  if (args.standardGames > 0) return { action: 'save' };
  if (args.rawGames === 0) return { action: 'complete' };
  if (args.oldestRawAt > 0 && args.oldestRawAt < args.cursor) {
    return { action: 'advance', to: args.oldestRawAt };
  }
  // Rows came back but none of them are older than where we already are, so
  // the walk cannot make progress. Stopping beats looping.
  return { action: 'complete' };
}

/** Test seam: drops the memoized connection so a fresh DB can be opened. */
export function __resetLibraryForTests(): void {
  dbPromise = null;
  migrated.clear();
}
