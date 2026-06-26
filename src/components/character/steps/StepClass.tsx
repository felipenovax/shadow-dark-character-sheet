import { Flex, Text, Card, Box, Icon, IconButton, Button, Image } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import type { Character } from '@/types/character';
import { LuSwords, LuWand, LuCross, LuEyeOff, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { GuerreiroDescription, LadraoDescription, SacerdoteDescription, MagoDescription } from './ClassDescriptions';

import {
  CarouselRoot,
  CarouselItemGroup,
  CarouselItem,
  CarouselPrevTrigger,
  CarouselNextTrigger,
  CarouselIndicators,
  CarouselIndicator,
} from '@/components/ui/carousel';

type StepProps = {
  character: Character;
  updateField: <K extends keyof Character>(key: K, value: Character[K]) => void;
  onValidityChange: (isValid: boolean) => void;
  onAdvance: () => void;
};

const CLASSES = [
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    description: 'Mestres invencíveis em combate e manejo de armas.',
    fullDescription: GuerreiroDescription,
    icon: LuSwords,
    color: 'red.500',
    image: '/images/classes/guerreiro.png',
  },
  {
    id: 'ladrao',
    name: 'Ladrão',
    description: 'Especialistas em furtividade e truques.',
    fullDescription: LadraoDescription,
    icon: LuEyeOff,
    color: 'gray.500',
    image: '/images/classes/ladrao.png',
    imagePosition: '65% 30%',
  },
  {
    id: 'sacerdote',
    name: 'Sacerdote',
    description: 'Conjuradores divinos armados com a fé.',
    fullDescription: SacerdoteDescription,
    icon: LuCross,
    color: 'yellow.500',
    image: '/images/classes/sacerdote.png',
  },
  {
    id: 'mago',
    name: 'Mago',
    description: 'Estudiosos que moldam a realidade com magia.',
    fullDescription: MagoDescription,
    icon: LuWand,
    color: 'blue.500',
    image: '/images/classes/mago.png',
  },
];

export const StepClass = ({ character, updateField, onValidityChange, onAdvance }: StepProps) => {
  // Validate that a class is selected
  useEffect(() => {
    onValidityChange(!!character.class);
  }, [character.class, onValidityChange]);

  const defaultPageIndex = useMemo(() => {
    if (!character.class) return 0;
    const index = CLASSES.findIndex((c) => c.id === character.class);
    return index !== -1 ? index : 0;
  }, [character.class]);

  return (
    <Flex direction="column" gap="1.5rem" w="100%" flex="1" minH="0">
        <CarouselRoot defaultPage={defaultPageIndex} spacing="1rem" slideCount={CLASSES.length} allowMouseDrag flex="1" display="flex" flexDirection="column" minH="0">
          <CarouselItemGroup flex="1" alignItems="stretch" minH="0">
          {CLASSES.map((cls, idx) => {
            const isSelected = character.class === cls.id;

            return (
              <CarouselItem key={cls.id} index={idx} flex={{ base: "0 0 80%", md: "0 0 40%" }} display="flex" minH="0">
                <Card.Root
                  flex="1"
                  flexDirection="row"
                  minH="0"
                  bg={isSelected ? 'surface.raised' : 'surface.panel'}
                  borderColor={isSelected ? 'brand.accent' : 'surface.border'}
                  borderWidth="2px"
                  borderRadius="0.375rem"
                  overflow="hidden"
                  cursor="grab"
                >
                  {cls.image ? (
                    <Box w="30%" minW="30%" h="100%" position="relative" overflow="hidden">
                      <Image
                        src={cls.image}
                        alt={cls.name}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        objectPosition={cls.imagePosition || "center 30%"}
                      />
                      {/* Dimmer de borda em tom de roxo */}
                      <Box
                        position="absolute"
                        inset="0"
                        boxShadow="inset 0 0 60px 15px rgba(25, 5, 50, 0.9)" // Um roxo bem escuro, quase preto, para escurecer as bordas
                        pointerEvents="none"
                      />
                      {/* Gradiente extra na direita para misturar com o fundo do card */}
                      <Box
                        position="absolute"
                        top="0"
                        bottom="0"
                        right="0"
                        w="80%"
                        bg="linear-gradient(to right, transparent 0%, var(--chakra-colors-surface-panel) 85%, var(--chakra-colors-surface-panel) 100%)"
                        pointerEvents="none"
                      />
                    </Box>
                  ) : (
                    <Flex
                      w="30%"
                      minW="30%"
                      h="100%"
                      align="center"
                      justify="center"
                      bg="rgba(0, 0, 0, 0.2)"
                      color={cls.color}
                    >
                      <Icon as={cls.icon} boxSize={{ base: '2rem', sm: '3rem' }} />
                    </Flex>
                  )}

                  <Box flex="1" display="flex" flexDirection="column" minW="0" minH="0">
                    <Card.Body p="1.5rem" flex="1" display="flex" flexDirection="column" minH="0">
                      <Flex direction="column" justify="flex-start" flex="1" maxH="100%" minH="0">
                        <Text fontWeight="bold" fontSize="3xl" color="fg.default">{cls.name}</Text>
                        
                        <Box
                          flex="1"
                          mt="1rem"
                          overflowY="auto"
                          pr="1rem"
                          minH="0"
                          style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#805ad5 transparent'
                          }}
                          css={{
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-track': { background: 'transparent' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#805ad5', borderRadius: '4px' }
                          }}
                        >
                          {cls.fullDescription ? cls.fullDescription : (
                            <Text fontSize="md" color="fg.muted">{cls.description}</Text>
                          )}
                        </Box>

                        {isSelected ? (
                          <Button
                            mt="1.5rem"
                            size="xs"
                            alignSelf="flex-end"
                            colorPalette="purple"
                            onClick={onAdvance}
                          >
                            Avançar
                          </Button>
                        ) : (
                          <Button
                            mt="1.5rem"
                            size="xs"
                            alignSelf="flex-end"
                            colorPalette="gray"
                            onClick={() => {
                              updateField('class', cls.id);
                            }}
                          >
                            Escolher
                          </Button>
                        )}
                      </Flex>
                    </Card.Body>
                  </Box>
                </Card.Root>
              </CarouselItem>
            );
          })}
        </CarouselItemGroup>
        <Flex justify="center" mt="1.5rem" align="center" gap="1rem">
          <CarouselPrevTrigger asChild>
            <IconButton variant="ghost" rounded="full" aria-label="Classe anterior">
              <LuChevronLeft />
            </IconButton>
          </CarouselPrevTrigger>

          <CarouselIndicators display="flex" gap="0.5rem">
            {CLASSES.map((_, idx) => (
              <CarouselIndicator key={idx} index={idx} w="8px" h="8px" bg="surface.border" css={{ "&[data-current]": { bg: "brand.accent" } }} borderRadius="full" cursor="pointer" />
            ))}
          </CarouselIndicators>
          <CarouselNextTrigger asChild>
            <IconButton variant="ghost" rounded="full" aria-label="Próxima classe">
              <LuChevronRight />
            </IconButton>
          </CarouselNextTrigger>
        </Flex>
      </CarouselRoot>
    </Flex>
  );
};
