import {db} from "../config/firebase";
import {
  GenerateSuggestionRequest,
  GenerateSuggestionResponse,
  GeminiInput,
  OutfitSuggestion,
  GeminiOutfitSuggestion,
} from "../types/suggestions";
import {ClothItem} from "../types/wardrobe";
import {ApiError} from "../utils/errors/ApiError";
import {Gemini} from "./gemini";
import logger from "../utils/logger";

export const suggestion = {
  async generateSuggestions(
    data: GenerateSuggestionRequest
  ): Promise<GenerateSuggestionResponse> {
    const startTime = Date.now();

    try {
      // Fetch all selected items from the database
      const itemsSnapshot = await Promise.all(
        data.selectedItems.map((itemId: string) =>
          db.collection("wardrobeItems").doc(itemId).get()
        )
      );

      const items = itemsSnapshot.map(
        (doc: FirebaseFirestore.DocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as ClothItem),
        })
      );

      // Verify all items exist and belong to the user
      if (
        items.some((item: ClothItem) => !item || item.userID !== data.userId)
      ) {
        throw new ApiError(403, "Unauthorized access to wardrobe items");
      }

      // Prepare input for Gemini
      const geminiInput: GeminiInput = {
        items: items.map((item: ClothItem) => ({
          id: item.id!,
          type: item.clothType,
          imageUrl: item.imageUrl,
          attributes: {
            color: item.color || "unknown",
            pattern: item.pattern,
            material: item.material,
            category: item.category || item.clothType,
          },
        })),
        preferences: data.preferences,
      };

      // Generate suggestions using Gemini
      const geminiResponse = await Gemini.generateSuggestions(geminiInput);

      // Transform Gemini response to API response
      const suggestions: OutfitSuggestion[] = await Promise.all(
        geminiResponse.suggestedOutfits.map(
          async (outfit: GeminiOutfitSuggestion) => {
            const outfitItems = items.filter((item: ClothItem) =>
              outfit.itemIds.includes(item.id!)
            );

            return {
              items: outfitItems,
              reasoning: outfit.reasoning,
              score: outfit.confidenceScore,
              matchingPreferences: outfit.matchingPreferences,
              styleAdvice: outfit.styleAdvice,
            };
          }
        )
      );

      const processingTime = Date.now() - startTime;

      // Log successful suggestion generation
      logger.info({
        message: "Successfully generated outfit suggestions",
        userId: data.userId,
        processingTime,
        numberOfSuggestions: suggestions.length,
      });

      return {
        suggestions,
        processingTime,
        totalOptions: suggestions.length,
      };
    } catch (error) {
      logger.error("Error in generateSuggestions:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to generate outfit suggestions");
    }
  },
};
