// ui
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';

// components
import { EditableSection } from '@/components/character/EditableSection';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// constants
import { getInventorySlotCount } from '@/constants/character';

export const EquipmentPanel = () => {
  const { character, updateField, updateEquipmentSlot } =
    useCharacterSheetContext();

  const slotCount = getInventorySlotCount(character.abilities.for.score);
  const usedSlots = character.equipment
    .slice(0, slotCount)
    .filter((slot) => slot.trim() !== '').length;

  return (
    <EditableSection title="Equipamento">
      {(isEditing) => (
      <>
      <Flex align="center" justify="space-between">
        <StatLabel>Inventário</StatLabel>
        <Text fontSize="0.75rem" color="fg.muted">
          {usedSlots}/{slotCount} espaços
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="0.5rem">
        {Array.from({ length: slotCount }, (_, index) => (
          <Flex key={index} align="center" gap="0.5rem">
            <Text
              fontSize="0.75rem"
              color="fg.muted"
              minW="1.25rem"
              textAlign="right"
            >
              {index + 1}.
            </Text>
            <Box flex="1">
              <SheetField
                isEditing={isEditing}
                value={character.equipment[index] ?? ''}
                placeholder="Item"
                onChange={(value) => updateEquipmentSlot(index, value)}
                textProps={{ fontSize: '0.875rem' }}
              />
            </Box>
          </Flex>
        ))}
      </SimpleGrid>

      <Box>
        <StatLabel>Carga Livre</StatLabel>
        <SheetField
          isEditing={isEditing}
          value={character.freeCarry}
          placeholder="Itens de carga livre"
          onChange={(value) => updateField('freeCarry', value)}
          textProps={{ fontSize: '0.875rem' }}
        />
      </Box>
      </>
      )}
    </EditableSection>
  );
};
