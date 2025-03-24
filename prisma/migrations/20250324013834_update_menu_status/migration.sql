-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT;
