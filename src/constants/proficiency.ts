// Proficiência por classe (Shadow Dark): quais armas/armaduras cada classe pode
// usar. Ids correspondem ao catálogo em items.ts. 'all' = todas.

type Proficiency = 'all' | string[];

export const CLASS_WEAPONS: Record<string, Proficiency> = {
  Guerreiro: 'all',
  Clérigo: [
    'adaga',
    'besta',
    'cajado',
    'clava',
    'espada-longa',
    'maca',
    'martelo-de-guerra',
  ],
  Ladrão: ['adaga', 'arco-curto', 'besta', 'clava', 'espada-curta'],
  Mago: ['adaga', 'cajado'],
};

export const CLASS_ARMOR: Record<string, Proficiency> = {
  Guerreiro: 'all',
  Clérigo: 'all',
  Ladrão: ['armadura-de-couro', 'cota-de-malha'],
  Mago: [],
};

const canUse = (
  table: Record<string, Proficiency>,
  className: string,
  itemId: string | null,
): boolean => {
  if (!itemId) return false;
  const allowed = table[className];
  if (!allowed) return false;
  return allowed === 'all' || allowed.includes(itemId);
};

export const canUseWeapon = (className: string, itemId: string | null): boolean =>
  canUse(CLASS_WEAPONS, className, itemId);

export const canUseArmor = (className: string, itemId: string | null): boolean =>
  canUse(CLASS_ARMOR, className, itemId);
