-- Shadow Dark — schema inicial
-- Persistência de personagens na nuvem com isolamento por usuário anônimo (RLS).

-- ──────────────────────────────────────────────────────────────────────────
-- Tabela characters (abordagem documento: o Character completo em jsonb)
-- ──────────────────────────────────────────────────────────────────────────
create table if not exists public.characters (
  id         uuid primary key,
  owner_id   uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists characters_owner_id_idx
  on public.characters (owner_id);

-- updated_at automático a cada update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists characters_set_updated_at on public.characters;
create trigger characters_set_updated_at
  before update on public.characters
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- RLS: cada usuário (inclusive anônimo) só acessa as próprias fichas
-- ──────────────────────────────────────────────────────────────────────────
alter table public.characters enable row level security;

drop policy if exists "owner_select" on public.characters;
create policy "owner_select" on public.characters
  for select using (owner_id = auth.uid());

drop policy if exists "owner_insert" on public.characters;
create policy "owner_insert" on public.characters
  for insert with check (owner_id = auth.uid());

drop policy if exists "owner_update" on public.characters;
create policy "owner_update" on public.characters
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "owner_delete" on public.characters;
create policy "owner_delete" on public.characters
  for delete using (owner_id = auth.uid());

-- ──────────────────────────────────────────────────────────────────────────
-- Storage: bucket público de avatares; escrita restrita ao próprio usuário
-- Caminho dos objetos: {owner_id}/{character_id}
-- ──────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_read" on storage.objects;
create policy "avatars_read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars_insert" on storage.objects;
create policy "avatars_insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_update" on storage.objects;
create policy "avatars_update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_delete" on storage.objects;
create policy "avatars_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

GRANT ALL ON TABLE public.characters TO anon, authenticated;
