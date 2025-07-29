import express, { Router } from "express";
import { router as authRouter } from "./AuthRoutes";

export const router: Router = express.Router();

router.use("/user", authRouter);
