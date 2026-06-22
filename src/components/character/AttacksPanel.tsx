// ui
import { Box, Flex, Grid, IconButton, Text } from '@chakra-ui/react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

// components
import { EditableSection } from '@/components/character/EditableSection';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// utils
import { formatAttackBonus } from '@/utils/formatModifier';

export const AttacksPanel = () => {
  const { character, addAttack, updateAttack, removeAttack } =
    useCharacterSheetContext();
  const { attacks } = character;

  const renderAddButton = (isEditing: boolean) =>
    isEditing ? (
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
    <EditableSection title="Ataques" action={renderAddButton}>
      {(isEditing) => (
      <>
      {attacks.length === 0 && (
        <Text color="fg.muted" fontSize="0.875rem">
          Nenhum ataque cadastrado.
        </Text>
      )}

      {attacks.map((attack) => (
        <Grid
          key={attack.id}
          templateColumns={isEditing ? '1fr 4rem 1fr auto' : '1fr 55px 55px'}
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
              textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
            />
          </Box>
          <Box>
            <StatLabel>Bônus</StatLabel>
            {isEditing ? (
              <SheetField
                type="number"
                isEditing
                value={attack.bonus}
                onChange={(value) => updateAttack(attack.id, { bonus: value })}
                textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            ) : (
              <Text fontSize="1rem" fontWeight="bold">
                {formatAttackBonus(attack.bonus)}
              </Text>
            )}
          </Box>
          <Box>
            <StatLabel>Dano</StatLabel>
            <SheetField
              isEditing={isEditing}
              value={attack.damage}
              placeholder="1d6"
              onChange={(value) => updateAttack(attack.id, { damage: value })}
              textProps={{ fontSize: '1rem', fontWeight: 'bold' }}
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
      </>
      )}
    </EditableSection>
  );
};
