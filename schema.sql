-- ==============================================================================
-- ChessZ v1 � Supabase Production Database Schema
-- Run this in your Supabase project's SQL Editor (https://supabase.com/dashboard)
-- 100% Free Tier Compatible (Postgres 15+, Row-Level Security enabled)
-- ==============================================================================

-- 1. Create Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  rating_tier text default 'beginner',
  fide_diagnosis text,
  golden_rule text,
  current_streak integer default 0,
  best_streak integer default 0,
  puzzles_solved integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Puzzle Solved History Table
create table if not exists public.puzzle_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  puzzle_id text not null,
  track text not null check (track in ('tactical', 'positional')),
  is_correct boolean not null default true,
  solved_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.puzzle_history enable row level security;

-- 4. RLS Policies for Profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 5. RLS Policies for Puzzle History
create policy "Users can view their own puzzle history"
  on public.puzzle_history for select
  using (auth.uid() = user_id);

create policy "Users can record their puzzle solves"
  on public.puzzle_history for insert
  with check (auth.uid() = user_id);

-- 6. Trigger to automatically create a profile when a new user signs up via Magic Link
create or replace function public.handle_new_user()
returns trigger as 
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
 language plpgsql security definer;

-- Drop trigger if it exists already, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. Helpful Indexing for fast queries
create index if not exists idx_puzzle_history_user_id on public.puzzle_history(user_id);
create index if not exists idx_puzzle_history_puzzle_id on public.puzzle_history(puzzle_id);

-- ==============================================================================
-- 8. Lichess Accounts Table & RLS
-- ==============================================================================
create table if not exists public.lichess_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  lichess_username text not null unique,
  last_synced_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_game_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lichess_accounts enable row level security;

create policy "Users can view own lichess account"
  on public.lichess_accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert own lichess account"
  on public.lichess_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own lichess account"
  on public.lichess_accounts for update
  using (auth.uid() = user_id);

-- ==============================================================================
-- 9. Game Stats Table & RLS
-- ==============================================================================
create table if not exists public.game_stats (
  game_id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  played_at timestamp with time zone not null,
  color text not null check (color in ('white', 'black')),
  result text not null check (result in ('win', 'loss', 'draw')),
  speed text not null,
  eco text,
  opening_name text,
  opening_ply integer default 16,
  clock_initial integer,
  clock_increment integer default 0,
  user_rating integer,
  opponent_rating integer,
  rating_diff integer,
  accuracy numeric(5, 2),
  acpl integer,
  winpct_lost_opening numeric(5, 2),
  winpct_lost_middlegame numeric(5, 2),
  winpct_lost_endgame numeric(5, 2),
  inaccuracies integer default 0,
  mistakes integer default 0,
  blunders integer default 0,
  peak_eval integer,
  trough_eval integer,
  converted boolean default true,
  rescued boolean default false,
  missed_punishments integer default 0,
  eval_source text default 'none',
  engine_nodes bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.game_stats enable row level security;

create policy "Users can view own game stats"
  on public.game_stats for select
  using (auth.uid() = user_id);

create policy "Users can insert own game stats"
  on public.game_stats for insert
  with check (auth.uid() = user_id);

create policy "Users can update own game stats"
  on public.game_stats for update
  using (auth.uid() = user_id);

-- ==============================================================================
-- 10. Critical Moments Table & RLS
-- ==============================================================================
create table if not exists public.critical_moments (
  id uuid default gen_random_uuid() primary key,
  game_id text references public.game_stats(game_id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  ply integer not null,
  san text not null,
  fen text,
  eval_before integer not null,
  eval_after integer not null,
  winpct_lost numeric(5, 2) not null,
  judgment text not null check (judgment in ('none', 'inaccuracy', 'mistake', 'blunder')),
  phase text not null check (phase in ('opening', 'middlegame', 'endgame')),
  clock_remaining integer,
  time_spent_seconds integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.critical_moments enable row level security;

create policy "Users can view own critical moments"
  on public.critical_moments for select
  using (auth.uid() = user_id);

create policy "Users can insert own critical moments"
  on public.critical_moments for insert
  with check (auth.uid() = user_id);

-- Indexing for fast weakness studio queries
create index if not exists idx_game_stats_user_id_played_at on public.game_stats(user_id, played_at desc);
create index if not exists idx_critical_moments_game_id on public.critical_moments(game_id);
create index if not exists idx_critical_moments_user_id on public.critical_moments(user_id);


-- ==============================================================================
-- 11. Critical Moments De-duplication
-- ==============================================================================
-- saveGameStatsBatch runs on every scan and after every engine sweep, and used a
-- plain insert, so re-scanning the same 50 games appended a fresh copy of every
-- moment each time. A game and ply identify a moment uniquely; the client now
-- upserts on that key.
delete from public.critical_moments a
  using public.critical_moments b
  where a.ctid < b.ctid
    and a.game_id = b.game_id
    and a.ply = b.ply;

alter table public.critical_moments
  add constraint critical_moments_game_ply_key unique (game_id, ply);

create policy "Users can update own critical moments"
  on public.critical_moments for update
  using (auth.uid() = user_id);
