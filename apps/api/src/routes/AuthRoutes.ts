import { AuthController } from "@/controllers/AuthController";
import { prisma } from "@repo/db";
import express, { Router } from "express";
import { wrapAsync } from "@/utils/wrapAsync";

export const router: Router = express.Router();

const auth = new AuthController(prisma);

router.post("/register", wrapAsync(auth.register.bind(auth)));
router.post("/verify", wrapAsync(auth.verifyEmail.bind(auth)));
router.post("/sign-in", wrapAsync(auth.singIn.bind(auth)));
router.get(
  "/refresh-access-token",
  wrapAsync(auth.refreshAccessToken.bind(auth))
);
