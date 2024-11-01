import express from "express";
import {
  corsMiddleware,
  requestLogger,
  apiRateLimiter,
  errorHandler,
} from "./middlewares/index";
import authRouter from "./routes/auth";
import wardrobeRouter from "./routes/wardrobe";
import collectionsRouter from "./routes/collection";

const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);
app.use(apiRateLimiter);

app.use("/auth", authRouter);
app.use("/wardrobe", wardrobeRouter);
app.use("/collections", collectionsRouter);

// Add error handler middleware
app.use(errorHandler as unknown as express.ErrorRequestHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
