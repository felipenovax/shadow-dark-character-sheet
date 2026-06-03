// ui
import { Box } from '@chakra-ui/react';

// components
import { SectionCard } from '@/components/ui/SectionCard';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

export const IdentityCard = () => {
  const { character, isEditing, updateField } = useCharacterSheetContext();

  return (
    <SectionCard title="Identidade">
      <Box>
        <StatLabel>Antecedente</StatLabel>
        <SheetField
          isEditing={isEditing}
          value={character.background}
          placeholder="Antecedente"
          onChange={(value) => updateField('background', value)}
        />
      </Box>

      <Box>
        <StatLabel>Divindade</StatLabel>
        <SheetField
          isEditing={isEditing}
          value={character.deity}
          placeholder="Divindade"
          onChange={(value) => updateField('deity', value)}
        />
      </Box>
    </SectionCard>
  );
};
