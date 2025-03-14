/*
  Warnings:

  - Added the required column `seq` to the `tables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "seq" INTEGER NOT NULL;
