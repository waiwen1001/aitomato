import { Router } from "express";
import asyncHandler from "express-async-handler";
import { getOutletById } from "../controllers/restaurant.controller";

const router = Router();

router.get("/:id", asyncHandler(getOutletById));

export { router as outletRoutes };
