import {db} from "../config/firebase";
import {CollectionItem, CreateCollectionRequest} from "../types/collections";
import {ApiError} from "../utils/errors/ApiError";

export const collectionsService = {
  async createCollection(
    userId: string,
    data: CreateCollectionRequest
  ): Promise<CollectionItem> {
    try {
      const now = new Date().toISOString();

      // Validate that all cloth items exist and belong to the user
      const clothItems = await Promise.all(
        data.items.map(async (clothId) => {
          const clothDoc = await db
            .collection("wardrobeItems")
            .doc(clothId)
            .get();

          if (!clothDoc.exists) {
            throw new ApiError(404, `Cloth item ${clothId} not found`);
          }

          const clothData = clothDoc.data();
          if (clothData?.userID !== userId) {
            throw new ApiError(403, "Unauthorized access to cloth item");
          }

          return {
            clothId: clothDoc.id,
            imageUrl: clothData.imageUrl,
            clothName: clothData.clothName,
            clothType: clothData.clothType,
          };
        })
      );

      const collection: Omit<CollectionItem, "id"> = {
        name: data.name,
        items: clothItems,
        userId,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection("collections").add(collection);

      return {
        id: docRef.id,
        ...collection,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error in createCollection:", error);
      throw new ApiError(500, "Failed to create collection");
    }
  },

  async getUserCollections(userId: string): Promise<CollectionItem[]> {
    try {
      const collectionsSnapshot = await db
        .collection("collections")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      return collectionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CollectionItem, "id">),
      }));
    } catch (error) {
      console.error("Error in getUserCollections:", error);
      throw new ApiError(500, "Failed to fetch collections");
    }
  },
  async deleteCollection(collectionId: string, userId: string) {
    try {
      const collectionRef = db.collection("collections").doc(collectionId);
      const doc = await collectionRef.get();

      if (!doc.exists) {
        throw new ApiError(404, "Collection not found");
      }

      const collectionData = doc.data();
      if (collectionData?.userId !== userId) {
        throw new ApiError(403, "Unauthorized to delete this collection");
      }

      await collectionRef.delete();
      return {success: true, message: "Collection deleted successfully"};
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error in deleteCollection:", error);
      throw new ApiError(500, "Failed to delete collection");
    }
  },
};
