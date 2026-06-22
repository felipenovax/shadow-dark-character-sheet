// Exibe o modificador sempre com sinal: +3, -1, +0.
export const formatModifier = (modifier: number): string => {
  if (modifier < 0) {
    return `${modifier}`;
  }

  return modifier > 0 ? `+${modifier}` : `${modifier}`;
};

// Bônus de ataque: positivo com +, zero vira traço, negativo mantém o sinal.
export const formatAttackBonus = (bonus: number): string => {
  if (bonus > 0) return `+${bonus}`;
  if (bonus === 0) return '—';
  return `${bonus}`;
};

// Esquema monocromático: positivo em destaque (roxo), zero/negativo em tinta.
export const formatModifierColor = (modifier: number): string => {
  if (modifier > 0) {
    return 'green';
  }

  if (modifier === 0) {
    return 'fg.muted';
  }

  return 'red';
};
