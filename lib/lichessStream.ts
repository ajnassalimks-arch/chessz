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
 * Client-side streaming reader that fetches NDJSON from Lichess incrementally,
 * parsing line-by-line off the stream with zero server compute.
 */
export async function streamUserGames(
  username: string,
  options: {
    max?: number;
    since?: number;
    onGame?: OnGameReceivedCallback;
    onProgress?: (progress: StreamProgress) => void;
  } = {}
): Promise<GameDerivedStats[]> {
  const max = options.max || 50;
  const cleanUsername = username.trim();
  const storageKey = `chessz_last_game_at_${cleanUsername.toLowerCase()}`;

  // Get since parameter if available
  const since = options.since || (typeof window !== 'undefined' ? parseInt(localStorage.getItem(storageKey) || '0', 10) : 0);

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

  const directUrl = `https://lichess.org/api/games/user/${encodeURIComponent(cleanUsername)}?${queryParams.toString()}`;
  const proxyUrl = `/api/lichess/games/stream?username=${encodeURIComponent(cleanUsername)}&max=${max}${since > 0 ? `&since=${since}` : ''}`;

  let response: Response | null = null;

  // 1. Try direct browser fetch to Lichess with backoff retry
  let retries = 0;
  while (retries < 2) {
    try {
      options.onProgress?.({
        gamesFetched: 0,
        analyzedCount: 0,
        currentPhase: 'connecting',
      });

      const res = await fetch(directUrl, {
        headers: {
          Accept: 'application/x-ndjson',
        },
      });

      if (res.status === 429) {
        // Rate limited: back off
        await new Promise((r) => setTimeout(r, 2500 * (retries + 1)));
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
    } catch {
      // Network/CORS error on direct fetch -> break to fallback
      break;
    }
  }

  // 2. Fallback to streaming route handler if direct fetch was blocked
  if (!response || !response.ok) {
    try {
      const fallbackRes = await fetch(proxyUrl);
      if (fallbackRes.ok) {
        response = fallbackRes;
      } else {
        const errorJson = await fallbackRes.json().catch(() => null);
        throw new Error(errorJson?.error || `Failed to stream games: ${fallbackRes.statusText}`);
      }
    } catch (err: any) {
      throw new Error(err.message || 'Unable to connect to Lichess. Please check your network or try again.');
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

          // Only process standard games (skip variants like chess960, crazyhouse, etc.)
          if ((rawGame as any).variant && (rawGame as any).variant !== 'standard') {
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
        if (!(rawGame as any).variant || (rawGame as any).variant === 'standard') {
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

  // 4. Update last synced game timestamp in localStorage
  if (typeof window !== 'undefined' && newestGameAt > 0) {
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

  return games;
}
