import {Response} from "express";
import {collectionsService} from "../services/collection";
import {RequestWithUser} from "../types/API_request";
import {collectionsValidation} from "../validators/collection";
import {ApiError} from "../utils/errors/ApiError";

export async function createCollection(req: RequestWithUser, res: Response) {
  try {
    const validationResult = collectionsValidation.createCollection.safeParse(
      req.body
    );

    if (!validationResult.success) {
      throw new ApiError(400, "Invalid input data", true);
    }

    const response = await collectionsService.createCollection(
      req.user?.uid!,
      validationResult.data
    );

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Collection creation error:", error);
    res.status(500).json({error: "Failed to create collection"});
  }
}

export async function getCollections(req: RequestWithUser, res: Response) {
  try {
    const collections = await collectionsService.getUserCollections(
      req.user?.uid!
    );
    res.status(200).json(collections);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Get collections error:", error);
    res.status(500).json({error: "Failed to fetch collections"});
  }
}

export async function deleteCollection(req: RequestWithUser, res: Response) {
  try {
    const {collectionId} = req.params;
    const userId = req.user?.uid;

    const response = await collectionsService.deleteCollection(
      collectionId,
      userId!
    );
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(400, error.message, true);
    } else {
      console.error("Delete collection error:", error);
      res
        .status(500)
        .json({error: "An error occurred while deleting collection"});
    }
  }
}
