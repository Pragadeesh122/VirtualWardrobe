import {Platform} from "react-native";

// Use your computer's IP address when running on Android
const developmentUrl = Platform.select({
  ios: "http://localhost:3000",
  android: "http://10.0.2.2:3000", // Android Studio Emulator
  // If using Genymotion, use: 'http://10.0.3.2:3000'
});

export const API_URL = process.env.EXPO_PUBLIC_API_URL || developmentUrl;
