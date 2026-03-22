import express, { type Request, type Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { corsOptions } from "./config/global.js";
import { env } from "./config/env.js";
import { logger } from "./lib/pino.js";
import { response } from "./utils/response.js";

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get("/health", (req: Request, res: Response) => {
  try {
    response.okMessage(res, "Healthy", 200);
  } catch (error) {
    logger.error({ message: "Failed to return server health", error });
  }
});

app.listen(env.PORT, (error: Error | undefined) => {
  if (!error) {
    logger.info(`Starting server at port: ${env.PORT}`);
  } else {
    logger.error(`Error starting server at port ${env.PORT}`);
  }
});
