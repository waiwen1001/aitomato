import { Router } from "express";
import asyncHandler from "express-async-handler";
import { addItemToCart, getOrders } from "../controllers/order.controller";
import { validateOrderInput } from "../middleware/validation.middleware";

const router = Router();

router.get("/:id", asyncHandler(getOrders));
router.post("/", validateOrderInput, asyncHandler(addItemToCart));

export { router as orderRoutes };
