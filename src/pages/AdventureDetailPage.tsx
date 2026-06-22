// libs
import { useEffect, useState } from 'react';

// ui
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';

// repositories
import { fetchAdventureCharacters } from '@/repositories/adventureRepository';

// types
import type { Character } from '@/types/character';

type Props = {
  adventureId: string;
  onOpenCharacter: (id: string) => void;
  onBack: () => void;
};

export const AdventureDetailPage = ({
  adventureId,
  onOpenCharacter,
  onBack,
}: Props) => {
  const [characters, setCharacters] = useState<Character[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchAdventureCharacters(adventureId)
      .then((list) => active && setCharacters(list))
      .catch(() => active && setCharacters([]));
    return () => {
      active = false;
    };
  }, [adventureId]);

  return (
    <Box
      minH="100vh"
      bg="surface.bg"
      color="fg"
      px={{ base: '1rem', md: '2rem' }}
      py="1.5rem"
    >
      <Flex align="center" gap="0.75rem" mb="1.5rem">
        <Button size="sm" variant="ghost" colorPalette="purple" onClick={onBack}>
          <LuArrowLeft />
          Aventuras
        </Button>
        <Heading size="lg" color="brand.accent" letterSpacing="0.04em">
          Mesa
        </Heading>
      </Flex>

      {characters === null ? (
        <Center py="4rem">
          <Spinner color="brand.accent" size="lg" />
        </Center>
      ) : characters.length === 0 ? (
        <Text color="fg.muted">
          Nenhum jogador vinculou um personagem a esta mesa ainda.
        </Text>
      ) : (
        <Flex direction="column" gap="0.75rem" maxW="40rem">
          {characters.map((char) => (
            <Card.Root
              key={char.id}
              bg="surface.panel"
              borderColor="surface.border"
              borderWidth="2px"
              borderRadius="0.75rem"
              cursor="pointer"
              transition="border-color 0.15s ease"
              _hover={{ borderColor: 'brand.accent' }}
              onClick={() => onOpenCharacter(char.id)}
            >
              <Card.Body p="1rem">
                <Flex align="center" justify="space-between" gap="0.5rem">
                  <Box>
                    <Text fontWeight="bold">{char.name || 'Sem nome'}</Text>
                    <Text fontSize="0.75rem" color="fg.muted">
                      {char.class} • Nível {char.level} • PV{' '}
                      {char.hitPoints.current}/{char.hitPoints.max}
                    </Text>
                  </Box>
                  <Button size="xs" variant="outline" colorPalette="purple">
                    Abrir ficha
                  </Button>
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
        </Flex>
      )}
    </Box>
  );
};
