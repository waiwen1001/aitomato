import { Request, Response } from "express";
import { QueueService } from "../services/queue.service";
import { QueueStatus, TableStatus } from "@prisma/client";
const queueService = new QueueService();

export const getPendingQueues = async (req: Request, res: Response) => {
  try {
    const queues = await queueService.getPendingQueues();
    res.status(200).json(queues);
  } catch (error) {
    console.error("Error fetching queues:", error);
    res.status(500).json({ message: "Failed to fetch pending queues" });
  }
};

export const createQueue = async (req: Request, res: Response) => {
  try {
    const queue = await queueService.createQueue(req.body);

    // check if the table is available
    const table = await queueService.checkTableAvailability(req.body);

    if (table) {
      // update the table status to occupied
      await queueService.updateTableStatus(table.id, TableStatus.OCCUPIED);
      await queueService.updateQueueStatus(
        queue.id,
        table.id,
        QueueStatus.PROCESSING
      );

      queue.tableId = table.id;
      queue.status = QueueStatus.PROCESSING;

      res.status(201).json({
        success: true,
        message: "Queue created successfully",
        data: queue,
      });

      return;
    }

    const queueInfo = await queueService.generateQueueInfo(queue);

    res.status(201).json({
      success: true,
      message: "Queue created successfully",
      data: queueInfo,
    });
  } catch (error) {
    console.error("Error create queues:", error);
    res.status(500).json({ message: "Failed to create queue" });
  }
};

export const getPendingQueuesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const queue = await queueService.getPendingQueuesById(id);

    if (!queue) {
      res.status(404).json({ message: "Queue not found" });
      return;
    }

    const queueInfo = await queueService.generateQueueInfo(queue);

    res.status(200).json({
      success: true,
      message: "Queue fetched successfully",
      data: queueInfo,
    });
  } catch (error) {
    console.error(`Error fetching queue with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to fetch queue" });
  }
};

export const completeQueue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const queue = await queueService.getPendingQueuesById(id);

    if (!queue) {
      res.status(404).json({ message: "Queue not found" });
      return;
    }

    // Complete the queue and get the updated queue
    const completedQueue = await queueService.completeQueue(id);

    if (completedQueue.tableId) {
      // If there was a table assigned, set it back to available
      await queueService.updateTableStatus(
        completedQueue.tableId,
        TableStatus.AVAILABLE
      );
    }

    const getNextQueue = await queueService.getNextQueue(
      completedQueue.outletId,
      completedQueue.queueNumber,
      completedQueue.seq
    );

    if (getNextQueue) {
      console.log(getNextQueue);
    }

    res.status(200).json({
      success: true,
      message: "Queue completed successfully",
      data: completedQueue,
    });
  } catch (error) {
    console.error(`Error completing queue with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to complete queue" });
  }
};
