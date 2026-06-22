// libs
import { useCallback, useEffect, useState } from 'react';

// types
import type { Adventure } from '@/types/character';

// repositories
import {
  createAdventure,
  fetchMyAdventures,
  joinAdventure,
  leaveAdventure,
} from '@/repositories/adventureRepository';
import {
  fetchCharacterLinks,
  type CharacterLink,
} from '@/repositories/characterRepository';

export const useAdventures = (userId: string) => {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [links, setLinks] = useState<CharacterLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [adventureList, linkList] = await Promise.all([
        fetchMyAdventures(),
        fetchCharacterLinks(userId),
      ]);
      setAdventures(adventureList);
      setLinks(linkList);
    } catch {
      setError('Não foi possível carregar as aventuras.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (name: string) => {
      const adventure = await createAdventure(name);
      await reload();
      return adventure;
    },
    [reload],
  );

  const join = useCallback(
    async (code: string, characterId: string) => {
      await joinAdventure(code, characterId);
      await reload();
    },
    [reload],
  );

  const leave = useCallback(
    async (characterId: string) => {
      await leaveAdventure(characterId);
      await reload();
    },
    [reload],
  );

  return { adventures, links, isLoading, error, reload, create, join, leave };
};
