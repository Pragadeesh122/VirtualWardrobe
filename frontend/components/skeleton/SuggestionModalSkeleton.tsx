import React from "react";
import {View} from "react-native";
import {YStack, XStack} from "tamagui";

function SuggestionModalSkeleton() {
  return (
    <YStack space='$4' padding='$4'>
      {/* Header Skeleton */}
      <XStack space='$4' alignItems='center'>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: "#e0e0e0",
            borderRadius: 20,
          }}
        />
        <View
          style={{
            width: 200,
            height: 24,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
          }}
        />
      </XStack>

      {/* Content Skeleton */}
      <YStack space='$4'>
        {/* Suggestion Items */}
        {[1, 2, 3].map((item) => (
          <XStack key={item} space='$4' alignItems='center'>
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
              }}
            />
            <YStack space='$2' flex={1}>
              <View
                style={{
                  width: "80%",
                  height: 20,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                }}
              />
              <View
                style={{
                  width: "60%",
                  height: 16,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                }}
              />
            </YStack>
          </XStack>
        ))}
      </YStack>

      {/* Bottom Actions Skeleton */}
      <XStack space='$4' justifyContent='flex-end'>
        <View
          style={{
            width: 100,
            height: 40,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
          }}
        />
        <View
          style={{
            width: 100,
            height: 40,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
          }}
        />
      </XStack>
    </YStack>
  );
}

export default SuggestionModalSkeleton;
