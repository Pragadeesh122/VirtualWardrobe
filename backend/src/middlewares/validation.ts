import {Request, Response, NextFunction} from "express";
import {AnyZodObject, ZodError} from "zod";
import {ApiError} from "../utils/errors/ApiError";

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new ApiError(400, "Invalid request data"));
      }
    }
  };
}
