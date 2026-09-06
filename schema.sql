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
