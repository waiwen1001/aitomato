import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  createTable,
  createCategory,
  getMenusByOutletId,
  getOutletById,
} from "../controllers/restaurant.controller";
import { validateTableInput } from "../middleware/validation.middleware";
const router = Router();

router.get("/:id", asyncHandler(getOutletById));
router.get("/:id/menus", asyncHandler(getMenusByOutletId));
router.post("/:id/category", asyncHandler(createCategory));
router.post("/tables", validateTableInput, asyncHandler(createTable));

export { router as outletRoutes };
