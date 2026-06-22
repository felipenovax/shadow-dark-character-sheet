// ui
import {
  Portal,
  Select,
  Stack,
  Text,
  createListCollection,
} from '@chakra-ui/react';

// constants
import { BACKGROUND_OPTIONS } from '@/constants/character';

type Props = {
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
};

const collection = createListCollection({ items: BACKGROUND_OPTIONS });

export const BackgroundField = ({ isEditing, value, onChange }: Props) => {
  const selected = BACKGROUND_OPTIONS.find((option) => option.value === value);

  if (!isEditing) {
    return (
      <Stack gap="0.125rem">
        <Text
          fontSize="1rem"
          fontWeight="bold"
          color={selected ? 'fg' : 'fg.muted'}
        >
          {selected?.label ?? '—'}
        </Text>
        {selected && (
          <Text fontSize="x-small" color="fg.muted">
            {selected.description}
          </Text>
        )}
      </Stack>
    );
  }

  return (
    <Select.Root
      collection={collection}
      value={value ? [value] : []}
      onValueChange={(details) => onChange(details.value[0] ?? '')}
      size="sm"
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger bg="surface.raised" borderColor="surface.border">
          <Select.ValueText placeholder="Selecione um antecedente" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {BACKGROUND_OPTIONS.map((option) => (
              <Select.Item key={option.value} item={option}>
                <Stack gap="0.125rem">
                  <Text fontWeight="medium">{option.label}</Text>
                  <Text fontSize="0.75rem" color="fg.muted">
                    {option.description}
                  </Text>
                </Stack>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};
