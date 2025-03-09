import prisma from "./prisma.service";

export class QueueService {
  async getPendingQueues() {
    return prisma.queue.findMany({
      where: {
        status: "PENDING",
      },
    });
  }
  
  async createQueue(data: {outletId: string; pax: number; phoneNumber: string}) {
    return prisma.queue.create({
      data: {
        outletId: data.outletId,
        pax: data.pax,
        phoneNumber: data.phoneNumber,
        status: "PENDING",
      },
    });
  }
}

export default new QueueService();
