import { TableStatus } from "@prisma/client";
import prisma from "./prisma.service";

export class TableService {
  async getTableAvailability(data: { outletId: string; pax: number }) {
    const table = await prisma.table.findFirst({
      where: {
        outletId: data.outletId,
        status: TableStatus.AVAILABLE,
        pax: {
          gte: data.pax,
        },
      },
      orderBy: [
        {
          merge: "asc",
        },
        {
          pax: "asc",
        },
      ],
    });

    return table;
  }

  async updateTableStatus(id: string, status: TableStatus) {
    await prisma.table.update({
      where: { id },
      data: { status },
    });
  }

  async getOutletTables(data: { outletId: string; pax: number }) {
    const tables = await prisma.table.findMany({
      where: { outletId: data.outletId },
    });

    return tables;
  }
}
