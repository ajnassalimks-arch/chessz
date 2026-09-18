'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { streamUserGames, StreamProgress } from './lichessStream';
import { GameDerivedStats, UserAggregateStats, CriticalMoment } from './chessMetrics/types';
import { aggregateUserStats } from './chessMetrics/gameParser';
import { saveGameStatsBatch, loadCachedGameStats } from './supabaseWeakness';
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

  scan: (username: string, forceRefresh?: boolean) => Promise<void>;
  runEngine: () => Promise<void>;
  pauseEngine: () => void;
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

  const engineAbortControllerRef = useRef<AbortController | null>(null);
  const streamAbortControllerRef = useRef<AbortController | null>(null);
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

    // 1. Local cache first for a 0ms render
    let cachedGames: GameDerivedStats[] = [];
    if (!forceRefresh) {
      const cached = await loadCachedGameStats(clean);
      if (cached.games.length > 0) {
        cachedGames = cached.games;
        setGames(cached.games);
        setLastSyncedAt(cached.lastSyncedAt);

        // The saved library is recent enough to serve as-is. This is the fix
        // for re-downloading the same 50 games on every visit: previously the
        // cache only painted the first frame, and a full Lichess stream always
        // followed it regardless of age.
        const age = cached.lastSyncedAt ? Date.now() - cached.lastSyncedAt : Infinity;
        if (age < SYNC_FRESHNESS_MS) {
          setIsServingCache(true);
          if (streamAbortControllerRef.current === abortCtrl) {
            streamAbortControllerRef.current = null;
          }
          return;
        }
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

      // 3. Stream up to 50 recent rated games
      const streamed = await streamUserGames(canonicalUser, {
        max: 50,
        signal: abortCtrl.signal,
        onProgress: (p) => setStreamProgress(p),
      });

      if (streamed.length === 0) {
        if (cachedGames.length === 0) {
          setError(`No recent standard games found for @${canonicalUser}.`);
        }
      } else {
        // Merge, preserving locally computed engine evals already on disk
        const cachedMap = new Map(cachedGames.map((g) => [g.gameId, g]));
        const merged: GameDerivedStats[] = streamed.map((sg) => {
          const prev = cachedMap.get(sg.gameId);
          if (prev && prev.evalSource === 'local' && sg.evalSource === 'none') {
            return prev;
          }
          return sg;
        });

        const streamedIds = new Set(streamed.map((g) => g.gameId));
        for (const cg of cachedGames) {
          if (!streamedIds.has(cg.gameId)) merged.push(cg);
        }

        merged.sort((a, b) => b.playedAt - a.playedAt);
        const finalGames = merged.slice(0, 50);

        setGames(finalGames);
        await saveGameStatsBatch(canonicalUser, finalGames);
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
    scan,
    runEngine,
    pauseEngine,
  };
}
