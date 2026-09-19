import { NextRequest } from 'next/server';

/**
 * Pure I/O streaming proxy for Lichess NDJSON games.
 * Used as a fallback if client-side direct CORS encounters browser network/adblock issues.
 * Streams chunks immediately without buffering in memory or consuming Active CPU.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.trim();
  const since = searchParams.get('since');
  const until = searchParams.get('until');

  if (!username || !/^[a-zA-Z0-9_-]{2,30}$/.test(username)) {
    return new Response(JSON.stringify({ error: 'Valid Lichess username required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // A page of the backwards walk through a full history, not just the recent
  // window. Still bounded: the body is piped, so a large page costs no memory
  // here, but it must finish inside the fetch timeout below.
  const parsedMax = parseInt(searchParams.get('max') || '50', 10);
  const clampedMax = String(Math.min(Math.max(Number.isFinite(parsedMax) ? parsedMax : 50, 1), 300));

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
  if (until) {
    queryParams.set('until', until);
  }

  const lichessUrl = `https://lichess.org/api/games/user/${encodeURIComponent(username)}?${queryParams.toString()}`;

  try {
    // Scales with the page size: 50 games arrive in a few seconds, 300 do not,
    // and the timeout aborts the body stream, not just the headers.
    const timeoutMs = Math.min(45000, 15000 + Number(clampedMax) * 100);
    const lichessRes = await fetch(lichessUrl, {
      signal: AbortSignal.timeout(timeoutMs),
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
