import { Flex, Text, Button, Icon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { Character, AbilityKey } from '@/types/character';
import { LuDices } from 'react-icons/lu';
import { supabase } from '@/lib/supabase';

export type StepAttributeProps = {
  character: Character;
  updateField: <K extends keyof Character>(key: K, value: Character[K]) => void;
  onValidityChange: (isValid: boolean) => void;
  onAdvance: () => void;
  attributeKey: AbilityKey;
  attributeName: string;
};

export const StepAttributeRoll = ({ character, updateField, onValidityChange, onAdvance, attributeKey, attributeName }: StepAttributeProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number[] | null>(character.attributeRolls?.[attributeKey] || null);

  const hasRolledStrict = !!character.attributeRolls?.[attributeKey];

  useEffect(() => {
    // Validate: true se a rolagem foi feita
    onValidityChange(hasRolledStrict);
  }, [hasRolledStrict, onValidityChange]);

  const handleRoll = async () => {
    if (hasRolledStrict) return;

    setIsRolling(true);
    let rolls = [3, 4, 3]; // fallback
    try {
      const { data, error } = await supabase.functions.invoke('dice-roller', {
        body: { formula: '3d6' }
      });
      if (error) throw error;
      if (data && data.rolls) {
        rolls = data.rolls;
      }
    } catch (err) {
      console.error("Erro ao rolar dados:", err);
      rolls = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    } finally {
      setIsRolling(false);
      setRollResult(rolls);
      const sum = rolls.reduce((acc, val) => acc + val, 0);

      const newAbilities = {
        ...character.abilities,
        [attributeKey]: { score: sum }
      };
      
      const newRolls = {
        ...(character.attributeRolls || {}),
        [attributeKey]: rolls
      };

      updateField('abilities', newAbilities);
      updateField('attributeRolls', newRolls);
    }
  };

  return (
    <Flex direction="column" justify="center" gap="2rem" w="100%" maxW="600px" mx="auto" h="100%" p="2rem">
      <Text fontSize="2xl" fontWeight="bold" color="brand.accent" textAlign="center">
        Definindo o Atributo: {attributeName}
      </Text>
      <Text color="fg.default" textAlign="center">
        Role <Text as="strong" color="fg.default">3d6</Text> e descubra seus pontos de {attributeName}:
      </Text>

      <Flex gap="2rem" mt="2rem" justify="center" align="center" direction="column">
        <Flex gap="1.5rem">
          {[0, 1, 2].map((diceIndex) => (
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
              onClick={handleRoll}
              loading={isRolling}
              disabled={hasRolledStrict}
              _hover={!hasRolledStrict ? { transform: 'scale(1.05)', bg: 'surface.panel' } : {}}
              transition="all 0.2s"
              opacity={hasRolledStrict ? 0.7 : 1}
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
              Total: <Text as="span" color="brand.accent" fontSize="2xl">{rollResult.reduce((a, b) => a + b, 0)}</Text>
            </Text>
            <Button colorPalette="purple" w="auto" minW="150px" mt="0.5rem" onClick={onAdvance}>
              Avançar
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
