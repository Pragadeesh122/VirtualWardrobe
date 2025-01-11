import {ClothItem} from "./wardrobe";

export interface SuggestionPreferences {
  occasion: string[];
  style: string[];
  season: string[];
  colorPreference: string[];
  dresscode: string[];
}

export interface GenerateSuggestionRequest {
  userId: string;
  selectedItems: string[];
  preferences: SuggestionPreferences;
}

export interface OutfitSuggestion {
  items: ClothItem[];
  reasoning: string;
  score: number;
  matchingPreferences: string[];
  styleAdvice: string;
}

export interface GenerateSuggestionResponse {
  suggestions: OutfitSuggestion[];
  processingTime: number;
  totalOptions: number;
}

// Types for Gemini API
export interface GeminiItemAttributes {
  color: string;
  pattern?: string;
  material?: string;
  category: string;
}

export interface GeminiItem {
  id: string;
  type: string;
  imageUrl: string;
  attributes: GeminiItemAttributes;
}

export interface GeminiInput {
  items: GeminiItem[];
  preferences: SuggestionPreferences;
}

export interface GeminiOutfitSuggestion {
  itemIds: string[];
  reasoning: string;
  styleAdvice: string;
  confidenceScore: number;
  matchingPreferences: string[];
}

export interface GeminiResponse {
  suggestedOutfits: GeminiOutfitSuggestion[];
}
