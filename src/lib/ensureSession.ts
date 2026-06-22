// libs
import type { User } from '@supabase/supabase-js';

// lib
import { supabase } from '@/lib/supabase';

// Garante uma sessão anônima persistente e retorna o usuário atual.
// Cada navegador/dispositivo recebe seu próprio usuário anônimo.
export const ensureSession = async (): Promise<User> => {
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    return data.session.user;
  }

  const { data: signInData, error } = await supabase.auth.signInAnonymously();

  if (error || !signInData.user) {
    throw error ?? new Error('Não foi possível iniciar a sessão anônima.');
  }

  return signInData.user;
};
