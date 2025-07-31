import "dotenv/config";

interface configOptions {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
}

const config: configOptions = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
};

export default config;
