-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "taxRate" TEXT,
ALTER COLUMN "taxAmount" DROP NOT NULL;
