import {NextFunction, Request, Response, Router} from "express";
import {register, login} from "../controllers/auth";
import {authenticate} from "../middlewares";
import {upload} from "../middlewares/multer";
import {uploadClothItem} from "../controllers/wardrobe";
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

export default wardrobeRouter;
