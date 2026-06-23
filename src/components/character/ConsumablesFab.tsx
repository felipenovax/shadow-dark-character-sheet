// libs
import { useEffect, useState } from 'react';

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

  const hasLocalActive = character.consumables.length > 0;
  const hasSharedActive = shared.length > 0;

  // Tique de 1s enquanto houver algo aceso (local ou na mesa).
  useEffect(() => {
    if (!hasLocalActive && !hasSharedActive) return;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [hasLocalActive, hasSharedActive]);

  // Expiração: apaga o que zerou e dispara o alerta (cada cliente limpa as suas).
  useEffect(() => {
    if (inAdventure) {
      shared.forEach((entry) => {
        if (entry.characterId !== character.id) return;
        if (entry.expiresAt - now > 0) return;
        const consumable = CONSUMABLES.find((c) => c.id === entry.consumableId);
        void extinguishSharedConsumable({
          characterId: entry.characterId,
          consumableId: entry.consumableId,
        });
        setExpiredAlert(consumable?.name ?? 'Consumível');
      });
      return;
    }

    character.consumables.forEach((active) => {
      if (active.expiresAt - now > 0) return;
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
    character.id,
    setConsumableTimer,
    requestSave,
  ]);

  const inventoryQuantity = (inventoryItemId: string): number =>
    character.inventory
      .filter((entry) => entry.itemId === inventoryItemId)
      .reduce((total, entry) => total + entry.quantity, 0);

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
    consumeInventoryItem(consumable.inventoryItemId);
    requestSave();

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

  // Tochas acesas da mesa (todas), só no modo aventura.
  const tableLit = inAdventure
    ? shared.filter((entry) => entry.expiresAt - now > 0)
    : [];

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
              TOCHAS DA MESA
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

        <VStack gap="0.75rem" align="center" alignSelf="flex-end">
          {CONSUMABLES.map((consumable) => {
            // Minha tocha (controla ação, badge e a possibilidade de acender).
            const myExpires = myExpiresAt(consumable);
            const myRemaining = myExpires ? myExpires - now : 0;
            const isMineLit = myRemaining > 0;

            // Tochas acesas da mesa (qualquer um) → aura "acesa" para todos.
            const tableEntries = shared.filter(
              (entry) =>
                entry.consumableId === consumable.id &&
                entry.expiresAt - now > 0,
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
              showLit &&
              visualRemaining > 0 &&
              visualRemaining <= CONSUMABLE_WARNING_MS;

            const available = inventoryQuantity(consumable.inventoryItemId);
            const isDisabled = !isMineLit && available <= 0;

            return (
              <VStack key={consumable.id} gap="0.25rem">
                <Button
                  type="button"
                  variant="plain"
                  title={
                    isMineLit
                      ? `Apagar ${consumable.name}`
                      : isDisabled
                        ? `Sem ${consumable.name.toLowerCase()}s`
                        : `Acender ${consumable.name}`
                  }
                  disabled={isDisabled}
                  onClick={() =>
                    isMineLit ? extinguish(consumable) : light(consumable)
                  }
                  boxSize="3.5rem"
                  minW="3.5rem"
                  p="0"
                  borderRadius="full"
                  borderWidth="2px"
                  borderColor={
                    isWarning
                      ? 'red.400'
                      : showLit
                        ? 'orange.300'
                        : 'surface.border'
                  }
                  bg="surface.panel"
                  boxShadow={
                    isWarning
                      ? '0 0 12px var(--chakra-colors-red-400)'
                      : showLit
                        ? '0 0 14px var(--chakra-colors-orange-300)'
                        : 'sm'
                  }
                  _disabled={{
                    opacity: showLit ? 1 : 0.4,
                    cursor: 'not-allowed',
                  }}
                  transition="box-shadow 0.2s ease, border-color 0.2s ease"
                >
                  <Image
                    src={consumable.icon}
                    alt={consumable.name}
                    boxSize="2rem"
                    objectFit="contain"
                    filter={showLit ? 'none' : 'grayscale(0.6)'}
                  />
                </Button>

                {showLit && visualRemaining > 0 && (
                  <Box
                    bg={isWarning ? 'red.500' : 'gray.800'}
                    color="white"
                    borderRadius="full"
                    px="0.5rem"
                    py="0.0625rem"
                    fontSize="0.6875rem"
                    fontWeight="bold"
                    fontFamily="mono"
                  >
                    {formatRemaining(visualRemaining)}
                  </Box>
                )}

                {!showLit && available > 0 && (
                  <Text fontSize="0.625rem" color="fg.muted">
                    ×{available}
                  </Text>
                )}
              </VStack>
            );
          })}
        </VStack>
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
