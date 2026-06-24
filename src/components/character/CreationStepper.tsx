import { Box } from '@chakra-ui/react';
import { StepsItem, StepsList, StepsRoot } from '@/components/ui/steps';

type StepInfo = {
  title: string;
};

type CreationStepperProps = {
  steps: StepInfo[];
  activeStep: number;
  onStepChange: (index: number) => void;
};

export const CreationStepper = ({ steps, activeStep, onStepChange }: CreationStepperProps) => {
  const itemWidth = 250;

  return (
    <Box w="100%" overflow="hidden" py="1rem" position="relative">
      {/* Container posicionado em 50% da tela, transladando para focar no passo ativo */}
      <Box
        position="relative"
        left="50%"
        transform={`translateX(-${activeStep * itemWidth + itemWidth / 2}px)`}
        transition="transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        w="max-content"
      >
        <StepsRoot
          step={activeStep}
          count={steps.length}
          orientation="horizontal"
          size="sm"
        >
          <StepsList gap="0">
            {steps.map((step, idx) => {
              const distance = Math.abs(idx - activeStep);
              // Dimmer para passos adjacentes diretos. O restante fica invisível.
              const opacity = distance === 0 ? 1 : distance === 1 ? 0.4 : 0;
              const scale = distance === 0 ? 1.05 : 0.95;

              return (
                <StepsItem
                  key={idx}
                  index={idx}
                  title={step.title}
                  w={`${itemWidth}px`}
                  minW={`${itemWidth}px`}
                  flex="none"
                  opacity={opacity}
                  transform={`scale(${scale})`}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  transformOrigin="center"
                  px="0.5rem"
                  cursor={distance <= 1 ? "pointer" : "default"}
                  onClick={() => distance <= 1 && onStepChange(idx)}
                />
              );
            })}
          </StepsList>
        </StepsRoot>
      </Box>
      
      {/* Fade nas bordas para dar efeito de continuidade */}
      <Box
        position="absolute"
        left="0"
        top="0"
        bottom="0"
        w="2rem"
        bgGradient="to-r"
        gradientFrom="surface.bg"
        gradientTo="transparent"
        zIndex={1}
      />
      <Box
        position="absolute"
        right="0"
        top="0"
        bottom="0"
        w="2rem"
        bgGradient="to-l"
        gradientFrom="surface.bg"
        gradientTo="transparent"
        zIndex={1}
      />
    </Box>
  );
};
