/*
  Warnings:

  - You are about to drop the column `adjacentToTableId` on the `tables` table. All the data in the column will be lost.
  - You are about to drop the column `combinable` on the `tables` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_adjacentToTableId_fkey";

-- AlterTable
ALTER TABLE "tables" DROP COLUMN "adjacentToTableId",
DROP COLUMN "combinable",
ADD COLUMN     "merge" JSONB;
