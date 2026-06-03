// libs
import { useState } from 'react';

// ui
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { LuCheck, LuPencil } from 'react-icons/lu';

// components
import { CharacterDashboard } from '@/components/character/CharacterDashboard';
import { CharacterSelector } from '@/components/character/CharacterSelector';

// contexts
import { CharacterSheetProvider } from '@/contexts/CharacterSheetContext';

// hooks
import { useCharacterRoster } from '@/hooks/useCharacterRoster';

export const CharacterSheetPage = () => {
  const {
    roster,
    activeCharacter,
    isReady,
    createCharacter,
    deleteCharacter,
    selectCharacter,
    ...updaters
  } = useCharacterRoster();

  const [isEditing, setIsEditing] = useState(false);

  if (!isReady) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Spinner color="brand.accent" size="lg" />
      </Center>
    );
  }

  if (!activeCharacter) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Flex direction="column" align="center" gap="1rem">
          <Text color="fg.muted">Nenhum personagem encontrado.</Text>
          <Button colorPalette="purple" onClick={createCharacter}>
            Criar personagem
          </Button>
        </Flex>
      </Center>
    );
  }

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <Box minH="100vh" bg="surface.bg" color="fg" px={{ base: '1rem', md: '2rem' }} py="1.5rem">
      <Flex
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
        gap="1rem"
        mb="1.5rem"
      >
        <Heading size="lg" color="brand.accent" letterSpacing="0.04em">
          ShadowDark
        </Heading>

        <Flex align="center" gap="0.75rem" wrap="wrap">
          <CharacterSelector
            characters={roster.characters}
            activeId={roster.activeId}
            onSelect={selectCharacter}
            onCreate={createCharacter}
            onDelete={deleteCharacter}
          />

          <Button
            size="sm"
            colorPalette="purple"
            onClick={toggleEditing}
          >
            {isEditing ? <LuCheck /> : <LuPencil />}
            {isEditing ? 'Concluir' : 'Editar'}
          </Button>
        </Flex>
      </Flex>

      <CharacterSheetProvider
        character={activeCharacter}
        isEditing={isEditing}
        {...updaters}
      >
        <CharacterDashboard />
      </CharacterSheetProvider>
    </Box>
  );
};
