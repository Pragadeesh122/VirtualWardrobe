import axios from "axios";
import {API_URL} from "../utils/API_url";
import {
  SuggestionRequest,
  GenerateSuggestionsResponse,
  UserPreferences,
} from "@/types/suggestions";

export async function generateSuggestions(
  selectedItems: string[],
  preferences: UserPreferences,
  token: string
): Promise<GenerateSuggestionsResponse> {
  try {
    console.log("selectedItems", selectedItems);
    console.log("preferences", preferences);
    const response = await axios.post(
      `${API_URL}/suggestions/generate`,
      {
        selectedItems,
        preferences,
      } as SuggestionRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Generate suggestions error:", error);
    throw error;
  }
}
