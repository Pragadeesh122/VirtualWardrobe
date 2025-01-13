import React from "react";
import {View} from "react-native";
import {YStack, XStack} from "tamagui";

function SelectedItemsPreviewSkeleton() {
  return (
    <YStack space='$4' padding='$4'>
      {/* Header Skeleton */}
      <View
        style={{
          width: "50%",
          height: 24,
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
        }}
      />

      {/* Selected Items Preview */}
      <XStack space='$3' flexWrap='wrap'>
        {[1, 2, 3].map((item) => (
          <YStack key={item} space='$2' marginBottom='$3'>
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
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
        ))}
      </XStack>

      {/* Action Buttons */}
      <XStack space='$4' justifyContent='flex-end' marginTop='$2'>
        <View
          style={{
            width: 120,
            height: 40,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
          }}
        />
        <View
          style={{
            width: 120,
            height: 40,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
          }}
        />
      </XStack>
    </YStack>
  );
}

export default SelectedItemsPreviewSkeleton;
