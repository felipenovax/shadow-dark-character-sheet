// libs
import { useState, type ReactNode } from 'react';

// ui
import { Flex, IconButton } from '@chakra-ui/react';
import { LuPencil, LuSave } from 'react-icons/lu';

// components
import { SectionCard } from '@/components/ui/SectionCard';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';
import { SectionEditProvider } from '@/contexts/SectionEditContext';

type Props = {
  title?: string;
  // Ações extras dependentes do modo (ex.: botão "+"), exibidas antes do toggle.
  action?: (isEditing: boolean) => ReactNode;
  // children pode ser um nó comum ou um render-prop que recebe o modo de edição.
  children: ReactNode | ((isEditing: boolean) => ReactNode);
};

export const EditableSection = ({ title, action, children }: Props) => {
  const { saveActiveCharacter } = useCharacterSheetContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editar não persiste nada; o POST acontece só ao concluir (salvar).
  const handleToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsSaving(true);
    try {
      await saveActiveCharacter();
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const content = typeof children === 'function' ? children(isEditing) : children;

  const header = (
    <Flex align="center" gap="0.25rem">
      {action?.(isEditing)}
      <IconButton
        aria-label={isEditing ? 'Salvar seção' : 'Editar seção'}
        size="xs"
        variant="ghost"
        colorPalette="purple"
        loading={isSaving}
        onClick={handleToggle}
      >
        {isEditing ? <LuSave /> : <LuPencil />}
      </IconButton>
    </Flex>
  );

  return (
    <SectionCard title={title} action={header}>
      <SectionEditProvider value={isEditing}>{content}</SectionEditProvider>
    </SectionCard>
  );
};
