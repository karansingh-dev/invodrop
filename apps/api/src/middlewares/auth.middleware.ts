import { Request, Response, NextFunction } from "express";
import { logger } from "@repo/logger";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@/lib/auth";
import { ApiError } from "@/utils/ApiError";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      throw new ApiError(401, "Authorization Failed", [
        "invalid cookie",
        "not allowed",
      ]);
    }

    req.user = {
      userId: session.user.id,
      role: session.user.role,
      email: session.user.email,
    };

    next();
  } catch (error: any) {
    logger.error(error.message, "Better auth Vaidation Failed");
    throw new ApiError(401, "Authorization Failed", [
      "invalid cookie",
      "not allowed",
    ]);
  }
};
