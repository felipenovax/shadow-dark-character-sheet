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

  return path;
};

export const getSecureAvatarUrl = async (path: string): Promise<string> => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // Se o path salvo no banco for uma URL pública antiga, limpa-o
  let cleanPath = path;
  if (path.includes('/storage/v1/object/public/avatars/')) {
    cleanPath = path.split('/storage/v1/object/public/avatars/')[1];
  }
  if (cleanPath.includes('?')) {
    cleanPath = cleanPath.split('?')[0];
  }

  const { data, error } = await supabase.storage.from(AVATARS_BUCKET).createSignedUrl(cleanPath, 3600);
  if (error) {
    console.error('Falha ao gerar signed URL:', error);
    return '';
  }
  
  // Cache-buster
  return `${data.signedUrl}&v=${Date.now()}`;
};

export const removeAvatar = async (characterId: string): Promise<void> => {
  const ownerId = await requireUserId();
  const path = buildPath(ownerId, characterId);

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .remove([path]);

  if (error) throw error;
};
