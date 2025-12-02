/*
  Warnings:

  - You are about to alter the column `taxRate` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,4)` to `Decimal(5,2)`.

*/
-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "taxRate" SET DATA TYPE DECIMAL(5,2);
