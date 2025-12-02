-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "invoiceCount" INTEGER NOT NULL DEFAULT 0;
