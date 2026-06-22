// lib
import { AVATARS_BUCKET, supabase } from '@/lib/supabase';

// Caminho do objeto no bucket: {owner_id}/{character_id} (alinhado às policies de Storage).
const buildPath = (ownerId: string, characterId: string): string => {
  return `${ownerId}/${characterId}`;
};

const requireUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error('Sessão ausente para upload de avatar.');
  }

  return data.user.id;
};

// Faz upload da imagem e retorna a URL pública (com cache-buster para refletir trocas).
export const uploadAvatar = async (
  file: File,
  characterId: string,
): Promise<string> => {
  const ownerId = await requireUserId();
  const path = buildPath(ownerId, characterId);

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);

  // Cache-buster: força o navegador a recarregar a imagem após uma troca.
  return `${data.publicUrl}?v=${Date.now()}`;
};

export const removeAvatar = async (characterId: string): Promise<void> => {
  const ownerId = await requireUserId();
  const path = buildPath(ownerId, characterId);

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .remove([path]);

  if (error) throw error;
};
