import { NextRequest } from 'next/server';

/**
 * Pure I/O streaming proxy for Lichess NDJSON games.
 * Used as a fallback if client-side direct CORS encounters browser network/adblock issues.
 * Streams chunks immediately without buffering in memory or consuming Active CPU.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.trim();
  const max = searchParams.get('max') || '50';
  const since = searchParams.get('since');

  if (!username || !/^[a-zA-Z0-9_-]{2,30}$/.test(username)) {
    return new Response(JSON.stringify({ error: 'Valid Lichess username required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parsedMax = parseInt(searchParams.get('max') || '50', 10);
  const clampedMax = String(Math.min(Math.max(Number.isFinite(parsedMax) ? parsedMax : 50, 1), 100));

  const queryParams = new URLSearchParams({
    max: clampedMax,
    rated: 'true',
    evals: 'true',
    clocks: 'true',
    opening: 'true',
    accuracy: 'true',
    pgnInJson: 'true',
    sort: 'dateDesc',
  });

  if (since) {
    queryParams.set('since', since);
  }

  const lichessUrl = `https://lichess.org/api/games/user/${encodeURIComponent(username)}?${queryParams.toString()}`;

  try {
    const lichessRes = await fetch(lichessUrl, {
      signal: AbortSignal.timeout(15000),
      headers: {
        Accept: 'application/x-ndjson',
        'User-Agent': 'ChessZ-App/1.0 (contact: chesszapp@vercel.app)',
      },
    });

    if (!lichessRes.ok) {
      const errorText = await lichessRes.text();
      let userMessage = errorText;
      if (lichessRes.status === 429 || errorText.includes('1 request')) {
        userMessage = 'Lichess allows only 1 export request at a time. Please wait a few seconds and try again.';
      }
      return new Response(JSON.stringify({ error: userMessage }), {
        status: lichessRes.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Forward the streaming body directly (zero CPU buffering)
    return new Response(lichessRes.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err: any) {
    const isTimeout = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    return new Response(
      JSON.stringify({
        error: isTimeout
          ? 'Lichess request timed out. Please try again with fewer games or wait a moment.'
          : err.message || 'Stream failed',
      }),
      {
        status: isTimeout ? 504 : 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
