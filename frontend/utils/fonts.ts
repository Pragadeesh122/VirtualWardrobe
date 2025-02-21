import * as Font from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      Inter: Inter_400Regular,
      InterMedium: Inter_500Medium,
      InterSemiBold: Inter_600SemiBold,
      InterBold: Inter_700Bold,
    });
  } catch (error) {
    console.error("Error loading fonts:", error);
    // Fallback to system fonts if loading fails
    await Font.loadAsync({
      Inter: "System",
      InterMedium: "System",
      InterSemiBold: "System",
      InterBold: "System",
    });
  }
};
