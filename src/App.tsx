// ui
import { Button, Center, Flex, Spinner, Text } from '@chakra-ui/react';

// pages
import { CharacterListPage } from '@/pages/CharacterListPage';
import { CharacterSheetPage } from '@/pages/CharacterSheetPage';

// hooks
import { useCharacterRoster } from '@/hooks/useCharacterRoster';

export const App = () => {
  const roster = useCharacterRoster();

  if (!roster.isReady) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Spinner color="brand.accent" size="lg" />
      </Center>
    );
  }

  if (roster.error) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Flex direction="column" align="center" gap="1rem">
          <Text color="fg.muted">{roster.error}</Text>
          <Button colorPalette="purple" onClick={() => location.reload()}>
            Tentar novamente
          </Button>
        </Flex>
      </Center>
    );
  }

  if (roster.activeCharacter) {
    return <CharacterSheetPage roster={roster} />;
  }

  return (
    <CharacterListPage
      characters={roster.roster.characters}
      onSelect={roster.selectCharacter}
      onCreate={roster.createCharacter}
      onDelete={roster.deleteCharacter}
    />
  );
};
