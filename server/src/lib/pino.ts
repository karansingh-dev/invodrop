import pino from "pino";
import { env } from "../config/env.js";
import path from "path";

const isDev = process.env.NODE_ENV !== "production";

const logDir = path.join(process.cwd(), "logs");

const transport = isDev
  ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    }
  : {
      target: "pino/file",
      options: { destination: path.join(logDir, "app.log") },
    };

export const logger = pino({
  level: env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport,
});
