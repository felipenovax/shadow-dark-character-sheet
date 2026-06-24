// ui
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';

// components
import { ActionBar } from '@/components/ActionBar';
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
      pt="0.5rem"
      pb="6rem"
    >
      <Flex px="1rem" py="0.5rem" mb="1rem" align="center" justify="space-between">
        <Flex gap="0.5rem" align="center" fontSize="lg">
          <Text as="span" cursor="pointer" onClick={() => window.location.href = '/'} color="fg.muted" _hover={{ color: 'fg' }} transition="color 0.2s">
            ShadowDark
          </Text>
          <Text color="fg.subtle">/</Text>
          <Text as="span" cursor="pointer" onClick={() => window.location.href = '/'} color="fg.muted" _hover={{ color: 'fg' }} transition="color 0.2s">
            Personagens
          </Text>
          <Text color="fg.subtle">/</Text>
          <Text color="brand.accent" fontWeight="bold">
            {activeCharacter.name || 'Sem nome'}
          </Text>
        </Flex>
      </Flex>

      <CharacterSheetProvider
        character={activeCharacter}
        updateField={roster.updateField}
        updateAbilityScore={roster.updateAbilityScore}
        updateHitPoints={roster.updateHitPoints}
        updateCoins={roster.updateCoins}
        addInventoryItem={roster.addInventoryItem}
        updateInventoryItem={roster.updateInventoryItem}
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
        addSpell={roster.addSpell}
        removeSpell={roster.removeSpell}
        saveActiveCharacter={roster.saveActiveCharacter}
        requestSave={roster.requestSave}
      >
        <CharacterDashboard />
        <ConsumablesFab />
      </CharacterSheetProvider>

      <ActionBar>
        <Button
          variant="outline"
          colorPalette="purple"
          flex="1"
          onClick={onBack}
        >
          <LuArrowLeft />
          Voltar para Personagens
        </Button>
      </ActionBar>
    </Box>
  );
};
