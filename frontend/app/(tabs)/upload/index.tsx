import React, {useState} from "react";
import {View, StyleSheet, ScrollView, Pressable, Text} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import {TextInput, TouchableOpacity} from "react-native";
import {useAuth} from "@/context/authContext";

const CLOTHING_CATEGORIES = [
  "T-shirts",
  "Shirts",
  "Pants",
  "Shorts",
  "Suits",
  "Blazers",
  "Crop tops",
  "Dresses",
  "Skirts",
  "Jackets",
  "Sweaters",
  "Accessories",
];

export default function UploadScreen() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const {logout} = useAuth();

  const handleUpload = () => {
    if (selectedCategory && itemName) {
      // Here you would typically handle the upload to your backend
      console.log("Uploading:", {category: selectedCategory, name: itemName});
      // Reset form
      setSelectedCategory("");
      setItemName("");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Pressable onPress={() => logout()}>
        <Text>Logout</Text>
      </Pressable>
      <ThemedText style={styles.title}>Add New Item</ThemedText>

      <ScrollView style={styles.categoryContainer}>
        <ThemedText style={styles.sectionTitle}>Select Category:</ThemedText>
        <View style={styles.categoryGrid}>
          {CLOTHING_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}>
              <ThemedText
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}>
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <ThemedText style={styles.sectionTitle}>Item Name:</ThemedText>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
          placeholder='Enter item name'
          placeholderTextColor='#999'
        />

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedCategory || !itemName) && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!selectedCategory || !itemName}>
          <ThemedText style={styles.uploadButtonText}>Upload Item</ThemedText>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  categoryContainer: {
    flex: 1,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  selectedCategory: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryText: {
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  uploadButtonDisabled: {
    backgroundColor: "#ccc",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
