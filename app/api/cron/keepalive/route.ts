import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Daily cron ping route to prevent Supabase Free Tier project from pausing after 7 idle days.
 * Configured in vercel.json to run at 00:00 UTC every day.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Verify Vercel Cron Secret in production; allow unauthenticated only in non-production environments when secret is unset
  if (process.env.NODE_ENV === 'production') {
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({
      status: 'skipped',
      message: 'Supabase is not configured yet',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Perform a lightweight keepalive query
    const { error } = await supabase.from('lichess_accounts').select('user_id').limit(1);

    if (error && error.code !== 'PGRST116') {
      // Ignore "no rows" errors, just keep connection alive
      console.warn('Keepalive query notice:', error.message);
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase keepalive ping successful',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', error: err.message },
      { status: 500 }
    );
  }
}
