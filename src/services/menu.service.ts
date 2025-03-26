import prisma from "./prisma.service";
import fs from "fs";
import path from "path";
import sharp from "sharp";
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

  async createMenuImages(menuId: string, images: string[]) {
    const uploadPath = `uploads/${menuId}`;
    const thumbnailPath = `uploads/${menuId}/thumbnails`;

    // Create directories if they don't exist
    [uploadPath, thumbnailPath].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const savedImages = [];
    const thumbnailImages = [];
    const baseUrl = process.env.BASE_URL + "/api";

    for (const image of images) {
      const fileName = path.basename(image);
      const sourcePath = path.join(process.cwd(), image);
      const originalPath = path.join(process.cwd(), uploadPath, fileName);
      const thumbnailPath = path.join(
        process.cwd(),
        uploadPath,
        "thumbnails",
        fileName
      );

      // Copy original image
      fs.copyFileSync(sourcePath, originalPath);

      // Create thumbnail
      await sharp(sourcePath)
        .resize(300, 300, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      savedImages.push(`${baseUrl}/${uploadPath}/${fileName}`);
      thumbnailImages.push(`${baseUrl}/${uploadPath}/thumbnails/${fileName}`);
    }

    await prisma.menuImage.createMany({
      data: savedImages.map((imagePath) => ({
        menuId,
        path: imagePath,
        type: "original",
      })),
    });

    await prisma.menuImage.createMany({
      data: thumbnailImages.map((imagePath) => ({
        menuId,
        path: imagePath,
        type: "thumbnail",
      })),
    });

    return;
  }
}
