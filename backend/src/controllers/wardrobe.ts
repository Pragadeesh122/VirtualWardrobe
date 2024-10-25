import {Request, Response} from "express";
import {wardrobeValidation} from "../validators/wardrobe";
import {wardrobeService} from "../services/wardrobe";
import {ApiError} from "../utils/errors/ApiError";
import {RequestWithUser} from "../types/API_request";

export const uploadClothItem = async (req: RequestWithUser, res: Response) => {
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
};
