import { Flex, Text, Card, Box, Icon, IconButton, Button, Image } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import type { Character, AbilityKey, AttributeBonus } from '@/types/character';
import { LuSwords, LuWand, LuCross, LuEyeOff, LuChevronLeft, LuChevronRight, LuDices } from 'react-icons/lu';
import { GuerreiroDescription, LadraoDescription, SacerdoteDescription, MagoDescription, GuerreiroTalents, LadraoTalents, SacerdoteTalents, MagoTalents } from './ClassDescriptions';
import { supabase } from '@/lib/supabase';

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

const TALENTS_BY_CLASS: Record<string, { roll: string; effect: string }[]> = {
  guerreiro: GuerreiroTalents,
  ladrao: LadraoTalents,
  sacerdote: SacerdoteTalents,
  mago: MagoTalents,
};

export const StepClass = ({ character, updateField, onValidityChange, onAdvance }: StepProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number[] | null>(character.talentRoll || null);

  // Validate that a class is selected
  useEffect(() => {
    onValidityChange(!!character.class);
  }, [character.class, onValidityChange]);

  const defaultPageIndex = useMemo(() => {
    if (!character.class) return 0;
    const index = CLASSES.findIndex((c) => c.id === character.class);
    return index !== -1 ? index : 0;
  }, [character.class]);

  const handleRollTalent = async () => {
    if (character.talentRoll || (character.talents && character.talents.length > 0)) return; // Previne rerolagem

    setIsRolling(true);
    let rolls = [1, 1];
    try {
      const { data, error } = await supabase.functions.invoke('dice-roller', {
        body: { formula: '2d6' }
      });
      if (error) throw error;
      rolls = data.rolls;
      setRollResult(rolls);
    } catch (err) {
      console.error("Erro ao rolar dados:", err);
      // Fallback in case of error
      rolls = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
      setRollResult(rolls);
    } finally {
      setIsRolling(false);
    }

    // Processa o resultado da rolagem
    const classKey = character.class?.toLowerCase() || '';
    if (classKey && TALENTS_BY_CLASS[classKey]) {
      const sum = rolls[0] + rolls[1];
      const talent = TALENTS_BY_CLASS[classKey]?.find(t => {
        if (t.roll === sum.toString()) return true;
        if (t.roll.includes('a')) {
          const [min, max] = t.roll.split(' a ').map(Number);
          if (sum >= min && sum <= max) return true;
        }
        return false;
      });

      if (talent) {
        updateField('talents', [talent.effect]);
        
        let newBonuses: AttributeBonus[] = [];
        if (talent.effect.includes('+2') && (talent.effect.toLowerCase().includes('atributo') || talent.effect.includes('Força') || talent.effect.includes('Destreza') || talent.effect.includes('Sabedoria') || talent.effect.includes('Inteligência') || talent.effect.includes('Carisma'))) {
          const allowed: AbilityKey[] = [];
          if (talent.effect.includes('Força')) allowed.push('for');
          if (talent.effect.includes('Destreza')) allowed.push('des');
          if (talent.effect.includes('Constituição')) allowed.push('con');
          if (talent.effect.includes('Inteligência')) allowed.push('int');
          if (talent.effect.includes('Sabedoria')) allowed.push('sab');
          if (talent.effect.includes('Carisma')) allowed.push('car');

          newBonuses.push({
            points: 2,
            allowedAttributes: allowed.length > 0 ? allowed : undefined, // Se não especificou, todos valem
          });
        }
        updateField('unspentAttributeBonuses', newBonuses);
        updateField('talentRoll', rolls);
      }
    }
  };

  return (
    <Flex direction="column" gap="1.5rem" w="100%" flex="1" minH="0">
      {character.class ? (
        <Flex
          flex="1"
          direction="column"
          justify="center"
          align="center"
          gap="1rem"
          p="2rem"
        >
          <Text fontSize="2xl" fontWeight="bold" color="brand.accent">
            Definindo o Talento do Personagem
          </Text>
          <Text color="fg.default">
            Role <Text as="strong" color="fg.default">2d6</Text> e descubra o talento:
          </Text>

          <Flex gap="2rem" mt="2rem" justify="center" align="center" direction="column">
            <Flex gap="1.5rem">
              {[0, 1].map((diceIndex) => (
                <Button
                  key={diceIndex}
                  size="xl"
                  h="100px"
                  w="100px"
                  variant="outline"
                  borderColor="brand.primary"
                  colorPalette="purple"
                  borderWidth="2px"
                  borderRadius="xl"
                  onClick={handleRollTalent}
                  loading={isRolling}
                  disabled={!!character.talentRoll || (character.talents && character.talents.length > 0)}
                  _hover={(!character.talentRoll && !(character.talents && character.talents.length > 0)) ? { transform: 'scale(1.05)', bg: 'surface.panel' } : {}}
                  transition="all 0.2s"
                  opacity={(character.talentRoll || (character.talents && character.talents.length > 0)) ? 0.7 : 1}
                >
                  <Flex direction="column" align="center" justify="center" gap="0.5rem" w="100%" h="100%">
                    {rollResult ? (
                      <Text fontSize="4xl" fontWeight="black" color="brand.accent">
                        {rollResult[diceIndex]}
                      </Text>
                    ) : (
                      <>
                        <Icon as={LuDices} boxSize="8" color="brand.primary" />
                        <Text fontSize="md" fontWeight="bold">D6</Text>
                      </>
                    )}
                  </Flex>
                </Button>
              ))}
            </Flex>

            {rollResult && (
              <Flex direction="column" align="center" gap="0.75rem" mt="1rem" bg="surface.panel" p="1.5rem" borderRadius="md" borderWidth="1px" borderColor="brand.accent" boxShadow="sm">
                <Text fontSize="lg" fontWeight="bold" color="fg.default">
                  Total: <Text as="span" color="brand.accent" fontSize="2xl">{rollResult[0] + rollResult[1]}</Text>
                </Text>
                {character.talents && character.talents.length > 0 ? (
                  <>
                    <Text color="fg.default" textAlign="center" maxW="400px" fontWeight="medium" fontSize="md">
                      {character.talents[0]}
                    </Text>
                    <Button colorPalette="purple" w="auto" minW="150px" mt="0.5rem" onClick={onAdvance}>
                      Avançar
                    </Button>
                  </>
                ) : (
                  <Text color="fg.muted" textAlign="center" maxW="400px" fontSize="sm">
                    Calculando efeito...
                  </Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      ) : (
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

                        <Button
                          mt="1.5rem"
                          size="xs"
                          alignSelf="flex-end"
                          colorPalette="purple"
                          onClick={() => {
                            updateField('class', cls.id);
                          }}
                        >
                          {isSelected ? 'Escolhida' : 'Escolher'}
                        </Button>
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
      )}
    </Flex>
  );
};
