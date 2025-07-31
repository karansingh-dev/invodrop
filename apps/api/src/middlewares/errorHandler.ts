import { NextFunction, Request, Response } from "express";
import { logger } from "@repo/logger";
import { ApiError } from "@/utils/ApiError";

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

  // Default values
  let statusCode = 500;

  let clientMessage = "Internal Server Error";
  let errors: string[] | undefined;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;

    clientMessage = error.message;
    errors = error.errors.length > 0 ? error.errors : undefined;
  } else if (error.message.includes("Validation failed")) {
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
    error.message.includes("Invalid email or password") ||
    error.message.includes("Incorrect")
  ) {
    statusCode = 401;
    clientMessage = error.message;
  } else if (
    error.message.includes("Unauthorized") ||
    error.message.includes("permission")
  ) {
    statusCode = 403;

    clientMessage = "Access denied";
  } else {
    statusCode = 400;

    clientMessage = error.message;
  }

  // Never expose stack to client message
  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "development" ? error.message : clientMessage,
    errors: errors ?? (clientMessage ? [clientMessage] : []),
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      details: error,
    }),
  });
};
