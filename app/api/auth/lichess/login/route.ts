import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  getBaseUrl,
  LICHESS_CLIENT_ID,
  LICHESS_HOST,
} from '@/lib/lichess';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const returnUrl = searchParams.get('returnUrl') || '/';

    const baseUrl = getBaseUrl(request.headers);
    const redirectUri = `${baseUrl}/api/auth/lichess/callback`;

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const rawState = crypto.randomBytes(16).toString('hex');
    const state = `${rawState}|${encodeURIComponent(returnUrl)}`;

    const authUrl = new URL(`${LICHESS_HOST}/oauth`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', LICHESS_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'preference:read');
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('state', state);

    const isProd = process.env.NODE_ENV === 'production' && !baseUrl.includes('localhost');

    const response = NextResponse.redirect(authUrl.toString());

    response.cookies.set('chessz_oauth_verifier', codeVerifier, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 minutes
    });

    response.cookies.set('chessz_oauth_state', state, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
    });

    return response;
  } catch (err) {
    console.error('Error initiating Lichess OAuth:', err);
    return NextResponse.json({ error: 'Failed to initiate OAuth flow' }, { status: 500 });
  }
}
