import React, {useState} from "react";
import {Image} from "react-native";
import {ScrollView, YStack, Input, Button, Text, XStack} from "tamagui";
import {useAuth} from "@/context/authContext";
import * as ImagePicker from "expo-image-picker";
import {uploadFile} from "@/app/services/uplaodFile";
import {router} from "expo-router";

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
        const result = await uploadFile(
          itemName,
          selectedCategory,
          image,
          imageType,
          token
        );
        setSelectedCategory("");
        setItemName("");
        setImage(null);
        setIsUploading(false);
        if (result.success) {
          router.push("/(tabs)/wardrobe");
        }
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <ScrollView flex={1} padding='$4' paddingTop='$6'>
      <XStack
        justifyContent='space-between'
        alignItems='center'
        marginBottom='$4'>
        <Text fontSize='$6' fontWeight='bold'>
          Upload Clothing
        </Text>
        <Button
          onPress={handleLogout}
          size='$3'
          backgroundColor='$red10'
          color='white'>
          Logout
        </Button>
      </XStack>

      <Button
        onPress={pickImage}
        marginBottom='$4'
        backgroundColor='$gray3'
        color='$gray11'>
        Pick an image from camera roll
      </Button>

      {image && (
        <Image
          source={{uri: image}}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 8,
            marginBottom: 16,
          }}
        />
      )}

      <Input
        placeholder='Cloth Name'
        value={itemName}
        onChangeText={setItemName}
        marginBottom='$4'
      />

      <Text fontSize='$5' fontWeight='600' marginBottom='$2'>
        Select Category
      </Text>
      <XStack flexWrap='wrap' gap='$2'>
        {CLOTHING_CATEGORIES.map((category) => (
          <Button
            key={category}
            size='$2'
            onPress={() => setSelectedCategory(category)}
            backgroundColor={
              selectedCategory === category ? "$blue10" : "$gray3"
            }
            color={selectedCategory === category ? "white" : "$gray11"}>
            {category}
          </Button>
        ))}
      </XStack>

      <Button
        onPress={handleUpload}
        disabled={!image || !itemName || !selectedCategory}
        marginTop='$4'
        backgroundColor='$blue10'
        color='white'>
        Upload
      </Button>
    </ScrollView>
  );
}
