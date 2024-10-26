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
} from "tamagui";
import {Ionicons} from "@expo/vector-icons";
import {fetchWardrobe} from "@/app/services/uplaodFile";
import {useAuth} from "@/context/authContext";
import {useIsFocused} from "@react-navigation/native";

type ClothItem = {
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
                      <XStack key={index} space='$4' alignItems='center'>
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
                    ))}
                  </YStack>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </YStack>
        ))}
      </ScrollView>
    </YStack>
  );
}
