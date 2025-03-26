import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  createLayout,
  createCategory,
  getMenusByOutletId,
  getOutletById,
} from "../controllers/restaurant.controller";
import { validateLayoutInput } from "../middleware/validation.middleware";
const router = Router();

router.get("/:id", asyncHandler(getOutletById));
router.get("/:id/menus", asyncHandler(getMenusByOutletId));
router.post("/:id/category", asyncHandler(createCategory));
router.post("/layouts", validateLayoutInput, asyncHandler(createLayout));

export { router as outletRoutes };
