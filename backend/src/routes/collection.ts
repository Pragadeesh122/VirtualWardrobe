import {Router} from "express";
import {authenticate} from "../middlewares";
import {createCollection, getCollections} from "../controllers/collection";
import {RequestWithUser} from "../types/API_request";

const collectionsRouter = Router();

collectionsRouter.use(authenticate);

collectionsRouter.post("/create", (req: RequestWithUser, res, next) => {
  createCollection(req, res).catch(next);
});

collectionsRouter.get("/", (req: RequestWithUser, res, next) => {
  getCollections(req, res).catch(next);
});

export default collectionsRouter;
