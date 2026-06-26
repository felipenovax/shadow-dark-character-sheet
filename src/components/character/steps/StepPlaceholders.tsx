import { Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import type { Character } from '@/types/character';

type StepProps = {
  character: Character;
  updateField: <K extends keyof Character>(key: K, value: Character[K]) => void;
  onValidityChange: (isValid: boolean) => void;
  onAdvance?: () => void;
};

const BaseStepPlaceholder = ({ title, onValidityChange }: { title: string, onValidityChange: (isValid: boolean) => void }) => {
  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <Flex direction="column" gap="1rem" w="100%">
      <Heading size="lg" color="brand.accent">{title}</Heading>
      <Text color="fg.muted">Em breve.</Text>
    </Flex>
  );
};

export const StepBackground = (props: StepProps) => <BaseStepPlaceholder title="Escolha dos Antecedentes" {...props} />;
export const StepAncestry = (props: StepProps) => <BaseStepPlaceholder title="Escolha de Ancestralidade" {...props} />;
export const StepAttributes = (props: StepProps) => <BaseStepPlaceholder title="Definição de Atributos" {...props} />;
export const StepAlignmentDeity = (props: StepProps) => <BaseStepPlaceholder title="Escolha de Alinhamento e Divindade" {...props} />;
export const StepName = (props: StepProps) => <BaseStepPlaceholder title="Escolha do Nome" {...props} />;
export const StepEquipment = (props: StepProps) => <BaseStepPlaceholder title="Escolha de Equipamentos" {...props} />;
