// libs
import { createContext, useContext, type ReactNode } from 'react';

// types
import type { Character } from '@/types/character';
import type { CharacterRoster } from '@/hooks/useCharacterRoster';

type CharacterUpdaters = Pick<
  CharacterRoster,
  | 'updateField'
  | 'updateAbilityScore'
  | 'updateHitPoints'
  | 'updateCoins'
  | 'addInventoryItem'
  | 'updateInventoryItem'
  | 'setInventoryQuantity'
  | 'removeInventoryItem'
  | 'consumeInventoryItem'
  | 'setConsumableTimer'
  | 'addAttack'
  | 'updateAttack'
  | 'removeAttack'
  | 'addTalent'
  | 'updateTalent'
  | 'removeTalent'
  | 'addSpell'
  | 'removeSpell'
  | 'saveActiveCharacter'
  | 'requestSave'
>;

type CharacterSheetContextValue = CharacterUpdaters & {
  character: Character;
};

const CharacterSheetContext =
  createContext<CharacterSheetContextValue | null>(null);

type ProviderProps = CharacterSheetContextValue & {
  children: ReactNode;
};

export const CharacterSheetProvider = ({
  children,
  ...value
}: ProviderProps) => {
  return (
    <CharacterSheetContext.Provider value={value}>
      {children}
    </CharacterSheetContext.Provider>
  );
};

export const useCharacterSheetContext = (): CharacterSheetContextValue => {
  const context = useContext(CharacterSheetContext);

  if (!context) {
    throw new Error(
      'useCharacterSheetContext deve ser usado dentro de CharacterSheetProvider.',
    );
  }

  return context;
};
