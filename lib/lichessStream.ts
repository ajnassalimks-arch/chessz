import { LichessRawGame, deriveGameStats } from './chessMetrics/gameParser';
import { GameDerivedStats } from './chessMetrics/types';

export interface StreamProgress {
  gamesFetched: number;
  latestGameDate?: number;
  analyzedCount: number;
  currentPhase: 'connecting' | 'streaming' | 'analyzing' | 'done';
}

export type OnGameReceivedCallback = (
  game: GameDerivedStats,
  progress: StreamProgress
) => void;

/**
 * What the stream saw before filtering, which the backwards walk through a
 * player's history needs in order to tell two different things apart: Lichess
 * having no older games at all, and a page that happened to be all variants.
 * Only the first means the history is exhausted.
 */
export interface StreamSummary {
  /** Every NDJSON line that parsed, standard or not. */
  rawGames: number;
  /** Oldest timestamp seen on any of them, or 0 if none. */
  oldestRawAt: number;
}

let activeStreamAbortController: AbortController | null = null;

/**
 * Client-side streaming reader that fetches NDJSON from Lichess incrementally,
 * parsing line-by-line off the stream with zero server compute.
 */
export async function streamUserGames(
  username: string,
  options: {
    max?: number;
    since?: number;
    /**
     * Only games played before this timestamp. This is what makes the
     * backwards walk through a player's full history resumable: each page asks
     * for games older than the oldest one already held.
     */
    until?: number;
    incremental?: boolean;
    signal?: AbortSignal;
    onGame?: OnGameReceivedCallback;
    onProgress?: (progress: StreamProgress) => void;
    onStreamSummary?: (summary: StreamSummary) => void;
  } = {}
): Promise<GameDerivedStats[]> {
  const max = options.max || 50;
  const until = typeof options.until === 'number' && options.until > 0 ? options.until : 0;
  const cleanUsername = username.trim();
  const storageKey = `chessz_last_game_at_${cleanUsername.toLowerCase()}`;

  // If a previous stream is still in-flight, abort it cleanly and wait for socket release
  if (activeStreamAbortController) {
    activeStreamAbortController.abort();
    activeStreamAbortController = null;
    await new Promise((r) => setTimeout(r, 1200));
  }

  const currentAbortController = new AbortController();
  activeStreamAbortController = currentAbortController;

  if (options.signal) {
    options.signal.addEventListener('abort', () => {
      currentAbortController.abort();
    });
  }

  // Only use since parameter if explicitly passed or incremental sync is requested
  let since = 0;
  if (typeof options.since === 'number' && options.since > 0) {
    since = options.since;
  } else if (options.incremental && typeof window !== 'undefined') {
    since = parseInt(localStorage.getItem(storageKey) || '0', 10);
  }

  const queryParams = new URLSearchParams({
    max: max.toString(),
    rated: 'true',
    evals: 'true',
    clocks: 'true',
    opening: 'true',
    accuracy: 'true',
    pgnInJson: 'true',
    sort: 'dateDesc',
  });

  if (since > 0) {
    queryParams.set('since', since.toString());
  }
  if (until > 0) {
    queryParams.set('until', until.toString());
  }

  const directUrl = `https://lichess.org/api/games/user/${encodeURIComponent(cleanUsername)}?${queryParams.toString()}`;
  const proxyUrl =
    `/api/lichess/games/stream?username=${encodeURIComponent(cleanUsername)}&max=${max}` +
    `${since > 0 ? `&since=${since}` : ''}${until > 0 ? `&until=${until}` : ''}`;

  let response: Response | null = null;

  // 1. Try direct browser fetch to Lichess with backoff retry
  let retries = 0;
  while (retries < 3) {
    if (currentAbortController.signal.aborted) {
      throw new Error('Stream cancelled');
    }

    try {
      options.onProgress?.({
        gamesFetched: 0,
        analyzedCount: 0,
        currentPhase: 'connecting',
      });

      const res = await fetch(directUrl, {
        signal: currentAbortController.signal,
        headers: {
          Accept: 'application/x-ndjson',
        },
      });

      if (res.status === 429) {
        // Rate limited: Lichess says "Please only run 1 request(s) at a time"
        const backoff = 3500 + retries * 1500;
        await new Promise((r) => setTimeout(r, backoff));
        retries++;
        continue;
      }

      if (res.ok) {
        response = res;
        break;
      } else {
        // If non-429 error, break and fallback
        break;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') throw err;
      // Network/CORS error on direct fetch -> break to fallback
      break;
    }
  }

  // 2. Fallback to streaming route handler if direct fetch was blocked
  if (!response || !response.ok) {
    if (currentAbortController.signal.aborted) {
      throw new Error('Stream cancelled');
    }

    try {
      const fallbackRes = await fetch(proxyUrl, { signal: currentAbortController.signal });
      if (fallbackRes.ok) {
        response = fallbackRes;
      } else {
        const errorJson = await fallbackRes.json().catch(() => null);
        const rawMsg = errorJson?.error || (await fallbackRes.text().catch(() => ''));
        if (fallbackRes.status === 429 || rawMsg.includes('1 request')) {
          throw new Error('Lichess is finishing a previous export. Please wait a few seconds and click Scan again.');
        }
        if (fallbackRes.status === 404) {
          throw new Error(`Lichess user "${cleanUsername}" was not found. Please check spelling.`);
        }
        throw new Error(rawMsg || `Failed to stream games: ${fallbackRes.statusText}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') throw err;
      const msg = err instanceof Error ? err.message : '';
      throw new Error(msg || 'Unable to connect to Lichess. Please check your network or try again.');
    }
  }

  if (!response.body) {
    throw new Error('Response body stream is unavailable.');
  }

  // 3. Read incrementally off the stream line-by-line
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  const games: GameDerivedStats[] = [];
  let newestGameAt = 0;
  let analyzedCount = 0;
  let rawGames = 0;
  let oldestRawAt = 0;

  const noteRaw = (rawGame: LichessRawGame) => {
    rawGames++;
    const at = rawGame.createdAt || rawGame.lastMoveAt || 0;
    if (at > 0 && (oldestRawAt === 0 || at < oldestRawAt)) oldestRawAt = at;
  };

  options.onProgress?.({
    gamesFetched: 0,
    analyzedCount: 0,
    currentPhase: 'streaming',
  });

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep partial line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const rawGame: LichessRawGame = JSON.parse(trimmed);
          noteRaw(rawGame);

          // Only process standard games (skip variants like chess960, crazyhouse, etc.)
          if (rawGame.variant && rawGame.variant !== 'standard') {
            continue;
          }

          const derived = deriveGameStats(rawGame, cleanUsername);
          if (derived) {
            games.push(derived);

            if (derived.evalSource !== 'none') {
              analyzedCount++;
            }

            if (derived.playedAt > newestGameAt) {
              newestGameAt = derived.playedAt;
            }

            const progress: StreamProgress = {
              gamesFetched: games.length,
              latestGameDate: newestGameAt,
              analyzedCount,
              currentPhase: 'streaming',
            };

            options.onGame?.(derived, progress);
            options.onProgress?.(progress);
          }
        } catch {
          // Ignore individual unparseable line
        }
      }
    }

    // Process any remaining bytes in buffer
    if (buffer.trim()) {
      try {
        const rawGame: LichessRawGame = JSON.parse(buffer.trim());
        noteRaw(rawGame);
        if (!rawGame.variant || rawGame.variant === 'standard') {
          const derived = deriveGameStats(rawGame, cleanUsername);
          if (derived) {
            games.push(derived);
            if (derived.evalSource !== 'none') analyzedCount++;
            if (derived.playedAt > newestGameAt) newestGameAt = derived.playedAt;
          }
        }
      } catch {}
    }
  } finally {
    reader.releaseLock();
  }

  // 4. Update last synced game timestamp in localStorage. Never from a
  // backwards walk: those pages are older by construction, so recording their
  // newest game would drag the incremental cursor into the past.
  if (typeof window !== 'undefined' && newestGameAt > 0 && until === 0) {
    try {
      localStorage.setItem(storageKey, newestGameAt.toString());
    } catch {}
  }

  options.onProgress?.({
    gamesFetched: games.length,
    latestGameDate: newestGameAt,
    analyzedCount,
    currentPhase: 'done',
  });

  options.onStreamSummary?.({ rawGames, oldestRawAt });

  return games;
}
