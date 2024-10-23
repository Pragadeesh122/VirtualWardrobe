import {Request, Response, NextFunction} from "express";
import {auth} from "../config/firebase";
import {ApiError} from "../utils/errors/ApiError";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided");
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Add user to request object
    // req.user = {
    //   uid: decodedToken.uid,
    //   email: decodedToken.email!,
    //   role: decodedToken.role,
    // };

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
