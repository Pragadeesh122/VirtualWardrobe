import React, {useState, useEffect} from "react";
import {RefreshControl} from "react-native";
import {ScrollView, YStack, XStack, Text, Card} from "tamagui";
import {Ionicons} from "@expo/vector-icons";
import {fetchWardrobe} from "@/app/services/uplaodFile";
import {useAuth} from "@/context/authContext";
import {useIsFocused} from "@react-navigation/native";
import {ClothItem, Wardrobe} from "@/types/wardrobe";
import {Link} from "expo-router";

// Use the same theme from upload screen
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

export default function WardrobeScreen() {
  const [wardrobe, setWardrobe] = useState<Wardrobe>({});
  const [refreshing, setRefreshing] = useState(false);
  const {user, token} = useAuth();
  const isFocused = useIsFocused();

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
  }, [isFocused]);

  return (
    <YStack flex={1} backgroundColor={theme.background}>
      <ScrollView
        flex={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{padding: 16}}>
        <Text
          fontSize={32}
          fontWeight='bold'
          color={theme.text}
          marginBottom={24}
          letterSpacing={-1}>
          My Wardrobe
        </Text>

        <YStack space='$4'>
          {Object.entries(wardrobe).map(([type, items]) => (
            <Link key={type} href={`/(tabs)/wardrobe/category/${type}`} asChild>
              <Card
                backgroundColor={theme.cardBg}
                borderRadius='$6'
                borderWidth={1}
                borderColor={theme.border}
                pressStyle={{scale: 0.98}}>
                <XStack
                  padding='$4'
                  justifyContent='space-between'
                  alignItems='center'>
                  <YStack>
                    <Text fontSize='$5' fontWeight='600' color={theme.text}>
                      {type}
                    </Text>
                    <Text fontSize='$3' color={theme.textSecondary}>
                      {items.length} items
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
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
