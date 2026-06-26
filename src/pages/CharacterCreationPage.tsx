import { useState, useMemo, useCallback, useEffect } from 'react';
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
import { StepAttributeRoll } from '@/components/character/steps/StepAttributeRoll';
import { StepTalentRoll } from '@/components/character/steps/StepTalentRoll';

const StepFor = (props: any) => <StepAttributeRoll attributeKey="for" attributeName="Força" {...props} />;
const StepDes = (props: any) => <StepAttributeRoll attributeKey="des" attributeName="Destreza" {...props} />;
const StepCon = (props: any) => <StepAttributeRoll attributeKey="con" attributeName="Constituição" {...props} />;
const StepInt = (props: any) => <StepAttributeRoll attributeKey="int" attributeName="Inteligência" {...props} />;
const StepSab = (props: any) => <StepAttributeRoll attributeKey="sab" attributeName="Sabedoria" {...props} />;
const StepCar = (props: any) => <StepAttributeRoll attributeKey="car" attributeName="Carisma" {...props} />;

type Props = {
  onComplete: (character: Character) => void;
  onCancel: () => void;
  onOpenAdventures: () => void;
  onSignOut: () => void;
};

const STEPS = [
  { title: 'Classe', Component: StepClass },
  { title: 'Talento do Personagem', Component: StepTalentRoll },
  { title: 'Ancestralidade', Component: StepAncestry },
  { title: 'Força', Component: StepFor },
  { title: 'Destreza', Component: StepDes },
  { title: 'Constituição', Component: StepCon },
  { title: 'Inteligência', Component: StepInt },
  { title: 'Sabedoria', Component: StepSab },
  { title: 'Carisma', Component: StepCar },
];

export const CharacterCreationPage = ({ onComplete, onCancel, onOpenAdventures, onSignOut }: Props) => {
  const [character, setCharacter] = useState<Character>(() => {
    try {
      const saved = localStorage.getItem('shadowdark_draft_character');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load draft character", e);
    }
    return createDefaultCharacter();
  });

  const [activeStep, setActiveStep] = useState<number>(() => {
    const saved = localStorage.getItem('shadowdark_draft_step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [pendingAction, setPendingAction] = useState<'cancel' | 'adventures' | null>(null);
  const [showRerollPrompt, setShowRerollPrompt] = useState(false);

  // Persist state
  useEffect(() => {
    localStorage.setItem('shadowdark_draft_character', JSON.stringify(character));
  }, [character]);

  useEffect(() => {
    localStorage.setItem('shadowdark_draft_step', activeStep.toString());
  }, [activeStep]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem('shadowdark_draft_character');
    localStorage.removeItem('shadowdark_draft_step');
  }, []);

  const updateField = useCallback(<K extends keyof Character>(key: K, value: Character[K]) => {
    setCharacter((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Estamos no último passo (Carisma)
      const maxAttr = Math.max(
        character.abilities.for.score,
        character.abilities.des.score,
        character.abilities.con.score,
        character.abilities.int.score,
        character.abilities.sab.score,
        character.abilities.car.score
      );

      if (maxAttr < 14) {
        setShowRerollPrompt(true);
      } else {
        clearDraft();
        onComplete(character);
      }
    }
  }, [activeStep, character, onComplete, clearDraft]);

  const handleAcceptReroll = () => {
    const resetAbilities = {
      for: { score: 10 },
      des: { score: 10 },
      con: { score: 10 },
      int: { score: 10 },
      sab: { score: 10 },
      car: { score: 10 },
    };
    updateField('abilities', resetAbilities);
    updateField('attributeRolls', undefined);
    
    setShowRerollPrompt(false);
    setActiveStep(3); // Volta para Força (agora no índice 3)
  };

  const handleDeclineReroll = () => {
    setShowRerollPrompt(false);
    clearDraft();
    onComplete(character);
  };

  const handleActionClick = (action: 'cancel' | 'adventures') => {
    setPendingAction(action);
  };

  const confirmAction = () => {
    clearDraft();
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

      <Dialog.Root open={showRerollPrompt} onOpenChange={(e) => !e.open && handleDeclineReroll()}>
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(4px)" />
          <Dialog.Positioner>
            <Dialog.Content bg="surface.panel" color="fg.default" borderRadius="lg" borderWidth="1px" borderColor="brand.accent" boxShadow="xl">
              <Dialog.Header>
                <Dialog.Title color="brand.accent">Atributos Baixos Detectados</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Você não obteve nenhum atributo com valor 14 ou mais. De acordo com as regras de Shadowdark, você tem o direito de descartar essas rolagens e rolar novamente todos os atributos.
                </Text>
                <Text mt="4" fontWeight="bold">Deseja reiniciar as rolagens a partir da Força?</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" onClick={handleDeclineReroll}>
                  Manter Atributos
                </Button>
                <Button colorPalette="brand" onClick={handleAcceptReroll}>
                  Sim, Rerolar Tudo
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

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
