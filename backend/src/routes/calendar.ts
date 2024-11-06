import {NextFunction, Response, Router} from "express";
import {authenticate} from "../middlewares";
import {
  createOutfitLog,
  deleteOutfitLog,
  getOutfitLogs,
} from "../controllers/calendar";
import {RequestWithUser} from "../types/API_request";

const calendarRouter = Router();

calendarRouter.use(authenticate);

calendarRouter.post(
  "/outfits",
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    createOutfitLog(req, res).catch(next);
  }
);

calendarRouter.get(
  "/outfits",
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    getOutfitLogs(req, res).catch(next);
  }
);

calendarRouter.delete(
  "/outfits/:logId",
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    deleteOutfitLog(req, res).catch(next);
  }
);

export default calendarRouter;
