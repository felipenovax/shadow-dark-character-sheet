// libs
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// types
import type {
  AbilityKey,
  Attack,
  Character,
  Coins,
  HitPoints,
  InventoryItem,
  Roster,
} from '@/types/character';

// constants
import { createDefaultCharacter } from '@/constants/character';
import { canUseArmor, canUseWeapon } from '@/constants/proficiency';
import { isEquippableArmor } from '@/constants/items';

// utils
import { createId } from '@/utils/createId';

// repositories
import {
  deleteCharacterRow,
  fetchCharacterById,
  fetchCharacters,
  insertCharacter,
  updateCharacter,
} from '@/repositories/characterRepository';

const EMPTY_ROSTER: Roster = { characters: [], activeId: null };

export const useCharacterRoster = (userId: string) => {
  const [roster, setRoster] = useState<Roster>(EMPTY_ROSTER);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Ids das fichas próprias (a lista pessoal não mistura fichas de jogadores
  // carregadas sob demanda pelo mestre).
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());

  // Espelho sempre atualizado do roster, para salvar a versão fresca sem
  // depender de closures defasadas. Declarado antes do efeito de save.
  const rosterRef = useRef<Roster>(roster);
  useEffect(() => {
    rosterRef.current = roster;
  }, [roster]);

  // ── Bootstrap: sessão anônima + carga inicial da nuvem ────────────────────
  const refreshList = useCallback(async () => {
    try {
      const characters = await fetchCharacters(userId);
      setRoster((current) => ({ ...current, characters }));
      setOwnedIds(new Set(characters.map((char) => char.id)));
      setError(null);
    } catch {
      setError('Não foi possível conectar ao servidor. Tente novamente.');
    }
  }, [userId]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const characters = await fetchCharacters(userId);
        if (!active) return;
        setRoster({ characters, activeId: null });
        setOwnedIds(new Set(characters.map((char) => char.id)));
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
  }, [userId]);

  // ── Persistência explícita ────────────────────────────────────────────────
  // Salva a ficha ativa atual (lida do ref, portanto sempre atualizada).
  const saveActiveCharacter = useCallback(async (): Promise<void> => {
    const current = rosterRef.current;
    const active = current.characters.find(
      (char) => char.id === current.activeId,
    );

    if (!active) return;

    try {
      await updateCharacter(active);
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

  // Lista pessoal: apenas as fichas do próprio usuário.
  const ownedCharacters = useMemo(
    () => roster.characters.filter((char) => ownedIds.has(char.id)),
    [roster.characters, ownedIds],
  );

  // Carrega sob demanda uma ficha acessível (ex.: o mestre abrindo a de um
  // jogador) e a deixa ativa. Retorna false se inacessível/inexistente.
  const loadCharacter = useCallback(async (id: string): Promise<boolean> => {
    const cached = rosterRef.current.characters.some((char) => char.id === id);

    if (!cached) {
      const character = await fetchCharacterById(id).catch(() => null);
      if (!character) return false;

      setRoster((current) => ({
        ...current,
        characters: [...current.characters, character],
      }));
    }

    setRoster((current) => ({ ...current, activeId: id }));
    return true;
  }, []);

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

  const createCharacter = useCallback((): string => {
    const newCharacter = createDefaultCharacter();

    setRoster((current) => ({
      characters: [...current.characters, newCharacter],
      activeId: newCharacter.id,
    }));
    setOwnedIds((current) => new Set(current).add(newCharacter.id));

    void insertCharacter(newCharacter).catch(() => {});

    return newCharacter.id;
  }, []);

  const saveNewCharacter = useCallback(async (newCharacter: Character): Promise<void> => {
    setRoster((current) => ({
      characters: [...current.characters, newCharacter],
      activeId: newCharacter.id,
    }));
    setOwnedIds((current) => new Set(current).add(newCharacter.id));
    await insertCharacter(newCharacter);
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    void deleteCharacterRow(id).catch(() => {});

    setOwnedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });

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

  const addInventoryItem = useCallback(
    (item: Omit<InventoryItem, 'quantity'>) => {
      updateActiveCharacter((char) => {
        // Armas/armaduras são entradas individuais (nome/stats próprios): não empilham.
        const isQuality = item.category === 'weapon' || item.category === 'armor';

        if (!isQuality) {
          // Empilha itens idênticos (mesmo id de catálogo, ou mesmo nome p/ custom).
          const existingIndex = char.inventory.findIndex((entry) =>
            item.itemId
              ? entry.itemId === item.itemId && entry.category === undefined
              : entry.itemId === null && entry.name === item.name,
          );

          if (existingIndex >= 0) {
            return {
              ...char,
              inventory: char.inventory.map((entry, index) =>
                index === existingIndex
                  ? { ...entry, quantity: entry.quantity + 1 }
                  : entry,
              ),
            };
          }
        }

        // Arma que a classe pode usar → cria um ataque vinculado (nome/bônus/dano).
        const isUsableWeapon =
          item.category === 'weapon' && canUseWeapon(char.class, item.itemId);

        if (isUsableWeapon) {
          const attackId = createId();
          const attackName = item.nickname
            ? `${item.name} (${item.nickname})`
            : item.name;

          return {
            ...char,
            inventory: [...char.inventory, { ...item, quantity: 1, attackId }],
            attacks: [
              ...char.attacks,
              {
                id: attackId,
                name: attackName,
                bonus: item.bonus ?? 0,
                damage: item.damage ?? '',
              },
            ],
          };
        }

        return {
          ...char,
          inventory: [...char.inventory, { ...item, quantity: 1 }],
        };
      });
    },
    [updateActiveCharacter],
  );

  const updateInventoryItem = useCallback(
    (index: number, patch: Partial<InventoryItem>) => {
      updateActiveCharacter((char) => ({
        ...char,
        inventory: char.inventory.map((entry, i) =>
          i === index ? { ...entry, ...patch } : entry,
        ),
      }));
    },
    [updateActiveCharacter],
  );

  const setInventoryQuantity = useCallback(
    (index: number, quantity: number) => {
      updateActiveCharacter((char) => ({
        ...char,
        inventory:
          quantity <= 0
            ? char.inventory.filter((_, i) => i !== index)
            : char.inventory.map((entry, i) =>
                i === index ? { ...entry, quantity } : entry,
              ),
      }));
    },
    [updateActiveCharacter],
  );

  const removeInventoryItem = useCallback(
    (index: number) => {
      updateActiveCharacter((char) => {
        const removed = char.inventory[index];
        return {
          ...char,
          inventory: char.inventory.filter((_, i) => i !== index),
          // Remove também o ataque vinculado, se houver.
          attacks: removed?.attackId
            ? char.attacks.filter((attack) => attack.id !== removed.attackId)
            : char.attacks,
        };
      });
    },
    [updateActiveCharacter],
  );

  // Equipa a armadura do índice (no máx. uma) e recalcula a CA.
  const equipArmor = useCallback(
    (index: number) => {
      updateActiveCharacter((char) => {
        const target = char.inventory[index];
        // Só equipa armadura equipável e permitida para a classe.
        if (
          !target ||
          !isEquippableArmor(target) ||
          !canUseArmor(char.class, target.itemId)
        ) {
          return char;
        }

        return {
          ...char,
          inventory: char.inventory.map((entry, i) =>
            isEquippableArmor(entry)
              ? { ...entry, equipped: i === index }
              : entry,
          ),
        };
      });
    },
    [updateActiveCharacter],
  );

  const unequipArmor = useCallback(
    (index: number) => {
      updateActiveCharacter((char) => {
        const target = char.inventory[index];
        if (!target) return char;

        return {
          ...char,
          inventory: char.inventory.map((entry, i) =>
            i === index ? { ...entry, equipped: false } : entry,
          ),
        };
      });
    },
    [updateActiveCharacter],
  );

  const toggleEquipArmor = useCallback(
    (index: number) => {
      const current = rosterRef.current;
      const active = current.characters.find(
        (char) => char.id === current.activeId,
      );
      const item = active?.inventory[index];
      if (item?.equipped) {
        unequipArmor(index);
      } else {
        equipArmor(index);
      }
    },
    [equipArmor, unequipArmor],
  );

  // Consome uma unidade de um item do inventário (por itemId de catálogo).
  const consumeInventoryItem = useCallback(
    (itemId: string) => {
      updateActiveCharacter((char) => ({
        ...char,
        inventory: char.inventory
          .map((entry) =>
            entry.itemId === itemId
              ? { ...entry, quantity: entry.quantity - 1 }
              : entry,
          )
          .filter((entry) => entry.quantity > 0),
      }));
    },
    [updateActiveCharacter],
  );

  // Acende (expiresAt) ou apaga (null) um consumível por id.
  const setConsumableTimer = useCallback(
    (id: string, expiresAt: number | null) => {
      updateActiveCharacter((char) => {
        const others = char.consumables.filter((entry) => entry.id !== id);
        return {
          ...char,
          consumables:
            expiresAt === null ? others : [...others, { id, expiresAt }],
        };
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

  const addSpell = useCallback(
    (spellId: string) => {
      updateActiveCharacter((char) =>
        char.spells.includes(spellId)
          ? char
          : { ...char, spells: [...char.spells, spellId] },
      );
    },
    [updateActiveCharacter],
  );

  const removeSpell = useCallback(
    (spellId: string) => {
      updateActiveCharacter((char) => ({
        ...char,
        spells: char.spells.filter((id) => id !== spellId),
      }));
    },
    [updateActiveCharacter],
  );

  return {
    roster,
    activeCharacter,
    ownedCharacters,
    isReady,
    error,
    createCharacter,
    saveNewCharacter,
    deleteCharacter,
    refreshList,
    selectCharacter,
    closeActiveCharacter,
    loadCharacter,
    saveActiveCharacter,
    requestSave,
    updateField,
    updateAbilityScore,
    updateHitPoints,
    updateCoins,
    addInventoryItem,
    updateInventoryItem,
    setInventoryQuantity,
    removeInventoryItem,
    equipArmor,
    unequipArmor,
    toggleEquipArmor,
    consumeInventoryItem,
    setConsumableTimer,
    addAttack,
    updateAttack,
    removeAttack,
    addTalent,
    updateTalent,
    removeTalent,
    addSpell,
    removeSpell,
  };
};

export type CharacterRoster = ReturnType<typeof useCharacterRoster>;
