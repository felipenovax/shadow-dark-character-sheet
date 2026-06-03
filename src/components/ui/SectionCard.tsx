// libs
import type { ReactNode } from 'react';

// ui
import { Card } from '@chakra-ui/react';

// components
import { StatLabel } from '@/components/ui/StatLabel';

type Props = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
};

export const SectionCard = ({ title, action, children }: Props) => {
  const hasHeader = Boolean(title || action);

  return (
    <Card.Root
      bg="surface.panel"
      borderColor="surface.border"
      borderWidth="2px"
      borderRadius="0.75rem"
      overflow="hidden"
    >
      <Card.Body p="1rem" display="flex" flexDirection="column" gap="0.75rem">
        {hasHeader && (
          <Card.Header
            p="0"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="0.75rem"
          >
            {title && <StatLabel>{title}</StatLabel>}
            {action}
          </Card.Header>
        )}

        {children}
      </Card.Body>
    </Card.Root>
  );
};
