import React, {useState} from "react";
import {ScrollView, Image} from "react-native";
import {YStack, XStack, Text, Button, Input} from "tamagui";
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {useAuth} from "@/context/authContext";
import {router} from "expo-router";
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
    <ScrollView style={{backgroundColor: theme.background}}>
      <YStack padding='$4' space='$5'>
        <XStack
          justifyContent='space-between'
          alignItems='center'
          marginTop='$2'>
          <Text
            fontSize='$9'
            fontWeight='bold'
            color={theme.text}
            letterSpacing={-1}>
            Upload Item
          </Text>
          <Button
            size='$3'
            backgroundColor={theme.buttonBg}
            borderColor={theme.border}
            borderWidth={1}
            pressStyle={{opacity: 0.8}}
            onPress={handleLogout}
            icon={
              <Ionicons
                name='log-out-outline'
                size={18}
                color={theme.textSecondary}
              />
            }>
            <Text color={theme.textSecondary}>Logout</Text>
          </Button>
        </XStack>

        <YStack space='$8'>
          <YStack
            backgroundColor={theme.cardBg}
            borderRadius='$6'
            padding='$6'
            alignItems='center'
            borderColor={theme.border}
            borderWidth={1}>
            {image ? (
              <YStack width='100%' space='$4' alignItems='center'>
                <Image
                  source={{uri: image}}
                  style={{
                    width: "100%",
                    height: 300,
                    borderRadius: 16,
                  }}
                />
                <Button
                  size='$4'
                  backgroundColor={theme.accent}
                  borderRadius='$4'
                  pressStyle={{
                    opacity: 0.9,
                    backgroundColor: theme.accentDark,
                  }}
                  onPress={pickImage}
                  icon={
                    <Ionicons name='camera-outline' size={20} color='white' />
                  }>
                  Change Photo
                </Button>
              </YStack>
            ) : (
              <YStack space='$3' alignItems='center' padding='$8'>
                <Ionicons
                  name='cloud-upload-outline'
                  size={48}
                  color={theme.accent}
                />
                <Button
                  size='$5'
                  backgroundColor={theme.accent}
                  borderRadius='$4'
                  pressStyle={{
                    opacity: 0.9,
                    backgroundColor: theme.accentDark,
                  }}
                  onPress={pickImage}>
                  Choose from Gallery
                </Button>
                <Text color={theme.textSecondary} fontSize='$3'>
                  Select a photo of your item
                </Text>
              </YStack>
            )}
          </YStack>

          <Input
            size='$4'
            placeholder='Item Name'
            value={itemName}
            onChangeText={setItemName}
            backgroundColor={theme.buttonBg}
            borderWidth={1}
            borderColor={theme.border}
            borderRadius='$4'
            placeholderTextColor={theme.textSecondary}
            color={theme.text}
          />

          <YStack space='$3'>
            <Text fontSize='$5' fontWeight='600' color={theme.text}>
              Category
            </Text>
            <XStack flexWrap='wrap' gap='$2'>
              {CLOTHING_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  size='$3'
                  onPress={() => setSelectedCategory(category)}
                  backgroundColor={
                    selectedCategory === category
                      ? theme.accent
                      : theme.buttonBg
                  }
                  color={
                    selectedCategory === category
                      ? theme.text
                      : theme.textSecondary
                  }
                  borderWidth={1}
                  borderColor={
                    selectedCategory === category ? theme.accent : theme.border
                  }
                  pressStyle={{
                    scale: 0.98,
                    opacity: 0.9,
                  }}
                  borderRadius='$4'>
                  {category}
                </Button>
              ))}
            </XStack>
          </YStack>

          <Button
            size='$5'
            backgroundColor={
              !image || !itemName || !selectedCategory || isUploading
                ? theme.buttonBg
                : theme.accent
            }
            color='white'
            disabled={!image || !itemName || !selectedCategory || isUploading}
            onPress={handleUpload}
            opacity={
              !image || !itemName || !selectedCategory || isUploading ? 0.5 : 1
            }
            pressStyle={{
              scale: 0.98,
              backgroundColor: theme.accentDark,
            }}
            icon={<Ionicons name='cloud-upload' size={24} color='white' />}
            borderRadius='$4'
            marginTop='$2'>
            {isUploading ? "Uploading..." : "Upload Item"}
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
