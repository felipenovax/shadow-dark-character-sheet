// ui
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';

// components
import { SectionCard } from '@/components/ui/SectionCard';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// types
import type { Coins } from '@/types/character';

const COIN_FIELDS: { key: keyof Coins; label: string }[] = [
  { key: 'gold', label: 'PO' },
  { key: 'silver', label: 'PP' },
  { key: 'copper', label: 'PC' },
];

export const EquipmentPanel = () => {
  const {
    character,
    isEditing,
    updateField,
    updateCoins,
    updateEquipmentSlot,
  } = useCharacterSheetContext();

  return (
    <SectionCard title="Equipamento">
      <SimpleGrid columns={3} gap="0.75rem">
        {COIN_FIELDS.map(({ key, label }) => (
          <Box key={key}>
            <StatLabel>{label}</StatLabel>
            <SheetField
              type="number"
              isEditing={isEditing}
              value={character.coins[key]}
              min={0}
              onChange={(value) => updateCoins(key, value)}
              textProps={{ fontWeight: 'bold' }}
            />
          </Box>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, sm: 2 }} gap="0.5rem">
        {character.equipment.map((slot, index) => (
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
                value={slot}
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
    </SectionCard>
  );
};
