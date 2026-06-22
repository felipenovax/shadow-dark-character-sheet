// ui
import { SimpleGrid } from '@chakra-ui/react';

// components
import { AbilityCard } from '@/components/character/AbilityCard';
import { EditableSection } from '@/components/character/EditableSection';

// constants
import { ABILITY_ORDER } from '@/constants/character';

export const AbilitiesGrid = () => {
  return (
    <EditableSection title="Atributos">
      <SimpleGrid columns={{ base: 2, md: 3, xl: 6 }} gap="0.75rem">
        {ABILITY_ORDER.map((abilityKey) => (
          <AbilityCard key={abilityKey} abilityKey={abilityKey} />
        ))}
      </SimpleGrid>
    </EditableSection>
  );
};
