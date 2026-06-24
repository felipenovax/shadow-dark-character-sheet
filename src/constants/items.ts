// Catálogo de itens do Shadow Dark. Cada item ocupa um número de espaços de
// equipamento. Feixes (ex.: "Flechas (20)") ocupam 1 espaço por unidade.

export type ItemCategory = 'gear' | 'weapon' | 'armor';

export type CatalogItem = {
  id: string;
  name: string;
  category: ItemCategory;
  slots: number;
  cost?: string;
  damage?: string;
  ac?: string;
  properties?: string;
};

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  gear: 'Equipamentos',
  weapon: 'Armas',
  armor: 'Armaduras',
};

// Qualidade de armas/armaduras. Normal usa os status do catálogo;
// desgastada/melhorada permitem editar (dano/CA).
export type ItemQuality = 'worn' | 'normal' | 'improved';

export const ITEM_QUALITY_LABELS: Record<ItemQuality, string> = {
  worn: 'Desgastada',
  normal: 'Normal',
  improved: 'Melhorada',
};

export const ITEM_QUALITY_ORDER: ItemQuality[] = ['worn', 'normal', 'improved'];

export const isQualityItem = (category?: ItemCategory): boolean =>
  category === 'weapon' || category === 'armor';

// Equipamentos básicos — todos ocupam 1 espaço (o número entre parênteses é o feixe).
const GEAR: CatalogItem[] = [
  { id: 'arpeu', name: 'Arpéu', category: 'gear', slots: 1, cost: '1 PO' },
  { id: 'corda', name: 'Corda (18 m)', category: 'gear', slots: 1, cost: '1 PO' },
  { id: 'cravos-de-ferro', name: 'Cravos de ferro (10)', category: 'gear', slots: 1, cost: '1 PO' },
  { id: 'espelho', name: 'Espelho', category: 'gear', slots: 1, cost: '10 PO' },
  { id: 'estrepes', name: 'Estrepes (um saco)', category: 'gear', slots: 1, cost: '5 PP' },
  { id: 'flechas', name: 'Flechas (20)', category: 'gear', slots: 1, cost: '1 PO' },
  { id: 'frasco', name: 'Frasco ou garrafa', category: 'gear', slots: 1, cost: '3 PP' },
  { id: 'gema', name: 'Gema', category: 'gear', slots: 1, cost: 'Varia' },
  { id: 'lampiao', name: 'Lampião', category: 'gear', slots: 1, cost: '5 PO' },
  { id: 'mochila', name: 'Mochila', category: 'gear', slots: 1, cost: '2 PO' },
  { id: 'oleo', name: 'Óleo (frasco)', category: 'gear', slots: 1, cost: '5 PP' },
  { id: 'pe-de-cabra', name: 'Pé de cabra', category: 'gear', slots: 1, cost: '5 PP' },
  { id: 'pederneira', name: 'Pederneira', category: 'gear', slots: 1, cost: '5 PP' },
  { id: 'racoes', name: 'Rações (3)', category: 'gear', slots: 1, cost: '5 PP' },
  { id: 'tocha', name: 'Tocha', category: 'gear', slots: 1, cost: '5 PP' },
  { id: 'vara', name: 'Vara', category: 'gear', slots: 1, cost: '5 PP' },
  { id: 'virotes', name: 'Virotes de besta (20)', category: 'gear', slots: 1, cost: '1 PO' },
];

const WEAPONS: CatalogItem[] = [
  { id: 'adaga', name: 'Adaga', category: 'weapon', slots: 1, cost: '1 PO', damage: '1d4', properties: 'Ac, Ar' },
  { id: 'arco-curto', name: 'Arco curto', category: 'weapon', slots: 1, cost: '6 PO', damage: '1d4', properties: '2M' },
  { id: 'arco-longo', name: 'Arco longo', category: 'weapon', slots: 1, cost: '8 PO', damage: '1d8', properties: '2M' },
  { id: 'azagaia', name: 'Azagaia', category: 'weapon', slots: 1, cost: '5 PP', damage: '1d4', properties: 'Ar' },
  { id: 'besta', name: 'Besta', category: 'weapon', slots: 1, cost: '8 PO', damage: '1d6', properties: '2M, R' },
  { id: 'cajado', name: 'Cajado', category: 'weapon', slots: 1, cost: '5 PP', damage: '1d4', properties: '2M' },
  { id: 'clava', name: 'Clava', category: 'weapon', slots: 1, cost: '5 PC', damage: '1d4' },
  { id: 'espada-curta', name: 'Espada curta', category: 'weapon', slots: 1, cost: '7 PO', damage: '1d6' },
  { id: 'espada-bastarda', name: 'Espada bastarda', category: 'weapon', slots: 2, cost: '10 PO', damage: '1d8/1d10', properties: 'V, 2 espaços' },
  { id: 'espada-grande', name: 'Espada grande', category: 'weapon', slots: 2, cost: '12 PO', damage: '1d12', properties: '2M, 2 espaços' },
  { id: 'espada-longa', name: 'Espada longa', category: 'weapon', slots: 1, cost: '9 PO', damage: '1d8' },
  { id: 'lanca', name: 'Lança', category: 'weapon', slots: 1, cost: '5 PP', damage: '1d6', properties: 'Ar' },
  { id: 'maca', name: 'Maça', category: 'weapon', slots: 1, cost: '5 PO', damage: '1d6' },
  { id: 'machado-grande', name: 'Machado grande', category: 'weapon', slots: 2, cost: '10 PO', damage: '1d8/1d10', properties: 'V, 2 espaços' },
  { id: 'martelo-de-guerra', name: 'Martelo de guerra', category: 'weapon', slots: 1, cost: '10 PO', damage: '1d10', properties: '2M' },
];

const ARMOR: CatalogItem[] = [
  { id: 'armadura-de-couro', name: 'Armadura de couro', category: 'armor', slots: 1, cost: '10 PO', ac: '11 + MOD DES' },
  { id: 'cota-de-malha', name: 'Cota de malha', category: 'armor', slots: 2, cost: '60 PO', ac: '13 + MOD DES', properties: 'DESV em furtividade e natação' },
  { id: 'armadura-de-placas', name: 'Armadura de placas', category: 'armor', slots: 3, cost: '130 PO', ac: '15', properties: 'DESV em furtividade, não pode nadar' },
  { id: 'escudo', name: 'Escudo', category: 'armor', slots: 1, cost: '10 PO', ac: '+2', properties: 'Ocupa uma mão' },
];

export const ITEM_CATALOG: CatalogItem[] = [...GEAR, ...WEAPONS, ...ARMOR];

const CATALOG_BY_ID = new Map(ITEM_CATALOG.map((item) => [item.id, item]));

export const getCatalogItem = (id: string): CatalogItem | undefined =>
  CATALOG_BY_ID.get(id);

export const CATALOG_BY_CATEGORY: { category: ItemCategory; items: CatalogItem[] }[] =
  (['gear', 'weapon', 'armor'] as ItemCategory[]).map((category) => ({
    category,
    items: ITEM_CATALOG.filter((item) => item.category === category),
  }));
