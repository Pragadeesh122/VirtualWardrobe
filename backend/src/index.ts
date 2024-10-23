import express from "express";
import {
  corsMiddleware,
  requestLogger,
  apiRateLimiter,
  errorHandler,
} from "./middlewares/index";
import authRouter from "./routes/auth";

const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);
app.use(apiRateLimiter);

app.use("/auth", authRouter);

// Add error handler middleware
app.use(errorHandler as unknown as express.ErrorRequestHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
