import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Image,
  Portal,
  SimpleGrid,
  Text,
  Link,
} from '@chakra-ui/react';
import { LuLogOut, LuPlus, LuSwords, LuTrash2, LuDownload, LuUpload, LuCheck } from 'react-icons/lu';
import { useState, useRef, useEffect } from 'react';
import { ActionBar } from '@/components/ActionBar';
import { createId } from '@/utils/createId';
import { uploadAvatar } from '@/utils/uploadAvatar';

// types
import type { Character } from '@/types/character';

type Props = {
  characters: Character[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onOpenAdventures: () => void;
  onImport: (characters: Character[]) => Promise<void>;
  onSignOut: () => void;
};

const CharacterCard = ({
  character,
  isExportMode,
  isSelected,
  onToggleSelect,
  onSelect,
  onDelete,
}: {
  character: Character;
  isExportMode: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const initial = (character.name.trim().charAt(0) || '?').toUpperCase();
  const [isHovered, setIsHovered] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);

  const handleTouchStart = () => {
    didLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      setIsLongPressed(true);
      didLongPressRef.current = true;
    }, 2000);
  };

  const handleTouchEndOrMove = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = () => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    if (isExportMode && onToggleSelect) {
      onToggleSelect(character.id);
    } else {
      onSelect(character.id);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsLongPressed(false);
    handleTouchEndOrMove();
  };

  return (
    <Card.Root
      position="relative"
      flexDirection="row"
      bg="surface.panel"
      borderColor={isSelected ? 'brand.accent' : 'surface.border'}
      borderWidth="2px"
      borderRadius="0.5rem"
      minH="200px"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s ease"
      boxShadow={isSelected ? '0 0 0 2px var(--chakra-colors-brand-accent)' : 'none'}
      _hover={{ borderColor: isSelected ? 'brand.accent' : 'surface.borderFocus' }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEndOrMove}
      onTouchMove={handleTouchEndOrMove}
    >
      {character.avatar ? (
        <Image
          objectFit="cover"
          w={{ base: '120px', sm: '150px' }}
          minW={{ base: '120px', sm: '150px' }}
          minH="200px"
          src={character.avatar}
          alt={character.name}
        />
      ) : (
        <Flex
          w={{ base: '120px', sm: '150px' }}
          minW={{ base: '120px', sm: '150px' }}
          minH="200px"
          align="center"
          justify="center"
          bg="surface.raised"
        >
          <Heading size="2xl" color="brand.accent">
            {initial}
          </Heading>
        </Flex>
      )}

      <Box flex="1" display="flex" flexDirection="column" minW="0">
        <Card.Body p="1.25rem" flex="1">
          <Flex justify="space-between" align="flex-start" mb="0.25rem" gap="0.5rem">
            <Card.Title as="h3" mb="0" truncate>
              {character.name || 'Sem nome'}
            </Card.Title>
            {isExportMode ? (
              <Box
                position="absolute"
                top="0.5rem"
                right="0.5rem"
                w="1.25rem"
                h="1.25rem"
                borderRadius="0.25rem"
                borderWidth="2px"
                borderColor={isSelected ? "brand.accent" : "surface.borderFocus"}
                bg={isSelected ? "brand.accent" : "transparent"}
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s ease"
              >
                {isSelected && <LuCheck size="0.875rem" />}
              </Box>
            ) : (
              (isHovered || isLongPressed) && (
                <IconButton
                  position="absolute"
                  top="0.25rem"
                  right="0.25rem"
                  aria-label="Excluir personagem"
                  size="xs"
                  variant="ghost"
                  color="fg"
                  _hover={{ color: 'red.500', bg: 'transparent' }}
                  _active={{ color: 'red.600', bg: 'transparent' }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(character.id);
                  }}
                >
                  <LuTrash2 />
                </IconButton>
              )
            )}
          </Flex>

          <Flex gap="0.5rem" wrap="wrap" mb={character.backstory ? '0.5rem' : '0'}>
            {character.alignment && (
              <Badge size="sm" colorPalette="gray" variant="surface">
                {character.alignment}
              </Badge>
            )}
            {character.ancestry && (
              <Badge size="sm" colorPalette="purple" variant="surface">
                {character.ancestry}
              </Badge>
            )}
            {character.background && (
              <Badge size="sm" colorPalette="blue" variant="surface">
                {character.background}
              </Badge>
            )}
          </Flex>

          {character.backstory && (
            <Text lineClamp={4} fontSize="0.875rem" color="fg.muted">
              {character.backstory}
            </Text>
          )}
        </Card.Body>

        <Card.Footer p="1.25rem" pt="0">
          <Text fontSize="0.75rem" color="fg.muted" fontWeight="medium" truncate>
            {character.class} • Nível {character.level}
          </Text>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
};

export const CharacterListPage = ({
  characters,
  onSelect,
  onCreate,
  onDelete,
  onOpenAdventures,
  onImport,
  onSignOut,
}: Props) => {
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [isExportMode, setIsExportMode] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<string[]>([]);
  const [showExportAlert, setShowExportAlert] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExportMode) {
        setIsExportMode(false);
        setSelectedForExport([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExportMode]);

  const dataUrlToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);
    try {
      const importedCharacters: Character[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();
        const parsed = JSON.parse(text);
        
        const items = Array.isArray(parsed) ? parsed : [parsed];

        for (const item of items) {
          if (!item.id || !item.name) continue;

          // Clona a ficha com um novo ID para evitar colisões
          const newId = createId();
          const clonedCharacter: Character = { ...item, id: newId };

          // Reconverte a base64 para File e sobe pro Supabase de forma segura
          if (clonedCharacter.avatar && clonedCharacter.avatar.startsWith('data:image')) {
            try {
              const imageFile = dataUrlToFile(clonedCharacter.avatar, `avatar_${newId}.png`);
              clonedCharacter.avatar = await uploadAvatar(imageFile, newId);
            } catch (err) {
              console.error('Falha ao re-upar avatar da ficha:', err);
              clonedCharacter.avatar = '';
            }
          } else if (clonedCharacter.avatar && clonedCharacter.avatar.startsWith('data:')) {
            console.warn('Avatar ignorado por conter um formato inválido (ex: erro exportado).');
            clonedCharacter.avatar = '';
          }

          importedCharacters.push(clonedCharacter);
        }
      }

      if (importedCharacters.length > 0) {
        await onImport(importedCharacters);
      } else {
        alert("Nenhum personagem válido encontrado no arquivo.");
      }
    } catch (error) {
      console.error("Falha na importação:", error);
      alert("Erro ao ler o arquivo. Certifique-se de que é um JSON válido.");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleSelectForExport = (id: string) => {
    setSelectedForExport(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const urlToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to convert image to base64", error);
      return url; // fallback
    }
  };

  const handleExportClick = async () => {
    if (!isExportMode) {
      setIsExportMode(true);
      setSelectedForExport([]);
    } else {
      if (selectedForExport.length === 0) {
        setShowExportAlert(true);
      } else {
        setIsExporting(true);
        try {
          const rawCharactersToExport = characters.filter(c => selectedForExport.includes(c.id));
          const charactersToExport = await Promise.all(
            rawCharactersToExport.map(async (char) => {
              const exportChar = { ...char };
              if (exportChar.avatar && exportChar.avatar.startsWith('http')) {
                exportChar.avatar = await urlToBase64(exportChar.avatar);
              }
              return exportChar;
            })
          );

          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(charactersToExport, null, 2));
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute("href", dataStr);
          downloadAnchorNode.setAttribute("download", `shadowdark_export_${new Date().toISOString().split('T')[0]}.json`);
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();

          setIsExportMode(false);
          setSelectedForExport([]);
        } finally {
          setIsExporting(false);
        }
      }
    }
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg="surface.bg"
      color="fg"
      px={{ base: '1rem', md: '2rem' }}
      pt="0.5rem"
      pb="1.5rem"
    >
      <Flex px="1rem" py="0.5rem" mb="1rem" align="center" justify="space-between">
        <Flex gap="0.5rem" align="center" fontSize="lg">
          <Link href="/" color="fg.muted" _hover={{ color: 'fg' }} transition="color 0.2s" outline="none" _focusVisible={{ ring: "2px", ringColor: "colorPalette.focusRing" }}>
            ShadowDark
          </Link>
          <Text color="fg.subtle">/</Text>
          <Text color="brand.accent" fontWeight="bold">
            Personagens
          </Text>
        </Flex>

        <Flex gap="0.5rem" align="center">
          <input
            type="file"
            accept=".json"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileImport}
          />
          <Button
            variant="ghost"
            colorPalette="gray"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            loading={isImporting}
            loadingText="Importando..."
            disabled={isExportMode}
          >
            <LuDownload />
            Importar
          </Button>

          <Button
            variant={isExportMode && selectedForExport.length > 0 ? "solid" : "ghost"}
            colorPalette={isExportMode && selectedForExport.length > 0 ? "purple" : "gray"}
            size="sm"
            onClick={handleExportClick}
            loading={isExporting}
            loadingText="Exportando..."
          >
            <LuUpload />
            {isExportMode ? "Confirmar Exportação" : "Exportar"}
          </Button>

          <Button
            variant="ghost"
            colorPalette="gray"
            size="sm"
            onClick={onSignOut}
          >
            <LuLogOut />
            Sair
          </Button>
        </Flex>
      </Flex>

      {characters.length === 0 ? (
        <Flex direction="column" align="center" justify="center" flexGrow={1} pb="6rem" gap="1rem">
          <Text color="fg.muted">Você ainda não tem personagens.</Text>
          <Button colorPalette="purple" onClick={onCreate}>
            <LuPlus />
            Criar primeiro personagem
          </Button>
        </Flex>
      ) : (
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          gap="1rem"
          w="100%"
          maxW={{ base: "500px", md: "100%" }}
          mx="auto"
        >
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isExportMode={isExportMode}
              isSelected={selectedForExport.includes(character.id)}
              onToggleSelect={toggleSelectForExport}
              onSelect={onSelect}
              onDelete={(id) => setCharacterToDelete(characters.find(c => c.id === id) || null)}
            />
          ))}
        </SimpleGrid>
      )}

      <ActionBar>
        {isExportMode ? (
          <Button
            variant="outline"
            colorPalette="gray"
            flex="1"
            minW="120px"
            onClick={() => {
              setIsExportMode(false);
              setSelectedForExport([]);
            }}
          >
            Cancelar Exportação
          </Button>
        ) : (
          <>
            <Button
              colorPalette="purple"
              flex="1"
              minW="120px"
              onClick={onCreate}
            >
              <LuPlus />
              Novo Personagem
            </Button>
            <Button
              variant="outline"
              colorPalette="purple"
              flex="1"
              minW="120px"
              onClick={onOpenAdventures}
            >
              <LuSwords />
              Aventuras
            </Button>
          </>
        )}
      </ActionBar>

      <Dialog.Root open={!!characterToDelete} onOpenChange={(e) => { if (!e.open) setCharacterToDelete(null); }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="surface.panel" color="fg" borderColor="surface.border" borderWidth="1px" borderRadius="1rem">
              <Dialog.Header>
                <Dialog.Title color="brand.accent">Excluir Personagem</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Tem certeza que deseja banir <strong>{characterToDelete?.name}</strong> para as sombras permanentemente? Esta ação não pode ser desfeita.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="ghost" colorPalette="gray" onClick={() => setCharacterToDelete(null)}>
                  Cancelar
                </Button>
                <Button
                  colorPalette="red"
                  onClick={() => {
                    if (characterToDelete) {
                      onDelete(characterToDelete.id);
                      setCharacterToDelete(null);
                    }
                  }}
                >
                  Excluir
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root open={showExportAlert} onOpenChange={(e) => { if (!e.open) setShowExportAlert(false); }}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="surface.panel" color="fg" borderColor="surface.border" borderWidth="1px" borderRadius="1rem">
              <Dialog.Header>
                <Dialog.Title color="brand.accent">Nenhuma ficha selecionada</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Você precisa selecionar pelo menos um personagem para realizar a exportação. Clique nos cards para marcá-los.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button colorPalette="purple" onClick={() => setShowExportAlert(false)}>
                  Entendi
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
