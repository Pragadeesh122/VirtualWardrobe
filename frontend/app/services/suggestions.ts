import axios from "axios";
import {API_URL} from "@/config/constants";
import {
  GenerateSuggestionRequest,
  GenerateSuggestionResponse,
} from "@/types/suggestions";

export async function generateSuggestions(
  request: GenerateSuggestionRequest,
  token: string
): Promise<GenerateSuggestionResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/suggestions/generate`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
}
