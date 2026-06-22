// ui
import { Flex, IconButton, Text, Textarea } from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

// components
import { EditableSection } from '@/components/character/EditableSection';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

export const SpellsTalentsPanel = () => {
  const { character, addTalent, updateTalent, removeTalent } =
    useCharacterSheetContext();
  const { talents } = character;

  const renderAddButton = (isEditing: boolean) =>
    isEditing ? (
      <IconButton
        aria-label="Adicionar talento ou magia"
        size="xs"
        variant="ghost"
        colorPalette="purple"
        onClick={addTalent}
      >
        <LuPlus />
      </IconButton>
    ) : null;

  return (
    <EditableSection title="Talentos / Magias" action={renderAddButton}>
      {(isEditing) => (
      <>
      {talents.length === 0 && (
        <Text color="fg.muted" fontSize="0.875rem">
          Nenhum talento ou magia cadastrado.
        </Text>
      )}

      {talents.map((talent, index) => (
        <Flex key={index} gap="0.5rem" align="start">
          {isEditing ? (
            <Textarea
              value={talent}
              placeholder="Descreva o talento ou magia"
              rows={2}
              size="sm"
              bg="surface.raised"
              borderColor="surface.border"
              onChange={(event) =>
                updateTalent(index, event.currentTarget.value)
              }
            />
          ) : (
            <Text flex="1" fontSize="0.875rem" whiteSpace="pre-wrap">
              {talent || '—'}
            </Text>
          )}

          {isEditing && (
            <IconButton
              aria-label="Remover talento"
              size="xs"
              variant="ghost"
              colorPalette="gray"
              onClick={() => removeTalent(index)}
            >
              <LuTrash2 />
            </IconButton>
          )}
        </Flex>
      ))}
      </>
      )}
    </EditableSection>
  );
};
