// libs
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

// lib
import { supabase } from '@/lib/supabase';

// Considera autenticado apenas quem tem conta de verdade (ignora sessões
// anônimas legadas, que devem cair na tela de login).
const toAccountUser = (user: User | null | undefined): User | null => {
  if (!user || user.is_anonymous) return null;
  return user;
};

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(toAccountUser(data.session?.user));
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAccountUser(session?.user));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return { user, loading };
};
