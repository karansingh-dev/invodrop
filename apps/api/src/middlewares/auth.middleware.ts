import { Request, Response, NextFunction } from "express";
import { JWTUtil } from "@/utils/jwt";
import { logger } from "@repo/logger";

export const defaultMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.header("Authorization");
  const token = authHeaders?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization Token is Required" });
    }

    const jwt = new JWTUtil();

    const decodedToken = jwt.verifyToken(token);

    const isJwtPayload = jwt.isJWTPayload(decodedToken);

    if (isJwtPayload) {
      const { userId, email, role } = decodedToken;
      req.user = { userId, email, role };

      next();
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error: any) {
    logger.error(error.message, token);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
