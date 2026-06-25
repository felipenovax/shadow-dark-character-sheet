// ui
import { Button, Dialog, Portal, Text } from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  armorName: string;
  onConfirm: () => void;
  onClose: () => void;
};

export const EquipArmorDialog = ({
  isOpen,
  armorName,
  onConfirm,
  onClose,
}: Props) => {
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
              <Dialog.Title>Equipar armadura</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text color="fg.muted" fontSize="0.875rem">
                Deseja equipar <strong>{armorName}</strong>? Isso vai recalcular
                a sua Classe de Armadura.
              </Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="ghost" onClick={onClose}>
                Agora não
              </Button>
              <Button colorPalette="purple" onClick={onConfirm}>
                Equipar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
