import {Request, Response, NextFunction} from "express";
import {ZodError} from "zod";
import {ApiError} from "../utils/errors/ApiError";
import logger from "../utils/logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  // Handle known application errors
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  // Handle firebase errors
  if (error.name === "FirebaseError") {
    return res.status(400).json({
      message: error.message,
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    message: "Internal server error",
  });
}
