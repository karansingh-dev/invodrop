/*
  Warnings:

  - You are about to drop the column `status` on the `client` table. All the data in the column will be lost.
  - Added the required column `is_active` to the `client` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "client_user_id_status_idx";

-- AlterTable
ALTER TABLE "client" DROP COLUMN "status",
ADD COLUMN     "is_active" BOOLEAN NOT NULL;

-- CreateIndex
CREATE INDEX "client_user_id_is_active_idx" ON "client"("user_id", "is_active");
