import {AuthProvider} from "@/context/authContext";
import {Stack} from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='index' />
      </Stack>
    </AuthProvider>
  );
}
