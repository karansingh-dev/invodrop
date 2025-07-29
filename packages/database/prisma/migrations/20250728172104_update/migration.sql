/*
  Warnings:

  - Made the column `primaryTimezone` on table `country` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "country" ALTER COLUMN "primaryTimezone" SET NOT NULL;
