import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.listen(8000, (err) => {
  if (err) {
    console.error("Error running server", err);
    return;
  }

  console.log(`Server started running at port ${8000}`);
});
