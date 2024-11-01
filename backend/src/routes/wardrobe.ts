import {NextFunction, Request, Response, Router} from "express";
import {authenticate} from "../middlewares";
import {upload} from "../middlewares/multer";
import {
  getItem,
  uploadClothItem,
  deleteClothItem,
  updateClothItem,
} from "../controllers/wardrobe";
import {RequestWithUser} from "../types/API_request";

const wardrobeRouter = Router();

wardrobeRouter.use(authenticate);

wardrobeRouter.post(
  "/uploadItem",
  upload.single("image"),
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    uploadClothItem(req, res).catch(next);
  }
);

wardrobeRouter.post(
  "/getItem",
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    getItem(req, res).catch(next);
  }
);

wardrobeRouter.delete(
  "/:itemId",
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    deleteClothItem(req, res).catch(next);
  }
);

wardrobeRouter.put(
  "/:itemId",
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    updateClothItem(req, res).catch(next);
  }
);

export default wardrobeRouter;
