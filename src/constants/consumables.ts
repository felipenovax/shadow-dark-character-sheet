// Consumíveis com duração em tempo real. A fonte define de onde vem a
// disponibilidade: um item do inventário (tocha) ou uma magia (luz).

export type ConsumableSource =
  | { type: 'inventory'; itemId: string } // liga ao item do catálogo (items.ts)
  | { type: 'spell'; spellId: string }; // liga a uma magia (spells.ts)

export type Consumable = {
  id: string;
  name: string;
  icon: string;
  durationMs: number;
  source: ConsumableSource;
};

const ONE_HOUR_MS = 60 * 60 * 1000;

// Faixa final em que a contagem aparece em vermelho (aviso de fim).
export const CONSUMABLE_WARNING_MS = 5 * 60 * 1000;

export const CONSUMABLES: Consumable[] = [
  {
    id: 'torch',
    name: 'Tocha',
    icon: '/assets/items/torch.png',
    durationMs: ONE_HOUR_MS,
    source: { type: 'inventory', itemId: 'tocha' },
  },
  {
    id: 'lamp',
    name: 'Lampião',
    icon: '/assets/items/lamp.png',
    durationMs: ONE_HOUR_MS,
    source: { type: 'inventory', itemId: 'lampiao' },
  },
  {
    id: 'light',
    name: 'Luz',
    icon: '/assets/misc/light-orb.png',
    durationMs: ONE_HOUR_MS,
    source: { type: 'spell', spellId: 'luz' },
  },
];
