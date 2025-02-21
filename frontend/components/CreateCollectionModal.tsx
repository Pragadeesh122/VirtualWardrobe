import React, {useState} from "react";
import {
  Sheet,
  YStack,
  Text,
  Button,
  Input,
  ScrollView,
  XStack,
  Checkbox,
  Image,
} from "tamagui";
import {theme} from "@/theme/theme";
import {ClothItem} from "@/types/wardrobe";
import {Platform} from "react-native";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  wardrobeItems: Record<string, ClothItem>;
  onCreateCollection: (name: string, items: string[]) => void;
  isLoading?: boolean;
}

export default function CreateCollectionModal({
  isOpen,
  onClose,
  wardrobeItems,
  onCreateCollection,
  isLoading = false,
}: CreateCollectionModalProps) {
  const [collectionName, setCollectionName] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleCreate = () => {
    if (collectionName.trim() && selectedItems.size > 0) {
      onCreateCollection(collectionName, Array.from(selectedItems));
      handleClose();
    }
  };

  const handleClose = () => {
    setCollectionName("");
    setSelectedItems(new Set());
    onClose();
  };

  const handleSelectionChange = (itemId: string, checked: boolean) => {
    const newSelection = new Set(selectedItems);
    if (checked) {
      newSelection.add(itemId);
    } else {
      newSelection.delete(itemId);
    }
    setSelectedItems(newSelection);
  };

  const itemsByType = Object.values(wardrobeItems).reduce<
    Record<string, ClothItem[]>
  >((acc, item) => {
    if (!acc[item.clothType]) {
      acc[item.clothType] = [];
    }
    acc[item.clothType].push(item);
    return acc;
  }, {});

  const canCreate = collectionName.trim().length > 0 && selectedItems.size > 0;

  if (isLoading) {
    return null;
  }

  return (
    <Sheet
      forceRemoveScrollEnabled={Platform.OS === "android"}
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose();
      }}
      snapPoints={[Platform.OS === "android" ? 100 : 80]}
      position={0}
      dismissOnSnapToBottom={false}
      zIndex={100000}
      animation='quick'>
      <Sheet.Overlay
        animation='quick'
        enterStyle={{opacity: 0}}
        exitStyle={{opacity: 0}}
      />
      <Sheet.Frame
        backgroundColor={theme.background}
        padding='$4'
        flex={1}
        justifyContent='flex-start'>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <YStack space='$4'>
            <Text
              color={theme.text}
              fontSize={20}
              fontWeight='600'
              textAlign='center'>
              Create New Collection
            </Text>

            <YStack space='$4' paddingVertical='$2'>
              <Text color={theme.text} fontSize={16}>
                Collection Name
              </Text>
              <Input
                size='$4'
                borderWidth={2}
                placeholder='Enter collection name'
                value={collectionName}
                onChangeText={setCollectionName}
                backgroundColor={theme.cardBg}
                borderColor={theme.border}
                color={theme.text}
                autoFocus={Platform.OS === "ios"}
              />
            </YStack>

            <YStack space='$4'>
              <Text color={theme.text} fontSize={16}>
                Select Items
              </Text>
              {Object.entries(itemsByType).map(([type, items]) => (
                <YStack key={type} space='$2' marginBottom='$3'>
                  <Text color={theme.text} fontSize={16} fontWeight='600'>
                    {type}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    bounces={false}>
                    <XStack space='$2' paddingHorizontal='$2'>
                      {items.map((item) => (
                        <YStack
                          key={item.id}
                          backgroundColor={theme.cardBg}
                          borderRadius='$2'
                          padding='$2'
                          width={120}
                          height={160}
                          position='relative'>
                          <XStack
                            position='absolute'
                            top={8}
                            right={8}
                            zIndex={1}
                            backgroundColor={theme.background}
                            borderRadius='$2'
                            padding='$1'>
                            <Checkbox
                              checked={selectedItems.has(item.id!)}
                              onCheckedChange={(checked) =>
                                handleSelectionChange(
                                  item.id!,
                                  checked as boolean
                                )
                              }
                              backgroundColor={
                                selectedItems.has(item.id!)
                                  ? theme.accent
                                  : theme.buttonBg
                              }
                            />
                          </XStack>
                          {item.imageUrl && (
                            <YStack
                              width={110}
                              height={110}
                              marginBottom='$2'
                              borderRadius='$2'
                              overflow='hidden'>
                              <Image
                                source={{uri: item.imageUrl}}
                                width='100%'
                                height='100%'
                                resizeMode='cover'
                                alt={item.clothName}
                              />
                            </YStack>
                          )}
                          <YStack flex={1} justifyContent='center'>
                            <Text
                              color={theme.text}
                              fontSize={14}
                              textAlign='center'
                              numberOfLines={2}>
                              {item.clothName}
                            </Text>
                          </YStack>
                        </YStack>
                      ))}
                    </XStack>
                  </ScrollView>
                </YStack>
              ))}
            </YStack>

            <Button
              backgroundColor={canCreate ? theme.accent : theme.buttonBg}
              color={theme.text}
              onPress={handleCreate}
              disabled={!canCreate}
              marginTop='$4'
              marginBottom='$4'>
              <Text color={theme.text} fontWeight='600'>
                Create Collection
              </Text>
            </Button>
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
