import React, {useState, useEffect} from "react";
import {
  ScrollView,
  YStack,
  Text,
  Button,
  Sheet,
  Image,
  XStack,
  Card,
} from "tamagui";
import {format, startOfWeek, addDays} from "date-fns";
import {useAuth} from "@/context/authContext";
import {fetchCollections} from "@/app/services/collection";
import {OutfitLog} from "@/types/calendar";
import {createOutfitLog, fetchOutfitLogs} from "@/app/services/calendar";
import {Ionicons} from "@expo/vector-icons";

interface Collection {
  id: string;
  name: string;
  items: CollectionItem[];
}

interface CollectionItem {
  clothId: string;
  imageUrl: string;
  clothName: string;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isAddOutfitOpen, setIsAddOutfitOpen] = useState(false);
  const {token} = useAuth();

  // First, we need to fetch the collection details for each outfit log
  const [collectionDetails, setCollectionDetails] = useState<{
    [key: string]: Collection;
  }>({});

  useEffect(() => {
    loadCollections();
  }, [token]);

  useEffect(() => {
    const loadCollectionDetails = async () => {
      const details: {[key: string]: Collection} = {};
      for (const log of outfitLogs) {
        try {
          const collection = collections.find((c) => c.id === log.collectionId);
          if (collection) {
            details[log.id] = collection;
          }
        } catch (error) {
          console.error("Error loading collection details:", error);
        }
      }
      setCollectionDetails(details);
    };

    if (outfitLogs.length > 0 && collections.length > 0) {
      loadCollectionDetails();
    }
  }, [outfitLogs, collections]);

  useEffect(() => {
    const loadOutfitLogs = async () => {
      try {
        const logs = await fetchOutfitLogs(token!);
        setOutfitLogs(logs);
      } catch (error) {
        console.error("Error loading outfit logs:", error);
      }
    };

    if (token) {
      loadOutfitLogs();
    }
  }, [token]);

  const loadCollections = async () => {
    try {
      const collectionsData = await fetchCollections(token!);
      setCollections(collectionsData);
    } catch (error) {
      console.error("Error loading collections:", error);
    }
  };

  const getWeekDates = () => {
    const start = startOfWeek(new Date(selectedDate));
    return Array.from({length: 7}, (_, i) => {
      const date = addDays(start, i);
      const dateString = format(date, "yyyy-MM-dd");
      const outfitsForDay = outfitLogs.filter((log) => log.date === dateString);
      return {
        date: dateString,
        dayName: format(date, "EEE"),
        dayNumber: format(date, "d"),
        outfits: outfitsForDay,
      };
    });
  };

  return (
    <ScrollView flex={1} padding='$4' paddingTop='$6' backgroundColor='$gray1'>
      <Text fontSize='$7' fontWeight='bold' marginBottom='$4' color='$gray12'>
        Calendar
      </Text>

      {getWeekDates().map((day) => (
        <YStack key={day.date} marginBottom='$3'>
          <Text fontSize='$2' color='$gray11' marginBottom='$1'>
            {day.dayName} - {format(new Date(day.date), "MMM d")}
          </Text>

          <Card
            bordered
            elevate
            animation='bouncy'
            scale={0.95}
            pressStyle={{scale: 0.975}}
            borderRadius='$4'
            backgroundColor='$white'>
            <Card.Header padded>
              <XStack justifyContent='flex-end'>
                <Button
                  size='$2'
                  theme='active'
                  borderRadius='$6'
                  onPress={() => {
                    setSelectedDate(day.date);
                    setIsAddOutfitOpen(true);
                  }}
                  icon={<Ionicons name='add-circle-outline' size={16} />}>
                  Add
                </Button>
              </XStack>
            </Card.Header>

            <Card.Footer padded>
              <YStack space='$2'>
                {day.outfits?.map((outfit, index) => (
                  <XStack
                    key={index}
                    space='$2'
                    alignItems='center'
                    backgroundColor='$gray2'
                    padding='$2'
                    borderRadius='$4'>
                    <Image
                      source={{uri: outfit.thumbnailUrl}}
                      width={30}
                      height={30}
                      borderRadius='$2'
                    />
                    <Text fontSize='$2' color='$gray11'>
                      {outfit.collectionName}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </Card.Footer>
          </Card>
        </YStack>
      ))}

      <Sheet
        modal
        open={isAddOutfitOpen}
        onOpenChange={setIsAddOutfitOpen}
        snapPoints={[60]}
        position={0}
        dismissOnSnapToBottom>
        <Sheet.Frame padding='$4' backgroundColor='$gray1'>
          <Sheet.Handle />
          <Text
            fontSize='$3'
            fontWeight='600'
            marginBottom='$4'
            color='$gray12'>
            Add outfit for {format(new Date(selectedDate), "MMM d, yyyy")}
          </Text>
          <ScrollView>
            {collections.map((collection) => (
              <Button
                key={collection.id}
                onPress={async () => {
                  try {
                    await createOutfitLog(selectedDate, collection.id, token!);
                    const updatedLogs = await fetchOutfitLogs(token!);
                    setOutfitLogs(updatedLogs);
                    setIsAddOutfitOpen(false);
                  } catch (error) {
                    console.error("Error creating outfit log:", error);
                  }
                }}
                marginBottom='$2'
                bordered
                animation='bouncy'
                pressStyle={{scale: 0.97}}
                backgroundColor='$white'>
                <XStack space='$2' alignItems='center' flex={1}>
                  <Image
                    source={{uri: collection.items[0]?.imageUrl}}
                    width={35}
                    height={35}
                    borderRadius='$2'
                  />
                  <Text fontSize='$2' color='$gray12'>
                    {collection.name}
                  </Text>
                </XStack>
              </Button>
            ))}
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </ScrollView>
  );
}
