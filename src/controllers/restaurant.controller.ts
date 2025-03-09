import { Request, Response } from "express";
import { RestaurantService } from "../services/restaurant.service";

const restaurantService = new RestaurantService();

export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.getRestaurantById(id);

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};

export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurantData = req.body;

    const newRestaurant = await restaurantService.createRestaurant(
      restaurantData
    );

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Failed to create restaurant" });
  }
};

export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const restaurantData = req.body;

    const updatedRestaurant = await restaurantService.updateRestaurant(
      id,
      restaurantData
    );

    if (!updatedRestaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error(`Error updating restaurant with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to update restaurant" });
  }
};
