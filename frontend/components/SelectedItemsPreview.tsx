import React from "react";
import {ScrollView, XStack, Text, Image, Button, YStack} from "tamagui";
import {Ionicons} from "@expo/vector-icons";
import {theme} from "@/theme/theme";

interface SelectedItemsPreviewProps {
  items: Array<{
    id: string;
    imageUrl: string;
    clothName: string;
  }>;
  onRemoveItem: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  totalItems: number;
  onSelectItems: () => void;
}

export default function SelectedItemsPreview({
  items,
  onRemoveItem,
  onSelectAll,
  onClearSelection,
  totalItems,
  onSelectItems,
}: SelectedItemsPreviewProps) {
  return (
    <YStack space='$2'>
      <XStack justifyContent='space-between' alignItems='center'>
        <Text color={theme.textSecondary}>
          Selected: {items.length} / {totalItems}
        </Text>
        <XStack space='$2'>
          <Button
            size='$2'
            backgroundColor={theme.buttonBg}
            color={theme.text}
            onPress={onClearSelection}
            borderColor={theme.border}
            borderWidth={1}>
            Clear
          </Button>
          <Button
            size='$2'
            backgroundColor={theme.accent}
            color='white'
            onPress={onSelectAll}>
            Select All
          </Button>
        </XStack>
      </XStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack space='$2' padding='$2'>
          {items.map((item) => (
            <XStack
              key={item.id}
              backgroundColor={theme.cardBg}
              borderRadius='$4'
              padding='$2'
              alignItems='center'
              space='$2'>
              <Image
                source={{uri: item.imageUrl}}
                width={40}
                height={40}
                borderRadius='$2'
              />
              <Text fontSize='$3' numberOfLines={1} color={theme.text}>
                {item.clothName}
              </Text>
              <Button
                size='$2'
                circular
                backgroundColor={theme.buttonBg}
                onPress={() => onRemoveItem(item.id)}
                icon={<Ionicons name='close' size={16} color={theme.text} />}
              />
            </XStack>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
