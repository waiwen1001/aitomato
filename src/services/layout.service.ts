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

    if (layout) {
      return [layout.id];
    }

    const mergedLayouts = await prisma.layout.findMany({
      where: {
        outletId: data.outletId,
        status: LayoutStatus.AVAILABLE,
        merge: {
          not: null,
        },
      },
    });

    if(mergedLayouts.length === 0) {
      return null;
    }

    for (const mergedLayout of mergedLayouts) {
      let mergeSeqs: number[];
      try {
        mergeSeqs = JSON.parse(mergedLayout.merge!);
      } catch (e) {
        console.error(`Invalid JSON in merge field for seq ${mergedLayout.seq}: ${mergedLayout.merge}`);
        continue;
      }
  
      if (!Array.isArray(mergeSeqs) || mergeSeqs.length === 0) continue;
  
      const filterLayouts = mergedLayouts.filter(l => mergeSeqs.includes(l.seq));
  
      let totalPax = mergedLayout.pax;
      const selectedIds = [mergedLayout.id];
  
      // Add merged layouts until totalPax meets or exceeds data.pax
      for (const filteredLayout of filterLayouts) {
        if (totalPax < data.pax) {
          totalPax += filteredLayout.pax;
          selectedIds.push(filteredLayout.id);
        }
        if (totalPax >= data.pax) {
          return selectedIds;
        }
      }
    }

    return null;
  }

  async updateLayoutStatus(ids: string[], status: LayoutStatus) {
    await prisma.layout.updateMany({
      where: { id: { in: ids } },
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
