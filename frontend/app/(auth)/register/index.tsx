import {userRegister} from "@/app/services/auth";
import {router} from "expo-router";
import React, {useState} from "react";
import {YStack, Input, Button, Text, XStack} from "tamagui";
import {AuthSkeleton} from "@/components/skeleton";
import {theme} from "@/theme/theme";
import {Ionicons} from "@expo/vector-icons";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleRegister() {
    setLoading(true);
    const response = await userRegister(username, email, password);
    if (response.success) {
      router.push("/login");
    }
    setLoading(false);
  }

  if (loading) {
    return <AuthSkeleton />;
  }

  return (
    <YStack
      flex={1}
      backgroundColor={theme.background}
      padding='$4'
      space='$4'
      justifyContent='center'>
      <YStack space='$6' marginBottom='$8'>
        <YStack space='$2' alignItems='center'>
          <Text
            fontSize={32}
            fontWeight='800'
            color={theme.text}
            textAlign='center'>
            Create Account
          </Text>
          <Text
            fontSize={16}
            color={theme.textSecondary}
            textAlign='center'
            marginTop='$2'>
            Join Virtual Wardrobe and organize your style
          </Text>
        </YStack>
      </YStack>

      <YStack space='$4'>
        <YStack space='$2'>
          <Text fontSize={14} color={theme.textSecondary} fontWeight='500'>
            Username
          </Text>
          <Input
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
            size='$4'
            borderWidth={2}
            placeholder='Choose a username'
            backgroundColor={theme.cardBg}
            borderColor={theme.border}
            color={theme.text}
            placeholderTextColor={theme.textSecondary}
            focusStyle={{
              borderColor: theme.accent,
            }}
          />
        </YStack>

        <YStack space='$2'>
          <Text fontSize={14} color={theme.textSecondary} fontWeight='500'>
            Email Address
          </Text>
          <Input
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
            keyboardType='email-address'
            size='$4'
            borderWidth={2}
            placeholder='Enter your email'
            backgroundColor={theme.cardBg}
            borderColor={theme.border}
            color={theme.text}
            placeholderTextColor={theme.textSecondary}
            focusStyle={{
              borderColor: theme.accent,
            }}
          />
        </YStack>

        <YStack space='$2'>
          <Text fontSize={14} color={theme.textSecondary} fontWeight='500'>
            Password
          </Text>
          <XStack
            backgroundColor={theme.cardBg}
            borderWidth={2}
            borderColor={theme.border}
            borderRadius='$4'
            alignItems='center'
            focusable
            focusStyle={{
              borderColor: theme.accent,
            }}>
            <Input
              flex={1}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              size='$4'
              placeholder='Create a password'
              backgroundColor='transparent'
              borderWidth={0}
              color={theme.text}
              placeholderTextColor={theme.textSecondary}
            />
            <Button
              backgroundColor='transparent'
              paddingHorizontal='$3'
              onPress={() => setShowPassword(!showPassword)}
              pressStyle={{opacity: 0.7}}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textSecondary}
              />
            </Button>
          </XStack>
          <Text fontSize={12} color={theme.textSecondary} marginTop='$1'>
            Must be at least 8 characters
          </Text>
        </YStack>

        <Button
          onPress={handleRegister}
          backgroundColor={loading ? theme.buttonBg : theme.accent}
          color={theme.text}
          size='$4'
          disabled={loading}
          pressStyle={{
            backgroundColor: theme.accentDark,
          }}
          marginTop='$4'>
          <Text color={theme.text} fontWeight='600'>
            {loading ? "Creating Account..." : "Create Account"}
          </Text>
        </Button>

        <XStack justifyContent='center' marginTop='$4'>
          <Text color={theme.textSecondary}>Already have an account? </Text>
          <Text
            color={theme.accent}
            fontWeight='600'
            onPress={() => router.push("/(auth)/login")}
            pressStyle={{
              opacity: 0.7,
            }}>
            Sign In
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
