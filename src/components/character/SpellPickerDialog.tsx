// libs
import { useEffect, useState } from 'react';

// ui
import {
  Button,
  Dialog,
  Portal,
  RadioCard,
  Stack,
  Text,
} from '@chakra-ui/react';

// constants
import { formatSpellClasses, type Spell } from '@/constants/spells';

type Props = {
  isOpen: boolean;
  spells: Spell[];
  onConfirm: (id: string) => void;
  onClose: () => void;
};

export const SpellPickerDialog = ({
  isOpen,
  spells,
  onConfirm,
  onClose,
}: Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  // Reinicia a seleção sempre que o diálogo é reaberto.
  useEffect(() => {
    if (isOpen) setSelected(null);
  }, [isOpen]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      placement="center"
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="surface.panel"
            borderColor="surface.border"
            borderWidth="2px"
            borderRadius="0.75rem"
            maxW="32rem"
          >
            <Dialog.Header>
              <Dialog.Title>Adicionar magia</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body maxH="60vh" overflowY="auto">
              {spells.length === 0 ? (
                <Text color="fg.muted" fontSize="0.875rem">
                  Nenhuma magia disponível para esta classe e nível.
                </Text>
              ) : (
                <RadioCard.Root
                  value={selected}
                  onValueChange={(details) => setSelected(details.value)}
                >
                  <Stack gap="0.5rem">
                    {spells.map((spell) => (
                      <RadioCard.Item key={spell.id} value={spell.id}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl
                          bg="surface.raised"
                          borderColor="surface.border"
                        >
                          <RadioCard.ItemContent>
                            <RadioCard.ItemText>{spell.name}</RadioCard.ItemText>
                            <Text fontSize="0.6875rem" color="fg.muted">
                              Grau {spell.tier} •{' '}
                              {formatSpellClasses(spell.classes)} •{' '}
                              {spell.duration} • {spell.range}
                            </Text>
                            <RadioCard.ItemDescription>
                              {spell.description}
                            </RadioCard.ItemDescription>
                          </RadioCard.ItemContent>
                          <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                      </RadioCard.Item>
                    ))}
                  </Stack>
                </RadioCard.Root>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorPalette="purple"
                disabled={!selected}
                onClick={() => selected && onConfirm(selected)}
              >
                Adicionar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
