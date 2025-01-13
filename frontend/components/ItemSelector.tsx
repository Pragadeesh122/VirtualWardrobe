import React from "react";
import {
  Sheet,
  YStack,
  Text,
  ScrollView,
  XStack,
  Button,
  Image,
  Checkbox,
} from "tamagui";
import {ClothItem} from "@/types/wardrobe";
import {theme} from "@/theme/theme";
import {ItemSelectorSkeleton} from "./skeleton";

interface ItemSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobeItems: Record<string, ClothItem>;
  selectedItems: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
  isLoading?: boolean;
}

export default function ItemSelector({
  isOpen,
  onClose,
  wardrobeItems,
  selectedItems,
  onSelectionChange,
  isLoading = false,
}: ItemSelectorProps) {
  const itemsByType = Object.values(wardrobeItems).reduce<
    Record<string, ClothItem[]>
  >((acc, item) => {
    if (!acc[item.clothType]) {
      acc[item.clothType] = [];
    }
    acc[item.clothType].push(item);
    return acc;
  }, {});

  const handleSelectionChange = (
    item: ClothItem,
    checked: string | boolean
  ) => {
    if (!item.id) return;
    const isChecked = checked === true || checked === "true";

    const newSelection = new Set(selectedItems);
    if (isChecked) {
      newSelection.add(item.id);
    } else {
      newSelection.delete(item.id);
    }
    onSelectionChange(newSelection);
  };

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[90]}
      position={0}
      dismissOnSnapToBottom>
      <Sheet.Overlay />
      <Sheet.Frame
        padding='$4'
        backgroundColor={theme.background}
        borderTopLeftRadius='$4'
        borderTopRightRadius='$4'>
        <Sheet.Handle />
        {isLoading ? (
          <ItemSelectorSkeleton />
        ) : (
          <YStack space='$4'>
            <Text fontSize='$6' fontWeight='bold' color={theme.text}>
              Select Items
            </Text>

            <ScrollView style={{maxHeight: "85%"}}>
              <YStack space='$4'>
                {Object.entries(itemsByType).map(([type, items]) => (
                  <YStack key={type} space='$2'>
                    <Text
                      fontSize='$5'
                      fontWeight='600'
                      color={theme.text}
                      textTransform='capitalize'>
                      {type}
                    </Text>
                    {items.map((item) => (
                      <XStack
                        key={item.id}
                        space='$3'
                        padding='$2'
                        backgroundColor={theme.cardBg}
                        borderRadius='$4'
                        alignItems='center'>
                        <Checkbox
                          checked={selectedItems.has(item.id!)}
                          onCheckedChange={(checked) =>
                            handleSelectionChange(item, checked)
                          }
                          backgroundColor={
                            selectedItems.has(item.id!)
                              ? theme.accent
                              : undefined
                          }
                          borderColor={
                            selectedItems.has(item.id!)
                              ? theme.accent
                              : theme.border
                          }
                        />
                        <Image
                          source={{uri: item.imageUrl}}
                          width={50}
                          height={50}
                          borderRadius='$2'
                        />
                        <Text color={theme.text}>{item.clothName}</Text>
                      </XStack>
                    ))}
                  </YStack>
                ))}
              </YStack>
            </ScrollView>

            <Button
              size='$4'
              theme='accent'
              onPress={onClose}
              position='absolute'
              bottom={16}
              left={16}
              right={16}>
              Done
            </Button>
          </YStack>
        )}
      </Sheet.Frame>
    </Sheet>
  );
}
