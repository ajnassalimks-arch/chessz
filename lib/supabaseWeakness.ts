import { supabase, isSupabaseConfigured } from './supabase';
import { GameDerivedStats } from './chessMetrics/types';

const LOCAL_STORAGE_KEY_PREFIX = 'chessz_weakness_';

async function ensureAuthenticatedSession(): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user?.id) {
      return sessionData.session.user.id;
    }
    const { data: anonData, error } = await supabase.auth.signInAnonymously();
    if (error || !anonData?.user) {
      return null;
    }
    return anonData.user.id;
  } catch {
    return null;
  }
}

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

  // 1. Always checkpoint locally for instant client-side cache load
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${username.toLowerCase()}`;
    const sanitized = games.map((g) => ({
      ...g,
      // Preserve essential move data so in-browser Stockfish engine can replay moves
      moves: (g.moves || []).map((m) => ({
        ply: m.ply,
        moveNumber: m.moveNumber,
        color: m.color,
        san: m.san,
        // fen is the position before the move: required by the blunder trainer's
        // setup stepper and by Maia Lens after a reload from cache.
        fen: m.fen,
        evalBefore: m.evalBefore,
        evalAfter: m.evalAfter,
        winPctBefore: m.winPctBefore,
        winPctAfter: m.winPctAfter,
        winPctLost: m.winPctLost,
        judgment: m.judgment,
        accuracy: m.accuracy,
        phase: m.phase,
        pieceCount: m.pieceCount,
        clockRemaining: m.clockRemaining,
        timeSpentSeconds: m.timeSpentSeconds,
      })),
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
    const userId = await ensureAuthenticatedSession();

    if (!userId) {
      // User is viewing anonymously without active session
      return { savedToSupabase: false, count: games.length };
    }

    // Upsert Lichess Account row (safely compute newest timestamp)
    const validTimestamps = games
      .map((g) => Number(g.playedAt))
      .filter((t) => Number.isFinite(t) && t > 0);
    const newestGameAt = validTimestamps.length > 0 ? Math.max(...validTimestamps) : Date.now();

    await supabase.from('lichess_accounts').upsert({
      user_id: userId,
      lichess_username: username.toLowerCase(),
      last_synced_at: new Date().toISOString(),
      last_game_at: new Date(newestGameAt).toISOString(),
    });

    // Batch upsert game_stats rows
    const gameRows = games.map((g) => {
      const validPlayedAt = Number.isFinite(Number(g.playedAt)) && Number(g.playedAt) > 0
        ? new Date(Number(g.playedAt)).toISOString()
        : new Date().toISOString();

      return {
        game_id: g.gameId,
        user_id: userId,
        played_at: validPlayedAt,
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
    };
  });

    const { error: gameError } = await supabase.from('game_stats').upsert(gameRows, {
      onConflict: 'game_id',
    });

    if (gameError) {
      console.warn('Error saving game_stats to Supabase:', gameError.message);
      return { savedToSupabase: false, count: games.length };
    }

    // Batch insert critical moments (max 10 per game)
    interface MomentRow {
      game_id: string;
      user_id: string;
      ply: number;
      san: string;
      fen: string | null;
      eval_before: number;
      eval_after: number;
      winpct_lost: number;
      judgment: string;
      phase: string;
      clock_remaining: number | null;
      time_spent_seconds: number | null;
    }
    const momentRows: MomentRow[] = [];
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
      // Upsert, not insert: this runs on every scan and after every engine
      // sweep, so a plain insert appended a fresh copy of every moment each
      // time. (game_id, ply) identifies a moment uniquely.
      await supabase
        .from('critical_moments')
        .upsert(momentRows, { onConflict: 'game_id,ply' });
    }

    return { savedToSupabase: true, count: games.length };
  } catch (err) {
    console.warn('Supabase sync notice:', err);
    return { savedToSupabase: false, count: games.length };
  }
}

interface DbGameRow {
  game_id: string;
  user_id: string;
  played_at: string;
  color: 'white' | 'black';
  result: 'win' | 'loss' | 'draw';
  speed: string;
  eco?: string;
  opening_name?: string;
  opening_ply?: number;
  clock_initial?: number;
  clock_increment?: number;
  user_rating?: number;
  opponent_rating?: number;
  rating_diff?: number;
  accuracy?: number | string;
  acpl?: number | string;
  winpct_lost_opening?: number | string;
  winpct_lost_middlegame?: number | string;
  winpct_lost_endgame?: number | string;
  inaccuracies?: number;
  mistakes?: number;
  blunders?: number;
  peak_eval?: number;
  trough_eval?: number;
  converted?: boolean;
  rescued?: boolean;
  missed_punishments?: number;
  eval_source?: 'lichess' | 'local' | 'none';
  engine_nodes?: number;
}

/**
 * Reads the locally checkpointed games for a user. These rows carry the full
 * move list and critical moments; the Supabase tables do not.
 */
function readLocalGames(username: string): GameDerivedStats[] {
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${username.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as GameDerivedStats[];
      }
    }
  } catch {}
  return [];
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

  const localGames = readLocalGames(username);
  const localById = new Map(localGames.map((g) => [g.gameId, g]));

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
          const mapped: GameDerivedStats[] = (rows as DbGameRow[]).map((r) => {
            // game_stats stores aggregates only. When the same game is already
            // checkpointed locally, prefer that copy: it still has the moves and
            // critical moments the engine sweep and blunder trainer replay from.
            const local = localById.get(r.game_id);
            if (local && local.moves && local.moves.length > 0) {
              return local;
            }
            return {
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
            };
          });

          // Local-only games (not yet upserted, or newer than the last sync)
          // must not be dropped just because Supabase answered first.
          const mappedIds = new Set(mapped.map((g) => g.gameId));
          for (const lg of localGames) {
            if (!mappedIds.has(lg.gameId)) mapped.push(lg);
          }
          mapped.sort((a, b) => b.playedAt - a.playedAt);

          return { games: mapped, fromSupabase: true };
        }
      }
    } catch {}
  }

  // 2. Fallback to localStorage
  if (localGames.length > 0) {
    return { games: localGames, fromSupabase: false };
  }

  return { games: [], fromSupabase: false };
}
