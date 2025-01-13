import cors from "cors";
import {ApiError} from "../utils/errors/ApiError";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
  "http://10.0.2.2:3000",
  "http://10.0.3.2:3000", // Genymotion
  process.env.FRONTEND_URL, // Production URL
].filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});
