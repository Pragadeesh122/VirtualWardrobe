import React from "react";
import {View, ScrollView} from "react-native";
import {YStack, XStack} from "tamagui";
import {theme} from "@/theme/theme";

function CollectionsSkeleton() {
  return (
    <YStack flex={1} backgroundColor={theme.background} padding='$4'>
      {/* Header */}
      <XStack
        justifyContent='space-between'
        alignItems='center'
        marginBottom='$4'>
        {/* Title */}
        <View
          style={{
            width: 200,
            height: 32,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
          }}
        />
        {/* Add Button */}
        <View
          style={{
            width: 100,
            height: 40,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
          }}
        />
      </XStack>

      {/* Collections List */}
      <ScrollView>
        {[1, 2, 3].map((index) => (
          <View
            key={index}
            style={{
              width: "100%",
              backgroundColor: theme.cardBg,
              borderRadius: 12,
              marginBottom: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.border,
            }}>
            {/* Collection Header */}
            <XStack
              justifyContent='space-between'
              alignItems='center'
              marginBottom='$4'>
              {/* Collection Name */}
              <View
                style={{
                  width: 150,
                  height: 24,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                }}
              />
              {/* Delete Button */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 8,
                }}
              />
            </XStack>

            {/* Collection Items */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack space='$2'>
                {[1, 2, 3, 4].map((itemIndex) => (
                  <YStack key={itemIndex} alignItems='center' space='$2'>
                    {/* Item Image */}
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 8,
                      }}
                    />
                    {/* Item Name */}
                    <View
                      style={{
                        width: 60,
                        height: 16,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 4,
                      }}
                    />
                  </YStack>
                ))}
              </XStack>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </YStack>
  );
}

export default CollectionsSkeleton;
