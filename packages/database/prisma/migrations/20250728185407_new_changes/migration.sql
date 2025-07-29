/*
  Warnings:

  - The primary key for the `state` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "city" DROP CONSTRAINT "city_stateId_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_billing_state_id_fkey";

-- DropForeignKey
ALTER TABLE "client" DROP CONSTRAINT "client_shipping_state_id_fkey";

-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_stateId_fkey";

-- DropForeignKey
ALTER TABLE "state" DROP CONSTRAINT "state_countryId_fkey";

-- AlterTable
ALTER TABLE "city" ALTER COLUMN "stateId" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "client" ALTER COLUMN "billing_state_id" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "shipping_state_id" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "company" ALTER COLUMN "stateId" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "state" DROP CONSTRAINT "state_pkey",
ALTER COLUMN "countryId" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "id" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "state_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "state" ADD CONSTRAINT "state_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_billing_state_id_fkey" FOREIGN KEY ("billing_state_id") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_shipping_state_id_fkey" FOREIGN KEY ("shipping_state_id") REFERENCES "state"("id") ON DELETE SET NULL ON UPDATE CASCADE;
