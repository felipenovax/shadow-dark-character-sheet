// ui
import { Box, Grid, Image, VStack } from '@chakra-ui/react';

// components
import { AbilitiesGrid } from '@/components/character/AbilitiesGrid';
import { AttacksPanel } from '@/components/character/AttacksPanel';
import { EquipmentPanel } from '@/components/character/EquipmentPanel';
import { HeroPanel } from '@/components/character/HeroPanel';
import { SpellsTalentsPanel } from '@/components/character/SpellsTalentsPanel';
import { TreasurePanel } from '@/components/character/TreasurePanel';
import { VitalsCard } from '@/components/character/VitalsCard';

export const CharacterDashboard = () => {
  return (
    <Grid
      templateColumns={{ base: '1fr', lg: '1fr 2fr'}}
      gap="1rem"
      alignItems="start"
    >
      <VStack gap="1rem" align="stretch">
        <HeroPanel />
        <VitalsCard />
      </VStack>

      <VStack gap="1rem" align="stretch">
        <AbilitiesGrid />
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="1rem">
          <AttacksPanel />
          <SpellsTalentsPanel />
        </Grid>
        <Box position="relative">
          <Image
            src="/equipment.png"
            alt="Background"
            position="absolute"
            zIndex={10}
            width="auto"
            height="70px"
            top="-20px"
            right="0"
            // w="100%"
            // h="100%"
            objectFit="cover"
            // opacity="0.3"
          />
          <EquipmentPanel />
        </Box>
      </VStack>

      <VStack gap="1rem" align="stretch">
        <TreasurePanel />
      </VStack>
    </Grid>
  );
};
