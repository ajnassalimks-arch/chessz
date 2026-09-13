-- Weakness Dashboard Schema for ChessZ
-- Optimized for Supabase Free Tier (500 MB limit):
-- 1. Zero raw PGN in Postgres
-- 2. Zero per-move rows (capped at 10 critical moments per game)
-- 3. RLS enabled on all tables (users only access their own data)

-- 1. Lichess Accounts
create table if not exists public.lichess_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  lichess_username text not null unique,
  last_synced_at timestamptz not null default now(),
  last_game_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.lichess_accounts enable row level security;

create policy "Users can view their own lichess account"
  on public.lichess_accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own lichess account"
  on public.lichess_accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Game Stats (Per-game derived aggregates)
create table if not exists public.game_stats (
  game_id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  played_at timestamptz not null,
  color text not null check (color in ('white', 'black')),
  result text not null check (result in ('win', 'loss', 'draw')),
  speed text not null,
  eco text,
  opening_name text,
  opening_ply int default 16,
  clock_initial int,
  clock_increment int,
  user_rating int,
  opponent_rating int,
  rating_diff int,
  accuracy numeric(5,2),
  acpl numeric(6,2),
  winpct_lost_opening numeric(6,2) default 0,
  winpct_lost_middlegame numeric(6,2) default 0,
  winpct_lost_endgame numeric(6,2) default 0,
  inaccuracies int default 0,
  mistakes int default 0,
  blunders int default 0,
  peak_eval int,
  trough_eval int,
  converted boolean default false,
  rescued boolean default false,
  missed_punishments int default 0,
  eval_source text check (eval_source in ('lichess', 'local', 'none')),
  engine_nodes int,
  analysis_version int default 1,
  created_at timestamptz not null default now()
);

create index if not exists idx_game_stats_user on public.game_stats (user_id, played_at desc);
create index if not exists idx_game_stats_speed on public.game_stats (speed);
create index if not exists idx_game_stats_eco on public.game_stats (eco);

alter table public.game_stats enable row level security;

create policy "Users can read own game stats"
  on public.game_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert/update own game stats"
  on public.game_stats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Critical Moments (Capped at 10 worst moves per game)
create table if not exists public.critical_moments (
  id bigserial primary key,
  game_id text not null references public.game_stats(game_id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  ply int not null,
  san text not null,
  fen text,
  eval_before int,
  eval_after int,
  winpct_lost numeric(6,2) not null,
  judgment text not null,
  phase text not null,
  clock_remaining int,
  time_spent_seconds int,
  created_at timestamptz not null default now()
);

create index if not exists idx_critical_moments_game on public.critical_moments (game_id);
create index if not exists idx_critical_moments_user on public.critical_moments (user_id, winpct_lost desc);

alter table public.critical_moments enable row level security;

create policy "Users can read own critical moments"
  on public.critical_moments for select
  using (auth.uid() = user_id);

create policy "Users can insert/update own critical moments"
  on public.critical_moments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
