// libs
import { useEffect, useState } from 'react';
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
import { ColorModeButton } from '@/components/ui/color-mode';

// pages
import { AdventureDetailPage } from '@/pages/AdventureDetailPage';
import { AdventuresPage } from '@/pages/AdventuresPage';
import { AuthPage } from '@/pages/AuthPage';
import { CharacterListPage } from '@/pages/CharacterListPage';
import { CharacterSheetPage } from '@/pages/CharacterSheetPage';
import { CharacterCreationPage } from '@/pages/CharacterCreationPage';

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
      characters={roster.ownedCharacters}
      onSelect={(id) => navigate(`/character/${id}`)}
      onCreate={() => navigate(`/characters/create`)}
      onDelete={roster.deleteCharacter}
      onOpenAdventures={() => navigate('/adventures')}
      onImport={async (characters) => {
        // Save them sequentially to avoid race conditions on the DB constraints
        for (const char of characters) {
          await roster.saveNewCharacter(char);
        }
        // Refresh the list locally to convert new paths into Signed URLs without a full page reload
        await roster.refreshList();
      }}
      onSignOut={signOut}
    />
  );
};

const AdventuresRoute = ({
  roster,
  userId,
}: {
  roster: CharacterRoster;
  userId: string;
}) => {
  const navigate = useNavigate();

  return (
    <AdventuresPage
      userId={userId}
      ownedCharacters={roster.ownedCharacters}
      onOpenAdventure={(id) => navigate(`/adventures/${id}`)}
      onBack={() => navigate('/')}
    />
  );
};

const AdventureDetailRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return <Navigate to="/adventures" replace />;

  return (
    <AdventureDetailPage
      adventureId={id}
      onOpenCharacter={(charId) => navigate(`/character/${charId}`)}
      onBack={() => navigate('/adventures')}
    />
  );
};

const SheetRoute = ({ roster }: { roster: CharacterRoster }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ok' | 'notfound'>(
    'loading',
  );

  const { loadCharacter } = roster;

  // Carrega a ficha sob demanda (própria ou de jogador, se eu for o mestre).
  useEffect(() => {
    let active = true;
    if (!id) return;

    setStatus('loading');
    loadCharacter(id).then((ok) => {
      if (active) setStatus(ok ? 'ok' : 'notfound');
    });

    return () => {
      active = false;
    };
  }, [id, loadCharacter]);

  if (status === 'notfound') return <Navigate to="/" replace />;

  if (status === 'loading' || roster.roster.activeId !== id) {
    return (
      <Center minH="100vh" bg="surface.bg">
        <Spinner color="brand.accent" size="lg" />
      </Center>
    );
  }

  return <CharacterSheetPage roster={roster} onBack={() => navigate(-1)} />;
};

const CharacterCreationRoute = ({ roster }: { roster: CharacterRoster }) => {
  const navigate = useNavigate();
  return (
    <CharacterCreationPage
      onComplete={async (character) => {
        await roster.saveNewCharacter(character);
        navigate(`/character/${character.id}`);
      }}
      onCancel={() => navigate('/')}
      onOpenAdventures={() => navigate('/adventures')}
      onSignOut={signOut}
    />
  );
};

// App autenticado: dados + rotas. Só monta quando há usuário logado.
const AuthedApp = ({ userId }: { userId: string }) => {
  const roster = useCharacterRoster(userId);

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
        <Route
          path="/adventures"
          element={<AdventuresRoute roster={roster} userId={userId} />}
        />
        <Route path="/adventures/:id" element={<AdventureDetailRoute />} />
        <Route path="/character/:id" element={<SheetRoute roster={roster} />} />
        <Route path="/characters/create" element={<CharacterCreationRoute roster={roster} />} />
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

  return (
    <>
      {!user ? <AuthPage /> : <AuthedApp userId={user.id} />}
      <ColorModeButton
        position="fixed"
        bottom="1.5rem"
        right="1.5rem"
        zIndex="2000"
        bg="surface.panel"
        borderColor="surface.border"
        borderWidth="1px"
        boxShadow="md"
        _hover={{ bg: 'surface.raised' }}
      />
    </>
  );
};
