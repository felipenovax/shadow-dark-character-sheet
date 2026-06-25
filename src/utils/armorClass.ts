// types
import type { InventoryItem } from '@/types/character';

// utils
import { getAbilityModifier } from '@/utils/abilityModifier';

// CA sem armadura: 10 + modificador de Destreza.
export const getUnarmoredAC = (dexScore: number): number => {
  return 10 + getAbilityModifier(dexScore);
};

// CA com a armadura equipada: CA base (+ bônus) e, se a armadura somar, o mod DES.
export const getEquippedAC = (
  item: InventoryItem,
  dexScore: number,
): number => {
  const base = (item.ac ?? 10) + (item.bonus ?? 0);
  return base + (item.acAddsDex ? getAbilityModifier(dexScore) : 0);
};
