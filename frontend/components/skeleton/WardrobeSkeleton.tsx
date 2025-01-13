import React from "react";
import {View} from "react-native";
import {YStack, Card, XStack} from "tamagui";
import {theme} from "@/theme/theme";

function WardrobeSkeleton() {
  return (
    <YStack flex={1} backgroundColor={theme.background} padding='$4'>
      {/* Title Skeleton */}
      <View
        style={{
          width: 200,
          height: 32,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          marginBottom: 24,
        }}
      />

      {/* Categories Skeleton */}
      <YStack space='$4'>
        {[1, 2, 3, 4, 5].map((index) => (
          <Card
            key={index}
            backgroundColor={theme.cardBg}
            borderRadius='$6'
            borderWidth={1}
            borderColor={theme.border}>
            <XStack
              padding='$4'
              justifyContent='space-between'
              alignItems='center'>
              <YStack>
                <View
                  style={{
                    width: 120,
                    height: 24,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />
                <View
                  style={{
                    width: 80,
                    height: 16,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                  }}
                />
              </YStack>
              <View
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 12,
                }}
              />
            </XStack>
          </Card>
        ))}
      </YStack>
    </YStack>
  );
}

export default WardrobeSkeleton;
