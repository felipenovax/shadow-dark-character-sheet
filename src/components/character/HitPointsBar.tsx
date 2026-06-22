// ui
import { HStack, IconButton, Progress, Stack, Text } from '@chakra-ui/react';
import { LuMinus, LuPlus } from 'react-icons/lu';

type Props = {
  current: number;
  max: number;
  onAdjust: (delta: number) => void;
};

// Cor da barra reflete a proporção de vida restante.
const getHealthPalette = (ratio: number): string => {
  if (ratio <= 0.25) return 'red';
  if (ratio <= 0.5) return 'orange';
  return 'green';
};

export const HitPointsBar = ({ current, max, onAdjust }: Props) => {
  const ratio = max > 0 ? current / max : 0;
  const palette = getHealthPalette(ratio);

  return (
    <Stack gap="0.5rem">
      <Progress.Root
        value={current}
        max={Math.max(max, 1)}
        colorPalette={palette}
        size="lg"
      >
        <Progress.Track borderRadius="full" bg="surface.raised">
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>

      <HStack gap="0.75rem" justify="center">
        <IconButton
          aria-label="Remover 1 ponto de vida"
          size="xs"
          variant="outline"
          colorPalette="red"
          onClick={() => onAdjust(-1)}
          disabled={current <= 0}
        >
          <LuMinus />
        </IconButton>

        <Text
          fontSize="1.125rem"
          fontWeight="bold"
          minW="4.5rem"
          textAlign="center"
        >
          {current} / {max}
        </Text>

        <IconButton
          aria-label="Adicionar 1 ponto de vida"
          size="xs"
          variant="outline"
          colorPalette="green"
          onClick={() => onAdjust(1)}
          disabled={current >= max}
        >
          <LuPlus />
        </IconButton>
      </HStack>
    </Stack>
  );
};
