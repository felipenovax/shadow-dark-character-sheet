// libs
import { useRef, type ChangeEvent } from 'react';

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
import { readImageFile } from '@/utils/readImageFile';

type Props = {
  name: string;
  avatar: string;
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
  isEditing,
  onChange,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const initial = (name.trim().charAt(0) || '?').toUpperCase();

  const handleSelectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    const dataUrl = await readImageFile(file);
    onChange(dataUrl);
    event.currentTarget.value = ''; // permite reenviar o mesmo arquivo
  };

  return (
    <Box w={{ base: '100%', md: '8rem' }}>
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
              onClick={() => onChange('')}
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
