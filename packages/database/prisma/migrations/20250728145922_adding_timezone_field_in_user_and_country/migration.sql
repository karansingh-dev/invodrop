/*
  Warnings:

  - Added the required column `timezone` to the `country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "country" ADD COLUMN     "timezone" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "timezone" VARCHAR(50);
