import { LayoutStatus } from "@prisma/client";
import prisma from "./prisma.service";

export class LayoutService {
  async getLayoutAvailability(data: { outletId: string; pax: number }) {
    const layout = await prisma.layout.findFirst({
      where: {
        outletId: data.outletId,
        status: LayoutStatus.AVAILABLE,
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

    return layout;
  }

  async updateLayoutStatus(id: string, status: LayoutStatus) {
    await prisma.layout.update({
      where: { id },
      data: { status },
    });
  }

  async getOutletLayouts(data: { outletId: string; pax: number }) {
    const layouts = await prisma.layout.findMany({
      where: { outletId: data.outletId },
    });

    return layouts;
  }
}
