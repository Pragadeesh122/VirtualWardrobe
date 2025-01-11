import React from "react";
import {YStack, Text, XStack, Button} from "tamagui";
import {SuggestionPreferences} from "@/types/suggestions";

interface PreferencesSelectorProps {
  preferences: SuggestionPreferences;
  onPreferenceChange: (
    category: keyof SuggestionPreferences,
    value: string
  ) => void;
  preferenceOptions: Record<keyof SuggestionPreferences, readonly string[]>;
}

export default function PreferencesSelector({
  preferences,
  onPreferenceChange,
  preferenceOptions,
}: PreferencesSelectorProps) {
  return (
    <YStack space='$4'>
      {(
        Object.entries(preferenceOptions) as [
          keyof SuggestionPreferences,
          string[]
        ][]
      ).map(([category, options]) => (
        <YStack key={category}>
          <Text
            marginBottom='$2'
            fontSize='$6'
            fontWeight='bold'
            color='$gray11'
            textTransform='capitalize'>
            {category.replace(/([A-Z])/g, " $1").trim()}
          </Text>
          <XStack flexWrap='wrap' gap='$2' marginBottom='$4'>
            {options.map((option) => (
              <Button
                key={option}
                size='$3'
                borderRadius='$4'
                backgroundColor={
                  preferences[category].includes(option)
                    ? "$blue8"
                    : "transparent"
                }
                borderColor={
                  preferences[category].includes(option) ? "$blue8" : "$gray8"
                }
                borderWidth={1}
                color={
                  preferences[category].includes(option) ? "white" : "$gray11"
                }
                onPress={() => onPreferenceChange(category, option)}>
                {option}
              </Button>
            ))}
          </XStack>
        </YStack>
      ))}
    </YStack>
  );
}
