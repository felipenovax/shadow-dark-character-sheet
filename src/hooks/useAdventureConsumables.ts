// libs
import { useEffect, useState } from 'react';

// lib
import { supabase } from '@/lib/supabase';

// repositories
import {
  fetchActiveConsumables,
  toShared,
  type SharedConsumable,
} from '@/repositories/adventureConsumableRepository';

// Lista, em tempo real, os consumíveis acesos de uma aventura (tochas da mesa).
export const useAdventureConsumables = (
  adventureId: string | null,
): SharedConsumable[] => {
  const [active, setActive] = useState<SharedConsumable[]>([]);

  useEffect(() => {
    if (!adventureId) {
      setActive([]);
      return;
    }

    let mounted = true;

    fetchActiveConsumables(adventureId)
      .then((list) => mounted && setActive(list))
      .catch(() => mounted && setActive([]));

    const channel = supabase
      .channel(`adv-consumables:${adventureId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'adventure_consumables',
          filter: `adventure_id=eq.${adventureId}`,
        },
        (payload) => {
          setActive((current) => {
            if (payload.eventType === 'DELETE') {
              const removedId = (payload.old as { id?: string }).id;
              return current.filter((item) => item.id !== removedId);
            }

            const shared = toShared(payload.new as Parameters<typeof toShared>[0]);
            const without = current.filter((item) => item.id !== shared.id);
            return [...without, shared];
          });
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, [adventureId]);

  return active;
};
