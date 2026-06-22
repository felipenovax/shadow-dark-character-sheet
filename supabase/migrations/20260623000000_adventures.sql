-- Shadow Dark — aventuras (mesas) e papel de mestre.
-- Um mestre cria uma aventura e vê/edita as fichas dos jogadores vinculados a ela.
-- Membership é implícita: mestre = adventures.master_id; jogadores = donos de
-- personagens com adventure_id apontando para a mesa.

-- ──────────────────────────────────────────────────────────────────────────
-- Tabela adventures
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.adventures (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  master_id   uuid not null default auth.uid()
              references auth.users on delete cascade,
  invite_code text not null unique
              default upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  created_at  timestamptz not null default now()
);

create index if not exists adventures_master_id_idx
  on public.adventures (master_id);

alter table public.characters
  add column if not exists adventure_id uuid
  references public.adventures (id) on delete set null;

create index if not exists characters_adventure_id_idx
  on public.characters (adventure_id);

-- ──────────────────────────────────────────────────────────────────────────
-- Helpers SECURITY DEFINER (ignoram RLS internamente → evitam recursão entre
-- as policies de characters e adventures).
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.is_master_of(adv uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.adventures a
    where a.id = adv and a.master_id = auth.uid()
  );
$$;

create or replace function public.plays_in(adv uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.characters c
    where c.adventure_id = adv and c.owner_id = auth.uid()
  );
$$;

-- ──────────────────────────────────────────────────────────────────────────
-- RLS: adventures
-- ──────────────────────────────────────────────────────────────────────────
alter table public.adventures enable row level security;

drop policy if exists "adv_select" on public.adventures;
create policy "adv_select" on public.adventures
  for select using (master_id = auth.uid() or public.plays_in(id));

drop policy if exists "adv_insert" on public.adventures;
create policy "adv_insert" on public.adventures
  for insert with check (master_id = auth.uid());

drop policy if exists "adv_update" on public.adventures;
create policy "adv_update" on public.adventures
  for update using (master_id = auth.uid()) with check (master_id = auth.uid());

drop policy if exists "adv_delete" on public.adventures;
create policy "adv_delete" on public.adventures
  for delete using (master_id = auth.uid());

-- ──────────────────────────────────────────────────────────────────────────
-- RLS: characters — dono sempre; mestre da aventura pode ver e editar.
-- ──────────────────────────────────────────────────────────────────────────
drop policy if exists "owner_select" on public.characters;
create policy "owner_select" on public.characters
  for select using (owner_id = auth.uid() or public.is_master_of(adventure_id));

drop policy if exists "owner_update" on public.characters;
create policy "owner_update" on public.characters
  for update using (owner_id = auth.uid() or public.is_master_of(adventure_id))
  with check (owner_id = auth.uid() or public.is_master_of(adventure_id));

-- insert (só o dono) e delete (só o dono) permanecem como na migration inicial.

-- ──────────────────────────────────────────────────────────────────────────
-- RPCs para entrar/sair por código de convite (sem expor todas as aventuras).
-- ──────────────────────────────────────────────────────────────────────────
create or replace function public.join_adventure(p_code text, p_character_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_adventure_id uuid;
begin
  select id into v_adventure_id
  from public.adventures
  where invite_code = upper(trim(p_code));

  if v_adventure_id is null then
    raise exception 'Código de convite inválido';
  end if;

  update public.characters
  set adventure_id = v_adventure_id
  where id = p_character_id and owner_id = auth.uid();

  if not found then
    raise exception 'Personagem não encontrado';
  end if;

  return v_adventure_id;
end;
$$;

create or replace function public.leave_adventure(p_character_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.characters
  set adventure_id = null
  where id = p_character_id and owner_id = auth.uid();
end;
$$;
