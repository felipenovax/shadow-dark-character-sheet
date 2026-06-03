// libs
import { useCallback, useEffect, useMemo, useState } from 'react';

// types
import type {
  AbilityKey,
  Attack,
  Character,
  Coins,
  HitPoints,
  Roster,
} from '@/types/character';

// constants
import { createDefaultCharacter } from '@/constants/character';

// utils
import { createId } from '@/utils/createId';
import { loadRoster, saveRoster } from '@/utils/characterStorage';

const SAVE_DEBOUNCE_MS = 300;

export const useCharacterRoster = () => {
  const [roster, setRoster] = useState<Roster>(loadRoster);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => saveRoster(roster), SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [roster]);

  const activeCharacter = useMemo(
    () => roster.characters.find((char) => char.id === roster.activeId) ?? null,
    [roster],
  );

  // Aplica uma transformação imutável apenas na ficha ativa.
  const updateActiveCharacter = useCallback(
    (transform: (character: Character) => Character) => {
      setRoster((current) => ({
        ...current,
        characters: current.characters.map((char) =>
          char.id === current.activeId ? transform(char) : char,
        ),
      }));
    },
    [],
  );

  const createCharacter = useCallback(() => {
    const newCharacter = createDefaultCharacter();
    setRoster((current) => ({
      characters: [...current.characters, newCharacter],
      activeId: newCharacter.id,
    }));
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setRoster((current) => {
      const remaining = current.characters.filter((char) => char.id !== id);
      const characters =
        remaining.length > 0 ? remaining : [createDefaultCharacter()];
      const stillActive = characters.some(
        (char) => char.id === current.activeId,
      );

      return {
        characters,
        activeId: stillActive ? current.activeId : characters[0].id,
      };
    });
  }, []);

  const selectCharacter = useCallback((id: string) => {
    setRoster((current) => ({ ...current, activeId: id }));
  }, []);

  const updateField = useCallback(
    <K extends keyof Character>(key: K, value: Character[K]) => {
      updateActiveCharacter((char) => ({ ...char, [key]: value }));
    },
    [updateActiveCharacter],
  );

  const updateAbilityScore = useCallback(
    (key: AbilityKey, score: number) => {
      updateActiveCharacter((char) => ({
        ...char,
        abilities: { ...char.abilities, [key]: { score } },
      }));
    },
    [updateActiveCharacter],
  );

  const updateHitPoints = useCallback(
    (part: keyof HitPoints, value: number) => {
      updateActiveCharacter((char) => ({
        ...char,
        hitPoints: { ...char.hitPoints, [part]: value },
      }));
    },
    [updateActiveCharacter],
  );

  const updateCoins = useCallback(
    (part: keyof Coins, value: number) => {
      updateActiveCharacter((char) => ({
        ...char,
        coins: { ...char.coins, [part]: value },
      }));
    },
    [updateActiveCharacter],
  );

  const updateEquipmentSlot = useCallback(
    (index: number, value: string) => {
      updateActiveCharacter((char) => ({
        ...char,
        equipment: char.equipment.map((slot, slotIndex) =>
          slotIndex === index ? value : slot,
        ),
      }));
    },
    [updateActiveCharacter],
  );

  const addAttack = useCallback(() => {
    updateActiveCharacter((char) => ({
      ...char,
      attacks: [
        ...char.attacks,
        { id: createId(), name: '', bonus: 0, damage: '' },
      ],
    }));
  }, [updateActiveCharacter]);

  const updateAttack = useCallback(
    (id: string, patch: Partial<Omit<Attack, 'id'>>) => {
      updateActiveCharacter((char) => ({
        ...char,
        attacks: char.attacks.map((attack) =>
          attack.id === id ? { ...attack, ...patch } : attack,
        ),
      }));
    },
    [updateActiveCharacter],
  );

  const removeAttack = useCallback(
    (id: string) => {
      updateActiveCharacter((char) => ({
        ...char,
        attacks: char.attacks.filter((attack) => attack.id !== id),
      }));
    },
    [updateActiveCharacter],
  );

  const addTalent = useCallback(() => {
    updateActiveCharacter((char) => ({
      ...char,
      talents: [...char.talents, ''],
    }));
  }, [updateActiveCharacter]);

  const updateTalent = useCallback(
    (index: number, value: string) => {
      updateActiveCharacter((char) => ({
        ...char,
        talents: char.talents.map((talent, talentIndex) =>
          talentIndex === index ? value : talent,
        ),
      }));
    },
    [updateActiveCharacter],
  );

  const removeTalent = useCallback(
    (index: number) => {
      updateActiveCharacter((char) => ({
        ...char,
        talents: char.talents.filter((_, talentIndex) => talentIndex !== index),
      }));
    },
    [updateActiveCharacter],
  );

  return {
    roster,
    activeCharacter,
    isReady,
    createCharacter,
    deleteCharacter,
    selectCharacter,
    updateField,
    updateAbilityScore,
    updateHitPoints,
    updateCoins,
    updateEquipmentSlot,
    addAttack,
    updateAttack,
    removeAttack,
    addTalent,
    updateTalent,
    removeTalent,
  };
};

export type CharacterRoster = ReturnType<typeof useCharacterRoster>;
