// libs
import { useEffect, useState } from 'react';

// ui
import {
  Box,
  Button,
  Flex,
  Input,
  NativeSelect,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuCheck, LuPlus } from 'react-icons/lu';

// components
import { EditableSection } from '@/components/character/EditableSection';
import { EquipArmorDialog } from '@/components/character/EquipArmorDialog';
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
  isEquippableArmor,
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
    equipArmor,
    toggleEquipArmor,
    requestSave,
  } = useCharacterSheetContext();

  const [selectedId, setSelectedId] = useState('');
  const [quality, setQuality] = useState<ItemQuality>('normal');
  const [nickname, setNickname] = useState(''); // nome dado ao item (opcional)
  const [qualStat, setQualStat] = useState(''); // dano (arma) ou CA (armadura)
  const [qualBonus, setQualBonus] = useState('');
  const [customName, setCustomName] = useState('');
  const [customSlots, setCustomSlots] = useState(1);
  // Dialog "equipar?" ao adicionar uma armadura.
  const [armorPrompt, setArmorPrompt] = useState<{
    index: number;
    name: string;
  } | null>(null);

  const capacity = getInventorySlotCount(character.abilities.for.score);
  const used = getUsedSlots(character.inventory);
  const free = capacity - used;
  const isOver = used > capacity;

  const selectedItem = getCatalogItem(selectedId);
  const canAddSelected = !!selectedItem && selectedItem.slots <= free;
  const canAddCustom = customName.trim() !== '' && customSlots > 0 && customSlots <= free;
  const selectedIsQuality = isQualityItem(selectedItem?.category);
  const selectedIsWeapon = selectedItem?.category === 'weapon';

  // Prefill do stat ao escolher uma arma/armadura (o nome dado começa vazio).
  useEffect(() => {
    if (!selectedItem || !selectedIsQuality) return;
    setNickname('');
    setQualStat(
      selectedItem.category === 'weapon'
        ? (selectedItem.damage ?? '')
        : selectedItem.ac !== undefined
          ? String(selectedItem.ac)
          : '',
    );
    setQualBonus('');
  }, [selectedId]);

  const handleAddCatalog = () => {
    if (!selectedItem || selectedItem.slots > free) return;

    if (selectedIsQuality) {
      const isNormal = quality === 'normal';

      if (selectedIsWeapon) {
        const damage = isNormal
          ? selectedItem.damage
          : qualStat.trim() || selectedItem.damage;
        addInventoryItem({
          itemId: selectedItem.id,
          name: selectedItem.name,
          nickname: nickname.trim() || undefined,
          slots: selectedItem.slots,
          category: 'weapon',
          quality,
          damage,
          bonus: isNormal || qualBonus === '' ? undefined : Number(qualBonus),
        });
      } else {
        const editedAc = Number(qualStat);
        const ac =
          isNormal || qualStat.trim() === '' || Number.isNaN(editedAc)
            ? selectedItem.ac
            : editedAc;
        addInventoryItem({
          itemId: selectedItem.id,
          name: selectedItem.name,
          nickname: nickname.trim() || undefined,
          slots: selectedItem.slots,
          category: 'armor',
          quality,
          ac,
          acAddsDex: selectedItem.acAddsDex,
          bonus: isNormal || qualBonus === '' ? undefined : Number(qualBonus),
        });

        // Armadura equipável → pergunta se quer equipar (índice = fim da lista).
        if (isEquippableArmor({ category: 'armor', ac })) {
          setArmorPrompt({
            index: character.inventory.length,
            name: nickname.trim() || selectedItem.name,
          });
        }
      }
    } else {
      addInventoryItem({
        itemId: selectedItem.id,
        name: selectedItem.name,
        slots: selectedItem.slots,
      });
    }

    requestSave();
    setSelectedId('');
    setQuality('normal');
  };

  const confirmEquip = () => {
    if (armorPrompt) {
      equipArmor(armorPrompt.index);
      requestSave();
    }
    setArmorPrompt(null);
  };

  const handleAddCustom = () => {
    if (!canAddCustom) return;
    addInventoryItem({ itemId: null, name: customName.trim(), slots: customSlots });
    requestSave();
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
                onToggleEquip={(i) => {
                  toggleEquipArmor(i);
                  requestSave();
                }}
              />
            ))}
          </Stack>

          {isEditing && (
            <Stack
              gap="1rem"
              borderTopWidth="1px"
              borderColor="surface.border"
              pt="0.75rem"
            >
              <Stack gap="0.5rem">
                <StatLabel>Do catálogo</StatLabel>
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

                <Button
                  size="sm"
                  colorPalette="purple"
                  disabled={!canAddSelected}
                  onClick={handleAddCatalog}
                >
                  <LuCheck />
                  Salvar
                </Button>
              </Flex>

              {selectedIsQuality && (
                <>
                  <Input
                    size="sm"
                    placeholder="Nome personalizado (opcional) — ex.: Andúril"
                    value={nickname}
                    bg="surface.raised"
                    borderColor="surface.border"
                    onChange={(event) => setNickname(event.currentTarget.value)}
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
              </Stack>

              <Flex align="center" gap="0.75rem">
                <Separator flex="1" />
                <Text fontSize="0.75rem" color="fg.muted">
                  ou
                </Text>
                <Separator flex="1" />
              </Flex>

              <Stack gap="0.5rem">
                <StatLabel>Item personalizado</StatLabel>
                <Flex gap="0.5rem">
                <Input
                  size="sm"
                  flex="1"
                  placeholder="Nome do item"
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
                <Button
                  size="sm"
                  colorPalette="purple"
                  disabled={!canAddCustom}
                  onClick={handleAddCustom}
                >
                  <LuPlus />
                  Adicionar
                </Button>
                </Flex>
              </Stack>

              {free <= 0 && (
                <Text fontSize="0.75rem" color="red.500">
                  Sem espaço livre — aumente a Força ou remova itens.
                </Text>
              )}
            </Stack>
          )}

          <Box pt="2rem">
            <StatLabel mb="0.5rem">Carga Livre</StatLabel>
            <SheetField
              isEditing={isEditing}
              value={character.freeCarry}
              placeholder="Itens de carga livre"
              onChange={(value) => updateField('freeCarry', value)}
              textProps={{ fontSize: '0.875rem' }}
            />
          </Box>

          <EquipArmorDialog
            isOpen={armorPrompt !== null}
            armorName={armorPrompt?.name ?? ''}
            onConfirm={confirmEquip}
            onClose={() => setArmorPrompt(null)}
          />
        </>
      )}
    </EditableSection>
  );
};
