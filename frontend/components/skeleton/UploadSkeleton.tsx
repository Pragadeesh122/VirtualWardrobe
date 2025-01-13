import React from "react";
import {View} from "react-native";
import {YStack, XStack} from "tamagui";
import {theme} from "@/theme/theme";

function UploadSkeleton() {
  return (
    <YStack flex={1} backgroundColor={theme.background} padding='$4'>
      {/* Header */}
      <View
        style={{
          width: 200,
          height: 32,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          marginBottom: 24,
        }}
      />

      {/* Image Upload Area */}
      <View
        style={{
          width: "100%",
          height: 200,
          backgroundColor: "#e0e0e0",
          borderRadius: 8,
          marginBottom: 24,
        }}
      />

      {/* Form Fields */}
      <YStack space='$4'>
        {/* Name Input */}
        <View
          style={{
            width: "100%",
            height: 48,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
          }}
        />

        {/* Categories Grid */}
        <YStack space='$2'>
          <View
            style={{
              width: 120,
              height: 24,
              backgroundColor: "#e0e0e0",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <XStack flexWrap='wrap' gap='$2'>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <View
                key={index}
                style={{
                  width: 100,
                  height: 40,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
            ))}
          </XStack>
        </YStack>

        {/* Submit Button */}
        <View
          style={{
            width: "100%",
            height: 48,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
            marginTop: 16,
          }}
        />
      </YStack>
    </YStack>
  );
}

export default UploadSkeleton;
