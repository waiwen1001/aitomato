import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient();

export class RestaurantService {
  /**
   * Get all restaurants
   */
  async getAllRestaurants() {
    return prisma.restaurant.findMany();
  }

  /**
   * Get restaurant by ID
   */
  async getRestaurantById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new restaurant
   */
  async createRestaurant(data: { name: string; address: string }) {
    return prisma.restaurant.create({
      data,
    });
  }

  /**
   * Update an existing restaurant
   */
  async updateRestaurant(
    id: string,
    data: { name?: string; address?: string }
  ) {
    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return null;
    }

    return prisma.restaurant.update({
      where: { id },
      data,
    });
  }
}
