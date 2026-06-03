// types
import type { Character, Roster } from '@/types/character';

// constants
import {
  createDefaultCharacter,
  EQUIPMENT_SLOT_COUNT,
  STORAGE_KEY,
} from '@/constants/character';

const createInitialRoster = (): Roster => {
  const firstCharacter = createDefaultCharacter();

  return {
    characters: [firstCharacter],
    activeId: firstCharacter.id,
  };
};

// Garante que campos ausentes (versões antigas) tenham fallback seguro.
const normalizeCharacter = (character: Character): Character => {
  const base = createDefaultCharacter(character.name);
  const equipment = Array.from(
    { length: EQUIPMENT_SLOT_COUNT },
    (_, index) => character.equipment?.[index] ?? '',
  );

  return {
    ...base,
    ...character,
    abilities: { ...base.abilities, ...character.abilities },
    hitPoints: { ...base.hitPoints, ...character.hitPoints },
    coins: { ...base.coins, ...character.coins },
    attacks: character.attacks ?? [],
    talents: character.talents ?? [],
    equipment,
  };
};

const isValidRoster = (value: unknown): value is Roster => {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as Roster).characters)
  );
};

export const loadRoster = (): Roster => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return createInitialRoster();

    const parsed: unknown = JSON.parse(raw);

    if (!isValidRoster(parsed) || parsed.characters.length === 0) {
      return createInitialRoster();
    }

    const characters = parsed.characters.map(normalizeCharacter);
    const hasActive = characters.some((char) => char.id === parsed.activeId);

    return {
      characters,
      activeId: hasActive ? parsed.activeId : characters[0].id,
    };
  } catch {
    return createInitialRoster();
  }
};

export const saveRoster = (roster: Roster): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roster));
  } catch {
    // Falha de persistência (ex.: storage cheio) não deve quebrar a UI.
  }
};
