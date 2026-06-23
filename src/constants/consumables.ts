// Consumíveis com duração em tempo real. A tocha é o primeiro; a estrutura
// permite adicionar outros (lampião, óleo, etc.) no futuro.

export type Consumable = {
  id: string;
  name: string;
  icon: string;
  durationMs: number;
  inventoryItemId: string; // liga ao item do catálogo de inventário (items.ts)
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
    inventoryItemId: 'tocha', // id do item no catálogo de inventário (items.ts)
  },
];
