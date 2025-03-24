import { Router } from "express";
import asyncHandler from "express-async-handler";
import { createMenu, updateMenu } from "../controllers/menu.controller";
import { validateMenuInput } from "../middleware/validation.middleware";

const router = Router();

router.post("/", validateMenuInput, asyncHandler(createMenu));
router.put("/:id", validateMenuInput, asyncHandler(updateMenu));

export { router as menuRoutes };
