export type AbilityKey = 'for' | 'des' | 'con' | 'int' | 'sab' | 'car';

// O modificador NÃO é armazenado — é derivado do score em tempo de render.
export type Ability = {
  score: number;
};

export type Abilities = Record<AbilityKey, Ability>;

export type Alignment = 'Lawful' | 'Neutral' | 'Chaotic';

// Condição vital do personagem (máquina de estados de queda/morte).
// normal: PV > 0 · dying: caído a 0 PV (em agonia) · stabilized: 0 PV sem risco
// · dead: morto.
export type VitalCondition = 'normal' | 'dying' | 'stabilized' | 'dead';

export type Attack = {
  id: string;
  name: string;
  bonus: number;
  damage: string;
};

export type HitPoints = {
  current: number;
  max: number;
};

// PO (ouro) / PP (prata) / PC (cobre)
export type Coins = {
  gold: number;
  silver: number;
  copper: number;
};

export type Character = {
  id: string;
  createdAt: number;
  name: string;
  avatar: string; // data URL da imagem (vazio = sem imagem)
  abilities: Abilities;
  ancestry: string; // ANCESTRALIDADE
  class: string; // CLASSE
  level: number; // NÍVEL
  xp: number;
  title: string; // TÍTULO
  alignment: Alignment; // ALINHAMENTO
  background: string; // ANTECEDENTE
  deity: string; // DIVINDADE
  hitPoints: HitPoints; // PV
  // Rodadas restantes até a morte enquanto em agonia. null = timer não definido.
  deathTimer: number | null;
  condition: VitalCondition; // estado vital (normal/agonia/estabilizado/morto)
  armorClass: number; // CA
  attacks: Attack[]; // ATAQUES
  talents: string[]; // TALENTOS / MAGIAS
  coins: Coins;
  equipment: string[]; // tamanho fixo, índice = nº do slot, '' = vazio
  freeCarry: string; // CARGA LIVRE
};

export type Roster = {
  characters: Character[];
  activeId: string | null;
};
