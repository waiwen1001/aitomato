import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  createTable,
  getOutletById,
} from "../controllers/restaurant.controller";
import { validateTableInput } from "../middleware/validation.middleware";
const router = Router();

router.get("/:id", asyncHandler(getOutletById));
router.post("/tables", validateTableInput, asyncHandler(createTable));

export { router as outletRoutes };
