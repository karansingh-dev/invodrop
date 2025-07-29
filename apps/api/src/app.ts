import express, { Application } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import { router } from "@/routes/index";
import { globalErrorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(cors());
app.use(bodyparser.json());
app.use("/api/v1", router);
app.use(globalErrorHandler);

export default app;
