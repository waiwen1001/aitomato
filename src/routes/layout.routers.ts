import { Router } from "express";
import asyncHandler from "express-async-handler";
import { getOutletLayouts } from "../controllers/layout.controller";

const router = Router();

router.get("/:id", asyncHandler(getOutletLayouts));

export { router as layoutRoutes };
