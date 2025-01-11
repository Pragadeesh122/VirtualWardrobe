export interface UserPreferences {
  occasion: string[];
  style: string[];
  season: string[];
  colorPreference: string[];
  dresscode: string[];
}

export interface SuggestionRequest {
  selectedItems: string[];
  preferences: UserPreferences;
}

export interface SuggestedCollection {
  name: string;
  items: string[];
  confidence: number;
  reason: string;
}

export interface GenerateSuggestionsResponse {
  suggestions: SuggestedCollection[];
}

export interface VisionAnalysisResult {
  itemId: string;
  labels: {
    description: string;
    score: number;
    topicality: number;
  }[];
}

export interface PreferenceOption {
  occasion: readonly string[];
  style: readonly string[];
  season: readonly string[];
  colorPreference: readonly string[];
  dresscode: readonly string[];
}

export interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: string[];
  wardrobeItems: WardrobeItem[];
  onAcceptSuggestion: (suggestion: SuggestedCollection) => void;
  setSelectedItemsForSuggestion: React.Dispatch<
    React.SetStateAction<Set<string>>
  >;
}

export interface SuggestionResultsProps {
  suggestions: SuggestedCollection[];
  itemsData: Record<string, WardrobeItem>;
  onAccept: (suggestion: SuggestedCollection) => void;
  onReject: (suggestionId: string) => void;
}

export interface WardrobeItem {
  id: string;
  imageUrl: string;
  clothName: string;
  clothType: string;
}
