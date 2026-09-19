'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { streamUserGames, StreamProgress, StreamSummary } from './lichessStream';
import { GameDerivedStats, UserAggregateStats, CriticalMoment } from './chessMetrics/types';
import { aggregateUserStats } from './chessMetrics/gameParser';
import { saveGameStatsBatch, loadCachedGameStats } from './supabaseWeakness';
import {
  advanceOldestCursor,
  decideBackfillStep,
  getLibraryMeta,
  markHistoryComplete,
  mergeGames,
  saveLibraryGames,
} from './gameLibrary';
import { analyzeUnanalyzedGames } from './engine/browserStockfish';
import { EngineProgress } from './engine/types';

/**
 * The single source of weakness data for the whole app.
 *
 * There used to be two pipelines: this one, and /api/lichess/blunders, which
 * dropped every game Lichess had not already analyzed server-side -- most games
 * for most players. The in-arena trainer and the Lichess modal used that one, so
 * the surface users reached first was the surface that could not see their
 * mistakes. Both now read from here, where an unanalyzed game is simply a game
 * the browser engine has not swept yet.
 */
/** Below this age, a visit serves the saved library and never touches Lichess. */
export const SYNC_FRESHNESS_MS = 20 * 60 * 1000;

/**
 * How many recent games a first scan pulls. This is a latency budget, not a
 * ceiling: everything older is reachable through backfillHistory(), which
 * walks backwards a page at a time and survives a reload.
 */
export const RECENT_WINDOW_GAMES = 100;

/** Games per page of the backwards walk. */
export const BACKFILL_PAGE_GAMES = 100;

/**
 * Pages one backfillHistory() call will walk before returning. The cursor is
 * on disk, so pressing Continue picks up exactly where this left off -- the
 * bound exists so a single click cannot hold the connection for an hour.
 */
export const BACKFILL_PAGES_PER_RUN = 20;

export interface WeaknessScan {
  activeUsername: string;
  games: GameDerivedStats[];
  aggregate: UserAggregateStats | null;
  moments: CriticalMoment[];
  unanalyzedCount: number;

  isLoading: boolean;
  streamProgress: StreamProgress | null;
  error: string | null;
  /** When the current games were last pulled from Lichess, or null if never synced. */
  lastSyncedAt: number | null;
  /** True while scan() is serving the saved library without a network call. */
  isServingCache: boolean;

  isEngineRunning: boolean;
  isEnginePaused: boolean;
  engineProgress: EngineProgress | null;

  /** True once Lichess has no games older than the oldest one held. */
  historyComplete: boolean;
  isBackfilling: boolean;
  /** Games added by the backwards walk since this run started. */
  backfillFetched: number;

  scan: (username: string, forceRefresh?: boolean) => Promise<void>;
  runEngine: () => Promise<void>;
  pauseEngine: () => void;
  /** Walks further back through the player's history. Call again to resume. */
  backfillHistory: () => Promise<void>;
  pauseBackfill: () => void;
}

export function useWeaknessScan(options: { autoUsername?: string; enabled?: boolean } = {}): WeaknessScan {
  const { autoUsername, enabled = true } = options;

  const [activeUsername, setActiveUsername] = useState<string>('');
  const [games, setGames] = useState<GameDerivedStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamProgress, setStreamProgress] = useState<StreamProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [isServingCache, setIsServingCache] = useState<boolean>(false);

  const [isEngineRunning, setIsEngineRunning] = useState<boolean>(false);
  const [isEnginePaused, setIsEnginePaused] = useState<boolean>(false);
  const [engineProgress, setEngineProgress] = useState<EngineProgress | null>(null);

  const [historyComplete, setHistoryComplete] = useState<boolean>(false);
  const [isBackfilling, setIsBackfilling] = useState<boolean>(false);
  const [backfillFetched, setBackfillFetched] = useState<number>(0);

  const engineAbortControllerRef = useRef<AbortController | null>(null);
  const streamAbortControllerRef = useRef<AbortController | null>(null);
  const backfillAbortControllerRef = useRef<AbortController | null>(null);
  const isBackfillingRef = useRef<boolean>(false);
  const hasLoadedInitialRef = useRef<boolean>(false);
  // Mirrors activeUsername so scan can compare against it without taking it as a
  // dependency (the callback is intentionally stable).
  const activeUsernameRef = useRef<string>('');

  const scan = useCallback(async (targetUser: string, forceRefresh: boolean = false) => {
    const clean = targetUser.trim();
    if (!clean) return;

    // Abort a previous in-flight stream if still downloading
    if (streamAbortControllerRef.current) {
      streamAbortControllerRef.current.abort();
      streamAbortControllerRef.current = null;
    }
    const abortCtrl = new AbortController();
    streamAbortControllerRef.current = abortCtrl;

    // Switching accounts: drop the previous user's games immediately so a failed
    // or empty scan can never render one account's data under another account's
    // name (and so an engine run can't save it under the new user).
    if (activeUsernameRef.current.toLowerCase() !== clean.toLowerCase()) {
      setGames([]);
    }
    activeUsernameRef.current = clean;
    setActiveUsername(clean);
    setError(null);

    // 1. Local cache first for a 0ms render. Loaded even on a force refresh:
    // it is the merge base, and a refresh that replaced the library with just
    // the recent window would throw away every backfilled game.
    const cached = await loadCachedGameStats(clean);
    const cachedGames: GameDerivedStats[] = cached.games;
    if (cachedGames.length > 0) {
      setGames(cachedGames);
      setLastSyncedAt(cached.lastSyncedAt);
      setHistoryComplete((await getLibraryMeta(clean)).historyComplete);

      // The saved library is recent enough to serve as-is. This is the fix
      // for re-downloading the same games on every visit: previously the
      // cache only painted the first frame, and a full Lichess stream always
      // followed it regardless of age.
      const age = cached.lastSyncedAt ? Date.now() - cached.lastSyncedAt : Infinity;
      if (!forceRefresh && age < SYNC_FRESHNESS_MS) {
        setIsServingCache(true);
        if (streamAbortControllerRef.current === abortCtrl) {
          streamAbortControllerRef.current = null;
        }
        return;
      }
    }

    setIsServingCache(false);
    setIsLoading(true);
    try {
      // 2. Validate the username
      const valRes = await fetch(`/api/lichess/user/validate?username=${encodeURIComponent(clean)}`, {
        signal: abortCtrl.signal,
      });
      const valData = await valRes.json();
      if (!valRes.ok || !valData.valid) {
        throw new Error(valData.error || 'User not found on Lichess');
      }

      const canonicalUser = valData.user?.username || clean;
      if (canonicalUser !== clean) {
        activeUsernameRef.current = canonicalUser;
        setActiveUsername(canonicalUser);
      }

      // Only remember a username Lichess actually resolved, so a typo or an
      // offline scan doesn't become the account auto-loaded on the next visit.
      try {
        localStorage.setItem('chessz_last_username', canonicalUser);
      } catch {}

      // 3. Stream recent rated games. When a library already exists, ask only
      // for what is newer than its newest game: a revisit is then a handful of
      // games rather than a re-download of the whole recent window.
      const meta = await getLibraryMeta(canonicalUser);
      setHistoryComplete(meta.historyComplete);

      const since =
        !forceRefresh && cachedGames.length > 0 && meta.newestGameAt
          ? meta.newestGameAt
          : undefined;

      const streamed = await streamUserGames(canonicalUser, {
        max: RECENT_WINDOW_GAMES,
        since,
        signal: abortCtrl.signal,
        onProgress: (p) => setStreamProgress(p),
      });

      if (streamed.length === 0) {
        // Nothing new is the normal outcome of an incremental sync, and must
        // not read as "this account has no games".
        if (cachedGames.length === 0) {
          setError(`No recent standard games found for @${canonicalUser}.`);
        } else {
          // saveGameStatsBatch is a no-op on an empty list, so stamp freshness
          // directly -- otherwise "nothing new" would never refresh the clock
          // and every visit would hit Lichess again.
          setLastSyncedAt(Date.now());
          await saveLibraryGames(canonicalUser, [], { lastSyncedAt: Date.now() });
        }
      } else {
        const finalGames = mergeGames(cachedGames, streamed);
        setGames(finalGames);
        // Only the new rows need writing; the rest are already on disk.
        await saveGameStatsBatch(canonicalUser, streamed);
        setLastSyncedAt(Date.now());
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || 'Error loading games');
      }
    } finally {
      if (streamAbortControllerRef.current === abortCtrl) {
        setIsLoading(false);
        setStreamProgress(null);
      }
    }
  }, []);

  // Auto-scan once when a username is available
  useEffect(() => {
    if (!enabled || hasLoadedInitialRef.current) return;
    const target =
      autoUsername ||
      (typeof window !== 'undefined' ? localStorage.getItem('chessz_last_username') : '') ||
      '';
    if (target) {
      hasLoadedInitialRef.current = true;
      scan(target);
      // Deliberately no cleanup: cancelling the initial load whenever this effect
      // re-runs (a Lichess session resolving, or a dev re-mount) left the ref
      // guard set, so the load was dropped and never retried. scan already aborts
      // a stream it supersedes.
      return;
    }
    return () => {
      streamAbortControllerRef.current?.abort();
    };
  }, [enabled, autoUsername, scan]);

  const pauseBackfill = useCallback(() => {
    backfillAbortControllerRef.current?.abort();
    isBackfillingRef.current = false;
    setIsBackfilling(false);
  }, []);

  /**
   * Walks backwards through the player's history, a page at a time, asking
   * Lichess only for games older than the oldest one already held. The cursor
   * lives in the on-device library, so a paused, reloaded or crashed walk
   * resumes from exactly where it stopped rather than starting over.
   */
  const backfillHistory = useCallback(async () => {
    if (isBackfillingRef.current) {
      pauseBackfill();
      return;
    }

    const user = activeUsernameRef.current;
    if (!user) return;

    isBackfillingRef.current = true;
    setIsBackfilling(true);
    setBackfillFetched(0);
    setError(null);

    const abortCtrl = new AbortController();
    backfillAbortControllerRef.current = abortCtrl;

    try {
      for (let page = 0; page < BACKFILL_PAGES_PER_RUN; page++) {
        if (abortCtrl.signal.aborted) break;

        const meta = await getLibraryMeta(user);
        if (meta.historyComplete) {
          setHistoryComplete(true);
          break;
        }
        // Nothing held yet: there is no cursor to walk back from, so a plain
        // scan has to run first.
        if (!meta.oldestGameAt) break;

        let summary: StreamSummary = { rawGames: 0, oldestRawAt: 0 };
        const older = await streamUserGames(user, {
          max: BACKFILL_PAGE_GAMES,
          until: meta.oldestGameAt - 1,
          signal: abortCtrl.signal,
          onProgress: (p) => setStreamProgress(p),
          onStreamSummary: (s) => {
            summary = s;
          },
        });

        const step = decideBackfillStep({
          standardGames: older.length,
          rawGames: summary.rawGames,
          oldestRawAt: summary.oldestRawAt,
          cursor: meta.oldestGameAt,
        });

        if (step.action === 'complete') {
          await markHistoryComplete(user);
          setHistoryComplete(true);
          break;
        }

        if (step.action === 'advance') {
          // A block of variant games: nothing to save, but the cursor still
          // has to step past them or the walk loops on the same page forever.
          await advanceOldestCursor(user, step.to);
          continue;
        }

        setGames((prev) => mergeGames(prev, older));
        await saveGameStatsBatch(user, older);
        setBackfillFetched((n) => n + older.length);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || 'Could not load older games');
      }
    } finally {
      isBackfillingRef.current = false;
      setIsBackfilling(false);
      setStreamProgress(null);
      if (backfillAbortControllerRef.current === abortCtrl) {
        backfillAbortControllerRef.current = null;
      }
    }
  }, [pauseBackfill]);

  // Pause and resume share one path so the controls can't disagree about state.
  const pauseEngine = useCallback(() => {
    engineAbortControllerRef.current?.abort();
    setIsEngineRunning(false);
    setIsEnginePaused(true);
  }, []);

  const runEngine = useCallback(async () => {
    if (isEngineRunning) {
      pauseEngine();
      return;
    }

    setIsEngineRunning(true);
    setIsEnginePaused(false);
    const abortCtrl = new AbortController();
    engineAbortControllerRef.current = abortCtrl;

    try {
      const enriched = await analyzeUnanalyzedGames(games, activeUsernameRef.current, {
        signal: abortCtrl.signal,
        onProgress: (p) => setEngineProgress(p),
        // Surface each finished game as it lands instead of freezing for the batch.
        onGameAnalyzed: (partial) => setGames(partial),
      });

      setGames(enriched);
      await saveGameStatsBatch(activeUsernameRef.current, enriched);
      setLastSyncedAt(Date.now());

      // A run that was paused keeps its paused state and its progress bar: the
      // aborted analysis still resolves normally, and clearing here is what used
      // to wipe the "Paused - click Continue" affordance.
      if (!abortCtrl.signal.aborted) {
        setIsEnginePaused(false);
        setEngineProgress(null);
      }
    } catch (err: unknown) {
      console.error('Engine error:', err);
      setIsEnginePaused(false);
      setEngineProgress(null);
    } finally {
      setIsEngineRunning(false);
    }
  }, [games, isEngineRunning, pauseEngine]);

  const aggregate = useMemo<UserAggregateStats | null>(() => {
    if (games.length === 0 || !activeUsername) return null;
    return aggregateUserStats(games, activeUsername);
  }, [games, activeUsername]);

  const moments = useMemo<CriticalMoment[]>(() => aggregate?.criticalMoments ?? [], [aggregate]);

  const unanalyzedCount = useMemo(
    () => games.filter((g) => g.evalSource === 'none').length,
    [games]
  );

  return {
    activeUsername,
    games,
    aggregate,
    moments,
    unanalyzedCount,
    isLoading,
    streamProgress,
    error,
    lastSyncedAt,
    isServingCache,
    isEngineRunning,
    isEnginePaused,
    engineProgress,
    historyComplete,
    isBackfilling,
    backfillFetched,
    scan,
    runEngine,
    pauseEngine,
    backfillHistory,
    pauseBackfill,
  };
}
