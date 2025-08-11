import { BaseController } from "./BaseController";
import { type PrismaClient } from "@repo/db";
import {
  CreateCompanyData,
  createCompanySchema,
  fileExtensionSchema,
  FileExtensionType,
} from "@repo/shared";
import { Request, Response } from "express";
import { UserService } from "@/services/UserServices";

export class UserController extends BaseController {
  private userService: UserService;
  constructor(prisma: PrismaClient) {
    super(prisma);
    this.userService = new UserService(prisma);
  }

  async addCompany(req: Request, res: Response): Promise<Response> {
    const companyData = this.validateBody<CreateCompanyData>(
      createCompanySchema,
      req.body
    );

    const addedCompany = await this.userService.addUserCompany(
      req.user.userId,
      companyData
    );

    return this.sendSuccess(
      res,
      "Company added successfully",
      201,
      addedCompany.userId
    );
  }

  async generateUploadUrl(req: Request, res: Response): Promise<Response> {
    const params = this.validateParams<FileExtensionType>(
      fileExtensionSchema,
      req.query
    );

    const presignedUrl = await this.userService.generateUploadUrl(
      req.user.userId,
      params.fileExtension
    );

    return this.sendSuccess(
      res,
      "Url generated successfuly",
      200,
      presignedUrl
    );
  }
}
