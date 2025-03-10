import prisma from "./prisma.service";

export class QueueService {
  async getPendingQueues() {
    return prisma.queue.findMany({
      where: {
        status: "PENDING",
      },
    });
  }

  private async generateQueueNumber(pax: number): Promise<string> {
    let prefix = "A";
    if (pax >= 3 && pax <= 4) {
      prefix = "B";
    } else if (pax >= 5) {
      prefix = "C";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingQueues = await prisma.queue.count({
      where: {
        createdAt: {
          gte: today,
        },
        queueNumber: {
          startsWith: prefix,
        },
      },
    });

    const sequenceNumber = existingQueues + 1;
    const formattedNumber = String(sequenceNumber).padStart(3, "0");
    return `${prefix}${formattedNumber}`;
  }

  async createQueue(data: {
    outletId: string;
    pax: number;
    phoneNumber: string;
  }) {
    const queueNumber = await this.generateQueueNumber(data.pax);

    return (prisma as any).queue.create({
      data: {
        outletId: data.outletId,
        pax: data.pax,
        queueNumber: queueNumber,
        phoneNumber: data.phoneNumber,
        status: "PENDING",
      },
    });
  }

  async getPendingQueuesById(id: string) {
    return prisma.queue.findUnique({
      where: {
        id: id,
        status: "PENDING",
      },
    });
  }
}

export default new QueueService();
