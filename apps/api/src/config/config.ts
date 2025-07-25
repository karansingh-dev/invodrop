import "dotenv/config";

interface configOptions {
  PORT: number;
  NODE_ENV: string;
}

const config: configOptions = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default config;
