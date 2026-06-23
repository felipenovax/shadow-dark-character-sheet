// types
import type { Character } from '@/types/character';

// lib
import { supabase } from '@/lib/supabase';

// constants
import { createDefaultCharacter } from '@/constants/character';

const TABLE = 'characters';

// Garante que campos ausentes (linhas antigas) tenham fallback seguro.
export const normalizeCharacter = (character: Character): Character => {
  const base = createDefaultCharacter(character.name);

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
    inventory: character.inventory ?? [],
    consumables: character.consumables ?? [],
  };
};

type CharacterRow = {
  id: string;
  data: Character;
};

// Fichas do próprio usuário (lista pessoal), mais antigas primeiro.
export const fetchCharacters = async (
  ownerId: string,
): Promise<Character[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, data')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data as CharacterRow[]).map((row) => normalizeCharacter(row.data));
};

// Aventura à qual a ficha está vinculada (null se nenhuma). RLS permite ao dono
// e ao mestre lerem a linha.
export const fetchCharacterAdventureId = async (
  characterId: string,
): Promise<string | null> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('adventure_id')
    .eq('id', characterId)
    .maybeSingle();

  if (error) throw error;

  return (data as { adventure_id: string | null } | null)?.adventure_id ?? null;
};

export type CharacterLink = { characterId: string; adventureId: string };

// Vínculos das fichas próprias com aventuras (para listar "mesas que jogo").
export const fetchCharacterLinks = async (
  ownerId: string,
): Promise<CharacterLink[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, adventure_id')
    .eq('owner_id', ownerId)
    .not('adventure_id', 'is', null);

  if (error) throw error;

  return (data as { id: string; adventure_id: string }[]).map((row) => ({
    characterId: row.id,
    adventureId: row.adventure_id,
  }));
};

// Busca uma ficha acessível por id (própria ou de uma aventura que mestro, via RLS).
export const fetchCharacterById = async (
  id: string,
): Promise<Character | null> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, data')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return normalizeCharacter((data as CharacterRow).data);
};

// Cria uma ficha nova (owner_id vem do default auth.uid()). Só o dono insere.
export const insertCharacter = async (character: Character): Promise<void> => {
  const { error } = await supabase
    .from(TABLE)
    .insert({ id: character.id, data: character });

  if (error) throw error;
};

// Salva o conteúdo de uma ficha existente. Válido para o dono ou o mestre (RLS).
export const updateCharacter = async (character: Character): Promise<void> => {
  const { error } = await supabase
    .from(TABLE)
    .update({ data: character })
    .eq('id', character.id);

  if (error) throw error;
};

export const deleteCharacterRow = async (id: string): Promise<void> => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) throw error;
};
