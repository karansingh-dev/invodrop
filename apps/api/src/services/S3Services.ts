import { ApiError } from "@/utils/ApiError";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

interface PresignedUploadOptions {
  expiresIn?: number;
  contentType?: string;
  maxFileSize?: number;
  metadata?: Record<string, string>;
}

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(config: S3Config, bucketName: string) {
    this.bucketName = bucketName;

    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  generateLogoKey(userId: string, fileExtension: string): string {
    if (!userId || !fileExtension) {
      throw new ApiError(400, "Company ID and file extension are required", [
        "invalid company id or file extension",
      ]);
    }

    // Sanitize extension (remove dot if present)
    const cleanExtension = fileExtension.replace(/^\./, "").toLowerCase();

    // Generate timestamped key for versioning
    const timestamp = Date.now();

    return `companies/${userId}/logo/${timestamp}.${cleanExtension}`;
  }

  async generateUploadUrl(
    key: string,
    options: PresignedUploadOptions = {}
  ): Promise<string> {
    const {
      expiresIn = 3600,
      contentType,

      metadata = {},
    } = options;

    try {
      const commandParams: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: key,
      };

      if (contentType) {
        commandParams.ContentType = contentType;
      }

      if (Object.keys(metadata).length > 0) {
        commandParams.Metadata = metadata;
      }

      const command = new PutObjectCommand(commandParams);

      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return presignedUrl;
    } catch (error) {
      throw new ApiError(
        400,
        `S3 Service: Failed to generate upload URL for key: ${key}`,
        ["failed to generate upload url"]
      );
    }
  }

  async objectExists(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (
        error.name === "NoSuchKey" ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }

      throw error;
    }
  }

  getBucketName(): string {
    return this.bucketName;
  }

  destroy(): void {
    this.s3Client.destroy();
  }
}
