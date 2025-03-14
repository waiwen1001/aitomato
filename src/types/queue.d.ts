import { Queue } from "@prisma/client";

export interface PendingQueue {
  queueGroup: string;
  queueNumber: string;
  nextQueueNumber: string;
  estimatedWaitTime: number;
}

export interface QueueInfo {
  queue: Queue;
  waitTime: number;
  servingQueue: string;
  aheadGroup: number;
}
