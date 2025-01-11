import {GoogleGenerativeAI} from "@google/generative-ai";
import {GeminiInput, GeminiResponse, GeminiItem} from "../types/suggestions";
import {ApiError} from "../utils/errors/ApiError";
import logger from "../utils/logger";
import {getStorage} from "firebase-admin/storage";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({model: "gemini-pro-vision"});

export class Gemini {
  private static async generateImageParts(items: GeminiInput["items"]) {
    try {
      const storage = getStorage();
      const bucket = storage.bucket("virtualwardrobe-1e2a1.appspot.com");

      const imageParts = await Promise.all(
        items.map(async (item: GeminiItem) => {
          try {
            // Get the file path from the imageUrl
            const filePathMatch = item.imageUrl.match(/wardrobe%2F.*?(?=\?)/);
            if (!filePathMatch) {
              throw new Error("Invalid file path in URL");
            }
            const filePath = decodeURIComponent(filePathMatch[0]);

            // Get the file
            const file = bucket.file(filePath);
            const [exists] = await file.exists();

            if (!exists) {
              throw new Error(`Image file not found: ${filePath}`);
            }

            // Download and convert to base64
            const [buffer] = await file.download();
            const base64Data = buffer.toString("base64");

            // Get the content type
            const [metadata] = await file.getMetadata();
            const mimeType = metadata.contentType || "image/jpeg";

            return {
              inlineData: {
                data: base64Data,
                mimeType,
              },
            };
          } catch (error) {
            logger.error(`Error processing image for item ${item.id}:`, error);
            throw new ApiError(
              500,
              `Failed to process image for item ${item.id}`
            );
          }
        })
      );
      return imageParts;
    } catch (error) {
      logger.error("Error generating image parts:", error);
      throw new ApiError(500, "Failed to process images for Gemini");
    }
  }

  private static generatePrompt(input: GeminiInput): string {
    return `As a fashion expert, analyze these clothing items and create outfit suggestions based on the following preferences:
    
Occasions: ${input.preferences.occasion.join(", ")}
Styles: ${input.preferences.style.join(", ")}
Seasons: ${input.preferences.season.join(", ")}
Color Preferences: ${input.preferences.colorPreference.join(", ")}
Dress Codes: ${input.preferences.dresscode.join(", ")}

For each item, consider:
- Color: ${input.items
      .map((item: GeminiItem) => item.attributes.color)
      .join(", ")}
- Type: ${input.items.map((item: GeminiItem) => item.type).join(", ")}
- Category: ${input.items
      .map((item: GeminiItem) => item.attributes.category)
      .join(", ")}

Please provide 3 outfit suggestions in the following JSON format:
{
  "suggestedOutfits": [
    {
      "itemIds": ["id1", "id2"],
      "reasoning": "Detailed explanation of why these items work together",
      "styleAdvice": "Additional styling tips",
      "confidenceScore": 0.95,
      "matchingPreferences": ["preference1", "preference2"]
    }
  ]
}

Focus on creating cohesive outfits that match the specified preferences and style guidelines.`;
  }

  public static async generateSuggestions(
    input: GeminiInput
  ): Promise<GeminiResponse> {
    try {
      const imageParts = await this.generateImageParts(input.items);
      const prompt = this.generatePrompt(input);

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      const text = response.text();

      try {
        const jsonResponse = JSON.parse(text) as GeminiResponse;
        return jsonResponse;
      } catch (error) {
        logger.error("Error parsing Gemini response:", error);
        throw new ApiError(500, "Failed to parse Gemini response");
      }
    } catch (error) {
      logger.error("Error in Gemini suggestion generation:", error);
      throw new ApiError(
        500,
        "Failed to generate outfit suggestions using Gemini"
      );
    }
  }
}
