// ui
import { Box, Button, Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import {
  LuHeartPulse,
  LuMinus,
  LuRotateCcw,
  LuSkull,
} from 'react-icons/lu';

// types
import type { VitalCondition } from '@/types/character';

type Props = {
  condition: VitalCondition;
  deathTimer: number | null;
  isTimeUp: boolean;
  onDecrement: () => void;
  onSetTimer: () => void;
  onStabilize: () => void;
  onDeclareDeath: () => void;
  onRevertDeath: () => void;
};

type BannerTheme = {
  bg: string;
  border: string;
  fg: string;
};

const THEMES: Record<'danger' | 'stable' | 'dead', BannerTheme> = {
  danger: { bg: 'red.50', border: 'red.300', fg: 'red.700' },
  stable: { bg: 'green.50', border: 'green.300', fg: 'green.700' },
  dead: { bg: 'gray.200', border: 'gray.400', fg: 'gray.700' },
};

const buildDyingText = (deathTimer: number | null): string => {
  if (deathTimer === null) return 'Caído a 0 PV.';
  if (deathTimer === 0) return 'Tempo esgotado!';

  return `${deathTimer} ${deathTimer === 1 ? 'rodada' : 'rodadas'} até a morte`;
};

export const ConditionBanner = ({
  condition,
  deathTimer,
  isTimeUp,
  onDecrement,
  onSetTimer,
  onStabilize,
  onDeclareDeath,
  onRevertDeath,
}: Props) => {
  if (condition === 'normal') return null;

  const theme =
    condition === 'stabilized'
      ? THEMES.stable
      : condition === 'dead'
        ? THEMES.dead
        : THEMES.danger;

  const isCountingDown =
    condition === 'dying' && deathTimer !== null && deathTimer > 0;
  const needsTimer = condition === 'dying' && deathTimer === null;

  return (
    <Box
      bg={theme.bg}
      borderColor={theme.border}
      borderWidth="1px"
      borderRadius="0.5rem"
      p="0.75rem"
    >
      <Flex align="center" justify="space-between" gap="0.5rem" wrap="wrap">
        <HStack gap="0.5rem" color={theme.fg}>
          {condition === 'stabilized' && <LuHeartPulse />}
          {condition !== 'stabilized' && <LuSkull />}
          <Text fontWeight="bold" fontSize="0.875rem">
            {condition === 'dead' && 'Morto'}
            {condition === 'stabilized' && 'Estabilizado — 0 PV, fora de perigo'}
            {condition === 'dying' && buildDyingText(deathTimer)}
          </Text>
        </HStack>

        <HStack gap="0.5rem">
          {isCountingDown && (
            <IconButton
              aria-label="Passar uma rodada"
              size="xs"
              variant="solid"
              colorPalette="red"
              onClick={onDecrement}
            >
              <LuMinus />
            </IconButton>
          )}

          {needsTimer && (
            <Button
              size="xs"
              variant="outline"
              colorPalette="red"
              onClick={onSetTimer}
            >
              Definir rodadas
            </Button>
          )}

          {isTimeUp && (
            <Button
              size="xs"
              variant="solid"
              colorPalette="red"
              onClick={onDeclareDeath}
            >
              <LuSkull />
              Declarar morto
            </Button>
          )}

          {condition === 'dying' && (
            <Button size="xs" colorPalette="green" onClick={onStabilize}>
              Levantar
            </Button>
          )}

          {condition === 'dead' && (
            <Button
              size="xs"
              variant="outline"
              colorPalette="gray"
              onClick={onRevertDeath}
            >
              <LuRotateCcw />
              Reverter
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
