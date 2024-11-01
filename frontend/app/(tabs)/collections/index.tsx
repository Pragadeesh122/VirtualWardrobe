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
} from "tamagui";
import {useAuth} from "@/context/authContext";
import {createCollection, fetchCollections} from "@/app/services/collection";
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

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const {token, user} = useAuth();

  const loadCollections = async () => {
    try {
      const data = await fetchCollections(token!);
      console.log("Fetched collections data:", data);
      if (!data) throw new Error("No data received from fetchCollections");
      setCollections(data);
    } catch (error) {
      console.error("Error loading collections:", error);
    }
  };

  const loadWardrobe = async () => {
    try {
      const data = await fetchWardrobe(user?.uid!, token!);
      console.log("Fetched wardrobe data:", data);
      if (!data) throw new Error("No data received from fetchWardrobe");
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
        if (selectedItemIds.length === 0) {
          console.error("No valid items selected");
          return;
        }

        console.log("Selected Items:", selectedItemIds);
        console.log("Collection Name:", newCollectionName);

        const response = await createCollection(
          newCollectionName,
          selectedItemIds,
          token!
        );
        console.log("Create collection response:", response);

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
    <YStack flex={1} padding='$4' paddingTop='$6'>
      <XStack
        justifyContent='space-between'
        alignItems='center'
        marginBottom='$4'>
        <Text fontSize='$6' fontWeight='bold'>
          My Collections
        </Text>
        <Button
          onPress={() => setIsCreateOpen(true)}
          backgroundColor='$blue10'
          color='white'>
          Create Collection
        </Button>
      </XStack>

      <ScrollView flex={1}>
        {collections.map((collection) => (
          <Card key={collection.id} elevate size='$4' marginBottom='$3'>
            <Card.Header padded>
              <Text fontSize='$5' fontWeight='600'>
                {collection.name}
              </Text>
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
                      <Text fontSize='$3'>{item.clothName}</Text>
                    </YStack>
                  ))}
                </XStack>
              </ScrollView>
            </Card.Footer>
          </Card>
        ))}
      </ScrollView>

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
        <Sheet.Frame padding='$4'>
          <Sheet.Handle />
          <Text fontSize='$5' fontWeight='600' marginBottom='$4'>
            Create New Collection
          </Text>
          <Input
            placeholder='Collection Name'
            value={newCollectionName}
            onChangeText={setNewCollectionName}
            marginBottom='$4'
          />
          <Text fontSize='$4' fontWeight='500' marginBottom='$2'>
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
                        backgroundColor='$gray3'
                        borderRadius='$2'>
                        {({open}: {open: boolean}) => (
                          <>
                            <Text
                              fontSize='$4'
                              fontWeight='600'
                              textTransform='capitalize'>
                              {type}
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
                        <YStack space='$2' padding='$2'>
                          {items.map((item) => (
                            <XStack
                              key={item.id}
                              space='$2'
                              alignItems='center'
                              padding='$2'
                              backgroundColor='$gray2'
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
                              <Text>{item.clothName}</Text>
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
            backgroundColor='$blue10'
            color='white'
            disabled={!newCollectionName || selectedItems.size === 0}>
            Create Collection
          </Button>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}
