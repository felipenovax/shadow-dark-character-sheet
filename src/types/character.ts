// types
import type { ItemCategory, ItemQuality } from '@/constants/items';

export type AbilityKey = 'for' | 'des' | 'con' | 'int' | 'sab' | 'car';

// O modificador NÃO é armazenado — é derivado do score em tempo de render.
export type Ability = {
  score: number;
};

export type Abilities = Record<AbilityKey, Ability>;

export type AttributeBonus = {
  points: number;
  allowedAttributes?: AbilityKey[]; // Omitido = pode gastar em qualquer atributo
};

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

// Item carregado. Snapshot autossuficiente (nome/espaços), então não quebra se o
// catálogo mudar. itemId null = item personalizado (fora do catálogo).
// Campos de qualidade/stats só são usados por armas e armaduras.
export type InventoryItem = {
  itemId: string | null;
  name: string;
  slots: number;
  quantity: number;
  category?: ItemCategory; // 'weapon' | 'armor' (gear/custom omitem)
  quality?: ItemQuality;
  nickname?: string; // nome dado ao item (ex.: "Talon" em "Espada Longa")
  damage?: string; // arma: dano efetivo (ex.: 1d8)
  ac?: number; // armadura: CA base
  acAddsDex?: boolean; // armadura: soma o modificador de Destreza à CA
  bonus?: number; // arma/armadura: bônus (ex.: +1) para qualidade não-normal
  attackId?: string; // id do ataque criado automaticamente (arma usável pela classe)
  equipped?: boolean; // armadura equipada (no máximo uma)
};

// Consumível aceso: id + instante de expiração (epoch ms). Conta pelo relógio real.
export type ActiveConsumable = {
  id: string;
  expiresAt: number;
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
  backstory: string; // HISTÓRIA (Lore)
  deity: string; // DIVINDADE
  hitPoints: HitPoints; // PV
  // Rodadas restantes até a morte enquanto em agonia. null = timer não definido.
  deathTimer: number | null;
  condition: VitalCondition; // estado vital (normal/agonia/estabilizado/morto)
  attacks: Attack[]; // ATAQUES
  talents: string[]; // TALENTOS (texto livre)
  spells: string[]; // MAGIAS (ids do catálogo)
  coins: Coins;
  inventory: InventoryItem[]; // itens carregados (catálogo ou personalizados)
  consumables: ActiveConsumable[]; // consumíveis acesos (ex.: tocha)
  freeCarry: string; // CARGA LIVRE
  unspentAttributeBonuses: AttributeBonus[]; // PONTOS E RESTRIÇÕES GANHOS EM TALENTOS
  talentRoll?: number[]; // RESULTADO DOS DADOS (para manter na interface)
  attributeRolls?: Record<AbilityKey, number[]>; // HISTORICO DOS DADOS DOS ATRIBUTOS
};

export type Roster = {
  characters: Character[];
  activeId: string | null;
};

// Aventura (mesa): liga um mestre a jogadores via código de convite.
export type Adventure = {
  id: string;
  name: string;
  masterId: string;
  inviteCode: string;
  createdAt: string;
};
