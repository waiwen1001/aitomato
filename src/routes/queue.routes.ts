import { Router } from "express";
import asyncHandler from "express-async-handler";
import { getPendingQueues, createQueue } from "../controllers/queue.controller";
import { validateQueueInput } from "../middleware/validation.middleware";

const router = Router();

router.get("/pending", asyncHandler(getPendingQueues));

router.post("/", validateQueueInput, asyncHandler(createQueue));

export { router as queueRoutes };
