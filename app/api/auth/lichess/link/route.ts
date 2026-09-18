import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { LICHESS_HOST } from '@/lib/lichess';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const lichessToken = cookieStore.get('chessz_lichess_token')?.value;

    if (!lichessToken) {
      return NextResponse.json({ error: 'No active Lichess session' }, { status: 401 });
    }

    // Verify Lichess identity from source
    const lichessRes = await fetch(`${LICHESS_HOST}/api/account`, {
      headers: {
        Authorization: `Bearer ${lichessToken}`,
        'User-Agent': 'ChessZ-App/1.0 (contact: chesszapp@vercel.app)',
      },
      cache: 'no-store',
    });

    if (!lichessRes.ok) {
      return NextResponse.json({ error: 'Invalid Lichess credentials' }, { status: 401 });
    }
    const lichessUser = await lichessRes.json();

    // Verify Supabase Auth Header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing Supabase authorization' }, { status: 401 });
    }
    const supabaseToken = authHeader.split(' ')[1];

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
      '';
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      '';

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
    });

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized Supabase session' }, { status: 401 });
    }

    // Atomically link account with auth.uid() == user_id verified
    const { error: upsertErr } = await supabase.from('lichess_accounts').upsert(
      {
        user_id: user.id,
        lichess_username: lichessUser.username.toLowerCase(),
        last_synced_at: new Date().toISOString(),
        last_game_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      username: lichessUser.username,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
