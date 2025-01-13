import React from "react";
import {View} from "react-native";
import {YStack, XStack} from "tamagui";

function PreferencesSelectorSkeleton() {
  return (
    <YStack space='$4' padding='$4'>
      {/* Header Skeleton */}
      <View
        style={{
          width: "70%",
          height: 24,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
        }}
      />

      {/* Preferences Options */}
      <YStack space='$4'>
        {[1, 2, 3, 4].map((item) => (
          <XStack key={item} space='$3' alignItems='center'>
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
                width: "60%",
                height: 20,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
              }}
            />
          </XStack>
        ))}
      </YStack>

      {/* Additional Options */}
      <YStack space='$3' marginTop='$4'>
        <View
          style={{
            width: "80%",
            height: 16,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
          }}
        />
        <View
          style={{
            width: "70%",
            height: 16,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
          }}
        />
      </YStack>
    </YStack>
  );
}

export default PreferencesSelectorSkeleton;
