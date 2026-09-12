import crypto from 'crypto';

export interface LichessPerf {
  games: number;
  rating: number;
  rd?: number;
  prog?: number;
  prov?: boolean;
}

export interface LichessUser {
  id: string;
  username: string;
  title?: string; // GM, WGM, IM, WIM, FM, WFM, CM, WCM, NM, etc.
  online?: boolean;
  patron?: boolean;
  createdAt?: number;
  seenAt?: number;
  url?: string;
  perfs?: {
    bullet?: LichessPerf;
    blitz?: LichessPerf;
    rapid?: LichessPerf;
    classical?: LichessPerf;
    puzzle?: LichessPerf;
    correspondence?: LichessPerf;
    storm?: { runs: number; score: number };
    [key: string]: any;
  };
  profile?: {
    bio?: string;
    country?: string;
    location?: string;
    realName?: string;
    fideRating?: number;
    links?: string;
  };
  count?: {
    all?: number;
    rated?: number;
    ai?: number;
    draw?: number;
    drawH?: number;
    loss?: number;
    lossH?: number;
    win?: number;
    winH?: number;
  };
}

export interface LichessSession {
  user: LichessUser;
  connectedAt: number;
  scope?: string;
}

export const LICHESS_CLIENT_ID = 'chesszapp';
export const LICHESS_HOST = 'https://lichess.org';

/**
 * Base64-URL encode a buffer per RFC 7636
 */
export function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generate cryptographically secure PKCE verifier (43-128 chars)
 */
export function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32));
}

/**
 * Compute SHA-256 PKCE challenge from verifier
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
}

/**
 * Exchange authorization code for Lichess access token
 */
export async function exchangeLichessToken(
  code: string,
  verifier: string,
  redirectUri: string
): Promise<{ access_token?: string; token_type?: string; error?: string; error_description?: string }> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: LICHESS_CLIENT_ID,
    code,
    code_verifier: verifier,
    redirect_uri: redirectUri,
  });

  const response = await fetch(`${LICHESS_HOST}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  return await response.json();
}

/**
 * Fetch authenticated player's account details from Lichess
 */
export async function fetchLichessAccount(accessToken: string): Promise<LichessUser | null> {
  try {
    const response = await fetch(`${LICHESS_HOST}/api/account`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data: LichessUser = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching Lichess account:', err);
    return null;
  }
}

/**
 * Fetch public user data by username without requiring token
 */
export async function fetchLichessPublicUser(username: string): Promise<LichessUser | null> {
  try {
    const response = await fetch(`${LICHESS_HOST}/api/user/${encodeURIComponent(username.trim())}`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching public Lichess user:', err);
    return null;
  }
}

/**
 * Revoke Lichess access token
 */
export async function revokeLichessToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${LICHESS_HOST}/api/token`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (err) {
    console.error('Error revoking Lichess token:', err);
    return false;
  }
}

/**
 * Helper to determine redirect URL based on incoming request headers
 */
export function getBaseUrl(headers: Headers): string {
  // Support custom environment URL if provided
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  const host = headers.get('x-forwarded-host') || headers.get('host');
  const proto = headers.get('x-forwarded-proto') || 'https';

  if (!host) {
    return 'https://chesszapp.vercel.app';
  }

  // Handle localhost port
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return `http://${host}`;
  }

  return `${proto}://${host}`;
}
