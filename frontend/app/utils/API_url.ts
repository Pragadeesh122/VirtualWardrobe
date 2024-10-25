import {Platform} from "react-native";

export const API_URL =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_ANDROID_API_URL
    : process.env.EXPO_PUBLIC_IOS_API_URL;
