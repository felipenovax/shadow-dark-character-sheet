// ui
import { Grid, Text, VStack } from '@chakra-ui/react';

// components
import { SheetField } from '@/components/ui/SheetField';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';
import { useSectionEditing } from '@/contexts/SectionEditContext';

// constants
import { ABILITY_LABELS } from '@/constants/character';

// types
import type { AbilityKey } from '@/types/character';

// utils
import { getAbilityModifier } from '@/utils/abilityModifier';
import { formatModifier, formatModifierColor } from '@/utils/formatModifier';

type Props = {
  abilityKey: AbilityKey;
};

export const AbilityCard = ({ abilityKey }: Props) => {
  const { character, updateAbilityScore } = useCharacterSheetContext();
  const isEditing = useSectionEditing();

  const { score } = character.abilities[abilityKey];
  const modifier = getAbilityModifier(score);

  return (
    <VStack
      gap="0.25rem"
      align="center"
      bg="surface.raised"
      borderColor="surface.border"
      borderWidth="1px"
      borderRadius="0.5rem"
      p="0.75rem"
    >
      <Text
        fontSize="0.625rem"
        fontWeight="bold"
        letterSpacing="0.08em"
        textTransform="uppercase"
        color="fg.muted"
      >
        {abilityKey}
      </Text>


      <Grid templateColumns="1fr auto 1fr" gap="0.5rem">  

        <SheetField
          type="number"
          isEditing={isEditing}
          value={score}
          min={1}
          max={20}
          onChange={(value) => updateAbilityScore(abilityKey, value)}
          textProps={{ textAlign: 'center', fontSize: '1.5rem' }}
        />

         <Text fontSize="1.5rem" fontWeight="bold" color="brand.accent1" textAlign="center">
          /
        </Text>

      
        <Text 
          fontSize="1.5rem"
          fontWeight="bold" 
          color={formatModifierColor(modifier)} 
          textAlign="center"
        >
          {formatModifier(modifier)}
        </Text>
        
      </Grid>


      <Text fontSize="0.625rem" color="fg.muted">
        {ABILITY_LABELS[abilityKey]}
      </Text>
    </VStack>
  );
};
