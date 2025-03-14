/*
  Warnings:

  - You are about to drop the column `name` on the `floors` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[outletId,floor]` on the table `floors` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "floors" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "floors_outletId_floor_key" ON "floors"("outletId", "floor");
