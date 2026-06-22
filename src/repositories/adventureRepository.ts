// types
import type { Adventure, Character } from '@/types/character';

// lib
import { supabase } from '@/lib/supabase';

// repositories
import { normalizeCharacter } from '@/repositories/characterRepository';

const TABLE = 'adventures';

type AdventureRow = {
  id: string;
  name: string;
  master_id: string;
  invite_code: string;
  created_at: string;
};

const toAdventure = (row: AdventureRow): Adventure => ({
  id: row.id,
  name: row.name,
  masterId: row.master_id,
  inviteCode: row.invite_code,
  createdAt: row.created_at,
});

const SELECT = 'id, name, master_id, invite_code, created_at';

// Aventuras visíveis ao usuário (RLS: as que mestro + as em que jogo).
export const fetchMyAdventures = async (): Promise<Adventure[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data as AdventureRow[]).map(toAdventure);
};

export const createAdventure = async (name: string): Promise<Adventure> => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name })
    .select(SELECT)
    .single();

  if (error) throw error;

  return toAdventure(data as AdventureRow);
};

// Fichas dos jogadores de uma aventura (RLS: o mestre enxerga todas dela).
export const fetchAdventureCharacters = async (
  adventureId: string,
): Promise<Character[]> => {
  const { data, error } = await supabase
    .from('characters')
    .select('id, data')
    .eq('adventure_id', adventureId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data as { id: string; data: Character }[]).map((row) =>
    normalizeCharacter(row.data),
  );
};

// Entrar numa aventura vinculando um personagem (resolve o código no servidor).
export const joinAdventure = async (
  code: string,
  characterId: string,
): Promise<void> => {
  const { error } = await supabase.rpc('join_adventure', {
    p_code: code,
    p_character_id: characterId,
  });

  if (error) throw error;
};

export const leaveAdventure = async (characterId: string): Promise<void> => {
  const { error } = await supabase.rpc('leave_adventure', {
    p_character_id: characterId,
  });

  if (error) throw error;
};
