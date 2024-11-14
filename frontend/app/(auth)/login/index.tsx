import React, {useState} from "react";
import {YStack, Input, Button, Text} from "tamagui";
import {useAuth} from "@/context/authContext";
import {router} from "expo-router";
import {userLogin} from "@/app/services/auth";

export default function LoginScreen() {
  const {login} = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin() {
    setLoading(true);
    const response = await userLogin(email, password, login);
    if (response) {
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <YStack
      flex={1}
      justifyContent='center'
      alignItems='center'
      padding='$4'
      space='$4'>
      <Text fontSize='$6' fontWeight='bold' marginBottom='$4'>
        Login
      </Text>
      <Input
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        keyboardType='email-address'
        width='100%'
      />
      <Input
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        width='100%'
      />
      <Button
        onPress={handleLogin}
        backgroundColor={loading ? "gray" : "$blue10"}
        color='white'
        width='100%'
        disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
      <Text color='$blue10' onPress={() => router.push("/(auth)/register")}>
        Don't have an account? Register
      </Text>
    </YStack>
  );
}
