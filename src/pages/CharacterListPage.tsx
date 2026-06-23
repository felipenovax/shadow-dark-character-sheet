import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Image,
  Portal,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { LuLogOut, LuPlus, LuSwords, LuTrash2 } from 'react-icons/lu';
import { useState, useRef } from 'react';
import { ActionBar } from '@/components/ActionBar';

// types
import type { Character } from '@/types/character';

type Props = {
  characters: Character[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onOpenAdventures: () => void;
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
  const [isHovered, setIsHovered] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const didLongPressRef = useRef(false);

  const handleTouchStart = () => {
    didLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      setIsLongPressed(true);
      didLongPressRef.current = true;
    }, 2000);
  };

  const handleTouchEndOrMove = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = () => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    onSelect(character.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsLongPressed(false);
    handleTouchEndOrMove();
  };

  return (
    <Card.Root
      position="relative"
      flexDirection="row"
      bg="surface.panel"
      borderColor="surface.border"
      borderWidth="2px"
      borderRadius="0.5rem"
      minH="200px"
      overflow="hidden"
      cursor="pointer"
      transition="border-color 0.15s ease"
      _hover={{ borderColor: 'brand.accent' }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEndOrMove}
      onTouchMove={handleTouchEndOrMove}
    >
      {character.avatar ? (
        <Image
          objectFit="cover"
          w={{ base: '120px', sm: '150px' }}
          minW={{ base: '120px', sm: '150px' }}
          minH="200px"
          src={character.avatar}
          alt={character.name}
        />
      ) : (
        <Flex
          w={{ base: '120px', sm: '150px' }}
          minW={{ base: '120px', sm: '150px' }}
          minH="200px"
          align="center"
          justify="center"
          bg="surface.raised"
        >
          <Heading size="2xl" color="brand.accent">
            {initial}
          </Heading>
        </Flex>
      )}

      <Box flex="1" display="flex" flexDirection="column" minW="0">
        <Card.Body p="1.25rem" flex="1">
          <Flex justify="space-between" align="flex-start" mb="0.25rem" gap="0.5rem">
            <Card.Title as="h3" size="md" mb="0" truncate>
              {character.name || 'Sem nome'}
            </Card.Title>
            {(isHovered || isLongPressed) && (
              <IconButton
                position="absolute"
                top="0.25rem"
                right="0.25rem"
                aria-label="Excluir personagem"
                size="xs"
                variant="ghost"
                color="fg"
                _hover={{ color: 'red.500', bg: 'transparent' }}
                _active={{ color: 'red.600', bg: 'transparent' }}
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(character.id);
                }}
              >
                <LuTrash2 />
              </IconButton>
            )}
          </Flex>

          <Flex gap="0.5rem" wrap="wrap" mb={character.backstory ? '0.5rem' : '0'}>
            {character.alignment && (
              <Badge size="sm" colorPalette="gray" variant="surface">
                {character.alignment}
              </Badge>
            )}
            {character.ancestry && (
              <Badge size="sm" colorPalette="purple" variant="surface">
                {character.ancestry}
              </Badge>
            )}
            {character.background && (
              <Badge size="sm" colorPalette="blue" variant="surface">
                {character.background}
              </Badge>
            )}
          </Flex>

          {character.backstory && (
            <Text lineClamp={4} fontSize="0.875rem" color="fg.muted">
              {character.backstory}
            </Text>
          )}
        </Card.Body>

        <Card.Footer p="1.25rem" pt="0">
          <Text fontSize="0.75rem" color="fg.muted" fontWeight="medium" truncate>
            {character.class} • Nível {character.level}
          </Text>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
};

export const CharacterListPage = ({
  characters,
  onSelect,
  onCreate,
  onDelete,
  onOpenAdventures,
  onSignOut,
}: Props) => {
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg="surface.bg"
      color="fg"
      px={{ base: '1rem', md: '2rem' }}
      pt="0.5rem"
      pb="1.5rem"
    >
      <Flex px="1rem" py="0.5rem" mb="1rem" align="center" justify="space-between">
        <Flex gap="0.5rem" align="center" fontSize="lg">
          <Text as="a" href="/" color="fg.muted" _hover={{ color: 'fg' }} transition="color 0.2s">
            ShadowDark
          </Text>
          <Text color="fg.subtle">/</Text>
          <Text color="brand.accent" fontWeight="bold">
            Personagens
          </Text>
        </Flex>

        <Button
          variant="ghost"
          colorPalette="gray"
          size="sm"
          onClick={onSignOut}
        >
          <LuLogOut />
          Sair
        </Button>
      </Flex>

      {characters.length === 0 ? (
        <Flex direction="column" align="center" justify="center" flexGrow={1} pb="6rem" gap="1rem">
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
              onDelete={(id) => setCharacterToDelete(characters.find(c => c.id === id) || null)}
            />
          ))}
        </SimpleGrid>
      )}

      <ActionBar>
        <Button
          colorPalette="purple"
          flex="1"
          minW="120px"
          onClick={onCreate}
        >
          <LuPlus />
          Novo Personagem
        </Button>
        <Button
          variant="outline"
          colorPalette="purple"
          flex="1"
          minW="120px"
          onClick={onOpenAdventures}
        >
          <LuSwords />
          Aventuras
        </Button>
      </ActionBar>

      <Dialog.Root open={!!characterToDelete} onOpenChange={(e) => { if (!e.open) setCharacterToDelete(null); }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="surface.panel" color="fg" borderColor="surface.border" borderWidth="1px" borderRadius="1rem">
              <Dialog.Header>
                <Dialog.Title color="brand.accent">Excluir Personagem</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Tem certeza que deseja banir <strong>{characterToDelete?.name}</strong> para as sombras permanentemente? Esta ação não pode ser desfeita.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" colorPalette="gray" onClick={() => setCharacterToDelete(null)}>
                  Cancelar
                </Button>
                <Button
                  colorPalette="red"
                  onClick={() => {
                    if (characterToDelete) {
                      onDelete(characterToDelete.id);
                      setCharacterToDelete(null);
                    }
                  }}
                >
                  Excluir
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
