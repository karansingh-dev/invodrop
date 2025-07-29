// apps/backend/src/middleware/errorHandler.ts
import { NextFunction, Request, Response } from "express";
import { logger } from "@repo/logger";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Global Error Handler", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  let statusCode = 500;
  let clientMessage = "Internal Server Error";

  if (error.message.includes("Validation failed")) {
    statusCode = 400;
    clientMessage = error.message;
  } else if (error.message.includes("already exists")) {
    statusCode = 409;
    clientMessage = error.message;
  } else if (error.message.includes("not found")) {
    statusCode = 404;
    clientMessage = error.message;
  } else if (
    error.message.includes("Authentication") ||
    error.message.includes("Invalid email or password")
  ) {
    statusCode = 401;
    clientMessage = error.message;
  } else if (
    error.message.includes("Unauthorized") ||
    error.message.includes("permission")
  ) {
    statusCode = 403;
    clientMessage = "Access denied";
  }

  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "development" ? error.message : clientMessage,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      details: error,
    }),
  });
};
