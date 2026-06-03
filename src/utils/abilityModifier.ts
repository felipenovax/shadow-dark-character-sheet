// Modificador de atributo do Shadow Dark: floor((score - 10) / 2).
export const getAbilityModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};
