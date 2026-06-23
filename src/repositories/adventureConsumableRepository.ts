// lib
import { supabase } from '@/lib/supabase';

const TABLE = 'adventure_consumables';

export type SharedConsumable = {
  id: string;
  adventureId: string;
  characterId: string;
  consumableId: string;
  characterName: string;
  litBy: string;
  expiresAt: number; // epoch ms
};

type Row = {
  id: string;
  adventure_id: string;
  character_id: string;
  consumable_id: string;
  character_name: string;
  lit_by: string;
  expires_at: string;
};

export const toShared = (row: Row): SharedConsumable => ({
  id: row.id,
  adventureId: row.adventure_id,
  characterId: row.character_id,
  consumableId: row.consumable_id,
  characterName: row.character_name,
  litBy: row.lit_by,
  expiresAt: new Date(row.expires_at).getTime(),
});

export const fetchActiveConsumables = async (
  adventureId: string,
): Promise<SharedConsumable[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, adventure_id, character_id, consumable_id, character_name, lit_by, expires_at',
    )
    .eq('adventure_id', adventureId);

  if (error) throw error;

  return (data as Row[]).map(toShared);
};

export const lightSharedConsumable = async (params: {
  adventureId: string;
  characterId: string;
  characterName: string;
  consumableId: string;
  expiresAt: number;
}): Promise<void> => {
  const { error } = await supabase.from(TABLE).upsert(
    {
      adventure_id: params.adventureId,
      character_id: params.characterId,
      character_name: params.characterName,
      consumable_id: params.consumableId,
      expires_at: new Date(params.expiresAt).toISOString(),
    },
    { onConflict: 'character_id,consumable_id' },
  );

  if (error) throw error;
};

export const extinguishSharedConsumable = async (params: {
  characterId: string;
  consumableId: string;
}): Promise<void> => {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('character_id', params.characterId)
    .eq('consumable_id', params.consumableId);

  if (error) throw error;
};
