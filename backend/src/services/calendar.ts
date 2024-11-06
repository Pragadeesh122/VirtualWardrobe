import {db} from "../config/firebase";
import {ApiError} from "../utils/errors/ApiError";
import {
  CreateOutfitLogRequest,
  GetOutfitLogsRequest,
  OutfitLog,
} from "../types/calendar";

export const calendarService = {
  async createOutfitLog(
    userId: string,
    data: CreateOutfitLogRequest
  ): Promise<OutfitLog> {
    try {
      // Verify collection exists and belongs to user
      const collectionRef = await db
        .collection("collections")
        .doc(data.collectionId)
        .get();

      if (!collectionRef.exists) {
        throw new ApiError(404, "Collection not found");
      }

      const collection = collectionRef.data();
      if (collection?.userId !== userId) {
        throw new ApiError(403, "Unauthorized access to collection");
      }

      const now = new Date().toISOString();

      const outfitLog: Omit<OutfitLog, "id"> = {
        date: data.date,
        collectionId: data.collectionId,
        collectionName: collection.name,
        thumbnailUrl: collection.items[0]?.imageUrl || "",
        userId,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection("outfitLogs").add(outfitLog);

      return {
        id: docRef.id,
        ...outfitLog,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error in createOutfitLog:", error);
      throw new ApiError(500, "Failed to create outfit log");
    }
  },

  async getOutfitLogs(data: GetOutfitLogsRequest): Promise<OutfitLog[]> {
    try {
      const outfitLogs = await db
        .collection("outfitLogs")
        .where("userId", "==", data.userId)
        .orderBy("date", "desc")
        .get();

      return outfitLogs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<OutfitLog, "id">),
      }));
    } catch (error) {
      console.error("Error in getOutfitLogs:", error);
      throw new ApiError(500, "Failed to fetch outfit logs");
    }
  },

  async deleteOutfitLog(
    logId: string,
    userId: string
  ): Promise<{success: boolean}> {
    try {
      const logRef = db.collection("outfitLogs").doc(logId);
      const doc = await logRef.get();

      if (!doc.exists) {
        throw new ApiError(404, "Outfit log not found");
      }

      const logData = doc.data();
      if (logData?.userId !== userId) {
        throw new ApiError(403, "Unauthorized to delete this outfit log");
      }

      await logRef.delete();
      return {success: true};
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("Error in deleteOutfitLog:", error);
      throw new ApiError(500, "Failed to delete outfit log");
    }
  },
};
