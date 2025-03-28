import { Layout, LayoutStatus } from "@prisma/client";
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

        const layouts = layout.tables.map((table) => ({
          outletId: data.outletId,
          floorId: floor!.id,
          pax: table.pax,
          status: LayoutStatus.AVAILABLE,
          x_position: table.x,
          y_position: table.y,
          width: table.width,
          height: table.height,
          type: table.type || "table",
          merge: table.merge,
          seq: table.seq,
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
