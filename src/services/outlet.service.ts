import { Table } from "@prisma/client";
import { TableRequest } from "../types/table";
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

  async createTable(data: TableRequest) {
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

        const existingTables = await prisma.table.findMany({
          where: {
            outletId: data.outletId,
            floorId: floor!.id,
          },
        });

        if (existingTables.length > 0) {
          await prisma.table.deleteMany({
            where: {
              outletId: data.outletId,
              floorId: floor!.id,
            },
          });
        }

        const tables = layout.table.map((table) => ({
          outletId: data.outletId,
          floorId: floor!.id,
          pax: table.pax,
          status: "available",
          x_position: table.x,
          y_position: table.y,
          width: table.width,
          height: table.height,
          type: table.type || "table",
          merge: table.merge,
          seq: table.seq,
        }));

        await prisma.table.createMany({
          data: tables,
        });
      })
    );

    return;
  }
}

export default OutletService;
