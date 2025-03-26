import { Request, Response } from "express";
import { QueueService } from "../services/queue.service";
import { QueueStatus, LayoutStatus } from "@prisma/client";
import { PusherService } from "../services/pusher.service";
import { LayoutService } from "../services/layout.service";

const queueService = new QueueService();
const layoutService = new LayoutService();

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
    const layout = await layoutService.getLayoutAvailability(req.body);

    const queueInfo = await queueService.generateQueueInfo(queue);
    if (layout) {
      await layoutService.updateLayoutStatus(layout.id, LayoutStatus.OCCUPIED);
      await queueService.updateQueueStatus(
        queue.id,
        layout.id,
        QueueStatus.PROCESSING
      );

      queue.layoutId = layout.id;
      queue.status = QueueStatus.PROCESSING;

      res.status(201).json({
        success: true,
        message: "Queue created successfully",
        data: queueInfo,
      });

      return;
    }

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
    const { queueId } = req.body;
    const queue = await queueService.getPendingQueuesById(queueId);

    if (!queue) {
      res.status(404).json({ message: "Queue not found" });
      return;
    }

    const completedQueue = await queueService.completeQueue(queueId);

    var layoutId = null;
    if (completedQueue.layoutId) {
      await layoutService.updateLayoutStatus(
        completedQueue.layoutId,
        LayoutStatus.AVAILABLE
      );

      layoutId = completedQueue.layoutId;
    } else {
      const layout = await layoutService.getLayoutAvailability({
        outletId: completedQueue.outletId,
        pax: queue.pax,
      });

      if (layout) {
        layoutId = layout.id;
      }
    }

    console.log("layoutId", layoutId);

    if (!layoutId) {
      res.status(200).json({
        success: true,
        message: "Queue completed successfully",
        data: completedQueue,
      });

      return;
    }

    const nextQueue = await queueService.getNextQueue(
      completedQueue.outletId,
      completedQueue.queueNumber,
      completedQueue.seq
    );

    console.log("nextQueue", nextQueue);

    if (nextQueue) {
      if (!nextQueue.layoutId && nextQueue.status === QueueStatus.PENDING) {
        await queueService.updateQueueStatus(
          nextQueue.id,
          layoutId,
          QueueStatus.PROCESSING
        );
      }

      const pusherService = PusherService.getInstance();

      const queueInfo = await queueService.getQueueById(nextQueue.id);
      if (queueInfo) {
        await pusherService.notifyQueue(nextQueue.id, queueInfo);
      } else {
        console.error(`Queue not found with ID: ${nextQueue.id}`);
      }
    }

    res.status(200).json({
      success: true,
      message: "Queue completed successfully",
      data: completedQueue,
    });
  } catch (error) {
    console.error(`Error completing queue with ID ${req.body.queueId}:`, error);
    res.status(500).json({ message: "Failed to complete queue" });
  }
};
