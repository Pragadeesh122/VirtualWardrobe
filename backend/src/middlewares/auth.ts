import {Request, Response, NextFunction} from "express";
import {auth} from "../config/firebase";
import {ApiError} from "../utils/errors/ApiError";
import {RequestWithUser} from "../types/API_request";

export async function authenticate(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided");
    }
    console.log("control reachers here");
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email!,
    };
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
