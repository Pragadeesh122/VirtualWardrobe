import {ScrollView, StyleSheet, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";

// Mock data for collections
const MOCK_COLLECTIONS = [
  {
    name: "Summer Casual",
    items: ["White T-shirt", "Blue Shorts", "Sneakers"],
  },
  {
    name: "Office Formal",
    items: ["Blue Blazer", "White Shirt", "Black Pants"],
  },
  {
    name: "Weekend Brunch",
    items: ["Floral Dress", "Sandals", "Sun Hat"],
  },
];

export default function CollectionsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Collections</ThemedText>

      <ScrollView style={styles.collectionsContainer}>
        {MOCK_COLLECTIONS.map((collection, index) => (
          <View key={index} style={styles.collectionCard}>
            <ThemedText style={styles.collectionName}>
              {collection.name}
            </ThemedText>
            <View style={styles.itemsList}>
              {collection.items.map((item, itemIndex) => (
                <ThemedText key={itemIndex} style={styles.collectionItem}>
                  • {item}
                </ThemedText>
              ))}
            </View>
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
  collectionsContainer: {
    flex: 1,
  },
  collectionCard: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  itemsList: {
    marginTop: 5,
  },
  collectionItem: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
});
