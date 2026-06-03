// ui
import { Box, Flex, Text } from '@chakra-ui/react';

// components
import { SectionCard } from '@/components/ui/SectionCard';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

export const VitalsCard = () => {
  const { character, isEditing, updateField, updateHitPoints } =
    useCharacterSheetContext();
  const { hitPoints } = character;

  return (
    <SectionCard title="Vitais">
      <Box>
        <StatLabel>Pontos de Vida</StatLabel>
        <Flex align="center" gap="0.5rem">
          <Box flex="1">
            <SheetField
              type="number"
              isEditing={isEditing}
              value={hitPoints.current}
              onChange={(value) => updateHitPoints('current', value)}
              textProps={{ fontSize: '1.25rem', fontWeight: 'bold' }}
            />
          </Box>
          <Text color="fg.muted">/</Text>
          <Box flex="1">
            <SheetField
              type="number"
              isEditing={isEditing}
              value={hitPoints.max}
              onChange={(value) => updateHitPoints('max', value)}
              textProps={{ fontSize: '1.25rem', fontWeight: 'bold' }}
            />
          </Box>
        </Flex>
      </Box>

      <Box>
        <StatLabel>Classe de Armadura</StatLabel>
        <SheetField
          type="number"
          isEditing={isEditing}
          value={character.armorClass}
          onChange={(value) => updateField('armorClass', value)}
          textProps={{ fontSize: '1.25rem', fontWeight: 'bold' }}
        />
      </Box>
    </SectionCard>
  );
};
