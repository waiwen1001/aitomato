import { Request, Response } from "express";
import { QueueService } from "../services/queue.service";

const queueService = new QueueService();

export const getPendingQueues = async (req: Request, res: Response): Promise<void> => {
  try {
    const queues = await queueService.getPendingQueues();
    res.status(200).json(queues);
  } catch (error) {
    console.error("Error fetching queues:", error);
    res.status(500).json({ message: "Failed to fetch pending queues" });
  }
};

export const createQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    const queues = await queueService.createQueue(req.body);
    res.status(200).json(queues);
  } catch (error) {
    console.error("Error create queues:", error);
    res.status(500).json({ message: "Failed to create queue" });
  }
};
