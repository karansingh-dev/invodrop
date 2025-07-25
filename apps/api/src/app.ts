import express, { Application } from "express";
import cors from "cors";
import bodyparser from "body-parser";

const app: Application = express();

app.use(cors());
app.use(bodyparser.json());

export default app;
