import {getStorage} from "firebase-admin/storage";
import {db} from "../config/firebase";
import {
  ClothItem,
  UploadClothItemRequest,
  UploadClothItemResponse,
} from "../types/wardrobe";
import {ApiError} from "../utils/errors/ApiError";

export const wardrobeService = {
  async uploadClothItem(
    data: UploadClothItemRequest
  ): Promise<UploadClothItemResponse> {
    try {
      const storage = getStorage();
      const bucket = storage.bucket("virtualwardrobe-1e2a1");

      // Create a sanitized filename
      const timestamp = Date.now();
      const sanitizedName = data.clothName.replace(/[^a-zA-Z0-9]/g, "_");
      const fileExtension = data.image.mimetype.split("/")[1] || "jpg";
      const fileName = `wardrobe/${data.uid}/${timestamp}_${sanitizedName}.${fileExtension}`;

      const file = bucket.file(fileName);

      // Upload file to Firebase Storage
      try {
        await file.save(data.image.buffer, {
          metadata: {
            contentType: data.image.mimetype,
            metadata: {
              originalName: data.image.originalname,
              uploadedBy: data.email,
              uploadedAt: new Date().toISOString(),
            },
          },
        });
      } catch (error) {
        console.error("Storage upload error:", error);
        throw new ApiError(500, "Failed to upload file to storage");
      }

      // Get the download URL using getSignedUrl
      let imageUrl: string;
      try {
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "03-01-2500", // Set a far future expiration
        });

        // Convert to Firebase Storage download URL format
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(fileName)}?alt=media`;

        console.log("Generated image URL:", imageUrl);
      } catch (error) {
        console.error("Error getting download URL:", error);
        throw new ApiError(500, "Failed to generate download URL");
      }

      // Prepare item data
      const now = new Date().toISOString();
      const clothItem: ClothItem = {
        clothType: data.clothType,
        clothName: data.clothName,
        imageUrl: imageUrl,
        userID: data.uid,
        createdAt: now,
        updatedAt: now,
      };

      // Save to Firestore
      try {
        await db.collection("wardrobeItems").add(clothItem);
      } catch (error) {
        console.error("Firestore save error:", error);
        // If Firestore save fails, try to delete the uploaded file
        try {
          await file.delete();
        } catch (deleteError) {
          console.error(
            "Failed to delete file after Firestore error:",
            deleteError
          );
        }
        throw new ApiError(500, "Failed to save item details");
      }

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error in uploadClothItem:", error);
      throw new ApiError(500, "Failed to process upload");
    }
  },
};
