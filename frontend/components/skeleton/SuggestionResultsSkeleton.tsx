import React from "react";
import {View} from "react-native";
import {YStack, XStack, Card} from "tamagui";
import {theme} from "@/theme/theme";

function SuggestionResultsSkeleton() {
  return (
    <YStack space='$4'>
      {[1, 2].map((index) => (
        <Card
          key={index}
          backgroundColor={theme.cardBg}
          padding='$4'
          borderRadius='$4'
          borderWidth={1}
          borderColor={theme.border}>
          <YStack space='$4'>
            {/* Title */}
            <View
              style={{
                width: 120,
                height: 24,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
              }}
            />

            {/* Outfit Items Preview */}
            <XStack space='$3'>
              {[1, 2, 3].map((item) => (
                <YStack key={item} space='$2' alignItems='center'>
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

            {/* Reasoning */}
            <YStack space='$3'>
              <View
                style={{
                  width: "100%",
                  height: 60,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                }}
              />

              {/* Styling Tips */}
              <YStack space='$2'>
                <View
                  style={{
                    width: 100,
                    height: 20,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                  }}
                />
                <View
                  style={{
                    width: "100%",
                    height: 40,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                  }}
                />
              </YStack>

              {/* Matches */}
              <YStack space='$2'>
                <View
                  style={{
                    width: 80,
                    height: 20,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                  }}
                />
                <XStack space='$2' flexWrap='wrap'>
                  {[1, 2, 3].map((item) => (
                    <View
                      key={item}
                      style={{
                        width: 80,
                        height: 32,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 4,
                        marginBottom: 8,
                      }}
                    />
                  ))}
                </XStack>
              </YStack>

              {/* Action Button */}
              <View
                style={{
                  width: "100%",
                  height: 44,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 8,
                  marginTop: 8,
                }}
              />
            </YStack>
          </YStack>
        </Card>
      ))}
    </YStack>
  );
}

export default SuggestionResultsSkeleton;
