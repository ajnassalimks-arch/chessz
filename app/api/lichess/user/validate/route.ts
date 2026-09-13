import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates a Lichess username against GET https://lichess.org/api/user/{username}
 * Serverless function does I/O only.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.trim();

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Sanitize username (letters, numbers, hyphens, underscores)
  if (!/^[a-zA-Z0-9_-]{2,30}$/.test(username)) {
    return NextResponse.json({ error: 'Invalid Lichess username format' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://lichess.org/api/user/${encodeURIComponent(username)}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ChessZ-App/1.0 (contact: chesszapp@vercel.app)',
      },
      next: { revalidate: 300 }, // Cache 5 min
    });

    if (res.status === 404) {
      return NextResponse.json(
        { error: `Lichess user "${username}" was not found. Please check spelling.` },
        { status: 404 }
      );
    }

    if (res.status === 429) {
      return NextResponse.json(
        { error: 'Lichess rate limit reached. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lichess API error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const userData = await res.json();
    return NextResponse.json({
      valid: true,
      user: {
        id: userData.id,
        username: userData.username,
        title: userData.title,
        perfs: userData.perfs,
        count: userData.count,
        createdAt: userData.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to connect to Lichess' },
      { status: 500 }
    );
  }
}
