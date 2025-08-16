import { Company, type PrismaClient } from "@repo/db";
import { UserRepository } from "../repositories/UserRepository";
import { ApiError } from "@/utils/ApiError";
import {
  CreateCompanyData,
  isCountrySupported,
  isCurrencySupported,
} from "@repo/shared";
import { S3Service } from "./S3Services";
import config from "@/config/config";
import { getContentType } from "@/utils/getContentType";

type allowedType = "png" | "svg" | "gif" | "jpg";

interface UserProfile {
  role: "ADMIN" | "USER";
  onboardingCompleted: boolean;
  timezone: string | null;
}

export class UserService {
  /**
   Initiating all dependencies
  */
  private userRepository: UserRepository;
  private s3Service: S3Service;
  private readonly bucketName = config.S3_BUCKET_NAME;
  private readonly s3Config = {
    region: config.S3_BUCKET_REGION,
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  };

  constructor(prisma: PrismaClient) {
    this.s3Service = new S3Service(this.s3Config, this.bucketName);
    this.userRepository = new UserRepository(prisma);
  }

  async getUserProfile(id: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(id);

    if (!user)
      throw new ApiError(404, "User not found", [
        "system error, user not found",
      ]);

    return {
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      timezone: user.timezone,
    };
  }

  async addUserCompany(
    userId: string,
    company: CreateCompanyData
  ): Promise<Company> {
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser)
      throw new ApiError(404, "User not found", [
        "user not found",
        "invalid token",
      ]);

    if (existingUser.onboardingCompleted)
      throw new ApiError(400, "User already onboarded", [
        "user not found",
        "invalid token",
      ]);

    // Checking valid country and currency support

    const isValidCountry = isCountrySupported(company.country);
    const isValidCurrency = isCurrencySupported(company.defaultCurrency);

    if (!isValidCountry || !isValidCurrency)
      throw new ApiError(400, "Invalid Data Sent", [
        "Invlalid country",
        "invalid currency",
      ]);

    // Generate deep copy to add userId  to the company data

    const companyData = JSON.parse(JSON.stringify(company));

    companyData.userId = existingUser.id;

    const companyDetails = await this.userRepository.createCompany(companyData);

    // updating onboarding status;

    await this.userRepository.updateOnboaringStatusById(userId, true);

    return companyDetails;
  }

  async generateUploadUrl(
    userId: string,
    fileExtension: allowedType
  ): Promise<string> {
    const key = this.s3Service.generateLogoKey(userId, fileExtension);

    const contentType = getContentType(fileExtension);

    const presignedUrl = await this.s3Service.generateUploadUrl(key, {
      expiresIn: 1800,
      contentType,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      metadata: {
        uploadedBy: userId,
      },
    });

    return presignedUrl;
  }
}
