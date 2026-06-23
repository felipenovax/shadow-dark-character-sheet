-- Shadow Dark — consumíveis compartilhados por aventura (tempo real).
-- Todos os membros da mesa veem as tochas acesas e o tempo restante.
-- Reaproveita os helpers is_master_of/plays_in da migration de aventuras.

create table if not exists public.adventure_consumables (
  id             uuid primary key default gen_random_uuid(),
  adventure_id   uuid not null references public.adventures (id) on delete cascade,
  character_id   uuid not null references public.characters (id) on delete cascade,
  consumable_id  text not null,
  character_name text not null,
  lit_by         uuid not null default auth.uid(),
  expires_at     timestamptz not null,
  created_at     timestamptz not null default now()
);

create index if not exists adventure_consumables_adventure_id_idx
  on public.adventure_consumables (adventure_id);

-- Uma tocha ativa por ficha+consumível (re-acender substitui a anterior).
create unique index if not exists adventure_consumables_character_consumable_idx
  on public.adventure_consumables (character_id, consumable_id);

alter table public.adventure_consumables enable row level security;

drop policy if exists "ac_select" on public.adventure_consumables;
create policy "ac_select" on public.adventure_consumables
  for select using (
    public.is_master_of(adventure_id) or public.plays_in(adventure_id)
  );

drop policy if exists "ac_insert" on public.adventure_consumables;
create policy "ac_insert" on public.adventure_consumables
  for insert with check (
    lit_by = auth.uid()
    and (public.is_master_of(adventure_id) or public.plays_in(adventure_id))
  );

drop policy if exists "ac_update" on public.adventure_consumables;
create policy "ac_update" on public.adventure_consumables
  for update using (lit_by = auth.uid()) with check (lit_by = auth.uid());

drop policy if exists "ac_delete" on public.adventure_consumables;
create policy "ac_delete" on public.adventure_consumables
  for delete using (lit_by = auth.uid() or public.is_master_of(adventure_id));

-- Habilita o Realtime (Postgres Changes) para esta tabela.
alter publication supabase_realtime add table public.adventure_consumables;
