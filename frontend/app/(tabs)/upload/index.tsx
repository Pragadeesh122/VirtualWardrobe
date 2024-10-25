import React, {useState} from "react";
import {View, StyleSheet, ScrollView, Image} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {ThemedView} from "@/components/ThemedView";
import {TextInput, TouchableOpacity} from "react-native";
import {useAuth} from "@/context/authContext";
import * as ImagePicker from "expo-image-picker";
import {uploadFile} from "@/app/services/uplaodFile";

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
  const [image, setImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {logout, token} = useAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Result:", result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageType(result.assets[0].mimeType || null);
      console.log("This is the image:", result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedCategory && itemName && image && imageType) {
      if (token) {
        setIsUploading(true);
        await uploadFile(itemName, selectedCategory, image, imageType, token);
        setSelectedCategory("");
        setItemName("");
        setImage(null);
        setIsUploading(false);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText style={styles.title}>Add New Item</ThemedText>

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

        <ThemedText style={styles.sectionTitle}>Item Image:</ThemedText>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <ThemedText style={styles.imagePickerText}>
            {image ? "Change Image" : "Upload Image"}
          </ThemedText>
        </TouchableOpacity>
        {image && <Image source={{uri: image}} style={styles.imagePreview} />}

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedCategory || !itemName || !image) &&
              styles.uploadButtonDisabled,
            isUploading && styles.uploadButtonUploading,
          ]}
          onPress={handleUpload}
          disabled={!selectedCategory || !itemName || !image || isUploading}>
          <ThemedText style={styles.uploadButtonText}>
            {isUploading ? "Uploading..." : "Upload Item"}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryText: {
    fontSize: 12,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 36,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
  },
  imagePicker: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 14,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  uploadButtonDisabled: {
    backgroundColor: "#ccc",
  },
  uploadButtonUploading: {
    backgroundColor: "#4DA6FF", // A lighter shade of blue
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  logoutButtonText: {
    fontSize: 12,
    color: "#333",
  },
});
