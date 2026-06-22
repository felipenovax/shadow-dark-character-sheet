// libs
import { useState } from 'react';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Centraliza a lógica de pontos de vida e a máquina de estados de queda/morte.
export const useVitals = () => {
  const { character, updateHitPoints, updateField, requestSave } =
    useCharacterSheetContext();
  const { current, max } = character.hitPoints;
  const { deathTimer, condition } = character;

  const [isDeathPromptOpen, setDeathPromptOpen] = useState(false);

  // Timer de agonia chegou ao fim → pode-se declarar a morte.
  const isTimeUp = condition === 'dying' && deathTimer === 0;

  const setCurrent = (next: number) => {
    const clamped = clamp(next, 0, Math.max(max, 0));
    updateHitPoints('current', clamped);

    // Caiu a 0 PV agora → entra em agonia e pergunta as rodadas até a morte.
    if (clamped === 0 && current > 0 && condition === 'normal') {
      updateField('condition', 'dying');
      setDeathPromptOpen(true);
      return;
    }

    // Recuperou PV → volta ao normal e zera o timer.
    if (clamped > 0 && condition !== 'normal') {
      updateField('condition', 'normal');
      updateField('deathTimer', null);
    }
  };

  // Ação rápida de jogo (fora do modo de edição): persiste imediatamente.
  const adjustCurrent = (delta: number) => {
    setCurrent(current + delta);
    requestSave();
  };

  const setMax = (next: number) => {
    const safeMax = Math.max(next, 0);
    updateHitPoints('max', safeMax);

    if (current > safeMax) updateHitPoints('current', safeMax);
  };

  const confirmDeathTimer = (rounds: number) => {
    updateField('condition', 'dying');
    updateField('deathTimer', Math.max(rounds, 0));
    setDeathPromptOpen(false);
    requestSave();
  };

  const decrementDeathTimer = () => {
    if (deathTimer === null) return;
    updateField('deathTimer', Math.max(deathTimer - 1, 0));
    requestSave();
  };

  // Declarar morto: estado terminal (reversível depois).
  const declareDeath = () => {
    updateField('condition', 'dead');
    requestSave();
  };

  // Levantar antes do fim: estabiliza com PV 0 (sem risco de morte).
  const stabilize = () => {
    updateField('condition', 'stabilized');
    updateField('deathTimer', null);
    requestSave();
  };

  // Reverter a morte → volta como estabilizado (0 PV).
  const revertDeath = () => {
    updateField('condition', 'stabilized');
    updateField('deathTimer', null);
    requestSave();
  };

  return {
    current,
    max,
    deathTimer,
    condition,
    isTimeUp,
    isDeathPromptOpen,
    setCurrent,
    setMax,
    adjustCurrent,
    confirmDeathTimer,
    decrementDeathTimer,
    declareDeath,
    stabilize,
    revertDeath,
    openDeathPrompt: () => setDeathPromptOpen(true),
    closeDeathPrompt: () => setDeathPromptOpen(false),
  };
};
