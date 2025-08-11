import { BaseController } from "./BaseController";
import { type PrismaClient } from "@repo/db";
import { Request, response, Response } from "express";
import { VerificationService } from "@/services/VerificationService";

export class ClientController extends BaseController {
  private verifyService: VerificationService;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.verifyService = new VerificationService(prisma);
  }
}
