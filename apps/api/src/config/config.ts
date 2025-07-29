import "dotenv/config";

interface configOptions {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
}

const config: configOptions = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
};

export default config;
