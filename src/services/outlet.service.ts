import prisma from "./prisma.service";

export class OutletService {
  async createOutlet(data: { name: string; restaurantId: string }) {
    return prisma.outlet.create({
      data: {
        name: data.name || "Default",
        restaurantId: data.restaurantId,
      },
      select: {
        id: true,
        name: true,
        restaurantId: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getOutletById(id: string) {
    return prisma.outlet.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        restaurantId: true,
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}

export default OutletService;
