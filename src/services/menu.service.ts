import prisma from "./prisma.service";

export class MenuService {
  async getAllMenus() {
    return prisma.menu.findMany();
  }

  async getMenuById(id: string) {
    return prisma.menu.findUnique({
      where: { id },
    });
  }

  async createMenu(data: { outletId: string; name: string; price: number }) {
    return prisma.menu.create({
      data: {
        name: data.name,
        price: data.price,
        outletId: data.outletId,
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
}
