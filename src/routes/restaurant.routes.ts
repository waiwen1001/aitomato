import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
} from "../controllers/restaurant.controller";
import { validateRestaurantInput } from "../middleware/validation.middleware";

const router = Router();

router.get("/", asyncHandler(getAllRestaurants));
router.get("/:id", asyncHandler(getRestaurantById));
router.post("/", validateRestaurantInput, asyncHandler(createRestaurant));
router.put("/:id", validateRestaurantInput, asyncHandler(updateRestaurant));

export { router as restaurantRoutes };
