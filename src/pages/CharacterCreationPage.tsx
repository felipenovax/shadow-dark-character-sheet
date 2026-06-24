import { useState, useMemo, useCallback } from 'react';
import { Button, Flex, Container, Link, Text, Dialog, Portal } from '@chakra-ui/react';
import { LuUsers, LuLogOut, LuSwords } from 'react-icons/lu';

import { createDefaultCharacter } from '@/constants/character';
import type { Character } from '@/types/character';

import { ActionBar } from '@/components/ActionBar';
import { CreationStepper } from '@/components/character/CreationStepper';
import { StepClass } from '@/components/character/steps/StepClass';
import {
  StepBackground,
  StepAncestry,
  StepAttributes,
  StepAlignmentDeity,
  StepName,
  StepEquipment,
} from '@/components/character/steps/StepPlaceholders';

type Props = {
  onComplete: (character: Character) => void;
  onCancel: () => void;
  onOpenAdventures: () => void;
  onSignOut: () => void;
};

const STEPS = [
  { title: 'Escolha a Classe', Component: StepClass },
  { title: 'Antecedentes', Component: StepBackground },
  { title: 'Ancestralidade', Component: StepAncestry },
  { title: 'Atributos', Component: StepAttributes },
  { title: 'Alinhamento', Component: StepAlignmentDeity },
  { title: 'Nome', Component: StepName },
  { title: 'Equipamentos', Component: StepEquipment },
];

export const CharacterCreationPage = ({ onComplete, onCancel, onOpenAdventures, onSignOut }: Props) => {
  const [character, setCharacter] = useState<Character>(createDefaultCharacter);
  const [activeStep, setActiveStep] = useState(0);
  const [pendingAction, setPendingAction] = useState<'cancel' | 'adventures' | null>(null);

  const updateField = useCallback(<K extends keyof Character>(key: K, value: Character[K]) => {
    setCharacter((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      onComplete(character);
    }
  }, [activeStep, character, onComplete]);

  const handleActionClick = (action: 'cancel' | 'adventures') => {
    if (activeStep > 0) {
      setPendingAction(action);
    } else {
      if (action === 'cancel') onCancel();
      if (action === 'adventures') onOpenAdventures();
    }
  };

  const confirmAction = () => {
    if (pendingAction === 'cancel') onCancel();
    if (pendingAction === 'adventures') onOpenAdventures();
    setPendingAction(null);
  };

  const CurrentStepComponent = useMemo(() => STEPS[activeStep].Component, [activeStep]);

  return (
    <Flex 
      direction="column" 
      h="100dvh" 
      bg="surface.bg" 
      color="fg"
      px={{ base: '1rem', md: '2rem' }}
      pt="0.5rem"
      pb="1.5rem"
    >
      <Flex px="1rem" py="0.5rem" mb="1rem" align="center" justify="space-between">
        <Flex gap="0.5rem" align="center" fontSize="lg">
          <Link href="/" color="fg.muted" _hover={{ color: 'fg' }} transition="color 0.2s" outline="none" _focusVisible={{ ring: "2px", ringColor: "colorPalette.focusRing" }}>
            ShadowDark
          </Link>
          <Text color="fg.subtle">/</Text>
          <Text color="brand.accent" fontWeight="bold">
            Novo Personagem
          </Text>
        </Flex>

        <Button
          variant="ghost"
          colorPalette="gray"
          size="sm"
          onClick={onSignOut}
        >
          <LuLogOut />
          Sair
        </Button>
      </Flex>

      <CreationStepper 
        steps={STEPS} 
        activeStep={activeStep} 
        onStepChange={(idx) => {
          setActiveStep(idx);
        }}
      />

      <Container flex="1" minH="0" py="2rem" maxW="container.md" display="flex" flexDirection="column">
        <CurrentStepComponent 
          character={character} 
          updateField={updateField} 
          onValidityChange={() => {}} 
          onAdvance={handleNext}
        />
      </Container>

      <ActionBar>
        <Button 
          colorPalette="purple" 
          flex="1" 
          minW="120px" 
          onClick={() => handleActionClick('cancel')}
        >
          <LuUsers />
          Personagens
        </Button>

        <Button 
          variant="outline"
          colorPalette="purple" 
          flex="1" 
          minW="120px"
          onClick={() => handleActionClick('adventures')} 
        >
          <LuSwords />
          Aventuras
        </Button>
      </ActionBar>

      <Dialog.Root
        open={pendingAction !== null}
        onOpenChange={(details) => {
          if (!details.open) setPendingAction(null);
        }}
        placement="center"
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              bg="surface.panel"
              borderColor="surface.border"
              borderWidth="2px"
              borderRadius="0.75rem"
            >
              <Dialog.Header>
                <Dialog.Title>Atenção</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="fg.muted" fontSize="0.875rem">
                  Você está saindo da criação de personagem. Todo o seu progresso até aqui será perdido. Tem certeza de que deseja continuar?
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" onClick={() => setPendingAction(null)}>
                  Voltar
                </Button>
                <Button colorPalette="red" onClick={confirmAction}>
                  Sair sem salvar
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
