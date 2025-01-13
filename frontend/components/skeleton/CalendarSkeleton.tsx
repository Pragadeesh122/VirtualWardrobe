import React from "react";
import {View, ScrollView} from "react-native";
import {YStack, XStack} from "tamagui";
import {theme} from "@/theme/theme";

function CalendarSkeleton() {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daysInMonth = Array(35).fill(null); // 5 weeks x 7 days

  return (
    <YStack flex={1} backgroundColor={theme.background}>
      {/* Header */}
      <XStack
        paddingHorizontal='$4'
        paddingVertical='$5'
        justifyContent='space-between'
        alignItems='center'
        backgroundColor={theme.cardBg}>
        {/* Month Title */}
        <View
          style={{
            width: 150,
            height: 32,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
          }}
        />
      </XStack>

      {/* Weekday Headers */}
      <XStack
        paddingHorizontal='$2'
        paddingVertical='$2'
        backgroundColor={theme.cardBg}>
        {weekDays.map((day) => (
          <View
            key={day}
            style={{
              width: "14.28%",
              height: 24,
              backgroundColor: "#e0e0e0",
              borderRadius: 4,
              margin: 2,
            }}
          />
        ))}
      </XStack>

      {/* Calendar Grid */}
      <ScrollView>
        <YStack padding='$2'>
          <XStack flexWrap='wrap'>
            {daysInMonth.map((_, index) => (
              <View
                key={index}
                style={{
                  width: "14.28%",
                  height: 120,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 8,
                  margin: 1,
                }}
              />
            ))}
          </XStack>
        </YStack>
      </ScrollView>

      {/* Stats Card */}
      <YStack padding='$4' space='$4'>
        <View
          style={{
            width: "100%",
            height: 100,
            backgroundColor: "#e0e0e0",
            borderRadius: 8,
          }}
        />
      </YStack>
    </YStack>
  );
}

export default CalendarSkeleton;
