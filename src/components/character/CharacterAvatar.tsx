// libs
import { useState, useRef, type ChangeEvent } from 'react';

// ui
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
} from '@chakra-ui/react';
import { LuImagePlus, LuTrash2 } from 'react-icons/lu';

// utils
import { removeAvatar, uploadAvatar } from '@/utils/uploadAvatar';

type Props = {
  name: string;
  avatar: string;
  characterId: string;
  isEditing: boolean;
  onChange: (avatar: string) => void;
};

const sharedFrameStyles = {
  borderRadius: '0.75rem',
  borderWidth: '1px',
  borderColor: 'surface.border',
} as const;

export const CharacterAvatar = ({
  name,
  avatar,
  characterId,
  isEditing,
  onChange,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const initial = (name.trim().charAt(0) || '?').toUpperCase();

  const handleSelectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = ''; // permite reenviar o mesmo arquivo

    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadAvatar(file, characterId);
      onChange(publicUrl);
    } catch {
      // falha de upload não deve quebrar a UI
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeAvatar(characterId);
    } catch {
      // segue limpando a referência mesmo se o objeto já não existir
    }
    onChange('');
  };

  return (
    <Box
      w={{ base: '100%', md: '8rem' }}
      display={isEditing ? "grid" : "flex"}
      width="100%"
      justifyContent={{ base: 'center', md: undefined }}
    >
      <AspectRatio ratio={4 / 5} h="274px" w="220px">
        {avatar ? (
          <Image
            src={avatar}
            alt={`Retrato de ${name || 'personagem'}`}
            objectFit="cover"
            {...sharedFrameStyles}
            w="100%"
          />
        ) : (
          <Flex
            align="center"
            justify="center"
            bg="surface.raised"
            {...sharedFrameStyles}
          >
            <Heading size="3xl" color="brand.accent">
              {initial}
            </Heading>
          </Flex>
        )}
      </AspectRatio>

      {isEditing && (
        <Flex gap="0.5rem" mt="0.5rem">
          <Button
            size="xs"
            variant="outline"
            colorPalette="purple"
            flex="1"
            loading={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <LuImagePlus />
            Imagem
          </Button>

          {avatar && (
            <IconButton
              aria-label="Remover imagem"
              size="xs"
              variant="ghost"
              colorPalette="gray"
              disabled={isUploading}
              onClick={handleRemove}
            >
              <LuTrash2 />
            </IconButton>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleSelectFile}
          />
        </Flex>
      )}
    </Box>
  );
};
