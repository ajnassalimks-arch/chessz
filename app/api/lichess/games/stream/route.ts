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

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const queryParams = new URLSearchParams({
    max,
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
    return new Response(JSON.stringify({ error: err.message || 'Stream failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
