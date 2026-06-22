// libs
import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';

// ui
import { Button, Center, Flex, Spinner, Text } from '@chakra-ui/react';

// pages
import { AuthPage } from '@/pages/AuthPage';
import { CharacterListPage } from '@/pages/CharacterListPage';
import { CharacterSheetPage } from '@/pages/CharacterSheetPage';

// lib
import { supabase } from '@/lib/supabase';

// hooks
import { useAuthSession } from '@/hooks/useAuthSession';
import {
  useCharacterRoster,
  type CharacterRoster,
} from '@/hooks/useCharacterRoster';

const signOut = () => {
  void supabase.auth.signOut();
};

const ListRoute = ({ roster }: { roster: CharacterRoster }) => {
  const navigate = useNavigate();

  return (
    <CharacterListPage
      characters={roster.roster.characters}
      onSelect={(id) => navigate(`/character/${id}`)}
      onCreate={() => navigate(`/character/${roster.createCharacter()}`)}
      onDelete={roster.deleteCharacter}
      onSignOut={signOut}
    />
  );
};

const SheetRoute = ({ roster }: { roster: CharacterRoster }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const exists = roster.roster.characters.some((char) => char.id === id);

  // Aponta os updaters/save para a ficha da URL.
  useEffect(() => {
    if (id && exists) roster.selectCharacter(id);
  }, [id, exists, roster]);

  // URL inválida (ficha inexistente) → volta para a lista.
  if (!exists) return <Navigate to="/" replace />;

  // Espera o activeId sincronizar com a URL antes de renderizar a ficha.
  if (roster.roster.activeId !== id) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Spinner color="brand.accent" size="lg" />
      </Center>
    );
  }

  return <CharacterSheetPage roster={roster} onBack={() => navigate('/')} />;
};

// App autenticado: dados + rotas. Só monta quando há usuário logado.
const AuthedApp = () => {
  const roster = useCharacterRoster();

  if (!roster.isReady) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Spinner color="brand.accent" size="lg" />
      </Center>
    );
  }

  if (roster.error) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Flex direction="column" align="center" gap="1rem">
          <Text color="fg.muted">{roster.error}</Text>
          <Button colorPalette="purple" onClick={() => location.reload()}>
            Tentar novamente
          </Button>
        </Flex>
      </Center>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListRoute roster={roster} />} />
        <Route path="/character/:id" element={<SheetRoute roster={roster} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export const App = () => {
  const { user, loading } = useAuthSession();

  if (loading) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Spinner color="brand.accent" size="lg" />
      </Center>
    );
  }

  if (!user) return <AuthPage />;

  return <AuthedApp />;
};
