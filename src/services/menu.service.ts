import prisma from "./prisma.service";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { CategoryMap } from "../types/menu";
import { copyFileToNewPath } from "../controllers/file.controller";

export class MenuService {
  async getMenusByOutletId(outletId: string) {
    const menus = await prisma.menu.findMany({
      where: {
        active: true,
        outletId,
      },
      include: {
        images: true,
        category: true,
      },
    });

    // Group menus by category
    const menusByCategory = menus.reduce((acc: CategoryMap, menu) => {
      const category = menu.category || {
        id: "Other",
        name: "Other",
        outletId: menu.outletId,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
      };

      if (!acc[category.id]) {
        acc[category.id] = {
          id: category.id,
          outletId: category.outletId,
          name: category.name,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          menus: [],
        };
      }

      acc[category.id].menus.push({
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: Number(menu.price),
        thumbnail:
          menu.images.find((img) => img.type === "thumbnail")?.path || null,
        images: menu.images.filter((img) => img.type === "original"),
      });

      return acc;
    }, {});

    return Object.values(menusByCategory);
  }

  async getMenuById(id: string) {
    return prisma.menu.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
  }

  async getCategoryById(id: string, outletId: string) {
    return prisma.category.findUnique({
      where: { id, outletId },
    });
  }

  async createMenu(data: {
    outletId: string;
    name: string;
    price: number;
    categoryId: string;
  }) {
    return prisma.menu.create({
      data: {
        name: data.name,
        price: data.price,
        outletId: data.outletId,
        categoryId: data.categoryId || null,
      },
    });
  }

  async updateMenu(id: string, data: { name: string; price: number }) {
    return prisma.menu.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
      },
    });
  }

  async createMenuImages(restaurantId: string, menuId: string, imageUrl: string) {
    const uploadPath = `storage/restaurants/${restaurantId}/menus/${menuId}`;
    const thumbnailPath = `storage/restaurants/${restaurantId}/menus/${menuId}/thumbnails`;

    // Create directories if they don't exist
    [uploadPath, thumbnailPath].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const { filePath, url } = await copyFileToNewPath(imageUrl, `restaurants/${restaurantId}/menus/${menuId}/original.jpg`);
    const newThumbnailPath = `${thumbnailPath}/thumbnail.jpg`;

    await sharp(filePath)
      .resize(300, 300, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 80 })
      .toFile(newThumbnailPath);

    await prisma.menuImage.create({
      data: {
        menuId,
        path: url,
        type: "original",
      },
    });

    await prisma.menuImage.create({
      data: {
        menuId,
        path: newThumbnailPath,
        type: "thumbnail",
      },
    });

    return;
  }
}
