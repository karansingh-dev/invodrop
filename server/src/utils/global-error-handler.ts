import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/pino.js";
import { ApiError } from "./api-error.js";
import { response } from "./response.js";

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  let statusCode = 500;
  let message = "Internal Server Error";
  let errorMessage = "INTERNAL_SERVER_ERROR";

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessage = error.error;
  } else if (error.message.includes("Validation")) {
    statusCode = 400;
    message = error.message;
    errorMessage = "VALIDATION_ERROR";
  } else if (error.message.includes("already exists")) {
    statusCode = 409;
    message = error.message;
    errorMessage = "CONFLICT";
  } else if (error.message.includes("not found")) {
    statusCode = 404;
    message = error.message;
    errorMessage = "NOT_FOUND";
  } else if (
    error.message.includes("Authentication") ||
    error.message.includes("Invalid email or password") ||
    error.message.includes("Incorrect")
  ) {
    statusCode = 401;
    message = error.message;
    errorMessage = "UNAUTHORIZED";
  } else if (
    error.message.includes("Unauthorized") ||
    error.message.includes("permission")
  ) {
    statusCode = 403;
    message = "Access denied";
    errorMessage = "FORBIDDEN";
  }

  return response.error(res, message, errorMessage, statusCode);
};
