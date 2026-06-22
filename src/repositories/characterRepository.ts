// types
import type { Character } from '@/types/character';

// lib
import { supabase } from '@/lib/supabase';

// constants
import {
  createDefaultCharacter,
  getInventorySlotCount,
} from '@/constants/character';

const TABLE = 'characters';

// Garante que campos ausentes (linhas antigas) tenham fallback seguro.
const normalizeCharacter = (character: Character): Character => {
  const base = createDefaultCharacter(character.name);
  const strengthScore =
    character.abilities?.for?.score ?? base.abilities.for.score;
  const slotCount = Math.max(
    getInventorySlotCount(strengthScore),
    character.equipment?.length ?? 0,
  );
  const equipment = Array.from(
    { length: slotCount },
    (_, index) => character.equipment?.[index] ?? '',
  );

  return {
    ...base,
    ...character,
    abilities: { ...base.abilities, ...character.abilities },
    hitPoints: { ...base.hitPoints, ...character.hitPoints },
    deathTimer: character.deathTimer ?? null,
    condition: character.condition ?? 'normal',
    coins: { ...base.coins, ...character.coins },
    attacks: character.attacks ?? [],
    talents: character.talents ?? [],
    equipment,
  };
};

type CharacterRow = {
  id: string;
  data: Character;
};

// Busca todas as fichas do usuário atual (RLS limita ao owner), mais antigas primeiro.
export const fetchCharacters = async (): Promise<Character[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, data')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data as CharacterRow[]).map((row) => normalizeCharacter(row.data));
};

// Cria ou atualiza uma ficha. owner_id é preenchido pelo default auth.uid() no insert.
export const upsertCharacter = async (character: Character): Promise<void> => {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: character.id, data: character });

  if (error) throw error;
};

export const deleteCharacterRow = async (id: string): Promise<void> => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) throw error;
};
