import express, { Application } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import { router } from "@/routes/index";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import config from "./config/config";

const app: Application = express();

app.use(
  cors({
    origin: [config.TRUSTED_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// keep this above bodyparser so that bodyparser does not interfere
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(bodyparser.json());
app.use("/api/v1", router);
app.use(globalErrorHandler);

export default app;
