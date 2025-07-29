/*
  Warnings:

  - You are about to drop the column `timezone` on the `country` table. All the data in the column will be lost.
  - Added the required column `primaryTimezone` to the `country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "country" DROP COLUMN "timezone",
ADD COLUMN     "primaryTimezone" VARCHAR(50) NOT NULL;
