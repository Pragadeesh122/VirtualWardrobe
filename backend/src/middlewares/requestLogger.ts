import {Request, Response, NextFunction} from "express";
import logger from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Log request details
  logger.info({
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Log response
  const originalSend = res.send;
  res.send = function (body) {
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      // responseTime: Date.now() - req.startTime,
    });
    return originalSend.call(this, body);
  };

  next();
}
