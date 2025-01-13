import React from "react";
import {View} from "react-native";
import {YStack, XStack} from "tamagui";

function ItemSelectorSkeleton() {
  return (
    <YStack space='$4' padding='$4'>
      {/* Search Bar Skeleton */}
      <View
        style={{
          width: "100%",
          height: 40,
          backgroundColor: "#e0e0e0",
          borderRadius: 8,
        }}
      />

      {/* Filter Options Skeleton */}
      <XStack space='$2' flexWrap='wrap'>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={{
              width: 80,
              height: 32,
              backgroundColor: "#e0e0e0",
              borderRadius: 16,
              marginBottom: 8,
            }}
          />
        ))}
      </XStack>

      {/* Items Grid */}
      <XStack flexWrap='wrap' gap='$2'>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <YStack key={item} width='31%' space='$2' marginBottom='$2'>
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
              }}
            />
            <View
              style={{
                width: "80%",
                height: 12,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
              }}
            />
          </YStack>
        ))}
      </XStack>
    </YStack>
  );
}

export default ItemSelectorSkeleton;
