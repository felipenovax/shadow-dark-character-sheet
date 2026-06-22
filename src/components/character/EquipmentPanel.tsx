// libs
import { useState } from 'react';

// ui
import { Box, Flex, IconButton, Input, NativeSelect, Stack, Text } from '@chakra-ui/react';
import { LuMinus, LuPlus, LuTrash2 } from 'react-icons/lu';

// components
import { EditableSection } from '@/components/character/EditableSection';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// constants
import { getInventorySlotCount, getUsedSlots } from '@/constants/character';
import {
  CATALOG_BY_CATEGORY,
  getCatalogItem,
  ITEM_CATEGORY_LABELS,
} from '@/constants/items';

export const EquipmentPanel = () => {
  const {
    character,
    updateField,
    addInventoryItem,
    setInventoryQuantity,
    removeInventoryItem,
  } = useCharacterSheetContext();

  const [selectedId, setSelectedId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customSlots, setCustomSlots] = useState(1);

  const capacity = getInventorySlotCount(character.abilities.for.score);
  const used = getUsedSlots(character.inventory);
  const free = capacity - used;
  const isOver = used > capacity;

  const selectedItem = getCatalogItem(selectedId);
  const canAddSelected = !!selectedItem && selectedItem.slots <= free;
  const canAddCustom = customName.trim() !== '' && customSlots > 0 && customSlots <= free;

  const handleAddCatalog = () => {
    if (!selectedItem || selectedItem.slots > free) return;
    addInventoryItem({
      itemId: selectedItem.id,
      name: selectedItem.name,
      slots: selectedItem.slots,
    });
    setSelectedId('');
  };

  const handleAddCustom = () => {
    if (!canAddCustom) return;
    addInventoryItem({ itemId: null, name: customName.trim(), slots: customSlots });
    setCustomName('');
    setCustomSlots(1);
  };

  return (
    <EditableSection title="Equipamento">
      {(isEditing) => (
        <>
          <Flex align="center" justify="space-between">
            <StatLabel>Inventário</StatLabel>
            <Text
              fontSize="0.75rem"
              fontWeight="bold"
              color={isOver ? 'red.500' : 'fg.muted'}
            >
              {used}/{capacity} espaços
            </Text>
          </Flex>

          <Stack gap="0.375rem">
            {character.inventory.length === 0 && (
              <Text color="fg.muted" fontSize="0.875rem">
                Nenhum item no inventário.
              </Text>
            )}

            {character.inventory.map((item, index) => (
              <Flex key={index} align="center" gap="0.5rem">
                <Box flex="1">
                  <Text fontSize="0.875rem" fontWeight="bold">
                    {item.name}
                    {item.quantity > 1 && (
                      <Text as="span" color="fg.muted" fontWeight="normal">
                        {' '}
                        ×{item.quantity}
                      </Text>
                    )}
                  </Text>
                  <Text fontSize="0.6875rem" color="fg.muted">
                    {item.quantity * item.slots}{' '}
                    {item.quantity * item.slots === 1 ? 'espaço' : 'espaços'}
                  </Text>
                </Box>

                {isEditing && (
                  <Flex align="center" gap="0.25rem">
                    <IconButton
                      aria-label="Diminuir quantidade"
                      size="2xs"
                      variant="outline"
                      colorPalette="gray"
                      onClick={() =>
                        setInventoryQuantity(index, item.quantity - 1)
                      }
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
                      onClick={() =>
                        setInventoryQuantity(index, item.quantity + 1)
                      }
                    >
                      <LuPlus />
                    </IconButton>
                    <IconButton
                      aria-label="Remover item"
                      size="2xs"
                      variant="ghost"
                      colorPalette="gray"
                      onClick={() => removeInventoryItem(index)}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </Flex>
                )}
              </Flex>
            ))}
          </Stack>

          {isEditing && (
            <Stack
              gap="0.5rem"
              borderTopWidth="1px"
              borderColor="surface.border"
              pt="0.5rem"
            >
              <Flex gap="0.5rem">
                <NativeSelect.Root size="sm" flex="1">
                  <NativeSelect.Field
                    value={selectedId}
                    bg="surface.raised"
                    borderColor="surface.border"
                    onChange={(event) => setSelectedId(event.currentTarget.value)}
                  >
                    <option value="">Escolha um item…</option>
                    {CATALOG_BY_CATEGORY.map(({ category, items }) => (
                      <optgroup
                        key={category}
                        label={ITEM_CATEGORY_LABELS[category]}
                      >
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} — {item.slots}{' '}
                            {item.slots === 1 ? 'esp.' : 'esp.'}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <IconButton
                  aria-label="Adicionar item do catálogo"
                  size="sm"
                  colorPalette="purple"
                  disabled={!canAddSelected}
                  onClick={handleAddCatalog}
                >
                  <LuPlus />
                </IconButton>
              </Flex>

              <Flex gap="0.5rem">
                <Input
                  size="sm"
                  flex="1"
                  placeholder="Item personalizado"
                  value={customName}
                  bg="surface.raised"
                  borderColor="surface.border"
                  onChange={(event) => setCustomName(event.currentTarget.value)}
                />
                <NativeSelect.Root size="sm" maxW="6.5rem">
                  <NativeSelect.Field
                    value={String(customSlots)}
                    bg="surface.raised"
                    borderColor="surface.border"
                    onChange={(event) =>
                      setCustomSlots(Number(event.currentTarget.value))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value} esp.
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <IconButton
                  aria-label="Adicionar item personalizado"
                  size="sm"
                  colorPalette="purple"
                  disabled={!canAddCustom}
                  onClick={handleAddCustom}
                >
                  <LuPlus />
                </IconButton>
              </Flex>

              {free <= 0 && (
                <Text fontSize="0.75rem" color="red.500">
                  Sem espaço livre — aumente a Força ou remova itens.
                </Text>
              )}
            </Stack>
          )}

          <Box>
            <StatLabel>Carga Livre</StatLabel>
            <SheetField
              isEditing={isEditing}
              value={character.freeCarry}
              placeholder="Itens de carga livre"
              onChange={(value) => updateField('freeCarry', value)}
              textProps={{ fontSize: '0.875rem' }}
            />
          </Box>
        </>
      )}
    </EditableSection>
  );
};
