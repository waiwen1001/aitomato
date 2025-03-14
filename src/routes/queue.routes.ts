import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  getPendingQueues,
  createQueue,
  getPendingQueuesById,
  completeQueue,
} from "../controllers/queue.controller";
import { validateQueueInput } from "../middleware/validation.middleware";

const router = Router();

router.get("/pending", asyncHandler(getPendingQueues));
router.get("/pending/:id", asyncHandler(getPendingQueuesById));
router.post("/", validateQueueInput, asyncHandler(createQueue));
router.post("/complete/:id", asyncHandler(completeQueue));

export { router as queueRoutes };
