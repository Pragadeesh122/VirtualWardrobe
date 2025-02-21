import React, {useState} from "react";
import {Sheet, YStack, Text, Button, Input} from "tamagui";
import {theme} from "@/theme/theme";
import {Platform} from "react-native";

interface CollectionNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCollection: (name: string) => void;
  isLoading?: boolean;
}

export default function CollectionNameModal({
  isOpen,
  onClose,
  onCreateCollection,
  isLoading = false,
}: CollectionNameModalProps) {
  const [collectionName, setCollectionName] = useState("");

  const handleCreate = () => {
    if (collectionName.trim()) {
      onCreateCollection(collectionName);
      handleClose();
    }
  };

  const handleClose = () => {
    setCollectionName("");
    onClose();
  };

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
      snapPoints={[40]}
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
        justifyContent='flex-start'>
        <YStack space='$4'>
          <Text
            color={theme.text}
            fontSize={20}
            fontWeight='600'
            textAlign='center'>
            Name Your Collection
          </Text>

          <YStack space='$4'>
            <YStack space='$2'>
              <Text fontSize={14} color={theme.textSecondary} fontWeight='500'>
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
                placeholderTextColor={theme.textSecondary}
                autoFocus={Platform.OS === "ios"}
                focusStyle={{
                  borderColor: theme.accent,
                }}
              />
            </YStack>

            <Button
              backgroundColor={
                collectionName.trim() ? theme.accent : theme.buttonBg
              }
              color={theme.text}
              onPress={handleCreate}
              disabled={!collectionName.trim()}
              marginTop='$2'>
              <Text color={theme.text} fontWeight='600'>
                Create Collection
              </Text>
            </Button>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
