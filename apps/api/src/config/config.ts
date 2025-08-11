import "dotenv/config";

interface configOptions {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  OAUTH_REDIRECT_URI: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_ACCESS_KEY: string;
  S3_BUCKET_NAME: string;
  S3_BUCKET_REGION: string;
  TRUSTED_ORIGIN: string;
}

const config: configOptions = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  OAUTH_REDIRECT_URI: process.env.OAUTH_REDIRECT_URI!,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY!,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
  S3_BUCKET_REGION: process.env.S3_BUCKET_REGION!,
  TRUSTED_ORIGIN: process.env.TRUSTED_ORIGIN!,
};

export default config;
