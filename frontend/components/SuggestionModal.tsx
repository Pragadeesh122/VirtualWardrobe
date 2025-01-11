import React, {useState} from "react";
import {
  Sheet,
  YStack,
  Text,
  Input,
  Button,
  XStack,
  ScrollView,
  Checkbox,
  Card,
  Image,
  View,
  Switch,
} from "tamagui";
import {useAuth} from "@/context/authContext";
import {generateSuggestions} from "@/app/services/suggestion";
import SelectedItemsPreview from "@/components/SelectedItemsPreview";
import PreferencesSelector from "@/components/PreferencesSelector";

import {
  UserPreferences,
  SuggestedCollection,
  SuggestionModalProps,
  PreferenceOption,
  WardrobeItem,
} from "@/types/suggestions";
import {theme} from "@/theme/theme";
import ItemSelector from "@/components/ItemSelector";

const PREFERENCES: PreferenceOption = {
  occasion: [
    "Formal",
    "Casual",
    "Business",
    "Party",
    "Outdoor",
    "Sports",
    "Date",
  ],
  style: [
    "Classic",
    "Modern",
    "Minimalist",
    "Vintage",
    "Streetwear",
    "Bohemian",
    "Preppy",
  ],
  season: ["Spring", "Summer", "Fall", "Winter"],
  colorPreference: [
    "Neutral",
    "Warm",
    "Cool",
    "Bright",
    "Pastel",
    "Monochrome",
  ],
  dresscode: [
    "Business Formal",
    "Business Casual",
    "Smart Casual",
    "Casual",
    "Cocktail",
    "Black Tie",
  ],
} as const;

export default function SuggestionModal({
  isOpen,
  onClose,
  selectedItems,
  wardrobeItems,
  onAcceptSuggestion,
  setSelectedItemsForSuggestion,
}: SuggestionModalProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    occasion: [],
    style: [],
    season: [],
    colorPreference: [],
    dresscode: [],
  });
  const [suggestions, setSuggestions] = useState<SuggestedCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const {token} = useAuth();
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("No authentication token");
      const itemsToUse = selectedItems;

      const result = await generateSuggestions(itemsToUse, preferences, token);
      // setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[90]}
      position={0}
      dismissOnSnapToBottom>
      <Sheet.Overlay />
      <Sheet.Frame
        padding='$4'
        backgroundColor={theme.background}
        borderTopLeftRadius='$4'
        borderTopRightRadius='$4'>
        <Sheet.Handle />
        <YStack space='$4'>
          <Text fontSize='$6' fontWeight='bold' color={theme.text}>
            Generate Collection Suggestions
          </Text>

          <Button
            size='$3'
            backgroundColor={theme.buttonBg}
            color={theme.text}
            borderColor={theme.border}
            borderWidth={1}
            onPress={() => setIsItemSelectorOpen(true)}>
            Select Items
          </Button>

          <ScrollView style={{maxHeight: "80%"}}>
            <YStack space='$4' paddingBottom='$4'>
              <SelectedItemsPreview
                items={selectedItems
                  .map((id) => wardrobeItems.find((item) => item.id === id))
                  .filter((item): item is WardrobeItem => item !== undefined)}
                onRemoveItem={(id) => {
                  setSelectedItemsForSuggestion((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                  });
                }}
                onSelectAll={() => {
                  setSelectedItemsForSuggestion(
                    new Set(wardrobeItems.map((item) => item.id))
                  );
                }}
                onClearSelection={() => {
                  setSelectedItemsForSuggestion(new Set());
                }}
                totalItems={wardrobeItems.length}
                onSelectItems={() => setIsItemSelectorOpen(true)}
              />

              <PreferencesSelector
                preferences={preferences}
                onPreferenceChange={(category, value) => {
                  setPreferences((prev) => ({
                    ...prev,
                    [category]: prev[category].includes(value)
                      ? prev[category].filter((item) => item !== value)
                      : [...prev[category], value],
                  }));
                }}
                preferenceOptions={PREFERENCES}
              />

              {/* {suggestions.length > 0 && (
                <SuggestionResults
                  suggestions={suggestions}
                  itemsData={wardrobeItems.reduce<Record<string, WardrobeItem>>(
                    (acc, item) => ({
                      ...acc,
                      [item.id]: item,
                    }),
                    {}
                  )}
                  onAccept={onAcceptSuggestion}
                  onReject={(suggestionId) => {
                    setSuggestions((prev) =>
                      prev.filter((s) => s.name !== suggestionId)
                    );
                  }}
                />
              )} */}
            </YStack>
          </ScrollView>

          <Button
            size='$3'
            backgroundColor={theme.accent}
            color={theme.text}
            onPress={handleGenerate}
            disabled={loading || selectedItems.length === 0}
            position='absolute'
            bottom={16}
            left={16}
            right={16}
            borderRadius='$4'
            height={40}>
            {loading ? "Generating..." : "Generate Suggestions"}
          </Button>
        </YStack>
      </Sheet.Frame>

      <ItemSelector
        isOpen={isItemSelectorOpen}
        onClose={() => setIsItemSelectorOpen(false)}
        wardrobeItems={wardrobeItems}
        selectedItems={new Set(selectedItems)}
        onSelectionChange={(newSelection) => {
          setSelectedItemsForSuggestion(newSelection);
        }}
      />
    </Sheet>
  );
}
