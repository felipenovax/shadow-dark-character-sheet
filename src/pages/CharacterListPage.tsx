// ui
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { LuLogOut, LuPlus, LuTrash2 } from 'react-icons/lu';

// types
import type { Character } from '@/types/character';

type Props = {
  characters: Character[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onSignOut: () => void;
};

const CharacterCard = ({
  character,
  onSelect,
  onDelete,
}: {
  character: Character;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const initial = (character.name.trim().charAt(0) || '?').toUpperCase();

  return (
    <Card.Root
      bg="surface.panel"
      borderColor="surface.border"
      borderWidth="2px"
      borderRadius="0.75rem"
      overflow="hidden"
      cursor="pointer"
      transition="border-color 0.15s ease"
      _hover={{ borderColor: 'brand.accent' }}
      onClick={() => onSelect(character.id)}
    >
      <Card.Body p="1rem">
        <Flex gap="0.75rem" align="center">
          {character.avatar ? (
            <Image
              src={character.avatar}
              alt={character.name}
              boxSize="3.5rem"
              borderRadius="0.5rem"
              objectFit="cover"
            />
          ) : (
            <Flex
              boxSize="3.5rem"
              align="center"
              justify="center"
              bg="surface.raised"
              borderRadius="0.5rem"
            >
              <Heading size="md" color="brand.accent">
                {initial}
              </Heading>
            </Flex>
          )}

          <Box flex="1" minW="0">
            <Text fontWeight="bold" fontSize="1rem" truncate>
              {character.name || 'Sem nome'}
            </Text>
            <Text fontSize="0.75rem" color="fg.muted" truncate>
              {character.class} • Nível {character.level}
            </Text>
            {character.title && (
              <Text fontSize="0.75rem" color="brand.accent" truncate>
                {character.title}
              </Text>
            )}
          </Box>

          <IconButton
            aria-label="Excluir personagem"
            size="xs"
            variant="ghost"
            colorPalette="gray"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(character.id);
            }}
          >
            <LuTrash2 />
          </IconButton>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export const CharacterListPage = ({
  characters,
  onSelect,
  onCreate,
  onDelete,
  onSignOut,
}: Props) => {
  return (
    <Box
      minH="100vh"
      bg="surface.bg"
      color="fg"
      px={{ base: '1rem', md: '2rem' }}
      py="1.5rem"
    >
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

        <Flex gap="0.5rem" wrap="wrap">
          <Button size="sm" colorPalette="purple" onClick={onCreate}>
            <LuPlus />
            Novo personagem
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorPalette="gray"
            onClick={onSignOut}
          >
            <LuLogOut />
            Sair
          </Button>
        </Flex>
      </Flex>

      {characters.length === 0 ? (
        <Flex direction="column" align="center" gap="1rem" py="4rem">
          <Text color="fg.muted">Você ainda não tem personagens.</Text>
          <Button colorPalette="purple" onClick={onCreate}>
            <LuPlus />
            Criar primeiro personagem
          </Button>
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="1rem">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
