import express, { type Request, type Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { corsOptions } from "./config/global.js";
import { env } from "./config/env.js";
import { logger } from "./lib/pino.js";
import { response } from "./utils/response.js";
import db from "./lib/drizzle.js";
import { sql } from "drizzle-orm";
import { globalErrorHandler } from "./utils/global-error-handler.js";

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get("/health", async (req: Request, res: Response) => {
  try {
    await db.execute(sql`SELECT 1`);

    const data = {
      uptime: process.uptime(),
      timestamp: Date.now(),
    };

    return response.ok(res, data, "Healthy", 200);
  } catch (error) {
    logger.error({ error }, "Health check DB failed");

    return response.error(
      res,
      "Server not healthy",
      "DATABASE_UNAVAILABLE",
      503,
    );
  }
});


app.use(globalErrorHandler);

app.listen(env.PORT, (error: Error | undefined) => {
  if (!error) {
    logger.info(`Starting server at port: ${env.PORT}`);
  } else {
    logger.error(`Error starting server at port ${env.PORT}`);
  }
});
