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
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import {useAuth} from "@/context/authContext";
import {Ionicons} from "@expo/vector-icons";
import {createOutfitLog, fetchOutfitLogs} from "@/app/services/calendar";
import {OutfitLog} from "@/types/calendar";
import {Collection} from "@/types/collection";
import {fetchCollections} from "@/app/services/collection";
import {Link, useRouter} from "expo-router";
import {TouchableOpacity} from "react-native";

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>([]);
  const [isAddOutfitOpen, setIsAddOutfitOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const {token} = useAuth();
  const router = useRouter();

  // Fetch outfit logs
  useEffect(() => {
    const loadOutfitLogs = async () => {
      if (token) {
        try {
          const logs = await fetchOutfitLogs(token);
          setOutfitLogs(logs);
        } catch (error) {
          console.error("Error fetching outfit logs:", error);
        }
      }
    };
    loadOutfitLogs();
  }, [token]);

  // Fetch collections
  useEffect(() => {
    const loadCollections = async () => {
      if (token) {
        try {
          const data = await fetchCollections(token);
          setCollections(data);
        } catch (error) {
          console.error("Error loading collections:", error);
        }
      }
    };
    loadCollections();
  }, [token]);

  // Get calendar days
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({start, end});
  };

  const days = getDaysInMonth();

  // Handle adding new outfit log
  const handleAddOutfit = async (collectionId: string) => {
    if (selectedDate && token) {
      try {
        await createOutfitLog(
          format(selectedDate, "yyyy-MM-dd"),
          collectionId,
          token
        );
        const updatedLogs = await fetchOutfitLogs(token);
        setOutfitLogs(updatedLogs);
        setIsAddOutfitOpen(false);
      } catch (error) {
        console.error("Error adding outfit:", error);
      }
    }
  };

  return (
    <YStack flex={1} backgroundColor='$gray1'>
      {/* Calendar Header */}
      <XStack
        paddingHorizontal='$4'
        paddingVertical='$5'
        justifyContent='space-between'
        alignItems='center'
        backgroundColor='$white'>
        <Button
          icon={<Ionicons name='chevron-back' size={24} />}
          onPress={() => setCurrentDate(subMonths(currentDate, 1))}
          transparent
        />
        <Text fontSize='$6' fontWeight='bold'>
          {format(currentDate, "MMMM yyyy")}
        </Text>
        <Button
          icon={<Ionicons name='chevron-forward' size={24} />}
          onPress={() => setCurrentDate(addMonths(currentDate, 1))}
          transparent
        />
      </XStack>

      {/* Weekday Headers */}
      <XStack
        paddingHorizontal='$2'
        paddingVertical='$2'
        backgroundColor='$white'>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text
            key={day}
            width='14.28%'
            textAlign='center'
            fontSize='$4'
            color='$gray11'>
            {day}
          </Text>
        ))}
      </XStack>

      {/* Calendar Grid */}
      <ScrollView>
        <YStack padding='$2'>
          <XStack flexWrap='wrap'>
            {days.map((date) => {
              const dateString = format(date, "yyyy-MM-dd");
              const outfitsForDay = outfitLogs.filter(
                (log) => log.date === dateString
              );

              return (
                <Card
                  key={dateString}
                  width='14.28%'
                  minHeight={120}
                  borderWidth={1}
                  borderColor='$gray5'
                  backgroundColor={
                    isSameMonth(date, currentDate) ? "$white" : "$gray2"
                  }
                  pressStyle={{scale: 0.98}}
                  onPress={() => {
                    setSelectedDate(date);
                    setIsAddOutfitOpen(true);
                  }}>
                  <Text fontSize='$3' color='$gray11' padding='$1'>
                    {format(date, "d")}
                  </Text>
                  <XStack flexWrap='wrap' padding='$0.5'>
                    {outfitsForDay.map((outfit) => (
                      <Image
                        key={outfit.id}
                        source={{uri: outfit.thumbnailUrl}}
                        width={20}
                        height={20}
                        borderRadius='$1'
                        margin='$0.5'
                      />
                    ))}
                  </XStack>
                </Card>
              );
            })}
          </XStack>
        </YStack>

        {/* Stats Section */}
        <YStack padding='$4' space='$4'>
          <Link href='/stats' asChild>
            <Card bordered padding='$4' pressStyle={{scale: 0.98}}>
              <XStack justifyContent='space-between' alignItems='center'>
                <YStack>
                  <Text fontSize='$5' fontWeight='bold' marginBottom='$2'>
                    Wardrobe Statistics
                  </Text>
                  <Text color='$gray11'>
                    {outfitLogs.length} outfits this month
                  </Text>
                </YStack>
                <Ionicons name='chevron-forward' size={24} color='$gray11' />
              </XStack>
            </Card>
          </Link>
        </YStack>
      </ScrollView>

      {/* Collection Selection Sheet */}
      <Sheet
        modal
        open={isAddOutfitOpen}
        onOpenChange={setIsAddOutfitOpen}
        snapPoints={[60]}
        dismissOnSnapToBottom>
        <Sheet.Frame padding='$4'>
          <Sheet.Handle />
          <Text fontSize='$5' fontWeight='bold' marginBottom='$4'>
            Add Outfit for{" "}
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
          </Text>
          <ScrollView style={{maxHeight: 400}}>
            <YStack space='$4'>
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  pressStyle={{scale: 0.98}}
                  onPress={() => handleAddOutfit(collection.id)}
                  padding='$4'
                  bordered>
                  <Text fontSize='$4' fontWeight='600' marginBottom='$2'>
                    {collection.name}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <XStack space='$2'>
                      {collection.items.map((item) => (
                        <Image
                          key={item.clothId}
                          source={{uri: item.imageUrl}}
                          width={50}
                          height={50}
                          borderRadius='$2'
                        />
                      ))}
                    </XStack>
                  </ScrollView>
                </Card>
              ))}
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}
