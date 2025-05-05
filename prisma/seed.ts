import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Create a restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Sample Restaurant',
      address: '123 Main Street',
    },
  });

  // Create an outlet
  const outlet = await prisma.outlet.create({
    data: {
      name: 'Main Branch',
      restaurantId: restaurant.id,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Main Course',
        outletId: outlet.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages',
        outletId: outlet.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Desserts',
        outletId: outlet.id,
      },
    }),
  ]);

  // Create sample menus
  const menus = await Promise.all(
    categories.map((category) =>
      prisma.menu.create({
        data: {
          name: `Sample ${category.name} Item`,
          price: 9.99,
          description: `A delicious ${category.name.toLowerCase()} item`,
          outletId: outlet.id,
          categoryId: category.id,
          images: {
            create: {
              type: 'thumbnail',
              path: `/images/sample-${category.name.toLowerCase()}.jpg`,
            },
          },
        },
      })
    )
  );

  // Create a floor
  const floor = await prisma.floor.create({
    data: {
      outletId: outlet.id,
      floor: '1st Floor',
    },
  });

  // Create some layouts
  const layouts = await Promise.all(
    Array.from({ length: 5 }).map((_, index) =>
      prisma.layout.create({
        data: {
          outletId: outlet.id,
          floorId: floor.id,
          type: 'TABLE',
          seq: index + 1,
          pax: 4,
          status: 'AVAILABLE',
          x_position: index * 100,
          y_position: 100,
          width: 80,
          height: 80,
        },
      })
    )
  );

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding the database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 