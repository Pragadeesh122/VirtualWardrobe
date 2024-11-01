import {Request, Response} from "express";
import {
  wardrobeGetItemValidation,
  wardrobeValidation,
} from "../validators/wardrobe";
import {wardrobeService} from "../services/wardrobe";
import {ApiError} from "../utils/errors/ApiError";
import {RequestWithUser} from "../types/API_request";

export async function uploadClothItem(req: RequestWithUser, res: Response) {
  try {
    if (!req.file) {
      throw new ApiError(400, "No image file provided");
    }

    if (!req.file.mimetype.startsWith("image/")) {
      throw new ApiError(400, "Only image files are allowed");
    }

    const maxSize = 10 * 1024 * 1024;
    if (req.file.size > maxSize) {
      throw new ApiError(400, "File size exceeds 10MB limit");
    }

    // Get and validate form data
    const validationResult = wardrobeValidation.uploadClothItem.safeParse({
      clothName: req.body.clothName,
      clothType: req.body.clothType,
    });

    if (!validationResult.success) {
      throw new ApiError(400, "Invalid input data", true);
    }

    const uploadData = {
      ...validationResult.data,
      uid: req.user?.uid,
      email: req.user?.email,
      image: {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        size: req.file.size,
      },
    };

    // Process upload

    const response = await wardrobeService.uploadClothItem(uploadData);

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(400, error.message, true);
    } else {
      console.error("Upload error:", error);
      res.status(500).json({error: "An error occurred during upload"});
    }
  }
}

export async function getItem(req: RequestWithUser, res: Response) {
  try {
    const data = {
      userId: req.user?.uid!,
    };

    const validatedResult = wardrobeGetItemValidation.safeParse(data);

    if (!validatedResult.success) {
      throw new ApiError(400, "Invalid input data", true);
    }

    const response = await wardrobeService.getItem(validatedResult.data);
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(400, error.message, true);
    } else {
      console.error("Get item error:", error);
      res.status(500).json({error: "An error occurred during get item"});
    }
  }
}

export async function deleteClothItem(req: RequestWithUser, res: Response) {
  try {
    const {itemId} = req.params;
    const userId = req.user?.uid;

    const response = await wardrobeService.deleteClothItem(itemId, userId!);
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(400, error.message, true);
    } else {
      console.error("Delete item error:", error);
      res.status(500).json({error: "An error occurred while deleting item"});
    }
  }
}

export async function updateClothItem(req: RequestWithUser, res: Response) {
  try {
    const {itemId} = req.params;
    const userId = req.user?.uid;
    const updates = req.body;

    const response = await wardrobeService.updateClothItem(
      itemId,
      updates,
      userId!
    );
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(400, error.message, true);
    } else {
      console.error("Update item error:", error);
      res.status(500).json({error: "An error occurred while updating item"});
    }
  }
}
