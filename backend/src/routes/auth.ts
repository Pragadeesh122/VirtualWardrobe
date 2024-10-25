import {NextFunction, Request, Response, Router} from "express";
import {register, login} from "../controllers/auth";

const authRouter = Router();

authRouter.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    register(req, res).catch(next);
  }
);

authRouter.post("/login", (req: Request, res: Response, next: NextFunction) => {
  login(req, res).catch(next);
});

export default authRouter;
