/*
  Warnings:

  - You are about to drop the column `tableId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tableId` on the `queues` table. All the data in the column will be lost.
  - You are about to drop the `tables` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LayoutStatus" AS ENUM ('AVAILABLE', 'ONHOLD', 'OCCUPIED', 'MAINTENANCE');

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_tableId_fkey";

-- DropForeignKey
ALTER TABLE "queues" DROP CONSTRAINT "queues_tableId_fkey";

-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_floorId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "tableId",
ADD COLUMN     "layoutId" TEXT;

-- AlterTable
ALTER TABLE "queues" DROP COLUMN "tableId",
ADD COLUMN     "layoutId" TEXT;

-- DropTable
DROP TABLE "tables";

-- DropEnum
DROP TYPE "TableStatus";

-- CreateTable
CREATE TABLE "layouts" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "pax" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "merge" JSONB,
    "x_position" INTEGER NOT NULL,
    "y_position" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "layouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "layouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "layouts" ADD CONSTRAINT "layouts_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queues" ADD CONSTRAINT "queues_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "layouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
