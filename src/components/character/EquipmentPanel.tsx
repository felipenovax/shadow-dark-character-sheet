// libs
import { useEffect, useState } from 'react';

// ui
import { Box, Flex, IconButton, Input, NativeSelect, Stack, Text } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';

// components
import { EditableSection } from '@/components/character/EditableSection';
import { InventoryItemRow } from '@/components/character/InventoryItemRow';
import { SheetField } from '@/components/ui/SheetField';
import { StatLabel } from '@/components/ui/StatLabel';

// contexts
import { useCharacterSheetContext } from '@/contexts/CharacterSheetContext';

// constants
import { getInventorySlotCount, getUsedSlots } from '@/constants/character';
import {
  CATALOG_BY_CATEGORY,
  getCatalogItem,
  isQualityItem,
  ITEM_CATEGORY_LABELS,
  ITEM_QUALITY_LABELS,
  ITEM_QUALITY_ORDER,
  type ItemQuality,
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
  const [quality, setQuality] = useState<ItemQuality>('normal');
  const [qualName, setQualName] = useState('');
  const [qualStat, setQualStat] = useState(''); // dano (arma) ou CA (armadura)
  const [qualBonus, setQualBonus] = useState('');
  const [customName, setCustomName] = useState('');
  const [customSlots, setCustomSlots] = useState(1);

  const capacity = getInventorySlotCount(character.abilities.for.score);
  const used = getUsedSlots(character.inventory);
  const free = capacity - used;
  const isOver = used > capacity;

  const selectedItem = getCatalogItem(selectedId);
  const canAddSelected = !!selectedItem && selectedItem.slots <= free;
  const canAddCustom = customName.trim() !== '' && customSlots > 0 && customSlots <= free;
  const selectedIsQuality = isQualityItem(selectedItem?.category);
  const selectedIsWeapon = selectedItem?.category === 'weapon';

  // Prefill nome/stat ao escolher uma arma/armadura.
  useEffect(() => {
    if (!selectedItem || !selectedIsQuality) return;
    setQualName(selectedItem.name);
    setQualStat(
      (selectedItem.category === 'weapon'
        ? selectedItem.damage
        : selectedItem.ac) ?? '',
    );
    setQualBonus('');
  }, [selectedId]);

  const handleAddCatalog = () => {
    if (!selectedItem || selectedItem.slots > free) return;

    if (selectedIsQuality) {
      const isNormal = quality === 'normal';
      const baseStat = selectedIsWeapon ? selectedItem.damage : selectedItem.ac;
      const stat = isNormal ? baseStat : qualStat.trim() || baseStat;

      addInventoryItem({
        itemId: selectedItem.id,
        name: qualName.trim() || selectedItem.name,
        slots: selectedItem.slots,
        category: selectedItem.category,
        quality,
        damage: selectedIsWeapon ? stat : undefined,
        ac: selectedIsWeapon ? undefined : stat,
        bonus: isNormal || qualBonus === '' ? undefined : Number(qualBonus),
      });
    } else {
      addInventoryItem({
        itemId: selectedItem.id,
        name: selectedItem.name,
        slots: selectedItem.slots,
      });
    }

    setSelectedId('');
    setQuality('normal');
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
              <InventoryItemRow
                key={index}
                item={item}
                index={index}
                isEditing={isEditing}
                free={free}
                onSetQuantity={setInventoryQuantity}
                onRemove={removeInventoryItem}
              />
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

                {selectedIsQuality && (
                  <NativeSelect.Root size="sm" maxW="9rem">
                    <NativeSelect.Field
                      value={quality}
                      bg="surface.raised"
                      borderColor="surface.border"
                      onChange={(event) =>
                        setQuality(event.currentTarget.value as ItemQuality)
                      }
                    >
                      {ITEM_QUALITY_ORDER.map((value) => (
                        <option key={value} value={value}>
                          {ITEM_QUALITY_LABELS[value]}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                )}

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

              {selectedIsQuality && (
                <>
                  <Input
                    size="sm"
                    placeholder="Nome (ex.: Espada Longa Talon)"
                    value={qualName}
                    bg="surface.raised"
                    borderColor="surface.border"
                    onChange={(event) => setQualName(event.currentTarget.value)}
                  />
                  {quality !== 'normal' && (
                    <Flex gap="0.5rem">
                      <Input
                        size="sm"
                        flex="1"
                        placeholder={selectedIsWeapon ? 'Dano (ex.: 1d8)' : 'CA'}
                        value={qualStat}
                        bg="surface.raised"
                        borderColor="surface.border"
                        onChange={(event) => setQualStat(event.currentTarget.value)}
                      />
                      <Input
                        size="sm"
                        type="number"
                        maxW="6.5rem"
                        placeholder="Bônus"
                        value={qualBonus}
                        bg="surface.raised"
                        borderColor="surface.border"
                        onChange={(event) => setQualBonus(event.currentTarget.value)}
                      />
                    </Flex>
                  )}
                </>
              )}

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
