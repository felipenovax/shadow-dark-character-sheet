// libs
import { useMemo, useState } from 'react';

// ui
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  NativeSelect,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuArrowLeft, LuCopy, LuPlus } from 'react-icons/lu';

// components
import { SectionCard } from '@/components/ui/SectionCard';
import { StatLabel } from '@/components/ui/StatLabel';

// hooks
import { useAdventures } from '@/hooks/useAdventures';

// types
import type { Character } from '@/types/character';

type Props = {
  userId: string;
  ownedCharacters: Character[];
  onOpenAdventure: (id: string) => void;
  onBack: () => void;
};

export const AdventuresPage = ({
  userId,
  ownedCharacters,
  onOpenAdventure,
  onBack,
}: Props) => {
  const { adventures, links, create, join, leave } = useAdventures(userId);

  const [newName, setNewName] = useState('');
  const [code, setCode] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);

  const mastered = adventures.filter((adv) => adv.masterId === userId);
  const played = adventures.filter((adv) => adv.masterId !== userId);

  const characterByAdventure = useMemo(() => {
    const map = new Map<string, string>();
    links.forEach((link) => map.set(link.adventureId, link.characterId));
    return map;
  }, [links]);

  const nameOf = (id: string | undefined) =>
    ownedCharacters.find((char) => char.id === id)?.name ?? 'Personagem';

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await create(newName.trim());
    setNewName('');
  };

  const handleJoin = async () => {
    setJoinError(null);
    if (!code.trim() || !characterId) return;
    try {
      await join(code.trim(), characterId);
      setCode('');
      setCharacterId('');
    } catch (caught) {
      setJoinError(
        caught instanceof Error ? caught.message : 'Não foi possível entrar.',
      );
    }
  };

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
          Personagens
        </Button>
        <Heading size="lg" color="brand.accent" letterSpacing="0.04em">
          Aventuras
        </Heading>
      </Flex>

      <Stack gap="1rem" maxW="40rem">
        <SectionCard title="Mesas que mestro">
          <Flex gap="0.5rem">
            <Input
              size="sm"
              placeholder="Nome da nova aventura"
              value={newName}
              bg="surface.raised"
              borderColor="surface.border"
              onChange={(event) => setNewName(event.currentTarget.value)}
            />
            <Button
              size="sm"
              colorPalette="purple"
              onClick={handleCreate}
              disabled={!newName.trim()}
            >
              <LuPlus />
              Criar
            </Button>
          </Flex>

          {mastered.length === 0 ? (
            <Text color="fg.muted" fontSize="0.875rem">
              Você ainda não mestra nenhuma aventura.
            </Text>
          ) : (
            mastered.map((adv) => (
              <Flex
                key={adv.id}
                align="center"
                justify="space-between"
                gap="0.5rem"
                wrap="wrap"
              >
                <Box>
                  <Text fontWeight="bold">{adv.name}</Text>
                  <Flex align="center" gap="0.5rem">
                    <StatLabel>Código</StatLabel>
                    <Text fontSize="0.875rem" fontFamily="mono">
                      {adv.inviteCode}
                    </Text>
                    <Button
                      size="2xs"
                      variant="ghost"
                      colorPalette="gray"
                      onClick={() =>
                        navigator.clipboard?.writeText(adv.inviteCode)
                      }
                    >
                      <LuCopy />
                    </Button>
                  </Flex>
                </Box>
                <Button
                  size="xs"
                  variant="outline"
                  colorPalette="purple"
                  onClick={() => onOpenAdventure(adv.id)}
                >
                  Abrir mesa
                </Button>
              </Flex>
            ))
          )}
        </SectionCard>

        <SectionCard title="Entrar em uma aventura">
          <Flex gap="0.5rem" wrap="wrap">
            <Input
              size="sm"
              placeholder="Código"
              value={code}
              maxW="8rem"
              bg="surface.raised"
              borderColor="surface.border"
              onChange={(event) => setCode(event.currentTarget.value)}
            />
            <NativeSelect.Root size="sm" maxW="14rem">
              <NativeSelect.Field
                value={characterId}
                bg="surface.raised"
                borderColor="surface.border"
                onChange={(event) => setCharacterId(event.currentTarget.value)}
              >
                <option value="">Escolha um personagem</option>
                {ownedCharacters.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.name || 'Sem nome'}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Button
              size="sm"
              colorPalette="purple"
              onClick={handleJoin}
              disabled={!code.trim() || !characterId}
            >
              Entrar
            </Button>
          </Flex>
          {joinError && (
            <Text color="red.500" fontSize="0.8125rem">
              {joinError}
            </Text>
          )}
        </SectionCard>

        <SectionCard title="Mesas que jogo">
          {played.length === 0 ? (
            <Text color="fg.muted" fontSize="0.875rem">
              Você ainda não entrou em nenhuma aventura.
            </Text>
          ) : (
            played.map((adv) => {
              const linkedId = characterByAdventure.get(adv.id);
              return (
                <Flex
                  key={adv.id}
                  align="center"
                  justify="space-between"
                  gap="0.5rem"
                  wrap="wrap"
                >
                  <Box>
                    <Text fontWeight="bold">{adv.name}</Text>
                    <Text fontSize="0.75rem" color="fg.muted">
                      {nameOf(linkedId)}
                    </Text>
                  </Box>
                  {linkedId && (
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="gray"
                      onClick={() => leave(linkedId)}
                    >
                      Sair
                    </Button>
                  )}
                </Flex>
              );
            })
          )}
        </SectionCard>
      </Stack>
    </Box>
  );
};
