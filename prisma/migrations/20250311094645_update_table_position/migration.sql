/*
  Warnings:

  - Added the required column `height` to the `tables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `tables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x_position` to the `tables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y_position` to the `tables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tables" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL,
ADD COLUMN     "x_position" INTEGER NOT NULL,
ADD COLUMN     "y_position" INTEGER NOT NULL;
