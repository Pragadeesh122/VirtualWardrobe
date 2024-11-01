import React, {useState, useEffect} from "react";
import {RefreshControl} from "react-native";
import {
  ScrollView,
  YStack,
  XStack,
  View,
  Image,
  Accordion,
  Text,
  styled,
  AlertDialog,
  Button,
  Sheet,
  Input,
} from "tamagui";
import {Ionicons} from "@expo/vector-icons";
import {
  fetchWardrobe,
  deleteClothItem,
  updateClothItem,
} from "@/app/services/uplaodFile";
import {useAuth} from "@/context/authContext";
import {useIsFocused} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

type ClothItem = {
  id: string;
  imageUrl: string;
  clothName: string;
  clothType: string;
};

type Wardrobe = {
  [clothType: string]: ClothItem[];
};

export default function WardrobeScreen() {
  const [wardrobe, setWardrobe] = useState<Wardrobe>({});
  const [expandedTypes, setExpandedTypes] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const {user, token} = useAuth();
  const isFocused = useIsFocused();
  const [editingItem, setEditingItem] = useState<ClothItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ClothItem | null>(null);
  const [newName, setNewName] = useState("");

  const fetchWardrobeData = async () => {
    try {
      const response = await fetchWardrobe(user?.uid!, token!);
      const organizedWardrobe = response.reduce(
        (acc: Wardrobe, item: ClothItem) => {
          if (!acc[item.clothType]) {
            acc[item.clothType] = [];
          }
          acc[item.clothType].push(item);
          return acc;
        },
        {}
      );
      setWardrobe(organizedWardrobe);
    } catch (error) {
      console.error("Error fetching wardrobe data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWardrobeData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) {
      fetchWardrobeData();
    }
  }, [isFocused, user?.uid, token]);

  const handleDelete = async (item: ClothItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteClothItem(itemToDelete.id, token!);
      await fetchWardrobeData();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdate = async (item: ClothItem) => {
    setEditingItem(item);
    setNewName(item.clothName);
    setIsEditOpen(true);
  };

  return (
    <YStack flex={1} padding='$4' paddingTop='$6'>
      <Text fontSize='$6' fontWeight='bold' marginBottom='$4'>
        My Wardrobe
      </Text>
      <ScrollView
        flex={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {Object.entries(wardrobe).map(([clothType, items]) => (
          <YStack key={clothType} space='$3'>
            <Accordion type='multiple'>
              <Accordion.Item value={clothType}>
                <Accordion.Trigger
                  flexDirection='row'
                  justifyContent='space-between'
                  alignItems='center'
                  padding='$3'
                  backgroundColor='$gray3'
                  borderRadius='$2'>
                  {({open}: {open: boolean}) => (
                    <>
                      <Text fontSize='$5' fontWeight='600'>
                        {clothType}
                      </Text>
                      <Ionicons
                        name={open ? "chevron-up" : "chevron-down"}
                        size={24}
                        color='$gray11'
                      />
                    </>
                  )}
                </Accordion.Trigger>
                <Accordion.Content>
                  <YStack space='$3' padding='$3'>
                    {items.map((item, index) => (
                      <XStack
                        key={index}
                        space='$4'
                        alignItems='center'
                        justifyContent='space-between'>
                        <XStack space='$4' alignItems='center' flex={1}>
                          <Image
                            source={{uri: item.imageUrl}}
                            width={100}
                            height={100}
                            borderRadius='$2'
                          />
                          <Text fontSize='$4' fontWeight='600'>
                            {item.clothName}
                          </Text>
                        </XStack>
                        <XStack space='$2'>
                          <Button
                            size='$3'
                            onPress={() => handleUpdate(item)}
                            icon={<Ionicons name='pencil' size={16} />}
                          />
                          <Button
                            size='$3'
                            theme='red'
                            onPress={() => handleDelete(item)}
                            icon={<Ionicons name='trash' size={16} />}
                          />
                        </XStack>
                      </XStack>
                    ))}
                  </YStack>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </YStack>
        ))}
      </ScrollView>
      <Sheet
        modal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        snapPoints={[50]}
        position={0}
        dismissOnSnapToBottom>
        <Sheet.Overlay />
        <Sheet.Frame padding='$4'>
          <Sheet.Handle />
          <Text fontSize='$5' fontWeight='600' marginBottom='$4'>
            Update Item
          </Text>
          <Input
            value={newName}
            onChangeText={setNewName}
            placeholder='Item name'
            marginBottom='$4'
          />
          <Button
            onPress={async () => {
              if (editingItem) {
                try {
                  await updateClothItem(
                    editingItem.id,
                    {
                      clothName: newName,
                    },
                    token!
                  );
                  await fetchWardrobeData();
                  setIsEditOpen(false);
                } catch (error) {
                  console.error("Error updating item:", error);
                }
              }
            }}>
            Update
          </Button>
        </Sheet.Frame>
      </Sheet>
      <AlertDialog open={showDeleteDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <AlertDialog.Title>Delete Item</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialog.Description>
            <XStack space='$3' justifyContent='flex-end'>
              <AlertDialog.Cancel>
                <Button theme='gray' onPress={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button theme='red' onPress={confirmDelete}>
                  Delete
                </Button>
              </AlertDialog.Action>
            </XStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
}
