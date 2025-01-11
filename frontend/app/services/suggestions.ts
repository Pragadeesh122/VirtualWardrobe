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
    console.log("API URL:", API_URL);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Request:", {
      selectedItems: request.selectedItems,
      preferences: request.preferences,
    });

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

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        },
      });
    } else {
      console.error("Generate suggestions error:", error);
    }
    throw error;
  }
}
