import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import envVar from "./config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

const corsOptions = {
  origin: envVar.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(bodyParser.json());

app.listen(envVar.PORT, (err) => {
  if (err) {
    console.error("Error running server", err);
    return;
  }

  console.log(`Server started running at port ${envVar.PORT}`);
});
