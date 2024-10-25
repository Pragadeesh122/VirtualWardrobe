import React, {useState, useEffect} from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
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

  const toggleAccordion = (clothType: string) => {
    setExpandedTypes((prev) =>
      prev.includes(clothType)
        ? prev.filter((type) => type !== clothType)
        : [...prev, clothType]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Wardrobe</ThemedText>
      <ScrollView
        style={styles.accordionContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {Object.entries(wardrobe).map(([clothType, items]) => (
          <View key={clothType} style={styles.accordionItem}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleAccordion(clothType)}>
              <ThemedText style={styles.accordionTitle}>{clothType}</ThemedText>
              <Ionicons
                name={
                  expandedTypes.includes(clothType)
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={24}
                color='#333'
              />
            </TouchableOpacity>
            {expandedTypes.includes(clothType) && (
              <View style={styles.accordionContent}>
                {items.map((item, index) => (
                  <View key={index} style={styles.clothItem}>
                    <Image
                      source={{uri: item.imageUrl}}
                      style={styles.clothImage}
                    />
                    <View style={styles.clothNameContainer}>
                      <ThemedText style={styles.clothName}>
                        {item.clothName}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  accordionContainer: {
    flex: 1,
  },
  accordionItem: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#e0e0e0",
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  accordionContent: {
    padding: 15,
    flexDirection: "column",
  },
  clothItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    marginBottom: 15,
  },
  clothImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  clothNameContainer: {
    flex: 1,
    marginLeft: 15,
  },
  clothName: {
    fontSize: 16,
    fontWeight: "600",
  },
});
