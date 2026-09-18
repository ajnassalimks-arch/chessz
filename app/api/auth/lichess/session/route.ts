import { NextRequest, NextResponse } from 'next/server';
import { fetchLichessAccount } from '@/lib/lichess';
import {
  isLichessLoginConfigured,
  getSupabaseAdmin,
  createServerAuthClient,
  deriveLichessLoginEmail,
  deriveLichessLoginPassword,
} from '@/lib/supabaseAdmin';

/**
 * Bridges an already-verified Lichess OAuth connection into a Supabase
 * session, so a player's saved blunder library follows their Lichess account
 * across devices instead of living in one browser's localStorage.
 *
 * Client-side, useLichess calls this once a real OAuth connection (not a
 * public-username preview) is confirmed, and passes the returned tokens to
 * supabase.auth.setSession(). This route never receives or returns anything
 * the player would recognize as a password -- it derives one server-side from
 * their Lichess id and a secret that stays on the server.
 */
export async function POST(request: NextRequest) {
  if (!isLichessLoginConfigured) {
    // Optional feature. Without it, saves stay local to this browser (or to a
    // Supabase anonymous session, if only the base Supabase keys are set).
    return NextResponse.json({ linked: false, reason: 'not_configured' });
  }

  const token = request.cookies.get('chessz_lichess_token')?.value;
  if (!token) {
    return NextResponse.json({ linked: false, reason: 'not_connected' }, { status: 401 });
  }

  const lichessUser = await fetchLichessAccount(token);
  if (!lichessUser) {
    return NextResponse.json({ linked: false, reason: 'lichess_unreachable' }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const authClient = createServerAuthClient();
  if (!admin || !authClient) {
    return NextResponse.json({ linked: false, reason: 'not_configured' });
  }

  const email = deriveLichessLoginEmail(lichessUser.id);
  const password = deriveLichessLoginPassword(lichessUser.id);

  try {
    let { data, error } = await authClient.auth.signInWithPassword({ email, password });

    if (error) {
      // First time this Lichess account has connected: create its Supabase
      // user. "already registered" here would mean a race with another
      // request for the same account, which the retry below resolves.
      const { error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          lichess_id: lichessUser.id,
          lichess_username: lichessUser.username,
        },
      });
      if (createErr && !/already.*registered/i.test(createErr.message)) {
        throw createErr;
      }

      ({ data, error } = await authClient.auth.signInWithPassword({ email, password }));
      if (error) throw error;
    }

    if (!data.session || !data.user) {
      throw new Error('Supabase sign-in returned no session');
    }

    // Keyed on lichess_username, not user_id: an earlier anonymous session
    // (before this bridge existed) may already hold a row for this same
    // username under a different, disconnected user_id. Conflicting on the
    // username lets this write correct that row rather than fail on it.
    await admin.from('lichess_accounts').upsert(
      {
        user_id: data.user.id,
        lichess_username: lichessUser.username.toLowerCase(),
        last_synced_at: new Date().toISOString(),
        last_game_at: new Date().toISOString(),
      },
      { onConflict: 'lichess_username' }
    );

    return NextResponse.json({
      linked: true,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch (err: unknown) {
    console.error('Lichess-linked Supabase login failed:', err);
    return NextResponse.json({ linked: false, reason: 'error' }, { status: 500 });
  }
}
