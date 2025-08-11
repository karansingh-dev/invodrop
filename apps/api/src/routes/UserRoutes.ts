import { UserController } from "@/controllers/UserController";
import { prisma } from "@repo/db";
import express, { Router } from "express";
import { wrapAsync } from "@/utils/wrapAsync";
import { authMiddleware } from "@/middlewares/auth.middleware";

export const router: Router = express.Router();

const user = new UserController(prisma);

router.use(authMiddleware);

router.post("/onboarding", wrapAsync(user.addCompany.bind(user)));
router.get("/get-presignedurl", wrapAsync(user.generateUploadUrl.bind(user)));
