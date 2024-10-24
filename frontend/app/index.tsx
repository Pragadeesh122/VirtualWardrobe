import {useAuth} from "@/context/authContext";
import {Redirect} from "expo-router";
import {View, Text} from "react-native";

export default function Index() {
  const {isLoading, isAuthenticated} = useAuth();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href='/(auth)/login' />;
  }

  return <Redirect href='/(tabs)/upload' />;
}
