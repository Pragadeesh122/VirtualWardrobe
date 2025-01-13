import React from "react";
import {View} from "react-native";
import {YStack} from "tamagui";
import {theme} from "@/theme/theme";

function AuthSkeleton() {
  return (
    <YStack
      flex={1}
      justifyContent='center'
      alignItems='center'
      padding='$4'
      space='$4'
      backgroundColor={theme.background}>
      {/* Title */}
      <View
        style={{
          width: 120,
          height: 32,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          marginBottom: 16,
        }}
      />

      {/* Input Fields */}
      {[1, 2].map((index) => (
        <View
          key={index}
          style={{
            width: "100%",
            height: 48,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
            marginBottom: 12,
          }}
        />
      ))}

      {/* Submit Button */}
      <View
        style={{
          width: "100%",
          height: 48,
          backgroundColor: "#e0e0e0",
          borderRadius: 8,
          marginTop: 8,
        }}
      />

      {/* Link Text */}
      <View
        style={{
          width: 200,
          height: 20,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          marginTop: 16,
        }}
      />
    </YStack>
  );
}

export default AuthSkeleton;
