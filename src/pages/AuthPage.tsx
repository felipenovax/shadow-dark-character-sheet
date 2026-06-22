// libs
import { useState, type FormEvent } from 'react';

// ui
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';

// lib
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'signup';

export const AuthPage = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === 'login';

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'signup' : 'login'));
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Sucesso: onAuthStateChange assume a navegação.
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // Sem sessão = confirmação de e-mail ativa no projeto.
        if (!data.session) {
          setNotice('Conta criada. Verifique seu e-mail para confirmar.');
        }
      }
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : 'Falha na autenticação.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center minH="100vh" bg="surface.bg" px="1rem">
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="surface.panel"
        borderColor="surface.border"
        borderWidth="2px"
        borderRadius="0.75rem"
        p="2rem"
        w="100%"
        maxW="22rem"
      >
        <Stack gap="1.25rem">
          <Heading
            size="lg"
            color="brand.accent"
            letterSpacing="0.04em"
            textAlign="center"
          >
            ShadowDark
          </Heading>

          <Text color="fg.muted" fontSize="0.875rem" textAlign="center">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </Text>

          <Stack gap="0.75rem">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              required
              autoComplete="email"
              bg="surface.raised"
              borderColor="surface.border"
              onChange={(event) => setEmail(event.currentTarget.value)}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              required
              minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              bg="surface.raised"
              borderColor="surface.border"
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          </Stack>

          {error && (
            <Text color="red.500" fontSize="0.8125rem">
              {error}
            </Text>
          )}

          {notice && (
            <Text color="green.600" fontSize="0.8125rem">
              {notice}
            </Text>
          )}

          <Button
            type="submit"
            colorPalette="purple"
            loading={isLoading}
            w="100%"
          >
            {isLogin ? 'Entrar' : 'Criar conta'}
          </Button>

          <Button variant="ghost" size="sm" onClick={toggleMode}>
            {isLogin
              ? 'Não tem conta? Cadastre-se'
              : 'Já tem conta? Entrar'}
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};
