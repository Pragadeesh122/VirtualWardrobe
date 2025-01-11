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

export interface GeminiItem {
  id: string;
  clothName: string;
  clothType: string;
  imageUrl: string;
  userID?: string;
  createdAt: string;
  updatedAt: string;
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
