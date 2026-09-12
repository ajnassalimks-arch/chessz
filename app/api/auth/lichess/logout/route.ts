import { NextRequest, NextResponse } from 'next/server';
import { revokeLichessToken, getBaseUrl } from '@/lib/lichess';

export async function POST(request: NextRequest) {
  return handleLogout(request);
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

async function handleLogout(request: NextRequest) {
  const token = request.cookies.get('chessz_lichess_token')?.value;
  const searchParams = request.nextUrl.searchParams;
  const redirectUrl = searchParams.get('redirect');

  if (token) {
    try {
      await revokeLichessToken(token);
    } catch (err) {
      console.error('Failed revoking token on Lichess:', err);
    }
  }

  const baseUrl = getBaseUrl(request.headers);
  const destination = redirectUrl ? new URL(redirectUrl, baseUrl).toString() : null;

  const response = destination
    ? NextResponse.redirect(destination)
    : NextResponse.json({ ok: true, message: 'Logged out successfully' });

  response.cookies.delete('chessz_lichess_token');
  response.cookies.delete('chessz_lichess_user');

  return response;
}
