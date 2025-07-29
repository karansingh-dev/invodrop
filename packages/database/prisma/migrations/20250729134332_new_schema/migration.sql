/*
  Warnings:

  - The values [INVOICE_OVERDUE] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.
  - The values [OVERDUE] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `billing_postal_code` on the `client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `shipping_postal_code` on the `client` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to drop the column `cityId` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `default_currency_id` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `currency_id` on the `invoice` table. All the data in the column will be lost.
  - You are about to alter the column `payment_term_text` on the `invoice` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `description` on the `invoice_item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(255)`.
  - You are about to drop the column `reference_number` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `payment` table. All the data in the column will be lost.
  - You are about to alter the column `timezone` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(30)`.
  - You are about to drop the `city` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `currency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `state` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `default_currency` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `company` table without a default value. This is not possible if the table is not empty.
  - Made the column `invoice_prefix` on table `company` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currency` to the `invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('INVOICE_CREATED', 'INVOICE_UPDATED', 'INVOICE_SENT', 'INVOICE_PAID', 'INVOICE_CANCELLED', 'CLIENT_CREATED', 'CLIENT_UPDATED', 'CLIENT_DELETED', 'PAYMENT_RECEIVED', 'PAYMENT_CANCELLED', 'PAYMENT_REFUNDED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'USER_PROFILE_UPDATED', 'COMPANY_UPDATED');
ALTER TABLE "activity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "ActivityType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('DRAFT', 'PENDING', 'PAID', 'CANCELLED', 'PARTIALLY_PAID');
ALTER TABLE "invoice" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "InvoiceStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "city" DROP CONSTRAINT "city_stateId_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_billing_city_id_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_billing_country_id_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_billing_state_id_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_shipping_city_id_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_shipping_country_id_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_shipping_state_id_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_cityId_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_countryId_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_default_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_stateId_fkey";

-- DropForeignKey
ALTER TABLE "invoice" DROP CONSTRAINT "invoice_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "state" DROP CONSTRAINT "state_countryId_fkey";

-- DropIndex
DROP INDEX "payment_company_id_status_idx";

-- DropIndex
DROP INDEX "payment_method_status_idx";

-- AlterTable
ALTER TABLE "client" ALTER COLUMN "billing_city_id" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "billing_postal_code" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "shipping_city_id" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "shipping_postal_code" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "billing_state_id" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "shipping_state_id" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "company" DROP COLUMN "cityId",
DROP COLUMN "countryId",
DROP COLUMN "default_currency_id",
DROP COLUMN "stateId",
ADD COLUMN     "city" VARCHAR(30) NOT NULL,
ADD COLUMN     "country" VARCHAR(2) NOT NULL,
ADD COLUMN     "default_currency" VARCHAR(10) NOT NULL,
ADD COLUMN     "state" VARCHAR(30) NOT NULL,
ALTER COLUMN "invoice_prefix" SET NOT NULL;

-- AlterTable
ALTER TABLE "invoice" DROP COLUMN "currency_id",
ADD COLUMN     "currency" VARCHAR(10) NOT NULL,
ALTER COLUMN "payment_term_text" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "invoice_item" ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "reference_number",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "timezone" SET DATA TYPE VARCHAR(30);

-- DropTable
DROP TABLE "city";

-- DropTable
DROP TABLE "country";

-- DropTable
DROP TABLE "currency";

-- DropTable
DROP TABLE "state";

-- DropEnum
DROP TYPE "PaymentStatus";
