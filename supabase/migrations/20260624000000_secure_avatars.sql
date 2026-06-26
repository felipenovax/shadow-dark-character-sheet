-- Migration para proteger o bucket de avatares
-- 1. Remove a flag 'public' do bucket
update storage.buckets
set public = false
where id = 'avatars';

-- 2. Atualiza a política de leitura para que terceiros possam gerar signed URLs
-- Como o mestre e os jogadores da mesma aventura precisam ver os avatares uns dos outros,
-- a política de SELECT deve permitir acessos autenticados para gerar a Signed URL.
drop policy if exists "avatars_read" on storage.objects;
create policy "avatars_read" on storage.objects
  for select to authenticated using (bucket_id = 'avatars');
