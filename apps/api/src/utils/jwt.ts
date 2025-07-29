import config from "@/config/config";
import jwt from "jsonwebtoken";

interface JWTPayload {
  userId: string;
  email: string;
  role: "USER" | "AMDIN";
}

export class JWTUtil {
  private readonly secret = config.JWT_SECRET;
  private readonly expiresIn = "7d";

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.secret) as JWTPayload;
  }
}
