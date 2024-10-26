import {AuthProvider} from "@/context/authContext";
import {config} from "@/tamagui.config";
import {Stack} from "expo-router";
import {TamaguiProvider, Theme} from "tamagui";

export default function RootLayout() {
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
