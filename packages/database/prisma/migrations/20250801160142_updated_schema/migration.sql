/*
  Warnings:

  - You are about to drop the column `company_id` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `billing_city_id` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `billing_country_id` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `billing_state_id` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_city_id` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_country_id` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_state_id` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `payment_term` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `tax` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `first_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `is_email_verified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verification_code` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verification_code_expires_at` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,email]` on the table `client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_Id]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,invoice_number]` on the table `invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_Id,is_default]` on the table `payment_term` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,is_default]` on the table `tax` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,name]` on the table `tax` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_city` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_country` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_state` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_Id` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_Id` to the `payment_term` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `tax` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_verified` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_company_id_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_company_id_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_company_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_company_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_term" DROP CONSTRAINT "payment_term_company_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_company_id_fkey";

-- DropForeignKey
ALTER TABLE "tax" DROP CONSTRAINT "tax_company_id_fkey";

-- DropIndex
DROP INDEX "activity_company_id_created_at_idx";

-- DropIndex
DROP INDEX "activity_company_id_type_created_at_idx";

-- DropIndex
DROP INDEX "client_company_id_email_key";

-- DropIndex
DROP INDEX "client_company_id_name_idx";

-- DropIndex
DROP INDEX "client_company_id_status_idx";

-- DropIndex
DROP INDEX "company_owner_id_idx";

-- DropIndex
DROP INDEX "company_slug_idx";

-- DropIndex
DROP INDEX "company_slug_key";

-- DropIndex
DROP INDEX "invoice_company_id_created_at_idx";

-- DropIndex
DROP INDEX "invoice_company_id_invoice_number_key";

-- DropIndex
DROP INDEX "invoice_company_id_status_due_date_idx";

-- DropIndex
DROP INDEX "payment_company_id_created_at_idx";

-- DropIndex
DROP INDEX "payment_term_company_id_is_active_idx";

-- DropIndex
DROP INDEX "payment_term_company_id_is_default_key";

-- DropIndex
DROP INDEX "product_company_id_is_active_idx";

-- DropIndex
DROP INDEX "product_company_id_type_idx";

-- DropIndex
DROP INDEX "tax_company_id_is_active_idx";

-- DropIndex
DROP INDEX "tax_company_id_is_default_key";

-- DropIndex
DROP INDEX "tax_company_id_name_key";

-- DropIndex
DROP INDEX "user_email_idx";

-- AlterTable
ALTER TABLE "activity" DROP COLUMN "company_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "client" DROP COLUMN "billing_city_id",
DROP COLUMN "billing_country_id",
DROP COLUMN "billing_state_id",
DROP COLUMN "company_id",
DROP COLUMN "shipping_city_id",
DROP COLUMN "shipping_country_id",
DROP COLUMN "shipping_state_id",
DROP COLUMN "taxId",
ADD COLUMN     "billing_city" VARCHAR(50) NOT NULL,
ADD COLUMN     "billing_country" VARCHAR(2) NOT NULL,
ADD COLUMN     "billing_state" VARCHAR(50) NOT NULL,
ADD COLUMN     "shipping_city" VARCHAR(50),
ADD COLUMN     "shipping_country" VARCHAR(2),
ADD COLUMN     "shipping_state" VARCHAR(50),
ADD COLUMN     "tax_id" VARCHAR(30),
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "company" DROP COLUMN "owner_id",
DROP COLUMN "slug",
ADD COLUMN     "user_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invoice" DROP COLUMN "company_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "company_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment_term" DROP COLUMN "company_id",
ADD COLUMN     "user_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "company_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tax" DROP COLUMN "company_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "first_name",
DROP COLUMN "is_email_verified",
DROP COLUMN "last_name",
DROP COLUMN "password_hash",
DROP COLUMN "verification_code",
DROP COLUMN "verification_code_expires_at",
ADD COLUMN     "email_verified" BOOLEAN NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" DROP DEFAULT,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "activity_user_id_created_at_idx" ON "activity"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_user_id_type_created_at_idx" ON "activity"("user_id", "type", "created_at" DESC);

-- CreateIndex
CREATE INDEX "client_user_id_status_idx" ON "client"("user_id", "status");

-- CreateIndex
CREATE INDEX "client_user_id_name_idx" ON "client"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "client_user_id_email_key" ON "client"("user_id", "email");

-- CreateIndex
CREATE INDEX "company_user_Id_idx" ON "company"("user_Id");

-- CreateIndex
CREATE UNIQUE INDEX "company_user_Id_key" ON "company"("user_Id");

-- CreateIndex
CREATE INDEX "invoice_user_id_status_due_date_idx" ON "invoice"("user_id", "status", "due_date");

-- CreateIndex
CREATE INDEX "invoice_user_id_created_at_idx" ON "invoice"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_user_id_invoice_number_key" ON "invoice"("user_id", "invoice_number");

-- CreateIndex
CREATE INDEX "payment_user_id_created_at_idx" ON "payment"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "payment_term_user_Id_is_active_idx" ON "payment_term"("user_Id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "payment_term_user_Id_is_default_key" ON "payment_term"("user_Id", "is_default");

-- CreateIndex
CREATE INDEX "product_user_id_is_active_idx" ON "product"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "product_user_id_type_idx" ON "product"("user_id", "type");

-- CreateIndex
CREATE INDEX "tax_user_id_is_active_idx" ON "tax"("user_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "tax_user_id_is_default_key" ON "tax"("user_id", "is_default");

-- CreateIndex
CREATE UNIQUE INDEX "tax_user_id_name_key" ON "tax"("user_id", "name");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_term" ADD CONSTRAINT "payment_term_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax" ADD CONSTRAINT "tax_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
