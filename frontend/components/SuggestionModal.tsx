import React, {useState} from "react";
import {Sheet, YStack, Text, Button, ScrollView, Spinner} from "tamagui";
import {theme} from "@/theme/theme";
import {ClothItem} from "@/types/wardrobe";
import {
  GenerateSuggestionRequest,
  OutfitSuggestion,
  SuggestionPreferences,
} from "@/types/suggestions";
import PreferencesSelector from "./PreferencesSelector";
import SuggestionResults from "./SuggestionResults";
import {generateSuggestions} from "@/app/services/suggestions";
import SelectedItemsPreview from "./SelectedItemsPreview";
import ItemSelector from "./ItemSelector";
import {useAuth} from "@/context/authContext";

const PREFERENCES = {
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

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: string[];
  wardrobeItems: Record<string, ClothItem>;
  onAcceptSuggestion: (items: string[]) => void;
  setSelectedItemsForSuggestion: React.Dispatch<
    React.SetStateAction<Set<string>>
  >;
}

export default function SuggestionModal({
  isOpen,
  onClose,
  selectedItems,
  wardrobeItems,
  onAcceptSuggestion,
  setSelectedItemsForSuggestion,
}: SuggestionModalProps) {
  const {token} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [preferences, setPreferences] = useState<SuggestionPreferences>({
    occasion: [],
    style: [],
    season: [],
    colorPreference: [],
    dresscode: [],
  });
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false);

  const handlePreferenceChange = (
    category: keyof SuggestionPreferences,
    value: string
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const handleGenerate = async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (selectedItems.length === 0) {
      setError("Please select at least one item");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Ensure we're sending valid document IDs
      const validSelectedItems = selectedItems.filter(
        (id) => wardrobeItems[id]?.id === id
      );

      if (validSelectedItems.length === 0) {
        throw new Error("No valid items selected");
      }

      const request: GenerateSuggestionRequest = {
        selectedItems: validSelectedItems,
        preferences,
      };

      console.log("Sending request with items:", validSelectedItems);
      const response = await generateSuggestions(request, token);
      console.log("[SuggestionModal] Received response:", response);
      if (!response || !Array.isArray(response.suggestions)) {
        throw new Error("Invalid response format");
      }
      setSuggestions(response.suggestions);
      console.log("[SuggestionModal] Updated suggestions state:", response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate suggestions"
      );
      setSuggestions([]); // Reset suggestions on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = (items: string[]) => {
    onAcceptSuggestion(items);
    onClose();
  };

  const selectedItemsWithId = selectedItems
    .map((id) => wardrobeItems[id])
    .filter(
      (item): item is ClothItem => item !== undefined && item.id !== undefined
    )
    .map((item) => ({
      id: item.id!,
      imageUrl: item.imageUrl,
      clothName: item.clothName,
    }));

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          setSuggestions([]);
          setError(null);
          onClose();
        }
      }}
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
        <YStack space='$4' flex={1}>
          <Text fontSize='$6' fontWeight='bold' color={theme.text}>
            {suggestions.length > 0
              ? "Outfit Suggestions"
              : "Generate Outfit Suggestions"}
          </Text>

          <ScrollView
            flex={1}
            bounces={false}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}>
            <YStack space='$4' flex={1}>
              {console.log(
                "[SuggestionModal] Current suggestions:",
                suggestions
              )}
              {console.log(
                "[SuggestionModal] Suggestions length:",
                suggestions.length
              )}
              {suggestions.length > 0 ? (
                <SuggestionResults
                  suggestions={suggestions}
                  itemsData={wardrobeItems}
                  onAccept={handleAccept}
                />
              ) : (
                <>
                  <YStack space='$4'>
                    <Button
                      size='$3'
                      backgroundColor={theme.buttonBg}
                      color={theme.text}
                      borderColor={theme.border}
                      borderWidth={1}
                      onPress={() => setIsItemSelectorOpen(true)}>
                      Select Items
                    </Button>
                    <SelectedItemsPreview
                      items={selectedItemsWithId}
                      onRemoveItem={(id) => {
                        setSelectedItemsForSuggestion((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(id);
                          return newSet;
                        });
                      }}
                      onSelectAll={() => {
                        setSelectedItemsForSuggestion(
                          new Set(Object.keys(wardrobeItems))
                        );
                      }}
                      onClearSelection={() => {
                        setSelectedItemsForSuggestion(new Set());
                      }}
                      totalItems={Object.keys(wardrobeItems).length}
                      onSelectItems={() => setIsItemSelectorOpen(true)}
                    />
                  </YStack>

                  <PreferencesSelector
                    preferences={preferences}
                    onPreferenceChange={handlePreferenceChange}
                    preferenceOptions={PREFERENCES}
                  />
                </>
              )}
            </YStack>
          </ScrollView>

          {suggestions.length === 0 && (
            <Button
              size='$3'
              backgroundColor={theme.accent}
              color={theme.text}
              onPress={handleGenerate}
              disabled={isLoading || selectedItems.length === 0}
              borderRadius='$4'
              height={44}
              marginTop='$2'
              marginBottom='$2'
              pressStyle={{opacity: 0.8}}>
              {isLoading ? <Spinner /> : "Generate Suggestions"}
            </Button>
          )}

          {error && (
            <Text color={theme.error} fontSize='$4'>
              {error}
            </Text>
          )}
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
