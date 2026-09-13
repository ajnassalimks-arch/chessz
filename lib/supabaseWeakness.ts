import { supabase, isSupabaseConfigured } from './supabase';
import { GameDerivedStats, CriticalMoment } from './chessMetrics/types';

const LOCAL_STORAGE_KEY_PREFIX = 'chessz_weakness_';

/**
 * Saves games and critical moments to Supabase if authenticated,
 * otherwise falls back to browser localStorage / IndexedDB.
 */
export async function saveGameStatsBatch(
  username: string,
  games: GameDerivedStats[]
): Promise<{ savedToSupabase: boolean; count: number }> {
  if (typeof window === 'undefined' || !games || games.length === 0) {
    return { savedToSupabase: false, count: 0 };
  }

  // 1. Always checkpoint locally for instant 0ms offline load
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${username.toLowerCase()}`;
    // Store only minimal representation without heavy move arrays
    const sanitized = games.map((g) => ({
      ...g,
      moves: [], // Strip heavy move objects to stay well below localStorage 5MB limit
    }));
    localStorage.setItem(key, JSON.stringify(sanitized));
    localStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch (e) {
    console.warn('LocalStorage quota limit reached, skipping local backup', e);
  }

  // 2. If Supabase is configured, check if user has an active session
  if (!isSupabaseConfigured || !supabase) {
    return { savedToSupabase: false, count: games.length };
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      // User is viewing anonymously / without Supabase login
      return { savedToSupabase: false, count: games.length };
    }

    // Upsert Lichess Account row
    const newestGameAt = Math.max(...games.map((g) => g.playedAt));
    await supabase.from('lichess_accounts').upsert({
      user_id: userId,
      lichess_username: username.toLowerCase(),
      last_synced_at: new Date().toISOString(),
      last_game_at: new Date(newestGameAt).toISOString(),
    });

    // Batch upsert game_stats rows
    const gameRows = games.map((g) => ({
      game_id: g.gameId,
      user_id: userId,
      played_at: new Date(g.playedAt).toISOString(),
      color: g.color,
      result: g.result,
      speed: g.speed,
      eco: g.eco || null,
      opening_name: g.openingName || null,
      opening_ply: g.openingPly,
      clock_initial: g.clockInitial || null,
      clock_increment: g.clockIncrement || 0,
      user_rating: g.userRating || null,
      opponent_rating: g.opponentRating || null,
      rating_diff: g.ratingDiff || null,
      accuracy: g.accuracy,
      acpl: g.acpl || null,
      winpct_lost_opening: g.winpctLostOpening,
      winpct_lost_middlegame: g.winpctLostMiddlegame,
      winpct_lost_endgame: g.winpctLostEndgame,
      inaccuracies: g.inaccuracies,
      mistakes: g.mistakes,
      blunders: g.blunders,
      peak_eval: g.peakEvalWhite,
      trough_eval: g.troughEvalWhite,
      converted: g.converted,
      rescued: g.rescued,
      missed_punishments: g.missedPunishments,
      eval_source: g.evalSource,
      engine_nodes: g.engineNodes || null,
    }));

    const { error: gameError } = await supabase.from('game_stats').upsert(gameRows, {
      onConflict: 'game_id',
    });

    if (gameError) {
      console.warn('Error saving game_stats to Supabase:', gameError.message);
      return { savedToSupabase: false, count: games.length };
    }

    // Batch insert critical moments (max 10 per game)
    const momentRows: any[] = [];
    for (const g of games) {
      for (const m of g.criticalMoments) {
        momentRows.push({
          game_id: g.gameId,
          user_id: userId,
          ply: m.ply,
          san: m.san,
          fen: m.fen || null,
          eval_before: m.evalBefore,
          eval_after: m.evalAfter,
          winpct_lost: m.winPctLost,
          judgment: m.judgment,
          phase: m.phase,
          clock_remaining: m.clockRemaining || null,
          time_spent_seconds: m.timeSpentSeconds || null,
        });
      }
    }

    if (momentRows.length > 0) {
      await supabase.from('critical_moments').insert(momentRows);
    }

    return { savedToSupabase: true, count: games.length };
  } catch (err) {
    console.warn('Supabase sync notice:', err);
    return { savedToSupabase: false, count: games.length };
  }
}

/**
 * Loads cached game stats from Supabase or localStorage
 */
export async function loadCachedGameStats(
  username: string
): Promise<{ games: GameDerivedStats[]; fromSupabase: boolean }> {
  if (typeof window === 'undefined' || !username) {
    return { games: [], fromSupabase: false };
  }

  // 1. Try Supabase first if configured and authenticated
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (userId) {
        const { data: rows } = await supabase
          .from('game_stats')
          .select('*')
          .eq('user_id', userId)
          .order('played_at', { ascending: false })
          .limit(100);

        if (rows && rows.length > 0) {
          const mapped: GameDerivedStats[] = rows.map((r: any) => ({
            gameId: r.game_id,
            userId: r.user_id,
            playedAt: new Date(r.played_at).getTime(),
            color: r.color,
            result: r.result,
            status: 'finished',
            speed: r.speed,
            eco: r.eco,
            openingName: r.opening_name,
            openingPly: r.opening_ply || 16,
            clockInitial: r.clock_initial,
            clockIncrement: r.clock_increment,
            userRating: r.user_rating,
            opponentRating: r.opponent_rating,
            ratingDiff: r.rating_diff,
            accuracy: Number(r.accuracy) || 0,
            acpl: Number(r.acpl) || 0,
            winpctLostOpening: Number(r.winpct_lost_opening) || 0,
            winpctLostMiddlegame: Number(r.winpct_lost_middlegame) || 0,
            winpctLostEndgame: Number(r.winpct_lost_endgame) || 0,
            inaccuracies: r.inaccuracies || 0,
            mistakes: r.mistakes || 0,
            blunders: r.blunders || 0,
            peakEvalWhite: r.peak_eval || 0,
            troughEvalWhite: r.trough_eval || 0,
            converted: Boolean(r.converted),
            rescued: Boolean(r.rescued),
            missedPunishments: r.missed_punishments || 0,
            evalSource: r.eval_source || 'none',
            engineNodes: r.engine_nodes,
            moves: [],
            criticalMoments: [],
          }));

          return { games: mapped, fromSupabase: true };
        }
      }
    } catch {}
  }

  // 2. Fallback to localStorage
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${username.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { games: parsed, fromSupabase: false };
      }
    }
  } catch {}

  return { games: [], fromSupabase: false };
}
