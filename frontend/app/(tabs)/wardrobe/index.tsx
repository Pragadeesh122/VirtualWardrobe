import React, {useState} from "react";
import {ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";

// Define a type for the wardrobe
type Wardrobe = {
  [category: string]: string[];
};

// Use the type for MOCK_WARDROBE
const MOCK_WARDROBE: Wardrobe = {
  "T-shirts": ["Black V-neck", "White Basic Tee", "Striped Polo"],
  Pants: ["Blue Jeans", "Black Slacks", "Khaki Chinos"],
  Dresses: ["Summer Floral", "Black Cocktail", "Maxi Dress"],
  // Add more categories as needed
};

export default function WardrobeScreen() {
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(MOCK_WARDROBE)[0]
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Wardrobe</ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}>
        {Object.keys(MOCK_WARDROBE).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.selectedCategoryTab,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <ThemedText
              style={[
                styles.categoryTabText,
                selectedCategory === category && styles.selectedCategoryTabText,
              ]}>
              {category} ({MOCK_WARDROBE[category as keyof Wardrobe].length})
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.itemsContainer}>
        {MOCK_WARDROBE[selectedCategory].map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <ThemedText style={styles.itemName}>{item}</ThemedText>
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
  categoryScroll: {
    flexGrow: 0,
    marginBottom: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  selectedCategoryTab: {
    backgroundColor: "#007AFF",
  },
  categoryTabText: {
    color: "#333",
  },
  selectedCategoryTabText: {
    color: "#fff",
  },
  itemsContainer: {
    flex: 1,
  },
  itemCard: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemName: {
    fontSize: 16,
  },
});
