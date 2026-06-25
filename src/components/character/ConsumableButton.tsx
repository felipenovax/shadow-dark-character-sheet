// ui
import { Box, Button, Image, Text, VStack } from '@chakra-ui/react';

// constants
import { type Consumable } from '@/constants/consumables';

const formatRemaining = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

type Props = {
  consumable: Consumable;
  isMineLit: boolean;
  showLit: boolean;
  isWarning: boolean;
  visualRemaining: number;
  available: number | null; // null = fonte não-inventário (magia)
  disabled: boolean;
  onClick: () => void;
};

export const ConsumableButton = ({
  consumable,
  isMineLit,
  showLit,
  isWarning,
  visualRemaining,
  available,
  disabled,
  onClick,
}: Props) => {
  return (
    <VStack gap="0.25rem">
      <Button
        type="button"
        variant="plain"
        title={
          isMineLit
            ? `Apagar ${consumable.name}`
            : disabled
              ? `Sem ${consumable.name.toLowerCase()}`
              : `Ativar ${consumable.name}`
        }
        disabled={disabled}
        onClick={onClick}
        boxSize="3.5rem"
        minW="3.5rem"
        p="0"
        borderRadius="full"
        borderWidth="2px"
        borderColor={
          isWarning ? 'red.400' : showLit ? 'orange.300' : 'surface.border'
        }
        bg="surface.panel"
        boxShadow={
          isWarning
            ? '0 0 12px var(--chakra-colors-red-400)'
            : showLit
              ? '0 0 14px var(--chakra-colors-orange-300)'
              : 'sm'
        }
        _disabled={{ opacity: showLit ? 1 : 0.4, cursor: 'not-allowed' }}
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

      {!showLit && available !== null && available > 0 && (
        <Text fontSize="0.625rem" color="fg.muted">
          ×{available}
        </Text>
      )}
    </VStack>
  );
};
