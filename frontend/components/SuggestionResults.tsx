import React from "react";
import {Card, Text, YStack, XStack, ScrollView, Button} from "tamagui";
import {Image} from "react-native";
import {theme} from "@/theme/theme";
import {OutfitSuggestion} from "@/types/suggestions";
import {ClothItem} from "@/types/wardrobe";

interface SuggestionResultsProps {
  suggestions: OutfitSuggestion[];
  itemsData: Record<string, ClothItem>;
  onAccept: (items: string[]) => void;
}

export default function SuggestionResults({
  suggestions,
  itemsData,
  onAccept,
}: SuggestionResultsProps) {
  console.log("[SuggestionResults] Rendering with suggestions:", suggestions);
  console.log("[SuggestionResults] Available itemsData:", itemsData);

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    console.log("[SuggestionResults] No valid suggestions to display");
    return null;
  }

  return (
    <YStack space='$4'>
      {suggestions.map((suggestion, index) => {
        console.log(
          `[SuggestionResults] Rendering suggestion ${index + 1}:`,
          suggestion
        );
        return (
          <Card
            key={index}
            backgroundColor={theme.cardBg}
            padding='$4'
            borderRadius='$4'
            borderWidth={1}
            borderColor={theme.border}>
            <YStack space='$4'>
              <Text color={theme.text} fontSize='$5' fontWeight='bold'>
                Outfit {index + 1}
              </Text>

              {/* Outfit Items Preview */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{padding: 2}}>
                <XStack space='$3'>
                  {suggestion.items.map((itemId) => {
                    console.log("Item ID:", itemId);
                    const item = itemsData[itemId.id];
                    console.log(`[SuggestionResults] Item ${itemId.id}:`, item);
                    console.log(
                      `[SuggestionResults] Image URL for ${itemId.id}:`,
                      item?.imageUrl
                    );
                    return item ? (
                      <YStack key={itemId.id} space='$2' alignItems='center'>
                        <Card
                          width={100}
                          height={100}
                          borderRadius='$2'
                          overflow='hidden'
                          borderWidth={1}
                          borderColor={theme.border}>
                          <Image
                            source={{uri: item.imageUrl}}
                            style={{
                              width: 100,
                              height: 100,
                              resizeMode: "cover",
                            }}
                            onError={(error) =>
                              console.error(
                                `[SuggestionResults] Image load error for ${itemId.id}:`,
                                error
                              )
                            }
                          />
                        </Card>
                        <Text
                          color={theme.textSecondary}
                          fontSize='$3'
                          textAlign='center'>
                          {item.clothName}
                        </Text>
                      </YStack>
                    ) : null;
                  })}
                </XStack>
              </ScrollView>

              {/* Outfit Details */}
              <YStack space='$3'>
                <Text color={theme.textSecondary} fontSize='$4' lineHeight={24}>
                  {suggestion.reasoning.replace(/\[ID:[^\]]+\]/g, "")}
                </Text>

                <YStack space='$2'>
                  <Text color={theme.accent} fontSize='$4' fontWeight='bold'>
                    Styling Tips:
                  </Text>
                  <Text
                    color={theme.textSecondary}
                    fontSize='$4'
                    lineHeight={24}>
                    {suggestion.styleAdvice}
                  </Text>
                </YStack>

                <YStack space='$2'>
                  <Text color={theme.accent} fontSize='$4' fontWeight='bold'>
                    Matches:
                  </Text>

                  <XStack space='$2' flexWrap='wrap'>
                    {suggestion.matchingPreferences.map((pref, i) => (
                      <Card
                        key={i}
                        backgroundColor={theme.buttonBg}
                        paddingHorizontal='$3'
                        paddingVertical='$2'
                        borderRadius='$2'>
                        <Text color={theme.textSecondary} fontSize='$3'>
                          {pref}
                        </Text>
                      </Card>
                    ))}
                  </XStack>
                </YStack>

                {/* Action Button */}
                <Button
                  backgroundColor={theme.accent}
                  color={theme.text}
                  onPress={() => {
                    console.log(
                      "[SuggestionResults] Accepting outfit with items:",
                      suggestion.items
                    );
                    console.log(
                      "[SuggestionResults] Item details:",
                      suggestion.items.map((item) => ({
                        id: item.id,
                        item: itemsData[item.id],
                      }))
                    );
                    onAccept(suggestion.items.map((item) => item.id));
                  }}
                  marginTop='$2'
                  height={44}
                  borderRadius='$4'>
                  Use This Outfit
                </Button>
              </YStack>
            </YStack>
          </Card>
        );
      })}
    </YStack>
  );
}
