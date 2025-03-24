import { Request, Response } from "express";
import { RestaurantService } from "../services/restaurant.service";
import { OutletService } from "../services/outlet.service";
import { MenuService } from "../services/menu.service";

const restaurantService = new RestaurantService();
const outletService = new OutletService();
const menuService = new MenuService();

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
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

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantData = req.body;

    const newRestaurant = await restaurantService.createRestaurant(
      restaurantData
    );

    const newOutlet = await outletService.createOutlet({
      name: "Default",
      restaurantId: newRestaurant.id,
    });

    res.status(201).json(newOutlet);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Failed to create restaurant" });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
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

export const getOutletById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const outlet = await outletService.getOutletById(id);

    if (!outlet) {
      res.status(404).json({ message: "Outlet not found" });
      return;
    }

    res.status(200).json(outlet);
  } catch (error) {
    console.error(`Error fetching outlet with ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Failed to fetch outlet" });
  }
};

export const createTable = async (req: Request, res: Response) => {
  try {
    const tableData = req.body;

    await outletService.createTable(tableData);

    res.status(201).json({ message: "Table created successfully" });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Failed to create table" });
  }
};

export const getMenusByOutletId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menus = await menuService.getMenusByOutletId(id);

    res.status(200).json(menus);
  } catch (error) {
    console.error(
      `Error fetching menus for outlet with ID ${req.params.id}:`,
      error
    );
    res.status(500).json({ message: "Failed to fetch menus" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { outletId, name } = req.body;
  const category = await outletService.createCategory(outletId, name);
  res.status(201).json(category);
};
