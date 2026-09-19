-- ==============================================================================
-- Turn puzzle_history into a real training attempt log
-- ==============================================================================
-- puzzle_history existed since v1 but nothing ever wrote to it: mastery was
-- tracked as a single localStorage array of solved-once ids, with no
-- timestamp, no record of a failed attempt, and no way to ask "did training
-- actually reduce this mistake." That question needs a dated, per-attempt
-- log -- this table already had the right shape (user_id, puzzle_id,
-- is_correct, solved_at), so it gains the columns a real log needs instead of
-- being replaced.

alter table public.puzzle_history
  add column if not exists category text,
  add column if not exists tier text,
  add column if not exists game_id text,
  add column if not exists ply integer,
  add column if not exists time_spent_ms integer,
  add column if not exists used_engine boolean default false,
  add column if not exists source text;

create index if not exists idx_puzzle_history_user_solved_at
  on public.puzzle_history(user_id, solved_at desc);

create index if not exists idx_puzzle_history_user_category
  on public.puzzle_history(user_id, category);
