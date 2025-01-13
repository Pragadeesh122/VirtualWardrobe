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
import calendarRouter from "./routes/calendar";
import suggestionRouter from "./routes/suggestion";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);
app.use(apiRateLimiter);

app.use("/auth", authRouter);
app.use("/wardrobe", wardrobeRouter);
app.use("/collections", collectionsRouter);
app.use("/calendar", calendarRouter);
app.use("/suggestions", suggestionRouter);

app.use(errorHandler as unknown as express.ErrorRequestHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
