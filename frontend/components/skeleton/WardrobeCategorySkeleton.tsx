import React from "react";
import {View} from "react-native";
import {YStack, XStack} from "tamagui";
import {theme} from "@/theme/theme";

function WardrobeCategorySkeleton() {
  return (
    <YStack flex={1} backgroundColor={theme.background}>
      {/* Header */}
      <XStack
        padding='$4'
        alignItems='center'
        space='$3'
        backgroundColor={theme.cardBg}>
        <View
          style={{
            width: 24,
            height: 24,
            backgroundColor: "#e0e0e0",
            borderRadius: 12,
          }}
        />
        <View
          style={{
            width: 120,
            height: 24,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
          }}
        />
      </XStack>

      {/* Items List */}
      <YStack padding='$4' space='$4'>
        {[1, 2, 3, 4].map((index) => (
          <XStack
            key={index}
            backgroundColor={theme.cardBg}
            borderRadius='$4'
            padding='$4'
            space='$4'
            borderWidth={1}
            borderColor={theme.border}>
            {/* Image Placeholder */}
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
              }}
            />
            <YStack flex={1} justifyContent='space-between'>
              {/* Title */}
              <View
                style={{
                  width: "80%",
                  height: 20,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                }}
              />
              {/* Action Buttons */}
              <XStack space='$2'>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 8,
                  }}
                />
              </XStack>
            </YStack>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}

export default WardrobeCategorySkeleton;
