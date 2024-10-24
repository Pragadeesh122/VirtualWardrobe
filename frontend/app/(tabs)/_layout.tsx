import {Redirect, Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useColorScheme} from "react-native";
import {Colors} from "@/constants/Colors";
import {useAuth} from "@/context/authContext";

export default function TabsLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const {isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return <Redirect href='/(auth)/login' />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colorScheme === "dark" ? "#1f1f1f" : "#e5e5e5",
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          height: 80,
        },
      }}>
      <Tabs.Screen
        name='upload/index'
        options={{
          title: "Upload",
          tabBarLabel: "Upload",
          headerTitle: "Add Item",
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name={
                color === Colors[colorScheme].tint
                  ? "add-circle"
                  : "add-circle-outline"
              }
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='wardrobe/index'
        options={{
          title: "Wardrobe",
          tabBarLabel: "Wardrobe",
          headerTitle: "My Wardrobe",
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name={
                color === Colors[colorScheme].tint ? "shirt" : "shirt-outline"
              }
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='collections/index'
        options={{
          title: "Collections",
          tabBarLabel: "Collections",
          headerTitle: "My Collections",
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name={
                color === Colors[colorScheme].tint ? "albums" : "albums-outline"
              }
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='index'
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
