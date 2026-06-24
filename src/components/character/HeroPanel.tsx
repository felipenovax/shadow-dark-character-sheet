// ui
import { Box, Grid, Stack, Text } from '@chakra-ui/react';

// components
import { BackgroundField } from '@/components/character/BackgroundField';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { EditableSection } from '@/components/character/EditableSection';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// constants
import {
  ALIGNMENT_OPTIONS,
  ANCESTRY_OPTIONS,
  CLASS_OPTIONS,
  DEITY_OPTIONS,
  getMatchingTitle,
  getXpThreshold,
} from '@/constants/character';

// types
import type { Alignment } from '@/types/character';

export const HeroPanel = () => {
  const { character, updateField } = useCharacterSheetContext();

  // Título é derivado de classe + alinhamento + nível; recalcula a cada mudança.
  const handleClassChange = (value: string) => {
    updateField('class', value);
    updateField('title', getMatchingTitle(value, character.alignment, character.level));
  };

  const handleAlignmentChange = (value: string) => {
    const alignment = value as Alignment;
    updateField('alignment', alignment);
    updateField('title', getMatchingTitle(character.class, alignment, character.level));

    // Divindade depende do alinhamento: limpa se não pertencer ao novo.
    const isValidDeity = DEITY_OPTIONS[alignment].some(
      (deity) => deity.value === character.deity,
    );
    if (character.deity && !isValidDeity) {
      updateField('deity', '');
    }
  };

  const handleLevelChange = (value: number) => {
    updateField('level', value);
    updateField('title', getMatchingTitle(character.class, character.alignment, value));
  };

  return (
    <EditableSection>
      {(isEditing) => (
      <Grid templateColumns={{ base: '1fr', md: '220px 1fr' }} gap="1.25rem">
        <CharacterAvatar
          name={character.name}
          avatar={character.avatar || '/default.png'}
          characterId={character.id}
          isEditing={isEditing}
          onChange={(value) => updateField('avatar', value)}
        />

        <Stack gap="0.75rem">
          <Box>
            <StatLabel>Nome</StatLabel>
            <SheetField
              isEditing={isEditing}
              value={character.name}
              placeholder="Nome do personagem"
              onChange={(value) => updateField('name', value)}
              textProps={{ fontSize: '1.5rem', fontWeight: 'bold' }}
            />
          </Box>

          <Box>
            <StatLabel>Classe</StatLabel>
            <SheetField
              type="select"
              isEditing={isEditing}
              value={character.class}
              options={CLASS_OPTIONS}
              onChange={handleClassChange}
              textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
            />
          </Box>

          <Box>
            <StatLabel>Ancestralidade</StatLabel>
            <SheetField
              type="select"
              isEditing={isEditing}
              value={character.ancestry}
              options={ANCESTRY_OPTIONS}
              onChange={(value) => updateField('ancestry', value)}
              textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
            />
          </Box>

          <Grid templateColumns={{ base: '1fr 1fr' }} gap="0.75rem">
            <Box>
              <StatLabel>Nível</StatLabel>
              <SheetField
                type="number"
                isEditing={isEditing}
                value={character.level}
                min={0}
                onChange={handleLevelChange}
                textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            </Box>
            <Box>
              <StatLabel>XP</StatLabel>
              <Grid templateColumns="auto auto" gap="0.5rem">
                <SheetField
                  type="number"
                  isEditing={isEditing}
                  value={character.xp}
                  min={0}
                  onChange={(value) => updateField('xp', value)}
                  textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
                />
                <Text fontSize="1rem" fontWeight="bold" color="fg.muted">
                  / {getXpThreshold(character.level)}
                </Text>
              </Grid>
            </Box>
          </Grid>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="0.75rem">
            <Box>
              <StatLabel>Alinhamento</StatLabel>
              <SheetField
                type="select"
                isEditing={isEditing}
                value={character.alignment}
                options={ALIGNMENT_OPTIONS}
                onChange={handleAlignmentChange}
                textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            </Box>

            <Box>
              <StatLabel>Título</StatLabel>
              <Text
                fontSize="1rem"
                fontWeight="bold"
                color={character.title ? 'fg' : 'fg.muted'}
              >
                {character.title || '—'}
              </Text>
            </Box>
          </Grid>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="0.75rem">
            <Box>
              <StatLabel>Antecedente</StatLabel>
              <BackgroundField
                isEditing={isEditing}
                value={character.background}
                onChange={(value) => updateField('background', value)}
              />
            </Box>
            <Box>
              <StatLabel>Divindade</StatLabel>
              <SheetField
                type="select"
                isEditing={isEditing}
                value={character.deity}
                options={[
                  { value: '', label: 'Nenhuma' },
                  ...DEITY_OPTIONS[character.alignment],
                ]}
                onChange={(value) => updateField('deity', value)}
                textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            </Box>
          </Grid>
        </Stack>
      </Grid>
      )}
    </EditableSection>
  );
};
