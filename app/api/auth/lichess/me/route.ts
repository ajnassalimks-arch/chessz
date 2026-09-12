import { NextRequest, NextResponse } from 'next/server';
import { fetchLichessAccount, fetchLichessPublicUser } from '@/lib/lichess';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shouldRefresh = searchParams.get('refresh') === 'true';
    const queryUsername = searchParams.get('username');

    const token = request.cookies.get('chessz_lichess_token')?.value;
    const userCookie = request.cookies.get('chessz_lichess_user')?.value;

    // 1. Authenticated token refresh or check
    if (token) {
      if (shouldRefresh) {
        const freshUser = await fetchLichessAccount(token);
        if (freshUser) {
          const response = NextResponse.json({ authenticated: true, user: freshUser });
          response.cookies.set('chessz_lichess_user', JSON.stringify(freshUser), {
            httpOnly: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
          });
          return response;
        }
      }

      if (userCookie) {
        try {
          const cachedUser = JSON.parse(userCookie);
          return NextResponse.json({ authenticated: true, user: cachedUser });
        } catch {}
      }

      // If user cookie was corrupted, fetch fresh from Lichess
      const freshUser = await fetchLichessAccount(token);
      return NextResponse.json({ authenticated: !!freshUser, user: freshUser });
    }

    // 2. Unauthenticated public username lookup (useful for previewing any Lichess player)
    if (queryUsername) {
      const publicUser = await fetchLichessPublicUser(queryUsername);
      return NextResponse.json({ authenticated: false, isPublicPreview: true, user: publicUser });
    }

    // 3. Fallback to cached user cookie if present (offline resilience)
    if (userCookie) {
      try {
        const cachedUser = JSON.parse(userCookie);
        return NextResponse.json({ authenticated: false, isCached: true, user: cachedUser });
      } catch {}
    }

    return NextResponse.json({ authenticated: false, user: null });
  } catch (err) {
    console.error('Error in /api/auth/lichess/me:', err);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
