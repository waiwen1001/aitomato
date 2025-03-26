import { Layout } from "@prisma/client";
import { LayoutRequest } from "../types/layout";
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

  async createLayout(data: LayoutRequest) {
    const outlet = await this.getOutletById(data.outletId);

    if (!outlet) {
      throw new Error("Outlet not found");
    }

    await Promise.all(
      data.layout.map(async (layout) => {
        var floor = await prisma.floor.findFirst({
          where: {
            outletId: data.outletId,
            floor: layout.floor,
          },
        });

        if (!floor) {
          floor = await prisma.floor.create({
            data: {
              outletId: data.outletId,
              floor: layout.floor,
            },
          });
        }

        const existingLayouts = await prisma.layout.findMany({
          where: {
            outletId: data.outletId,
            floorId: floor!.id,
          },
        });

        if (existingLayouts.length > 0) {
          await prisma.layout.deleteMany({
            where: {
              outletId: data.outletId,
              floorId: floor!.id,
            },
          });
        }

        const layouts = layout.layouts.map((layout) => ({
          outletId: data.outletId,
          floorId: floor!.id,
          pax: layout.pax,
          status: "available",
          x_position: layout.x,
          y_position: layout.y,
          width: layout.width,
          height: layout.height,
          type: layout.type || "table",
          merge: layout.merge,
          seq: layout.seq,
        }));

        await prisma.layout.createMany({
          data: layouts,
        });
      })
    );

    return;
  }

  async createCategory(outletId: string, name: string) {
    return prisma.category.create({
      data: {
        name,
        outletId,
      },
    });
  }
}

export default OutletService;
