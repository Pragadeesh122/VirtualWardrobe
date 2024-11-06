import {getStorage} from "firebase-admin/storage";
import {db} from "../config/firebase";
import {
  ClothItem,
  GetItemRequest,
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
      const bucket = storage.bucket("virtualwardrobe-1e2a1.appspot.com");

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

  async getItem(data: GetItemRequest): Promise<ClothItem[]> {
    try {
      const items = await db
        .collection("wardrobeItems")
        .where("userID", "==", data.userId)
        .get();
      return items.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ClothItem),
      }));
    } catch (error) {
      console.error("Error in getItem:", error);
      throw new ApiError(500, "Failed to process get item");
    }
  },

  async deleteClothItem(itemId: string, userId: string) {
    try {
      const itemRef = db.collection("wardrobeItems").doc(itemId);
      const doc = await itemRef.get();

      if (!doc.exists) {
        throw new ApiError(404, "Item not found");
      }

      const itemData = doc.data();
      if (itemData?.userID !== userId) {
        throw new ApiError(403, "Unauthorized to delete this item");
      }

      // Delete from Storage
      const storage = getStorage();
      const bucket = storage.bucket("virtualwardrobe-1e2a1.appspot.com");

      // Get the file path from the imageUrl
      const imageUrl = itemData.imageUrl;
      const filePathMatch = imageUrl.match(/wardrobe%2F.*?(?=\?)/);
      if (!filePathMatch) {
        throw new ApiError(500, "Invalid file path");
      }
      const filePath = decodeURIComponent(filePathMatch[0]);

      // Delete the file
      try {
        await bucket.file(filePath).delete();
      } catch (error) {
        console.error("Error deleting file from storage:", error);
        // Continue with Firestore deletion even if Storage deletion fails
      }

      // Delete from Firestore
      await itemRef.delete();

      return {success: true, message: "Item deleted successfully"};
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error in deleteClothItem:", error);
      throw new ApiError(500, "Failed to delete item");
    }
  },

  async updateClothItem(
    itemId: string,
    updates: {clothName: string},
    userId: string
  ) {
    try {
      const itemRef = db.collection("wardrobeItems").doc(itemId);
      const doc = await itemRef.get();

      if (!doc.exists) {
        throw new ApiError(404, "Item not found");
      }

      const itemData = doc.data();
      if (itemData?.userID !== userId) {
        throw new ApiError(403, "Unauthorized to update this item");
      }

      await itemRef.update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      return {success: true, message: "Item updated successfully"};
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error in updateClothItem:", error);
      throw new ApiError(500, "Failed to update item");
    }
  },
};
