import prisma from "./prisma.service";

export class RestaurantService {
  async getAllRestaurants() {
    return prisma.restaurant.findMany();
  }

  async getRestaurantById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        outlets: {
          include: {
            menus: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async createRestaurant(data: { name: string; address: string}) {
    return prisma.restaurant.create({
      data: {
        name: data.name,
        address: data.address,
      },
    });
  }

  async updateRestaurant(id: string, data: { name?: string; address?: string; logo?: string }) {
    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return null;
    }

    return prisma.restaurant.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.address && { address: data.address }),
        ...(data.logo && { logo: data.logo }),
      },
    });
  }
}
