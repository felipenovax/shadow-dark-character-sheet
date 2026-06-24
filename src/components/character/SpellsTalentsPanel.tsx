// libs
import { useState } from 'react';

// ui
import {
  Box,
  Button,
  Flex,
  IconButton,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

// components
import { EditableSection } from '@/components/character/EditableSection';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// constants
import {
  formatSpellClasses,
  getAvailableSpells,
  getSpell,
  getSpellClass,
} from '@/constants/spells';

export const SpellsTalentsPanel = () => {
  const {
    character,
    addTalent,
    updateTalent,
    removeTalent,
    addSpell,
    removeSpell,
  } = useCharacterSheetContext();
  const { talents, spells } = character;

  const [selectedSpellId, setSelectedSpellId] = useState('');

  const isCaster = getSpellClass(character.class) !== null;
  const knownSpells = spells.map((id) => getSpell(id)).filter(Boolean);
  const selectableSpells = getAvailableSpells(
    character.class,
    character.level,
  ).filter((spell) => !spells.includes(spell.id));

  const isEmpty = talents.length === 0 && spells.length === 0;

  const handleAddSpell = () => {
    if (!selectedSpellId) return;
    addSpell(selectedSpellId);
    setSelectedSpellId('');
  };

  return (
    <EditableSection title="Talentos / Magias">
      {(isEditing) => (
        <Stack gap="1rem">
          {isEmpty && !isEditing && (
            <Text color="fg.muted" fontSize="0.875rem">
              Nenhum talento ou magia cadastrado.
            </Text>
          )}

          {/* ── Talentos ───────────────────────────────────────────── */}
          {(talents.length > 0 || isEditing) && (
            <Stack gap="0.5rem">
              <StatLabel>Talentos</StatLabel>

              {talents.map((talent, index) => (
                <Flex key={index} gap="0.5rem" align="start">
                  {isEditing ? (
                    <Textarea
                      value={talent}
                      placeholder="Descreva o talento"
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

              {isEditing && (
                <Button
                  size="xs"
                  variant="outline"
                  colorPalette="purple"
                  alignSelf="flex-start"
                  onClick={addTalent}
                >
                  <LuPlus />
                  Talento
                </Button>
              )}
            </Stack>
          )}

          {/* ── Magias ─────────────────────────────────────────────── */}
          {(spells.length > 0 || isEditing) && (
            <Stack gap="0.5rem">
              <StatLabel>Magias</StatLabel>

              {knownSpells.map(
                (spell) =>
                  spell && (
                    <Flex key={spell.id} gap="0.5rem" align="start">
                      <Box flex="1">
                        <Text fontSize="0.875rem" fontWeight="bold">
                          {spell.name}
                        </Text>
                        <Text fontSize="0.6875rem" color="fg.muted">
                          Grau {spell.tier} • {formatSpellClasses(spell.classes)}{' '}
                          • {spell.duration} • {spell.range}
                        </Text>
                        <Text fontSize="0.8125rem" color="fg.muted" mt="0.125rem">
                          {spell.description}
                        </Text>
                      </Box>

                      {isEditing && (
                        <IconButton
                          aria-label="Remover magia"
                          size="xs"
                          variant="ghost"
                          colorPalette="gray"
                          onClick={() => removeSpell(spell.id)}
                        >
                          <LuTrash2 />
                        </IconButton>
                      )}
                    </Flex>
                  ),
              )}

              {isEditing && !isCaster && (
                <Text fontSize="0.75rem" color="fg.muted">
                  Apenas Mago e Clérigo conjuram magias.
                </Text>
              )}

              {isEditing && isCaster && (
                <Flex gap="0.5rem">
                  <NativeSelect.Root size="sm" flex="1">
                    <NativeSelect.Field
                      value={selectedSpellId}
                      bg="surface.raised"
                      borderColor="surface.border"
                      onChange={(event) =>
                        setSelectedSpellId(event.currentTarget.value)
                      }
                    >
                      <option value="">
                        {selectableSpells.length > 0
                          ? 'Escolha uma magia…'
                          : 'Nenhuma magia disponível'}
                      </option>
                      {selectableSpells.map((spell) => (
                        <option key={spell.id} value={spell.id}>
                          {spell.name} — Grau {spell.tier}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  <IconButton
                    aria-label="Adicionar magia"
                    size="sm"
                    colorPalette="purple"
                    disabled={!selectedSpellId}
                    onClick={handleAddSpell}
                  >
                    <LuPlus />
                  </IconButton>
                </Flex>
              )}
            </Stack>
          )}
        </Stack>
      )}
    </EditableSection>
  );
};
