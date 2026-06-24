// ui
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { LuMinus, LuPlus, LuTrash2 } from 'react-icons/lu';

// types
import type { InventoryItem } from '@/types/character';

// constants
import { isQualityItem, ITEM_QUALITY_LABELS } from '@/constants/items';

type Props = {
  item: InventoryItem;
  index: number;
  isEditing: boolean;
  free: number;
  onSetQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
};

const slotsLabel = (slots: number): string =>
  `${slots} ${slots === 1 ? 'espaço' : 'espaços'}`;

const formatBonus = (bonus?: number): string => {
  if (!bonus) return '';
  return bonus > 0 ? `+${bonus}` : `${bonus}`;
};

export const InventoryItemRow = ({
  item,
  index,
  isEditing,
  free,
  onSetQuantity,
  onRemove,
}: Props) => {
  const isQuality = isQualityItem(item.category);
  const isWeapon = item.category === 'weapon';

  // Dano/CA + bônus exibidos ao lado do nome (armas/armaduras).
  const stat = isWeapon ? item.damage : item.ac;
  const statText = isQuality
    ? `${isWeapon ? '' : 'CA '}${stat ?? ''} ${formatBonus(item.bonus)}`.trim()
    : '';

  const subtitle = isQuality
    ? `${item.quality ? `${ITEM_QUALITY_LABELS[item.quality]} • ` : ''}${slotsLabel(item.slots)}`
    : slotsLabel(item.quantity * item.slots);

  return (
    <Flex align="center" gap="0.5rem">
      <Box flex="1" minW="0">
        <Text fontSize="0.875rem" fontWeight="bold">
          {item.name}
          {statText && (
            <Text as="span" color="brand.accent" ml="0.375rem">
              {statText}
            </Text>
          )}
          {!isQuality && item.quantity > 1 && (
            <Text as="span" color="fg.muted" fontWeight="normal">
              {' '}
              ×{item.quantity}
            </Text>
          )}
        </Text>
        <Text fontSize="0.6875rem" color="fg.muted">
          {subtitle}
        </Text>
      </Box>

      {isEditing && (
        <Flex align="center" gap="0.25rem">
          {!isQuality && (
            <>
              <IconButton
                aria-label="Diminuir quantidade"
                size="2xs"
                variant="outline"
                colorPalette="gray"
                onClick={() => onSetQuantity(index, item.quantity - 1)}
              >
                <LuMinus />
              </IconButton>
              <Text fontSize="0.875rem" minW="1.25rem" textAlign="center">
                {item.quantity}
              </Text>
              <IconButton
                aria-label="Aumentar quantidade"
                size="2xs"
                variant="outline"
                colorPalette="green"
                disabled={item.slots > free}
                onClick={() => onSetQuantity(index, item.quantity + 1)}
              >
                <LuPlus />
              </IconButton>
            </>
          )}
          <IconButton
            aria-label="Remover item"
            size="2xs"
            variant="ghost"
            colorPalette="gray"
            onClick={() => onRemove(index)}
          >
            <LuTrash2 />
          </IconButton>
        </Flex>
      )}
    </Flex>
  );
};
