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
import {
  createOutfitLog,
  fetchOutfitLogs,
  deleteOutfitLog,
} from "@/app/services/calendar";
import {OutfitLog} from "@/types/calendar";
import {Collection} from "@/types/collection";
import {fetchCollections} from "@/app/services/collection";
import {Link, useRouter} from "expo-router";
import {TouchableOpacity} from "react-native";

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

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>([]);
  const [isAddOutfitOpen, setIsAddOutfitOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const {token} = useAuth();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [outfitsForSelectedDate, setOutfitsForSelectedDate] = useState<
    OutfitLog[]
  >([]);

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

  useEffect(() => {
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      const outfits = outfitLogs.filter((log) => log.date === dateString);
      setOutfitsForSelectedDate(outfits);
    }
  }, [selectedDate, outfitLogs]);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = endOfMonth(firstDayOfMonth);

    const daysArray = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });

    let firstDayOfWeek = firstDayOfMonth.getDay();

    firstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;
    const paddingDays = firstDayOfWeek - 1;

    const paddingBefore = Array(paddingDays).fill(null);

    return [...paddingBefore, ...daysArray];
  };

  const days = getDaysInMonth();

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDeleteOutfit = async (outfitId: string) => {
    setLoadingDelete(true);
    try {
      await deleteOutfitLog(outfitId, token!);
      const updatedLogs = await fetchOutfitLogs(token!);
      setOutfitLogs(updatedLogs);

      if (selectedDate) {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const outfits = updatedLogs.filter(
          (log: OutfitLog) => log.date === dateString
        );
        setOutfitsForSelectedDate(outfits);
      }
    } catch (error) {
      console.error("Error deleting outfit:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor={theme.background}>
      <XStack
        paddingHorizontal='$4'
        paddingVertical='$5'
        justifyContent='space-between'
        alignItems='center'
        backgroundColor={theme.cardBg}>
        <Button
          icon={<Ionicons name='chevron-back' size={24} color={theme.text} />}
          onPress={handlePreviousMonth}
          transparent
        />
        <Text fontSize='$6' fontWeight='bold' color={theme.text}>
          {format(currentDate, "MMMM yyyy")}
        </Text>
        <Button
          icon={
            <Ionicons name='chevron-forward' size={24} color={theme.text} />
          }
          onPress={handleNextMonth}
          transparent
        />
      </XStack>

      <XStack
        paddingHorizontal='$2'
        paddingVertical='$2'
        backgroundColor={theme.cardBg}>
        {weekDays.map((day) => (
          <Text
            key={day}
            width='14.28%'
            textAlign='center'
            fontSize='$4'
            color={theme.textSecondary}>
            {day}
          </Text>
        ))}
      </XStack>

      <ScrollView>
        <YStack padding='$2'>
          <XStack flexWrap='wrap'>
            {days.map((date, index) => {
              if (!date) {
                return (
                  <Card
                    key={`padding-${index}`}
                    width='14.28%'
                    minHeight={120}
                    borderWidth={1}
                    borderColor={theme.border}
                    backgroundColor={theme.buttonBg}>
                    <Text
                      fontSize='$3'
                      color={theme.textSecondary}
                      padding='$1'>
                      {" "}
                    </Text>
                  </Card>
                );
              }

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
                  borderColor={theme.border}
                  backgroundColor={
                    isSameMonth(date, currentDate)
                      ? theme.cardBg
                      : theme.buttonBg
                  }
                  pressStyle={{scale: 0.98}}
                  onPress={() => {
                    setSelectedDate(date);
                    setIsAddOutfitOpen(true);
                  }}>
                  <Text fontSize='$3' color={theme.text} padding='$1'>
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
      </ScrollView>

      <YStack padding='$4' space='$4'>
        <Link href='/stats' asChild>
          <Card
            bordered
            padding='$4'
            pressStyle={{scale: 0.98}}
            backgroundColor={theme.cardBg}>
            <XStack justifyContent='space-between' alignItems='center'>
              <YStack>
                <Text
                  fontSize='$5'
                  fontWeight='bold'
                  color={theme.text}
                  marginBottom='$2'>
                  Wardrobe Statistics
                </Text>
                <Text color={theme.textSecondary}>
                  {outfitLogs.length} outfits this month
                </Text>
              </YStack>
              <Ionicons
                name='chevron-forward'
                size={24}
                color={theme.textSecondary}
              />
            </XStack>
          </Card>
        </Link>
      </YStack>

      <Sheet
        modal
        open={isAddOutfitOpen}
        onOpenChange={setIsAddOutfitOpen}
        snapPoints={[60]}
        dismissOnSnapToBottom>
        <Sheet.Frame padding='$4'>
          <Sheet.Handle />
          <Text fontSize='$5' fontWeight='bold' marginBottom='$4'>
            Outfits for{" "}
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
          </Text>

          {outfitsForSelectedDate.length > 0 && (
            <YStack space='$4' marginBottom='$4'>
              <Text fontSize='$4' fontWeight='600'>
                Current Outfits
              </Text>
              {outfitsForSelectedDate.map((outfit) => (
                <Card
                  key={outfit.id}
                  padding='$4'
                  bordered
                  backgroundColor={theme.buttonBg}>
                  <XStack justifyContent='space-between' alignItems='center'>
                    <XStack space='$2' flex={1}>
                      <Image
                        source={{uri: outfit.thumbnailUrl}}
                        width={50}
                        height={50}
                        borderRadius='$2'
                      />
                      <Text color={theme.textSecondary}>
                        {outfit.collectionName}
                      </Text>
                    </XStack>
                    <Button
                      icon={
                        <Ionicons
                          name='trash-outline'
                          size={20}
                          color={theme.textSecondary}
                        />
                      }
                      onPress={() => handleDeleteOutfit(outfit.id)}
                      disabled={loadingDelete}
                      backgroundColor='transparent'
                    />
                  </XStack>
                </Card>
              ))}
            </YStack>
          )}
          <Text fontSize='$4' fontWeight='600' marginBottom='$2'>
            Add New Outfit
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
