import { Queue } from "@prisma/client";
import { pusherServer } from "../config/pusher";

export class PusherService {
  private static instance: PusherService;

  private constructor() {}

  static getInstance(): PusherService {
    if (!PusherService.instance) {
      PusherService.instance = new PusherService();
    }
    return PusherService.instance;
  }

  async notifyQueue(queueId: string, queue: Queue) {
    console.log("queue", queueId);
    await pusherServer.trigger(`queue-${queueId}`, "queue-updated", {
      queue,
    });
  }
}
