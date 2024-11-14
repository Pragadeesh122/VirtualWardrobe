import React, {useState, useEffect} from "react";
import {
  ScrollView,
  YStack,
  XStack,
  Text,
  Button,
  Image,
  AlertDialog,
} from "tamagui";
import {Ionicons} from "@expo/vector-icons";
import {useAuth} from "@/context/authContext";
import {useRouter, useLocalSearchParams} from "expo-router";
import {
  fetchWardrobe,
  deleteClothItem,
  updateClothItem,
} from "@/app/services/uplaodFile";
import {ClothItem} from "@/types/wardrobe";

const theme = {
  background: "#1A1B23",
  cardBg: "#23242F",
  accent: "#4A72FF",
  accentDark: "#3558DB",
  text: "#FFFFFF",
  textSecondary: "#A0A3BD",
  border: "#2F3142",
  buttonBg: "#2A2B36",
};

export default function CategoryScreen() {
  const {type} = useLocalSearchParams();
  const router = useRouter();
  const {user, token} = useAuth();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [items, setItems] = useState<ClothItem[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ClothItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, [type]);

  const fetchItems = async () => {
    try {
      const response = await fetchWardrobe(user?.uid!, token!);
      const categoryItems = response.filter(
        (item: ClothItem) => item.clothType === type
      );
      setItems(categoryItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleDelete = async (item: ClothItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setLoadingDelete(true);
    try {
      await deleteClothItem(itemToDelete.id!, token!);
      await fetchItems();
      setShowDeleteDialog(false);
    } catch (error) {
      setShowDeleteDialog(false);
      console.error("Error deleting item:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor={theme.background}>
      <XStack
        padding='$4'
        alignItems='center'
        space='$3'
        backgroundColor={theme.cardBg}>
        <Button
          icon={<Ionicons name='arrow-back' size={24} color={theme.text} />}
          onPress={() => router.push("/(tabs)/wardrobe")}
          backgroundColor='transparent'
        />
        <Text fontSize='$6' fontWeight='bold' color={theme.text}>
          {type}
        </Text>
      </XStack>

      <ScrollView flex={1} contentContainerStyle={{padding: 16}}>
        <YStack space='$4'>
          {items.map((item) => (
            <XStack
              key={item.id}
              backgroundColor={theme.cardBg}
              borderRadius='$4'
              padding='$4'
              space='$4'
              borderWidth={1}
              borderColor={theme.border}>
              <Image
                source={{uri: item.imageUrl}}
                width={100}
                height={100}
                borderRadius='$2'
              />
              <YStack flex={1} justifyContent='space-between'>
                <Text fontSize='$4' fontWeight='600' color={theme.text}>
                  {item.clothName}
                </Text>
                <XStack space='$2'>
                  <Button
                    size='$3'
                    backgroundColor={theme.buttonBg}
                    onPress={() => handleDelete(item)}
                    icon={
                      <Ionicons name='trash' size={16} color={theme.text} />
                    }
                  />
                </XStack>
              </YStack>
            </XStack>
          ))}
        </YStack>
      </ScrollView>

      <AlertDialog open={showDeleteDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            style={{backgroundColor: theme.background, opacity: 0.8}}
          />
          <AlertDialog.Content
            style={{
              backgroundColor: theme.cardBg,
              borderRadius: 8,
              padding: 16,
            }}>
            <AlertDialog.Title style={{color: theme.text}}>
              Delete Item
            </AlertDialog.Title>
            <AlertDialog.Description style={{color: theme.textSecondary}}>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialog.Description>
            <XStack space='$3' justifyContent='flex-end'>
              <AlertDialog.Cancel>
                <Button
                  theme='gray'
                  onPress={() => setShowDeleteDialog(false)}
                  style={{backgroundColor: theme.buttonBg, color: theme.text}}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button
                  theme='red'
                  onPress={confirmDelete}
                  style={{
                    backgroundColor: loadingDelete ? "gray" : theme.accent,
                    color: theme.text,
                  }}>
                  {loadingDelete ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialog.Action>
            </XStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
}
