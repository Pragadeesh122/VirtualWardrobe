import {Response} from "express";
import {suggestion} from "../services/suggestion";
import {RequestWithUser} from "../types/API_request";
import {suggestionValidation} from "../validators/suggestion";
import {ApiError} from "../utils/errors/ApiError";
import logger from "../utils/logger";

export async function generateSuggestions(req: RequestWithUser, res: Response) {
  try {
    const validationResult = suggestionValidation.safeParse({
      ...req.body,
      userId: req.user?.uid,
    });

    if (!validationResult.success) {
      throw new ApiError(400, "Invalid input data", true);
    }

    const response = await suggestion.generateSuggestions(
      validationResult.data
    );

    res.status(200).json(response);
  } catch (error) {
    logger.error("Generate suggestions error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to generate suggestions");
  }
}
