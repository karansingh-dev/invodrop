/*
  Warnings:

  - You are about to drop the column `is_active` on the `company` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "company_is_active_idx";

-- AlterTable
ALTER TABLE "company" DROP COLUMN "is_active";
