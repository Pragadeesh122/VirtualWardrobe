import {NextFunction, Response, Router} from "express";
import {authenticate} from "../middlewares";
import {generateSuggestions} from "../controllers/suggestion";
import {RequestWithUser} from "../types/API_request";

const suggestionRouter = Router();

suggestionRouter.use(authenticate);

suggestionRouter.post(
  "/generate",
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    generateSuggestions(req, res).catch(next);
  }
);

export default suggestionRouter;
