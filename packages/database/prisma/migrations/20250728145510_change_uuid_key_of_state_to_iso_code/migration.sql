/*
  Warnings:

  - The `shipping_state_id` column on the `client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `state` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `state` table. All the data in the column will be lost.
  - Changed the type of `stateId` on the `city` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `billing_state_id` on the `client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stateId` on the `company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `state` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "city" DROP CONSTRAINT "city_stateId_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_billing_state_id_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_shipping_state_id_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_stateId_fkey";

-- DropIndex
DROP INDEX "state_countryId_code_key";

-- AlterTable
ALTER TABLE "city" DROP COLUMN "stateId",
ADD COLUMN     "stateId" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "client" DROP COLUMN "billing_state_id",
ADD COLUMN     "billing_state_id" VARCHAR(10) NOT NULL,
DROP COLUMN "shipping_state_id",
ADD COLUMN     "shipping_state_id" VARCHAR(10);

-- AlterTable
ALTER TABLE "company" DROP COLUMN "stateId",
ADD COLUMN     "stateId" VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "state" DROP CONSTRAINT "state_pkey",
DROP COLUMN "code",
DROP COLUMN "id",
ADD COLUMN     "id" VARCHAR(10) NOT NULL,
ADD CONSTRAINT "state_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "city_stateId_name_key" ON "city"("stateId", "name");

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_billing_state_id_fkey" FOREIGN KEY ("billing_state_id") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_shipping_state_id_fkey" FOREIGN KEY ("shipping_state_id") REFERENCES "state"("id") ON DELETE SET NULL ON UPDATE CASCADE;
