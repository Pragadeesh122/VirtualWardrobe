import {AuthProvider} from "@/context/authContext";
import {config} from "@/tamagui.config";
import {Stack} from "expo-router";
import {TamaguiProvider, Theme} from "tamagui";
import {useEffect, useState} from "react";
import {loadFonts} from "@/utils/fonts";
import {View} from "react-native";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (e) {
        console.warn("Error loading fonts:", e);
      }
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return <View style={{flex: 1}} />;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name='light'>
        <AuthProvider>
          <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name='(auth)' />
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='index' />
          </Stack>
        </AuthProvider>
      </Theme>
    </TamaguiProvider>
  );
}
