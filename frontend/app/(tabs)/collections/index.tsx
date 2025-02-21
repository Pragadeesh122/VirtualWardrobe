import React, {useState, useEffect} from "react";
import {
  ScrollView,
  YStack,
  XStack,
  Button,
  Text,
  Card,
  Input,
  Sheet,
  Image,
  Checkbox,
  Accordion,
  AlertDialog,
} from "tamagui";
import {useAuth} from "@/context/authContext";
import {
  createCollection,
  fetchCollections,
  deleteCollection,
} from "@/app/services/collection";
import {fetchWardrobe} from "@/app/services/uplaodFile";
import {Ionicons} from "@expo/vector-icons";
import SuggestionModal from "@/components/SuggestionModal";
import CreateCollectionModal from "@/components/CreateCollectionModal";
import CollectionNameModal from "@/components/CollectionNameModal";
import {ClothItem} from "@/types/wardrobe";
import {CollectionsSkeleton} from "@/components/skeleton";
import {Platform} from "react-native";

interface CollectionItem {
  clothId: string;
  imageUrl: string;
  clothName: string;
}

interface Collection {
  id: string;
  name: string;
  items: CollectionItem[];
}

interface GroupedWardrobeItems {
  [key: string]: ClothItem[];
}

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

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [wardrobeItems, setWardrobeItems] = useState<Record<string, ClothItem>>(
    {}
  );
  const [selectedItemsForSuggestion, setSelectedItemsForSuggestion] = useState<
    Set<string>
  >(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<Collection | null>(null);
  const [suggestionItems, setSuggestionItems] = useState<string[]>([]);
  const {user, token} = useAuth();

  useEffect(() => {
    if (user && token) {
      loadCollections();
      loadWardrobe();
    }
  }, [user, token]);

  const loadCollections = async () => {
    try {
      const data = await fetchCollections(token!);
      setCollections(data);
    } catch (error) {
      console.error("Error loading collections:", error);
    }
  };

  const loadWardrobe = async () => {
    try {
      const data = await fetchWardrobe(user?.uid!, token!);
      const itemsRecord: Record<string, ClothItem> = {};
      data.forEach((item: ClothItem) => {
        if (item.id) {
          itemsRecord[item.id] = item;
        }
      });
      setWardrobeItems(itemsRecord);
    } catch (error) {
      console.error("Error loading wardrobe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateManualCollection = async (
    name: string,
    selectedItems: string[]
  ) => {
    try {
      const newCollection = await createCollection(name, selectedItems, token!);
      setCollections((prev) => [...prev, newCollection]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const handleSuggestionAccept = (items: string[]) => {
    setSuggestionItems(items);
    setIsSuggestionModalOpen(false);
    setIsNameModalOpen(true);
  };

  const handleCreateSuggestionCollection = async (name: string) => {
    try {
      const newCollection = await createCollection(
        name,
        suggestionItems,
        token!
      );
      setCollections((prev) => [...prev, newCollection]);
      setSuggestionItems([]);
    } catch (error) {
      console.error("Error creating collection from suggestion:", error);
    }
  };

  const handleDelete = async (collection: Collection) => {
    setCollectionToDelete(collection);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!collectionToDelete || !token) return;
    try {
      await deleteCollection(collectionToDelete.id, token);
      await loadCollections();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  if (isLoading) {
    return <CollectionsSkeleton />;
  }

  return (
    <ScrollView flex={1} backgroundColor={theme.background} padding='$4'>
      <YStack space='$4'>
        <Text
          fontSize='$6'
          alignSelf='center'
          fontWeight='800'
          color={theme.text}>
          Collections
        </Text>
        <XStack space='$4' justifyContent='center'>
          <Button
            backgroundColor={theme.accent}
            color={theme.text}
            onPress={() => setIsCreateModalOpen(true)}>
            Create Collection
          </Button>
          <Button
            icon={<Ionicons name='bulb' size={24} color={theme.text} />}
            backgroundColor={theme.accent}
            color={theme.text}
            onPress={() => setIsSuggestionModalOpen(true)}>
            Get Suggestion
          </Button>
        </XStack>

        {collections.map((collection) => (
          <Card
            key={collection.id}
            elevate
            size='$4'
            marginBottom='$3'
            backgroundColor={theme.cardBg}
            borderColor={theme.border}
            borderWidth={1}>
            <Card.Header padded>
              <XStack justifyContent='space-between' alignItems='center'>
                <Text fontSize='$5' fontWeight='600' color={theme.text}>
                  {collection.name}
                </Text>
                <Button
                  size='$3'
                  backgroundColor={theme.buttonBg}
                  onPress={() => handleDelete(collection)}
                  icon={<Ionicons name='trash' size={16} color={theme.text} />}
                />
              </XStack>
            </Card.Header>
            <Card.Footer padded>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space='$2'>
                  {collection.items.map((item) => (
                    <YStack key={item.clothId} alignItems='center' space='$2'>
                      <Image
                        source={{uri: item.imageUrl}}
                        width={80}
                        height={80}
                        borderRadius='$2'
                      />
                      <Text fontSize='$3' color={theme.text}>
                        {item.clothName}
                      </Text>
                    </YStack>
                  ))}
                </XStack>
              </ScrollView>
            </Card.Footer>
          </Card>
        ))}

        <SuggestionModal
          isOpen={isSuggestionModalOpen}
          onClose={() => setIsSuggestionModalOpen(false)}
          selectedItems={Array.from(selectedItemsForSuggestion)}
          wardrobeItems={wardrobeItems}
          onAcceptSuggestion={handleSuggestionAccept}
          setSelectedItemsForSuggestion={setSelectedItemsForSuggestion}
        />

        <CreateCollectionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          wardrobeItems={wardrobeItems}
          onCreateCollection={handleCreateManualCollection}
          isLoading={isLoading}
        />

        <CollectionNameModal
          isOpen={isNameModalOpen}
          onClose={() => {
            setIsNameModalOpen(false);
            setSuggestionItems([]);
          }}
          onCreateCollection={handleCreateSuggestionCollection}
          isLoading={isLoading}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}>
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
                Delete Collection
              </AlertDialog.Title>
              <AlertDialog.Description style={{color: theme.textSecondary}}>
                Are you sure you want to delete this collection? This action
                cannot be undone.
              </AlertDialog.Description>
              <XStack space='$3' justifyContent='flex-end'>
                <AlertDialog.Cancel>
                  <Button
                    theme='gray'
                    onPress={() => setIsDeleteDialogOpen(false)}
                    style={{
                      backgroundColor: theme.buttonBg,
                      color: theme.text,
                    }}>
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    theme='red'
                    onPress={confirmDelete}
                    style={{backgroundColor: theme.accent, color: theme.text}}>
                    Delete
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog>
      </YStack>
    </ScrollView>
  );
}
