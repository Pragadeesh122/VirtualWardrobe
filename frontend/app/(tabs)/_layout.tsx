import {Redirect, Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {useColorScheme} from "react-native";
import {Colors} from "@/constants/Colors";
import {useAuth} from "@/context/authContext";
import {SafeAreaView} from "react-native-safe-area-context";

export default function TabsLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const {isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return <Redirect href='/(auth)/login' />;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#4A72FF",
          tabBarInactiveTintColor: "#A0A3BD",
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: "#2F3142",
            backgroundColor: "#23242F",
            height: 70,
          },
          tabBarItemStyle: {
            paddingVertical: 10,
            height: 70,
          },
          tabBarIconStyle: {
            marginBottom: 4,
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
          name='stats/index'
          options={{
            title: "Statistics",
            headerTitle: "Wardrobe Statistics",
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name='wardrobe/category/[type]'
          options={{
            title: "Category",
            headerTitle: "Wardrobe Category",
            tabBarButton: () => null,
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
                  color === Colors[colorScheme].tint
                    ? "albums"
                    : "albums-outline"
                }
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='calendar/index'
          options={{
            title: "Calendar",
            tabBarLabel: "Calendar",
            headerTitle: "Outfit Calendar",
            tabBarIcon: ({color, size}) => (
              <Ionicons
                name={
                  color === Colors[colorScheme].tint
                    ? "calendar"
                    : "calendar-outline"
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
    </SafeAreaView>
  );
}
