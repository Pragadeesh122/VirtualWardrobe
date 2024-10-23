import {Stack} from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{headerShown: false}}
      initialRouteName='/(auth)/login'>
      <Stack.Screen name='/(auth)/login' />
      <Stack.Screen name='index' />
      <Stack.Screen name='/(auth)/register' />
    </Stack>
  );
}
