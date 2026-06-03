// ui
import { Button, Flex, IconButton, NativeSelect } from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

// types
import type { Character } from '@/types/character';

type Props = {
  characters: Character[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
};

export const CharacterSelector = ({
  characters,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: Props) => {
  const canDelete = characters.length > 1 && activeId !== null;

  return (
    <Flex align="center" gap="0.5rem">
      <NativeSelect.Root size="sm" maxW="14rem">
        <NativeSelect.Field
          value={activeId ?? ''}
          bg="surface.raised"
          borderColor="surface.border"
          onChange={(event) => onSelect(event.currentTarget.value)}
        >
          {characters.map((character) => (
            <option key={character.id} value={character.id}>
              {character.name || 'Sem nome'}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <Button
        size="sm"
        variant="outline"
        colorPalette="purple"
        onClick={onCreate}
      >
        <LuPlus />
        Nova
      </Button>

      <IconButton
        aria-label="Excluir personagem"
        size="sm"
        variant="ghost"
        colorPalette="gray"
        disabled={!canDelete}
        onClick={() => activeId && onDelete(activeId)}
      >
        <LuTrash2 />
      </IconButton>
    </Flex>
  );
};
