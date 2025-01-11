import {ClothItem} from "./wardrobe";

export interface SuggestionPreferences {
  occasion: string[];
  style: string[];
  season: string[];
  colorPreference: string[];
  dresscode: string[];
}

export interface GenerateSuggestionRequest {
  selectedItems: string[];
  preferences: SuggestionPreferences;
}

export interface OutfitSuggestion {
  items: {id: string}[];
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
