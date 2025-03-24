-- CreateTable
CREATE TABLE "menu_images" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "menu_images" ADD CONSTRAINT "menu_images_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
