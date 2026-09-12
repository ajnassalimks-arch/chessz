import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeLichessToken,
  fetchLichessAccount,
  getBaseUrl,
} from '@/lib/lichess';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');

  const baseUrl = getBaseUrl(request.headers);
  const isProd = process.env.NODE_ENV === 'production' && !baseUrl.includes('localhost');

  // Extract returnUrl from state if available
  let returnUrl = '/';
  if (state && state.includes('|')) {
    const parts = state.split('|');
    if (parts[1]) {
      try {
        returnUrl = decodeURIComponent(parts[1]);
      } catch {}
    }
  }

  const destinationUrl = new URL(returnUrl, baseUrl);

  if (errorParam) {
    destinationUrl.searchParams.set('auth_error', errorParam);
    return NextResponse.redirect(destinationUrl.toString());
  }

  const savedState = request.cookies.get('chessz_oauth_state')?.value;
  const codeVerifier = request.cookies.get('chessz_oauth_verifier')?.value;

  if (!state || !savedState || state !== savedState || !code || !codeVerifier) {
    destinationUrl.searchParams.set('auth_error', 'invalid_state_or_missing_verifier');
    return NextResponse.redirect(destinationUrl.toString());
  }

  const redirectUri = `${baseUrl}/api/auth/lichess/callback`;

  try {
    const tokenResult = await exchangeLichessToken(code, codeVerifier, redirectUri);

    if (!tokenResult.access_token) {
      console.error('Failed to exchange token:', tokenResult);
      destinationUrl.searchParams.set('auth_error', tokenResult.error || 'token_exchange_failed');
      return NextResponse.redirect(destinationUrl.toString());
    }

    const user = await fetchLichessAccount(tokenResult.access_token);

    if (!user) {
      destinationUrl.searchParams.set('auth_error', 'fetch_account_failed');
      return NextResponse.redirect(destinationUrl.toString());
    }

    destinationUrl.searchParams.set('lichess_connected', '1');
    destinationUrl.searchParams.set('username', user.username);

    const response = NextResponse.redirect(destinationUrl.toString());

    // 1 Year session duration
    const oneYear = 60 * 60 * 24 * 365;

    // Secure token cookie
    response.cookies.set('chessz_lichess_token', tokenResult.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: oneYear,
    });

    // Public user session cookie for fast client-side hydration
    response.cookies.set('chessz_lichess_user', JSON.stringify(user), {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: oneYear,
    });

    // Clear temp cookies
    response.cookies.delete('chessz_oauth_verifier');
    response.cookies.delete('chessz_oauth_state');

    return response;
  } catch (err: any) {
    console.error('Error handling Lichess callback:', err);
    destinationUrl.searchParams.set('auth_error', err.message || 'unknown_callback_error');
    return NextResponse.redirect(destinationUrl.toString());
  }
}
