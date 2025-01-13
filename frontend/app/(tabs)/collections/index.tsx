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
import {ClothItem} from "@/types/wardrobe";
import {CollectionsSkeleton} from "@/components/skeleton";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [wardrobeItems, setWardrobeItems] = useState<Record<string, ClothItem>>(
    {}
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<Collection | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemsForSuggestion, setSelectedItemsForSuggestion] = useState<
    Set<string>
  >(new Set());
  const {token, user} = useAuth();

  const loadCollections = async () => {
    try {
      const data = await fetchCollections(token!);
      setCollections(data);
    } catch (error) {
      console.error("Error loading collections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWardrobe = async () => {
    try {
      console.log("[CollectionsScreen] Loading wardrobe items");
      const data = await fetchWardrobe(user?.uid!, token!);
      console.log("[CollectionsScreen] Fetched wardrobe data:", data);

      const itemsRecord = data.reduce(
        (acc: Record<string, ClothItem>, item: ClothItem) => {
          // The document ID should be used as the key
          const id = item.id || "";
          if (id) {
            console.log(
              `[CollectionsScreen] Adding item ${id} to record:`,
              item
            );
            acc[id] = {
              ...item,
              id, // Ensure ID is set
            };
          } else {
            console.log("[CollectionsScreen] Skipping item without ID:", item);
          }
          return acc;
        },
        {}
      );

      console.log(
        "[CollectionsScreen] Final wardrobe items record:",
        itemsRecord
      );
      setWardrobeItems(itemsRecord);
    } catch (error) {
      console.error("[CollectionsScreen] Error loading wardrobe:", error);
    }
  };

  useEffect(() => {
    loadCollections();
    loadWardrobe();
  }, [token]);

  if (isLoading) {
    return <CollectionsSkeleton />;
  }

  const handleCreateCollection = async () => {
    console.log("[CollectionsScreen] Starting collection creation");
    console.log("[CollectionsScreen] Collection name:", newCollectionName);
    console.log(
      "[CollectionsScreen] Selected items:",
      Array.from(selectedItems)
    );

    if (newCollectionName && selectedItems.size > 0) {
      try {
        const selectedItemIds = Array.from(selectedItems).filter(
          (id): id is string => id !== undefined
        );
        console.log("[CollectionsScreen] Filtered item IDs:", selectedItemIds);

        if (selectedItemIds.length === 0) {
          console.log("[CollectionsScreen] No valid items after filtering");
          return;
        }

        console.log("[CollectionsScreen] Calling createCollection service");
        const response = await createCollection(
          newCollectionName,
          selectedItemIds,
          token!
        );
        console.log(
          "[CollectionsScreen] Create collection response:",
          response
        );

        if (response) {
          console.log("[CollectionsScreen] Collection created successfully");
          setIsCreateOpen(false);
          setNewCollectionName("");
          setSelectedItems(new Set());
          await loadCollections();
        }
      } catch (error) {
        console.error("[CollectionsScreen] Error creating collection:", error);
      }
    } else {
      console.log("[CollectionsScreen] Invalid input - Name or items missing", {
        hasName: Boolean(newCollectionName),
        itemCount: selectedItems.size,
      });
    }
  };

  const handleDelete = (collection: Collection) => {
    setCollectionToDelete(collection);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!collectionToDelete) return;
    setLoadingDelete(true);
    try {
      await deleteCollection(collectionToDelete.id, token!);
      await loadCollections();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting collection:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const groupItemsByType = (items: ClothItem[]): GroupedWardrobeItems => {
    return items.reduce((acc: GroupedWardrobeItems, item) => {
      if (!item.clothType) return acc;
      const type = item.clothType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {});
  };

  return (
    <YStack
      flex={1}
      padding='$4'
      paddingTop='$6'
      backgroundColor={theme.background}>
      <XStack
        flexDirection='column'
        justifyContent='space-between'
        alignItems='center'
        marginBottom='$11'>
        <Text
          fontSize='$6'
          fontWeight='bold'
          color={theme.text}
          marginBottom='$6'>
          My Collections
        </Text>
        <XStack space='$2' flex={1}>
          <Button
            fontSize='$4'
            fontWeight='semibold'
            onPress={() => setIsCreateOpen(true)}
            backgroundColor={theme.accent}
            color={theme.text}>
            Create Collection
          </Button>
          <Button
            fontSize='$4'
            fontWeight='semibold'
            onPress={() => setIsSuggestionsOpen(true)}
            backgroundColor={theme.buttonBg}
            color={theme.text}>
            Suggest Collections
          </Button>
        </XStack>
      </XStack>

      <ScrollView flex={1}>
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
      </ScrollView>

      {/* Create Collection Sheet */}
      <Sheet
        modal
        open={isCreateOpen}
        onOpenChange={(open: boolean) => {
          console.log(
            "[CollectionsScreen] Create collection sheet state changed:",
            open
          );
          setIsCreateOpen(open);
          if (!open) {
            setNewCollectionName("");
            setSelectedItems(new Set());
          }
        }}
        snapPoints={[80]}
        position={0}
        dismissOnSnapToBottom>
        <Sheet.Overlay />
        <Sheet.Frame padding='$4' backgroundColor={theme.background}>
          <Sheet.Handle />
          <Text
            fontSize='$5'
            fontWeight='600'
            color={theme.text}
            marginBottom='$4'>
            Create New Collection
          </Text>
          <Input
            placeholder='Collection Name'
            value={newCollectionName}
            onChangeText={setNewCollectionName}
            marginBottom='$4'
            backgroundColor={theme.buttonBg}
            borderColor={theme.border}
            color={theme.text}
          />
          <Button
            onPress={async () => {
              console.log(
                "[CollectionsScreen] Creating collection with name:",
                newCollectionName
              );
              console.log(
                "[CollectionsScreen] Selected items:",
                Array.from(selectedItems)
              );
              await handleCreateCollection();
            }}
            marginTop='$4'
            backgroundColor={theme.accent}
            color={theme.text}
            disabled={!newCollectionName || selectedItems.size === 0}>
            Create Collection
          </Button>
        </Sheet.Frame>
      </Sheet>

      {/* Delete Dialog */}
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

      {/* Suggestion Modal */}
      <SuggestionModal
        isOpen={isSuggestionsOpen}
        onClose={() => {
          console.log("[CollectionsScreen] Closing suggestion modal");
          setIsSuggestionsOpen(false);
          setSelectedItemsForSuggestion(new Set());
        }}
        selectedItems={Array.from(selectedItemsForSuggestion)}
        wardrobeItems={wardrobeItems}
        setSelectedItemsForSuggestion={setSelectedItemsForSuggestion}
        onAcceptSuggestion={async (items: string[]) => {
          console.log(
            "[CollectionsScreen] Accepting suggestion with items:",
            items
          );
          try {
            if (items.length === 0) {
              console.log("[CollectionsScreen] No items selected, returning");
              return;
            }

            // Log the wardrobe items state for debugging
            console.log(
              "[CollectionsScreen] Current wardrobe items:",
              wardrobeItems
            );

            // Ensure we only use valid item IDs
            const validItems = items.filter((id) => {
              const item = wardrobeItems[id];
              console.log(`[CollectionsScreen] Checking item ${id}:`, item);
              return item !== undefined;
            });

            console.log("[CollectionsScreen] Valid items:", validItems);

            if (validItems.length === 0) {
              console.log(
                "[CollectionsScreen] No valid items found, returning"
              );
              return;
            }

            // Open the create collection sheet with pre-selected items
            console.log(
              "[CollectionsScreen] Setting selected items:",
              validItems
            );
            setSelectedItems(new Set(validItems));
            console.log("[CollectionsScreen] Opening create collection sheet");
            setIsCreateOpen(true);
            setIsSuggestionsOpen(false);
            setSelectedItemsForSuggestion(new Set());
          } catch (error) {
            console.error(
              "[CollectionsScreen] Error handling suggestion acceptance:",
              error
            );
          }
        }}
      />
    </YStack>
  );
}
