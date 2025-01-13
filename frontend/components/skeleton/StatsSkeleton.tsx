import React from "react";
import {View, ScrollView} from "react-native";
import {YStack, XStack} from "tamagui";
import {theme} from "@/theme/theme";

function StatsSkeleton() {
  return (
    <ScrollView style={{backgroundColor: theme.background}}>
      <YStack padding='$4' space='$6'>
        {/* Header */}
        <XStack justifyContent='space-between' alignItems='center'>
          <View
            style={{
              width: 200,
              height: 32,
              backgroundColor: "#e0e0e0",
              borderRadius: 4,
            }}
          />
        </XStack>

        {/* Charts Section */}
        <YStack space='$4'>
          {/* Usage Over Time Chart */}
          <View
            style={{
              width: "100%",
              height: 300,
              backgroundColor: theme.cardBg,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.border,
            }}>
            {/* Chart Title */}
            <View
              style={{
                width: 150,
                height: 24,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
                marginBottom: 16,
              }}
            />
            {/* Chart Placeholder */}
            <View
              style={{
                width: "100%",
                height: 240,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
              }}
            />
          </View>

          {/* Category Distribution Chart */}
          <View
            style={{
              width: "100%",
              height: 300,
              backgroundColor: theme.cardBg,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.border,
            }}>
            {/* Chart Title */}
            <View
              style={{
                width: 180,
                height: 24,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
                marginBottom: 16,
              }}
            />
            {/* Chart Placeholder */}
            <View
              style={{
                width: "100%",
                height: 240,
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
              }}
            />
          </View>

          {/* Most Used Items */}
          <View
            style={{
              width: "100%",
              backgroundColor: theme.cardBg,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: theme.border,
            }}>
            {/* Section Title */}
            <View
              style={{
                width: 140,
                height: 24,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
                marginBottom: 16,
              }}
            />
            {/* Items List */}
            <YStack space='$3'>
              {[1, 2, 3].map((index) => (
                <XStack key={index} space='$3' alignItems='center'>
                  {/* Item Image */}
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: "#e0e0e0",
                      borderRadius: 8,
                    }}
                  />
                  {/* Item Details */}
                  <YStack space='$2' flex={1}>
                    <View
                      style={{
                        width: 120,
                        height: 20,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 4,
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
                  {/* Usage Count */}
                  <View
                    style={{
                      width: 40,
                      height: 24,
                      backgroundColor: "#e0e0e0",
                      borderRadius: 4,
                    }}
                  />
                </XStack>
              ))}
            </YStack>
          </View>
        </YStack>
      </YStack>
    </ScrollView>
  );
}

export default StatsSkeleton;
