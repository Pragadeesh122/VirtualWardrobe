import {userRegister} from "@/app/services/auth";
import {Link, router} from "expo-router";
import {useState} from "react";
import {YStack, Input, Button, Text} from "tamagui";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleRegister() {
    setLoading(true);
    const response = await userRegister(username, email, password);
    console.log(response);
    if (response.success) {
      router.push("/login");
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
        Register
      </Text>
      <Input
        placeholder='Username'
        value={username}
        onChangeText={setUsername}
        autoCapitalize='none'
        width='100%'
      />
      <Input
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
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
        onPress={handleRegister}
        disabled={loading}
        opacity={loading ? 0.5 : 1}
        backgroundColor='$blue10'
        color='white'
        width='100%'>
        {loading ? "Registering..." : "Register"}
      </Button>
      <Link href='/(auth)/login' asChild>
        <Text color='$blue10'>Already have an account? Login</Text>
      </Link>
    </YStack>
  );
}
