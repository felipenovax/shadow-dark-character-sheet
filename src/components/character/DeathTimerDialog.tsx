// libs
import { useEffect, useState } from 'react';

// ui
import { Button, Dialog, NumberInput, Portal, Stack, Text } from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rounds: number) => void;
};

const DEFAULT_ROUNDS = 3;

export const DeathTimerDialog = ({ isOpen, onClose, onConfirm }: Props) => {
  const [rounds, setRounds] = useState(DEFAULT_ROUNDS);

  // Reinicia o valor sempre que o diálogo é reaberto.
  useEffect(() => {
    if (isOpen) setRounds(DEFAULT_ROUNDS);
  }, [isOpen]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      placement="center"
      role="alertdialog"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="surface.panel"
            borderColor="surface.border"
            borderWidth="2px"
            borderRadius="0.75rem"
          >
            <Dialog.Header>
              <Dialog.Title>Personagem caiu a 0 PV</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap="0.75rem">
                <Text color="fg.muted" fontSize="0.875rem">
                  Quantas rodadas você tem até alguém conseguir te levantar?
                </Text>
                <NumberInput.Root
                  value={String(rounds)}
                  min={0}
                  onValueChange={(details) =>
                    setRounds(
                      Number.isNaN(details.valueAsNumber)
                        ? 0
                        : details.valueAsNumber,
                    )
                  }
                  bg="surface.raised"
                  borderColor="surface.border"
                >
                  <NumberInput.Input />
                </NumberInput.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button colorPalette="purple" onClick={() => onConfirm(rounds)}>
                Confirmar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
