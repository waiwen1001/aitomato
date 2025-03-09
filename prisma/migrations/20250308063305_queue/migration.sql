-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'CANCELLED', 'COMPLETED', 'TIMEOUT');

-- CreateTable
CREATE TABLE "queues" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "pax" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "status" "QueueStatus" NOT NULL,
    "tableId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "queues" ADD CONSTRAINT "queues_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;
