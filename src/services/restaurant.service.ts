import prisma from "./prisma.service";

export class RestaurantService {
  async getAllRestaurants() {
    return prisma.restaurant.findMany();
  }

  async getRestaurantById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async createRestaurant(data: { name: string; address: string }) {
    return prisma.restaurant.create({
      data: {
        name: data.name,
        address: data.address,
      },
    });
  }

  async updateRestaurant(id: string, data: { name: string; address: string }) {
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
        name: data.name,
        address: data.address,
      },
    });
  }
}
