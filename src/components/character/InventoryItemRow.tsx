// ui
import { Badge, Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { LuMinus, LuPlus, LuTrash2 } from 'react-icons/lu';

// types
import type { InventoryItem } from '@/types/character';

// constants
import {
  isEquippableArmor,
  isQualityItem,
  ITEM_QUALITY_LABELS,
} from '@/constants/items';

type Props = {
  item: InventoryItem;
  index: number;
  isEditing: boolean;
  free: number;
  onSetQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onToggleEquip: (index: number) => void;
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
  onToggleEquip,
}: Props) => {
  const isQuality = isQualityItem(item.category);
  const isWeapon = item.category === 'weapon';
  const isEquip = isEquippableArmor(item);

  // Dano/CA + bônus exibidos ao lado do nome (armas/armaduras).
  const statText = isWeapon
    ? `${item.damage ?? ''} ${formatBonus(item.bonus)}`.trim()
    : item.category === 'armor'
      ? `CA ${item.ac ?? ''}${item.acAddsDex ? ' + DES' : ''} ${formatBonus(item.bonus)}`.trim()
      : '';

  const subtitle = isQuality
    ? `${item.quality ? `${ITEM_QUALITY_LABELS[item.quality]} • ` : ''}${slotsLabel(item.slots)}`
    : slotsLabel(item.quantity * item.slots);

  return (
    <Flex align="center" gap="0.5rem">
      <Box
        flex="1"
        minW="0"
        cursor={isEquip ? 'pointer' : undefined}
        title={isEquip ? (item.equipped ? 'Desequipar' : 'Equipar') : undefined}
        onClick={isEquip ? () => onToggleEquip(index) : undefined}
      >
        <Text fontSize="0.875rem" fontWeight="bold">
          {item.name}
          {item.nickname && (
            <Badge ml="0.375rem" colorPalette="purple" variant="surface">
              {item.nickname}
            </Badge>
          )}
          {isEquip && (
            <Badge
              ml="0.375rem"
              colorPalette={item.equipped ? 'green' : 'gray'}
              variant="surface"
            >
              {item.equipped ? 'Equipada' : 'Não equipada'}
            </Badge>
          )}
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
