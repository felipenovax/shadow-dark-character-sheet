// ui
import { Box, Flex, Grid, IconButton, Text } from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

// components
import { SectionCard } from '@/components/ui/SectionCard';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

export const AttacksPanel = () => {
  const { character, isEditing, addAttack, updateAttack, removeAttack } =
    useCharacterSheetContext();
  const { attacks } = character;

  const addButton = isEditing ? (
    <IconButton
      aria-label="Adicionar ataque"
      size="xs"
      variant="ghost"
      colorPalette="purple"
      onClick={addAttack}
    >
      <LuPlus />
    </IconButton>
  ) : null;

  return (
    <SectionCard title="Ataques" action={addButton}>
      {attacks.length === 0 && (
        <Text color="fg.muted" fontSize="0.875rem">
          Nenhum ataque cadastrado.
        </Text>
      )}

      {attacks.map((attack) => (
        <Grid
          key={attack.id}
          templateColumns={isEditing ? '1fr 4rem 1fr auto' : '1fr 4rem 1fr'}
          gap="0.5rem"
          alignItems="center"
        >
          <Box>
            <StatLabel>Nome</StatLabel>
            <SheetField
              isEditing={isEditing}
              value={attack.name}
              placeholder="Ataque"
              onChange={(value) => updateAttack(attack.id, { name: value })}
            />
          </Box>
          <Box>
            <StatLabel>Bônus</StatLabel>
            <SheetField
              type="number"
              isEditing={isEditing}
              value={attack.bonus}
              onChange={(value) => updateAttack(attack.id, { bonus: value })}
            />
          </Box>
          <Box>
            <StatLabel>Dano</StatLabel>
            <SheetField
              isEditing={isEditing}
              value={attack.damage}
              placeholder="1d6"
              onChange={(value) => updateAttack(attack.id, { damage: value })}
            />
          </Box>
          {isEditing && (
            <Flex align="end" h="100%" pb="0.125rem">
              <IconButton
                aria-label="Remover ataque"
                size="xs"
                variant="ghost"
                colorPalette="gray"
                onClick={() => removeAttack(attack.id)}
              >
                <LuTrash2 />
              </IconButton>
            </Flex>
          )}
        </Grid>
      ))}
    </SectionCard>
  );
};
