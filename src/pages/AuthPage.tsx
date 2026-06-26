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
  Alert,
  Link,
  IconButton,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';

// lib
import { supabase } from '@/lib/supabase';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type Mode = 'login' | 'signup';

export const AuthPage = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === 'login';

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'signup' : 'login'));
    setError(null);
    setNotice(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('E-mail inválido. Verifique o formato do endereço.');
      return;
    }

    if (!password) {
      setError('A senha não pode estar em branco.');
      return;
    }

    if (!isLogin) {
      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }

      const hasLetters = /[a-zA-Z]/.test(password);
      const hasNumbers = /\d/.test(password);
      
      if (!hasLetters || !hasNumbers) {
        setError('A senha deve conter pelo menos uma letra e um número para sua segurança.');
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas digitadas não coincidem. Verifique e tente novamente.');
        return;
      }
    } else {
      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
    }

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
      let message =
        caught instanceof Error ? caught.message : 'Falha na autenticação.';
      
      if (message.includes('Invalid login credentials')) {
        message = 'E-mail ou senha incorretos.';
      } else if (message.includes('Password should be at least 6 characters')) {
        message = 'A senha deve ter no mínimo 6 caracteres.';
      } else if (message.includes('User already registered')) {
        message = 'Não foi possível criar a sua conta.';
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box position="relative" minH="100vh" overflow="hidden">
      <Box
        position="absolute"
        inset="0"
        bgImage="url('/bg-login.jpg')"
        style={{
          backgroundColor: 'black',
          backgroundSize: 'auto 100vh',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center'
        }}
      />

      <Center minH="100vh" px="1rem" position="relative" zIndex="1">
        <Box
          as="form"
          onSubmit={handleSubmit}
          {...({ noValidate: true } as any)}
          bg="surface.bg"
          backdropFilter="blur(16px)"
          borderColor={useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0.1)')}
          borderWidth="1px"
          borderRadius="0.75rem"
          p="1.5rem 2rem"
          w="100%"
          maxW="24rem"
          boxShadow="xl"
        >
          <Stack gap="2rem">
            <Stack gap="0.25rem">
              <Heading
                size="xl"
                color="brand.accent"
                letterSpacing="0.04em"
                textAlign="center"
              >
                ShadowDark
              </Heading>

              <Text color="fg.muted" fontSize="0.875rem" textAlign="center">
                {isLogin ? 'Entre na sua conta' : 'Crie a sua conta Agora!'}
              </Text>
            </Stack>

            <Stack gap="1rem">
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                required
                autoComplete="email"
                bg="surface.raised"
                color="fg"
                borderColor="surface.border"
                _focus={{ bg: 'surface.bg' }}
                onChange={(event) => {
                  setEmail(event.currentTarget.value);
                  setError(null);
                  setNotice(null);
                }}
              />
              <Box position="relative">
                <Input
                  type={!isLogin && showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  value={password}
                  required
                  minLength={6}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  bg="surface.raised"
                  color="fg"
                  borderColor="surface.border"
                  _focus={{ bg: 'surface.bg' }}
                  pr={!isLogin ? '4.5rem' : undefined}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                    setError(null);
                    setNotice(null);
                  }}
                />
                {!isLogin && (
                  <IconButton
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    variant="ghost"
                    size="sm"
                    position="absolute"
                    right="0.25rem"
                    top="50%"
                    transform="translateY(-50%)"
                    color="fg.muted"
                    _hover={{ color: 'fg', bg: 'transparent' }}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </IconButton>
                )}
              </Box>

              {!isLogin && (
                <Box position="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    bg="surface.raised"
                    color="fg"
                    borderColor="surface.border"
                    _focus={{ bg: 'surface.bg' }}
                    pr="4.5rem"
                    onChange={(event) => {
                      setConfirmPassword(event.currentTarget.value);
                      setError(null);
                      setNotice(null);
                    }}
                  />
                  <IconButton
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    variant="ghost"
                    size="sm"
                    position="absolute"
                    right="0.25rem"
                    top="50%"
                    transform="translateY(-50%)"
                    color="fg.muted"
                    _hover={{ color: 'fg', bg: 'transparent' }}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </IconButton>
                </Box>
              )}
            </Stack>

            {error && (
              <Alert.Root status="error" variant="subtle" borderRadius="0.375rem" w="100%">
                <Alert.Indicator />
                <Alert.Content flex="1">
                  <Alert.Title fontSize="0.875rem" fontWeight="normal" lineHeight="1.4">
                    {error}
                  </Alert.Title>
                </Alert.Content>
              </Alert.Root>
            )}

            {notice && (
              <Text color={useColorModeValue('green.600', 'green.300')} fontSize="0.8125rem">
                {notice}
              </Text>
            )}

            <Button
              type="submit"
              colorPalette="purple"
              loading={isLoading}
              w="100%"
              size="lg"
              mt="0.5rem"
            >
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>

            <Stack align="center" gap="0.75rem" mt="0.5rem">
              <Text color="fg.muted" fontSize="0.875rem">
                {isLogin ? (
                  <>
                    <Text as="span" fontWeight="normal" mr="0.25rem">Não tem conta?</Text>
                    <Link fontWeight="bold" cursor="pointer" onClick={toggleMode}>Cadastre-se</Link>
                  </>
                ) : (
                  <>
                    <Text as="span" fontWeight="normal" mr="0.25rem">Já tem conta?</Text>
                    <Link fontWeight="bold" cursor="pointer" onClick={toggleMode}>Entrar</Link>
                  </>
                )}
              </Text>

              {isLogin && (
                <Link
                  color="fg.muted"
                  fontSize="0.8125rem"
                  fontWeight="normal"
                  cursor="pointer"
                  _hover={{ color: 'fg', textDecoration: 'underline' }}
                >
                  Esqueci a minha senha
                </Link>
              )}
            </Stack>
          </Stack>
        </Box>
      </Center>
    </Box>
  );
};
