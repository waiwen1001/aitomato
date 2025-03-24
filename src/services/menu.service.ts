import prisma from "./prisma.service";
import fs from "fs";
import path from "path";
import { CategoryMap } from "../types/menu";

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
        images: menu.images.map((img) => ({
          id: img.id,
          path: img.path,
        })),
      });

      return acc;
    }, {});

    return Object.values(menusByCategory);
  }

  async getMenuById(id: string) {
    return prisma.menu.findUnique({
      where: { id },
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
        categoryId: data.categoryId,
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

  async createMenuImages(menuId: string, images: string[]) {
    const uploadPath = `api/uploads/${menuId}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const savedImages = [];
    const baseUrl = process.env.BASE_URL + "/api";

    for (const image of images) {
      const fileName = path.basename(image);
      const sourcePath = path.join(process.cwd(), image);
      const targetPath = path.join(process.cwd(), uploadPath, fileName);
      fs.copyFileSync(sourcePath, targetPath);
      savedImages.push(`${baseUrl}/${uploadPath}/${fileName}`);
    }

    return prisma.menuImage.createMany({
      data: savedImages.map((imagePath) => ({ menuId, path: imagePath })),
    });
  }
}
