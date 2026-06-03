// ui
import { Box, Flex, Grid, Stack, Text } from '@chakra-ui/react';

// components
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { SectionCard } from '@/components/ui/SectionCard';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// constants
import {
  ALIGNMENT_OPTIONS,
  ANCESTRY_OPTIONS,
  CLASS_OPTIONS,
  getMatchingTitle,
  getXpThreshold,
} from '@/constants/character';

// types
import type { Alignment } from '@/types/character';

export const HeroPanel = () => {
  const { character, isEditing, updateField } = useCharacterSheetContext();

  // Título é derivado de classe + alinhamento + nível; recalcula a cada mudança.
  const handleClassChange = (value: string) => {
    updateField('class', value);
    updateField('title', getMatchingTitle(value, character.alignment, character.level));
  };

  const handleAlignmentChange = (value: string) => {
    const alignment = value as Alignment;
    updateField('alignment', alignment);
    updateField('title', getMatchingTitle(character.class, alignment, character.level));
  };

  const handleLevelChange = (value: number) => {
    updateField('level', value);
    updateField('title', getMatchingTitle(character.class, character.alignment, value));
  };

  return (
    <SectionCard>
      <Grid templateColumns={{ base: '1fr', md: '220px 1fr' }} gap="1.25rem">
        <CharacterAvatar
          name={character.name}
          avatar={character.avatar || '/default.png'}
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
              <Flex align="center" gap="0.5rem">
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
              </Flex>
            </Box>
          </Grid>

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
        </Stack>
      </Grid>
    </SectionCard>
  );
};
