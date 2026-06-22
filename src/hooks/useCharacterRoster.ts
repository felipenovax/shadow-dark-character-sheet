// libs
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

// repositories
import {
  deleteCharacterRow,
  fetchCharacters,
  upsertCharacter,
} from '@/repositories/characterRepository';

// lib
import { ensureSession } from '@/lib/ensureSession';

const EMPTY_ROSTER: Roster = { characters: [], activeId: null };

export const useCharacterRoster = () => {
  const [roster, setRoster] = useState<Roster>(EMPTY_ROSTER);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Espelho sempre atualizado do roster, para salvar a versão fresca sem
  // depender de closures defasadas. Declarado antes do efeito de save.
  const rosterRef = useRef<Roster>(roster);
  useEffect(() => {
    rosterRef.current = roster;
  }, [roster]);

  // ── Bootstrap: sessão anônima + carga inicial da nuvem ────────────────────
  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        await ensureSession();
        const characters = await fetchCharacters();

        if (!active) return;

        // Começa na lista (nenhuma ficha aberta).
        setRoster({ characters, activeId: null });
        setIsReady(true);
      } catch {
        if (!active) return;
        setError('Não foi possível conectar ao servidor. Tente novamente.');
        setIsReady(true);
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  // ── Persistência explícita ────────────────────────────────────────────────
  // Salva a ficha ativa atual (lida do ref, portanto sempre atualizada).
  const saveActiveCharacter = useCallback(async (): Promise<void> => {
    const current = rosterRef.current;
    const active = current.characters.find(
      (char) => char.id === current.activeId,
    );

    if (!active) return;

    try {
      await upsertCharacter(active);
    } catch {
      // Falha de sync não deve quebrar a UI; o usuário pode tentar de novo.
    }
  }, []);

  // Pedido de save assíncrono para ações que mutam e persistem no mesmo evento
  // (ex.: barra de PV). O efeito roda após o commit do estado, com o ref fresco.
  const [saveToken, setSaveToken] = useState(0);
  const requestSave = useCallback(() => setSaveToken((token) => token + 1), []);

  useEffect(() => {
    if (saveToken === 0) return;
    void saveActiveCharacter();
  }, [saveToken, saveActiveCharacter]);

  const activeCharacter = useMemo(
    () => roster.characters.find((char) => char.id === roster.activeId) ?? null,
    [roster],
  );

  // Aplica uma transformação imutável apenas na ficha ativa (em memória).
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

    void upsertCharacter(newCharacter).catch(() => {});
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    void deleteCharacterRow(id).catch(() => {});

    setRoster((current) => {
      const remaining = current.characters.filter((char) => char.id !== id);
      const stillActive = remaining.some(
        (char) => char.id === current.activeId,
      );

      return {
        characters: remaining,
        activeId: stillActive ? current.activeId : null,
      };
    });
  }, []);

  const selectCharacter = useCallback((id: string) => {
    setRoster((current) => ({ ...current, activeId: id }));
  }, []);

  const closeActiveCharacter = useCallback(() => {
    setRoster((current) => ({ ...current, activeId: null }));
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
      updateActiveCharacter((char) => {
        const equipment = [...char.equipment];
        while (equipment.length <= index) {
          equipment.push('');
        }
        equipment[index] = value;

        return { ...char, equipment };
      });
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
    error,
    createCharacter,
    deleteCharacter,
    selectCharacter,
    closeActiveCharacter,
    saveActiveCharacter,
    requestSave,
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
