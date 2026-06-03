// ui
import { Box, Grid, Image, VStack } from '@chakra-ui/react';

// components
import { AbilitiesGrid } from '@/components/character/AbilitiesGrid';
import { AttacksPanel } from '@/components/character/AttacksPanel';
import { EquipmentPanel } from '@/components/character/EquipmentPanel';
import { HeroPanel } from '@/components/character/HeroPanel';
import { IdentityCard } from '@/components/character/IdentityCard';
import { SpellsTalentsPanel } from '@/components/character/SpellsTalentsPanel';
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
        <IdentityCard />
      </VStack>

      <VStack gap="1rem" align="stretch">
        <AbilitiesGrid />
        <AttacksPanel />
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
        <SpellsTalentsPanel />
      </VStack>
    </Grid>
  );
};
