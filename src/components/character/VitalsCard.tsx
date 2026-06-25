// ui
import { Box, Grid, Stack, Text } from '@chakra-ui/react';

// components
import { ConditionBanner } from '@/components/character/ConditionBanner';
import { DeathTimerDialog } from '@/components/character/DeathTimerDialog';
import { EditableSection } from '@/components/character/EditableSection';
import { HitPointsBar } from '@/components/character/HitPointsBar';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// constants
import { isEquippableArmor } from '@/constants/items';

// hooks
import { useVitals } from '@/hooks/useVitals';

// utils
import { getEquippedAC, getUnarmoredAC } from '@/utils/armorClass';

export const VitalsCard = () => {
  const { character } = useCharacterSheetContext();
  const vitals = useVitals();

  // CA derivada: armadura equipada (se houver) ou desarmado (10 + mod DES).
  const equippedArmor = character.inventory.find(
    (item) => item.equipped && isEquippableArmor(item),
  );
  const armorClass = equippedArmor
    ? getEquippedAC(equippedArmor, character.abilities.des.score)
    : getUnarmoredAC(character.abilities.des.score);

  return (
    <EditableSection title="Vitais">
      {(isEditing) => (
      <>
      <Box>
        <StatLabel>Pontos de Vida</StatLabel>
        <Stack gap="0.75rem">
          <HitPointsBar
            current={vitals.current}
            max={vitals.max}
            onAdjust={vitals.adjustCurrent}
          />

          {isEditing && (
            <Grid templateColumns="1fr 1fr" gap="0.5rem">
              <Box>
                <StatLabel>Atual</StatLabel>
                <SheetField
                  type="number"
                  isEditing
                  min={0}
                  value={vitals.current}
                  onChange={vitals.setCurrent}
                  textProps={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                />
              </Box>
              <Box>
                <StatLabel>Máximo</StatLabel>
                <SheetField
                  type="number"
                  isEditing
                  min={0}
                  value={vitals.max}
                  onChange={vitals.setMax}
                  textProps={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                />
              </Box>
            </Grid>
          )}

          <ConditionBanner
            condition={vitals.condition}
            deathTimer={vitals.deathTimer}
            isTimeUp={vitals.isTimeUp}
            onDecrement={vitals.decrementDeathTimer}
            onSetTimer={vitals.openDeathPrompt}
            onStabilize={vitals.stabilize}
            onDeclareDeath={vitals.declareDeath}
            onRevertDeath={vitals.revertDeath}
          />
        </Stack>
      </Box>

      <Box>
        <StatLabel>Classe de Armadura</StatLabel>
        <Text fontSize="1.25rem" fontWeight="bold">
          {armorClass}
        </Text>
      </Box>

      <DeathTimerDialog
        isOpen={vitals.isDeathPromptOpen}
        onClose={vitals.closeDeathPrompt}
        onConfirm={vitals.confirmDeathTimer}
      />
      </>
      )}
    </EditableSection>
  );
};
