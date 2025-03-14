/*
  Warnings:

  - Added the required column `seq` to the `queues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "queues" ADD COLUMN     "seq" INTEGER NOT NULL;
