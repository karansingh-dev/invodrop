import config from "@/config/config";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

export interface RefreshTokenPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export interface AccessTokenPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export class JWTUtil {
  private readonly secret = config.JWT_SECRET;
  private readonly refreshTokenSecret = config.JWT_REFRESH_TOKEN_SECRET;
  private readonly accessTokenSecret = config.JWT_ACCESS_TOKEN_SECRET;
  private readonly expiresIn = "7d";
  private readonly accessTokenExpiresIn = "60m";

  generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.expiresIn,
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessTokenSecret);
  }

  generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshTokenSecret);
  }

  isJWTPayload(value: JwtPayload | String): value is JwtPayload {
    return (value as JwtPayload) !== undefined;
  }
}
