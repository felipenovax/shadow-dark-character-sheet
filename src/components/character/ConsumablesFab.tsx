// libs
import { useEffect, useRef, useState } from 'react';

// lib
import { supabase } from '@/lib/supabase';

// ui
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';

// components
import { ConsumableButton } from '@/components/character/ConsumableButton';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// hooks
import { useAdventureConsumables } from '@/hooks/useAdventureConsumables';

// repositories
import { fetchCharacterAdventureId } from '@/repositories/characterRepository';
import {
  extinguishSharedConsumable,
  lightSharedConsumable,
} from '@/repositories/adventureConsumableRepository';

// constants
import {
  CONSUMABLES,
  CONSUMABLE_WARNING_MS,
  type Consumable,
} from '@/constants/consumables';

const formatRemaining = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const ConsumablesFab = () => {
  const { character, consumeInventoryItem, setConsumableTimer, requestSave } =
    useCharacterSheetContext();

  const [now, setNow] = useState(() => Date.now());
  const [expiredAlert, setExpiredAlert] = useState<string | null>(null);
  const [adventureId, setAdventureId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Expirações já tratadas (chave id:expiresAt) — evita re-disparar a cada tique.
  const handledRef = useRef<Set<string>>(new Set());

  // Usuário atual (para que só o dono apague a própria tocha na expiração).
  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getUser()
      .then(({ data }) => mounted && setCurrentUserId(data.user?.id ?? null));
    return () => {
      mounted = false;
    };
  }, []);

  // Resolve a aventura da ficha aberta (modo compartilhado x solo).
  useEffect(() => {
    let mounted = true;
    fetchCharacterAdventureId(character.id)
      .then((id) => mounted && setAdventureId(id))
      .catch(() => mounted && setAdventureId(null));
    return () => {
      mounted = false;
    };
  }, [character.id]);

  const inAdventure = adventureId !== null;
  const shared = useAdventureConsumables(adventureId);

  const hasLocalActive = character.consumables.some(
    (entry) => entry.expiresAt - now > 0,
  );
  const hasSharedActive = shared.some((entry) => entry.expiresAt - now > 0);

  // Tique de 1s enquanto houver algo aceso (local ou na mesa).
  useEffect(() => {
    if (!hasLocalActive && !hasSharedActive) return;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [hasLocalActive, hasSharedActive]);

  // Expiração: trata cada item uma única vez (trava por id:expiresAt).
  useEffect(() => {
    const handled = handledRef.current;

    if (inAdventure) {
      shared.forEach((entry) => {
        if (entry.expiresAt - now > 0) return;
        const key = `${entry.id}:${entry.expiresAt}`;
        if (handled.has(key)) return;
        handled.add(key);

        const consumable = CONSUMABLES.find((c) => c.id === entry.consumableId);
        setExpiredAlert(consumable?.name ?? 'Consumível');

        // Só o dono apaga; os demais recebem a remoção via Realtime.
        if (entry.litBy === currentUserId) {
          void extinguishSharedConsumable({
            characterId: entry.characterId,
            consumableId: entry.consumableId,
          });
        }
      });
      return;
    }

    character.consumables.forEach((active) => {
      if (active.expiresAt - now > 0) return;
      const key = `${active.id}:${active.expiresAt}`;
      if (handled.has(key)) return;
      handled.add(key);

      const consumable = CONSUMABLES.find((c) => c.id === active.id);
      setConsumableTimer(active.id, null);
      requestSave();
      setExpiredAlert(consumable?.name ?? 'Consumível');
    });
  }, [
    now,
    inAdventure,
    shared,
    character.consumables,
    currentUserId,
    setConsumableTimer,
    requestSave,
  ]);

  // O alerta de "apagou" some sozinho após alguns segundos.
  useEffect(() => {
    if (!expiredAlert) return;
    const timeout = setTimeout(() => setExpiredAlert(null), 6000);
    return () => clearTimeout(timeout);
  }, [expiredAlert]);

  const inventoryQuantity = (itemId: string): number =>
    character.inventory
      .filter((entry) => entry.itemId === itemId)
      .reduce((total, entry) => total + entry.quantity, 0);

  // Quantidade disponível: estoque do inventário, ou null se a fonte é magia.
  const availableOf = (consumable: Consumable): number | null =>
    consumable.source.type === 'inventory'
      ? inventoryQuantity(consumable.source.itemId)
      : null;

  // O jogador possui a fonte do consumível (tem o item, ou conhece a magia).
  const hasSource = (consumable: Consumable): boolean =>
    consumable.source.type === 'inventory'
      ? inventoryQuantity(consumable.source.itemId) > 0
      : character.spells.includes(consumable.source.spellId);

  const myExpiresAt = (consumable: Consumable): number | null => {
    if (inAdventure) {
      const entry = shared.find(
        (s) => s.characterId === character.id && s.consumableId === consumable.id,
      );
      return entry?.expiresAt ?? null;
    }
    const entry = character.consumables.find((c) => c.id === consumable.id);
    return entry?.expiresAt ?? null;
  };

  const light = (consumable: Consumable) => {
    const expiresAt = Date.now() + consumable.durationMs;

    // Apenas consumíveis de inventário gastam (a magia de Luz não consome nada).
    if (consumable.source.type === 'inventory') {
      consumeInventoryItem(consumable.source.itemId);
      requestSave();
    }

    if (inAdventure && adventureId) {
      void lightSharedConsumable({
        adventureId,
        characterId: character.id,
        characterName: character.name,
        consumableId: consumable.id,
        expiresAt,
      });
    } else {
      setConsumableTimer(consumable.id, expiresAt);
      requestSave();
    }

    setNow(Date.now());
  };

  const extinguish = (consumable: Consumable) => {
    if (inAdventure) {
      void extinguishSharedConsumable({
        characterId: character.id,
        consumableId: consumable.id,
      });
    } else {
      setConsumableTimer(consumable.id, null);
      requestSave();
    }
  };

  // Consumíveis ativos da mesa (todos), só no modo aventura.
  const tableLit = inAdventure
    ? shared.filter((entry) => entry.expiresAt - now > 0)
    : [];

  // Estado visual de um consumível (meu/mesa, contagem, aviso).
  const buildState = (consumable: Consumable) => {
    const myExpires = myExpiresAt(consumable);
    const myRemaining = myExpires ? myExpires - now : 0;
    const isMineLit = myRemaining > 0;

    const tableEntries = shared.filter(
      (entry) =>
        entry.consumableId === consumable.id && entry.expiresAt - now > 0,
    );
    const soonest = tableEntries.length
      ? Math.min(...tableEntries.map((entry) => entry.expiresAt))
      : null;

    const showLit = isMineLit || tableEntries.length > 0;
    const visualRemaining = isMineLit
      ? myRemaining
      : soonest
        ? soonest - now
        : 0;
    const isWarning =
      showLit && visualRemaining > 0 && visualRemaining <= CONSUMABLE_WARNING_MS;

    return {
      isMineLit,
      showLit,
      visualRemaining,
      isWarning,
      available: availableOf(consumable),
      disabled: !isMineLit && !hasSource(consumable),
    };
  };

  // Mostra os consumíveis que o jogador tem (fonte) ou que estão ativos.
  const visibleConsumables = CONSUMABLES.filter(
    (consumable) =>
      hasSource(consumable) ||
      buildState(consumable).showLit ||
      myExpiresAt(consumable) !== null,
  );

  const activeCount = CONSUMABLES.filter((consumable) => {
    const expires = myExpiresAt(consumable);
    return expires !== null && expires - now > 0;
  }).length;

  return (
    <>
      <VStack
        position="fixed"
        bottom="1.5rem"
        right="1.5rem"
        gap="0.75rem"
        align="stretch"
        zIndex={20}
      >
        {tableLit.length > 0 && (
          <VStack
            align="stretch"
            gap="0.25rem"
            bg="surface.panel"
            borderWidth="1px"
            borderColor="surface.border"
            borderRadius="0.5rem"
            p="0.5rem"
            maxW="14rem"
          >
            <Text fontSize="0.625rem" color="fg.muted" fontWeight="bold">
              NA MESA
            </Text>
            {tableLit.map((entry) => {
              const remaining = entry.expiresAt - now;
              const warning = remaining <= CONSUMABLE_WARNING_MS;
              return (
                <Flex key={entry.id} justify="space-between" gap="0.5rem">
                  <Text fontSize="0.75rem" truncate>
                    {entry.characterName}
                  </Text>
                  <Text
                    fontSize="0.75rem"
                    fontFamily="mono"
                    fontWeight="bold"
                    color={warning ? 'red.500' : 'fg'}
                  >
                    {formatRemaining(remaining)}
                  </Text>
                </Flex>
              );
            })}
          </VStack>
        )}

        {expanded && visibleConsumables.length > 0 && (
          <VStack gap="0.75rem" align="center" alignSelf="flex-end">
            {visibleConsumables.map((consumable) => {
              const state = buildState(consumable);
              return (
                <ConsumableButton
                  key={consumable.id}
                  consumable={consumable}
                  isMineLit={state.isMineLit}
                  showLit={state.showLit}
                  isWarning={state.isWarning}
                  visualRemaining={state.visualRemaining}
                  available={state.available}
                  disabled={state.disabled}
                  onClick={() =>
                    state.isMineLit
                      ? extinguish(consumable)
                      : light(consumable)
                  }
                />
              );
            })}
          </VStack>
        )}

        {/* FAB: ampulheta que expande os consumíveis disponíveis. */}
        <Box position="relative" alignSelf="flex-end">
          <Button
            type="button"
            variant="plain"
            aria-label="Consumíveis"
            onClick={() => setExpanded((value) => !value)}
            boxSize="4.5rem"
            minW="3.5rem"
            p="0"
            borderRadius="full"
            borderWidth="2px"
            borderColor={
              activeCount > 0 ? 'orange.300' : expanded ? 'brand.accent' : 'surface.border'
            }
            bg="surface.panel"
            boxShadow={
              activeCount > 0 ? '0 0 14px var(--chakra-colors-orange-300)' : 'md'
            }
            transition="box-shadow 0.2s ease, border-color 0.2s ease"
          >
            <Image
              src="/assets/misc/hourglass.png"
              alt="Consumíveis"
              boxSize="4rem"
              objectFit="contain"
            />
          </Button>

          {activeCount > 0 && (
            <Box
              position="absolute"
              top="-0.25rem"
              right="-0.25rem"
              bg="orange.400"
              color="white"
              borderRadius="full"
              minW="1.25rem"
              h="1.25rem"
              px="0.25rem"
              fontSize="0.6875rem"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {activeCount}
            </Box>
          )}
        </Box>
      </VStack>

      {expiredAlert && (
        <Flex
          position="fixed"
          bottom="1.5rem"
          left="50%"
          transform="translateX(-50%)"
          align="center"
          gap="0.75rem"
          bg="red.600"
          color="white"
          borderRadius="0.5rem"
          px="1rem"
          py="0.75rem"
          boxShadow="lg"
          zIndex={30}
        >
          <Text fontWeight="bold" fontSize="0.875rem">
            A {expiredAlert.toLowerCase()} apagou!
          </Text>
          <CloseButton
            size="sm"
            color="white"
            onClick={() => setExpiredAlert(null)}
          />
        </Flex>
      )}
    </>
  );
};
