-- Critical moments were inserted, never upserted, so every re-scan duplicated
-- every row. Collapse existing duplicates, then make the pair unique.
delete from public.critical_moments a
  using public.critical_moments b
  where a.ctid < b.ctid
    and a.game_id = b.game_id
    and a.ply = b.ply;

alter table public.critical_moments
  add constraint critical_moments_game_ply_key unique (game_id, ply);

-- Upsert needs an update path under RLS.
create policy "Users can update own critical moments"
  on public.critical_moments for update
  using (auth.uid() = user_id);
