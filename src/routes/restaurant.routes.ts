import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
} from "../controllers/restaurant.controller";
import { validateRestaurantInput } from "../middleware/validation.middleware";
import { upload } from "../utils/upload.util";

const router = Router();

// GET all restaurants
router.get("/", asyncHandler(getAllRestaurants));

// GET restaurant by ID
router.get("/:id", asyncHandler(getRestaurantById));

// POST create new restaurant with image upload
router.post(
  "/",
  upload.single("image"), // 'image' is the field name in the form
  validateRestaurantInput,
  asyncHandler(createRestaurant)
);

// PUT update restaurant with image upload
router.put(
  "/:id",
  upload.single("image"), // 'image' is the field name in the form
  validateRestaurantInput,
  asyncHandler(updateRestaurant)
);

export { router as restaurantRoutes };
