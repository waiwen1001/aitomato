import prisma from "./prisma.service";
import { addSecondsToDate } from "../utils/func.utils";
import { Queue, QueueStatus } from "@prisma/client";
import { QueueInfo } from "../types/queue";

export class QueueService {
  async getPendingQueues() {
    return prisma.queue.findMany({
      where: {
        status: QueueStatus.PENDING,
      },
    });
  }

  private getPrefix(pax: number): string {
    if (pax >= 3 && pax <= 4) {
      return "B";
    } else if (pax >= 5) {
      return "C";
    }

    return "A";
  }

  private async generateQueueNumber(
    prefix: string,
    seq: number
  ): Promise<string> {
    const formattedNumber = String(seq).padStart(3, "0");
    return `${prefix}${formattedNumber}`;
  }

  async createQueue(data: {
    outletId: string;
    pax: number;
    phoneNumber: string;
  }) {
    const prefix = this.getPrefix(data.pax);

    var seq = 1;
    const queue = await prisma.queue.findFirst({
      where: {
        queueNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        seq: "desc",
      },
    });

    if (queue) {
      seq = queue.seq + 1;
    }

    const queueNumber = await this.generateQueueNumber(prefix, seq);

    const diningTimePerPax = parseInt(process.env.DINING_TIME_PER_PAX || "600"); // 10 minutes
    const maxDiningTime = parseInt(process.env.MAX_DINING_TIME || "3600"); // 1 hour
    const estimatedWaitTime = Math.min(
      data.pax * diningTimePerPax,
      maxDiningTime
    );

    const today = new Date();
    const estTime = addSecondsToDate(today, estimatedWaitTime);

    return prisma.queue.create({
      data: {
        outletId: data.outletId,
        pax: data.pax,
        queueNumber: queueNumber,
        seq: seq,
        phoneNumber: data.phoneNumber,
        status: QueueStatus.PENDING,
        estimatedWaitTime: estTime,
      },
    });
  }

  async getPendingQueuesById(id: string) {
    return prisma.queue.findUnique({
      where: {
        id: id,
        // status: QueueStatus.PENDING,
      },
    });
  }

  async getQueueById(id: string) {
    return prisma.queue.findUnique({
      where: {
        id: id,
      },
      include: {
        table: true,
      },
    });
  }

  async completeQueue(id: string) {
    return prisma.queue.update({
      where: {
        id: id,
      },
      data: {
        status: QueueStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  async updateQueueStatus(id: string, tableId: string, status: QueueStatus) {
    const queue = await prisma.queue.update({
      where: { id },
      data: { tableId, status },
    });

    return queue;
  }

  async generateQueueInfo(queue: Queue) {
    // check how many queue are in the same group and pending
    const sameGroupQueues = await prisma.queue.findMany({
      where: {
        queueNumber: {
          startsWith: queue.queueNumber[0],
        },
        status: {
          in: [QueueStatus.PENDING, QueueStatus.PROCESSING],
        },
        NOT: {
          id: queue.id,
        },
      },
      orderBy: {
        seq: "desc",
      },
    });

    if (sameGroupQueues.length === 0) {
      return {
        queue: queue,
        waitTime: 0,
        servingQueue: "",
        aheadGroup: 0,
      } as QueueInfo;
    }

    const servingQueue = sameGroupQueues.find(
      (q) => q.status === QueueStatus.PROCESSING
    );

    const pendingQueues = sameGroupQueues.filter(
      (q) => q.status === QueueStatus.PENDING
    );

    const processingQueues = sameGroupQueues
      .filter((q) => q.status === QueueStatus.PROCESSING)
      .sort((a, b) => {
        return a.estimatedWaitTime!.getTime() - b.estimatedWaitTime!.getTime();
      });

    var estimatedWaitTime = 0;
    var currentTime = new Date().getTime();

    for (var a = 0; a < pendingQueues.length; a++) {
      if (processingQueues[a]) {
        let processTime =
          (processingQueues[a].estimatedWaitTime!.getTime() - currentTime) /
          1000;

        if (processTime > 3600) {
          processTime = 3600; // if queue is more than 1 hour, then set to 1 hour
        } else if (processTime <= 300) {
          processTime = 300; // if queue is less than 5 minutes, then set to 5 minutes
        }

        estimatedWaitTime += processTime;
      } else {
        estimatedWaitTime += 600; // if pending queue is more than processing queue, then add 10 minutes
      }
    }

    const queueInfo: QueueInfo = {
      queue: queue,
      waitTime: Math.floor(estimatedWaitTime),
      servingQueue: servingQueue ? servingQueue.queueNumber : "",
      aheadGroup: pendingQueues.length,
    };

    return queueInfo;
  }

  async getNextQueue(outletId: string, queueNumber: string, seq: number) {
    if (!queueNumber || !seq || !outletId) {
      return null;
    }

    const prefix = queueNumber[0];

    const queue = await prisma.queue.findFirst({
      where: {
        seq: { gt: seq },
        outletId: outletId,
        status: QueueStatus.PENDING,
        queueNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        seq: "asc",
      },
    });

    return queue;
  }
}

export default new QueueService();
