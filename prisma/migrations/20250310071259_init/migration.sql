-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'CANCELLED', 'COMPLETED', 'TIMEOUT');

-- CreateTable
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outlets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outlets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "Subtotal" DECIMAL(65,30) NOT NULL,
    "Tax" DECIMAL(65,30) NOT NULL,
    "GST" DECIMAL(65,30) NOT NULL,
    "Total" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "pax" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "combinable" BOOLEAN NOT NULL,
    "adjacentToTableId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queues" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "pax" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "queueNumber" TEXT NOT NULL,
    "status" "QueueStatus" NOT NULL,
    "tableId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "outlets" ADD CONSTRAINT "outlets_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floors" ADD CONSTRAINT "floors_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "outlets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_adjacentToTableId_fkey" FOREIGN KEY ("adjacentToTableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queues" ADD CONSTRAINT "queues_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;
