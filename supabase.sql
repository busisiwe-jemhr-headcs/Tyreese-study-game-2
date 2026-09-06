-- Tyreese Quest: minimal shared family state
-- 1) Create a Supabase project.
-- 2) Open SQL Editor and run this file.
-- 3) Put the Project URL + anon key in Vercel env vars.
-- This app stores one JSON state object for the family code.
create table if not exists public.player_state (
  family_code text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.player_state enable row level security;

drop policy if exists "family state read" on public.player_state;
drop policy if exists "family state write" on public.player_state;

create policy "family state read"
on public.player_state for select
to anon, authenticated
using (true);

create policy "family state write"
on public.player_state for insert
to anon, authenticated
with check (true);

create policy "family state update"
on public.player_state for update
to anon, authenticated
using (true)
with check (true);

insert into public.player_state (family_code, state)
values ('TYREESE-2026', '{"player":{"name":"Tyreese","handle":"TYR3ESE","xp":0,"level":1,"streak":0},"sessions":[],"subjectStats":{}}')
on conflict (family_code) do nothing;

-- Enable live updates so the parent dashboard can update while Tyreese is studying.
alter publication supabase_realtime add table public.player_state;
