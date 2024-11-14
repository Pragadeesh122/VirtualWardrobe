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

interface WardrobeItem {
  id: string;
  imageUrl: string;
  clothName: string;
  clothType: string;
}

interface GroupedWardrobeItems {
  [key: string]: WardrobeItem[];
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
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<Collection | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const {token, user} = useAuth();

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
      setWardrobeItems(data);
    } catch (error) {
      console.error("Error loading wardrobe:", error);
    }
  };

  useEffect(() => {
    loadCollections();
    loadWardrobe();
  }, [token]);

  const handleCreateCollection = async () => {
    if (newCollectionName && selectedItems.size > 0) {
      try {
        const selectedItemIds = Array.from(selectedItems).filter(
          (id) => id !== undefined
        );
        if (selectedItemIds.length === 0) return;

        const response = await createCollection(
          newCollectionName,
          selectedItemIds,
          token!
        );

        if (response) {
          setIsCreateOpen(false);
          setNewCollectionName("");
          setSelectedItems(new Set());
          await loadCollections();
        }
      } catch (error) {
        console.error("Error creating collection:", error);
      }
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

  const groupItemsByType = (items: WardrobeItem[]): GroupedWardrobeItems => {
    return items.reduce((acc: GroupedWardrobeItems, item) => {
      const type = item.clothType || "Other";
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
        justifyContent='space-between'
        alignItems='center'
        marginBottom='$4'>
        <Text fontSize='$6' fontWeight='bold' color={theme.text}>
          My Collections
        </Text>
        <Button
          onPress={() => setIsCreateOpen(true)}
          backgroundColor={theme.accent}
          color={theme.text}>
          Create Collection
        </Button>
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
          <Text
            fontSize='$4'
            fontWeight='500'
            color={theme.text}
            marginBottom='$2'>
            Select Items
          </Text>
          <ScrollView style={{maxHeight: 400}}>
            <YStack space='$4'>
              <Accordion type='multiple'>
                {Object.entries(groupItemsByType(wardrobeItems)).map(
                  ([type, items]) => (
                    <Accordion.Item key={type} value={type}>
                      <Accordion.Trigger
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                        padding='$3'
                        backgroundColor={theme.cardBg}
                        borderRadius='$2'>
                        {({open}: {open: boolean}) => (
                          <>
                            <Text
                              fontSize='$4'
                              fontWeight='600'
                              color={theme.text}
                              textTransform='capitalize'>
                              {type}
                            </Text>
                            <Ionicons
                              name={open ? "chevron-up" : "chevron-down"}
                              size={24}
                              color={theme.text}
                            />
                          </>
                        )}
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <YStack space='$2' padding='$2'>
                          {items.map((item) => (
                            <XStack
                              key={item.id}
                              space='$2'
                              alignItems='center'
                              padding='$2'
                              backgroundColor={theme.buttonBg}
                              borderRadius='$2'>
                              <Checkbox
                                id={item.id}
                                checked={selectedItems.has(item.id)}
                                onCheckedChange={(checked) => {
                                  setSelectedItems((prev) => {
                                    const newSet = new Set(prev);
                                    if (checked) {
                                      newSet.add(item.id);
                                    } else {
                                      newSet.delete(item.id);
                                    }
                                    return newSet;
                                  });
                                }}
                              />
                              <Image
                                source={{uri: item.imageUrl}}
                                width={50}
                                height={50}
                                borderRadius='$1'
                              />
                              <Text color={theme.text}>{item.clothName}</Text>
                            </XStack>
                          ))}
                        </YStack>
                      </Accordion.Content>
                    </Accordion.Item>
                  )
                )}
              </Accordion>
            </YStack>
          </ScrollView>
          <Button
            onPress={handleCreateCollection}
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
    </YStack>
  );
}
