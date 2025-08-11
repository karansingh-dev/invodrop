import config from "@/config/config";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export class JWTUtil {
  private readonly secret = config.JWT_SECRET;
  private readonly expiresIn = "7d";

  generateToken(payload: object | string): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.secret);
  }

  isJWTPayload(value: JwtPayload | String): value is JwtPayload {
    return (value as JwtPayload) !== undefined;
  }
}
