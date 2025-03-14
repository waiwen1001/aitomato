/*
  Warnings:

  - Added the required column `floor` to the `floors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "floors" ADD COLUMN     "floor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "queues" ADD COLUMN     "completedAt" TIMESTAMP(3);
