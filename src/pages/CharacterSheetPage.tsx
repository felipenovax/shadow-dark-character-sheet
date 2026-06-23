// ui
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';

// components
import { CharacterDashboard } from '@/components/character/CharacterDashboard';
import { ConsumablesFab } from '@/components/character/ConsumablesFab';

// contexts
import { CharacterSheetProvider } from '@/contexts/CharacterSheetContext';

// hooks
import type { CharacterRoster } from '@/hooks/useCharacterRoster';

type Props = {
  roster: CharacterRoster;
  onBack: () => void;
};

export const CharacterSheetPage = ({ roster, onBack }: Props) => {
  const { activeCharacter } = roster;

  if (!activeCharacter) return null;

  return (
    <Box
      minH="100vh"
      bg="surface.bg"
      color="fg"
      px={{ base: '1rem', md: '2rem' }}
      py="1.5rem"
    >
      <Flex align="center" gap="0.75rem" mb="1.5rem">
        <Button
          size="sm"
          variant="ghost"
          colorPalette="purple"
          onClick={onBack}
        >
          <LuArrowLeft />
          Personagens
        </Button>

        <Heading size="lg" color="brand.accent" letterSpacing="0.04em">
          ShadowDark
        </Heading>
      </Flex>

      <CharacterSheetProvider
        character={activeCharacter}
        updateField={roster.updateField}
        updateAbilityScore={roster.updateAbilityScore}
        updateHitPoints={roster.updateHitPoints}
        updateCoins={roster.updateCoins}
        addInventoryItem={roster.addInventoryItem}
        setInventoryQuantity={roster.setInventoryQuantity}
        removeInventoryItem={roster.removeInventoryItem}
        consumeInventoryItem={roster.consumeInventoryItem}
        setConsumableTimer={roster.setConsumableTimer}
        addAttack={roster.addAttack}
        updateAttack={roster.updateAttack}
        removeAttack={roster.removeAttack}
        addTalent={roster.addTalent}
        updateTalent={roster.updateTalent}
        removeTalent={roster.removeTalent}
        saveActiveCharacter={roster.saveActiveCharacter}
        requestSave={roster.requestSave}
      >
        <CharacterDashboard />
        <ConsumablesFab />
      </CharacterSheetProvider>
    </Box>
  );
};
