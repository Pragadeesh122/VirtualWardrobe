import {Response} from "express";
import {calendarService} from "../services/calendar";
import {RequestWithUser} from "../types/API_request";
import {calendarValidation} from "../validators/calendar";
import {ApiError} from "../utils/errors/ApiError";

export async function createOutfitLog(req: RequestWithUser, res: Response) {
  try {
    const validationResult = calendarValidation.createOutfitLog.safeParse(
      req.body
    );

    if (!validationResult.success) {
      throw new ApiError(400, "Invalid input data", true);
    }

    const response = await calendarService.createOutfitLog(
      req.user?.uid!,
      validationResult.data
    );

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Create outfit log error:", error);
    res.status(500).json({error: "Failed to create outfit log"});
  }
}

export async function getOutfitLogs(req: RequestWithUser, res: Response) {
  try {
    const data = {
      userId: req.user?.uid!,
    };

    const validationResult = calendarValidation.getOutfitLogs.safeParse(data);

    if (!validationResult.success) {
      throw new ApiError(400, "Invalid input data", true);
    }

    const response = await calendarService.getOutfitLogs(validationResult.data);
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Get outfit logs error:", error);
    res.status(500).json({error: "Failed to fetch outfit logs"});
  }
}

export async function deleteOutfitLog(req: RequestWithUser, res: Response) {
  try {
    const {logId} = req.params;
    const response = await calendarService.deleteOutfitLog(
      logId,
      req.user?.uid!
    );
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Delete outfit log error:", error);
    res.status(500).json({error: "Failed to delete outfit log"});
  }
}
