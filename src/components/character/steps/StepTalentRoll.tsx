import { Flex, Text, Button, Icon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import type { Character, AbilityKey, AttributeBonus } from '@/types/character';
import { LuDices } from 'react-icons/lu';
import { supabase } from '@/lib/supabase';
import { GuerreiroTalents, LadraoTalents, SacerdoteTalents, MagoTalents } from './ClassDescriptions';

type StepProps = {
  character: Character;
  updateField: <K extends keyof Character>(key: K, value: Character[K]) => void;
  onValidityChange: (isValid: boolean) => void;
  onAdvance: () => void;
};

const TALENTS_BY_CLASS: Record<string, { roll: string; effect: string }[]> = {
  guerreiro: GuerreiroTalents,
  ladrao: LadraoTalents,
  sacerdote: SacerdoteTalents,
  mago: MagoTalents,
};

export const StepTalentRoll = ({ character, updateField, onValidityChange, onAdvance }: StepProps) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number[] | null>(character.talentRoll || null);

  useEffect(() => {
    onValidityChange(!!character.talentRoll);
  }, [character.talentRoll, onValidityChange]);

  const handleRollTalent = async () => {
    if (character.talentRoll || (character.talents && character.talents.length > 0)) return;

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
      rolls = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
      setRollResult(rolls);
    } finally {
      setIsRolling(false);
    }

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
            allowedAttributes: allowed.length > 0 ? allowed : undefined,
          });
        }
        updateField('unspentAttributeBonuses', newBonuses);
        updateField('talentRoll', rolls);
      }
    }
  };

  if (!character.class) {
    return (
      <Flex direction="column" justify="center" align="center" h="100%" gap="1rem">
        <Text color="fg.muted">Selecione uma classe primeiro.</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" justify="center" align="center" gap="1rem" p="2rem" h="100%">
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
  );
};
