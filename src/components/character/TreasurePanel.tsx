// ui
import { Box, SimpleGrid } from '@chakra-ui/react';

// components
import { EditableSection } from '@/components/character/EditableSection';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// types
import type { Coins } from '@/types/character';

const COIN_FIELDS: { key: keyof Coins; label: string }[] = [
  { key: 'gold', label: 'Peças de Ouro' },
  { key: 'silver', label: 'Peças de Prata' },
  { key: 'copper', label: 'Peças de Cobre' },
];

export const TreasurePanel = () => {
  const { character, updateCoins } = useCharacterSheetContext();

  return (
    <EditableSection title="Tesouro">
      {(isEditing) => (
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
      )}
    </EditableSection>
  );
};
