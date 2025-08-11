import { Request, Response } from "express";
import { RestaurantService } from "../services/restaurant.service";
import { OutletService } from "../services/outlet.service";
import { MenuService } from "../services/menu.service";
import { copyFileToNewPath } from "./file.controller";
import { createMenu } from "./menu.controller";

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

    if(restaurantData.imageUrl) {
      const { url } = await copyFileToNewPath(restaurantData.imageUrl, `restaurants/${newRestaurant.id}/logo.jpg`);
      await restaurantService.updateRestaurant(newRestaurant.id, {
        logo: url,
      });
    }

    const newOutlet = await outletService.createOutlet({
      name: "Default",
      restaurantId: newRestaurant.id,
    });

    if(restaurantData.items) {
      for(const item of restaurantData.items) {
        const menu = await menuService.createMenu({
          outletId: newOutlet.id,
          name: item.name,
          price: item.price,
          categoryId: "",
        });

        await menuService.createMenuImages(newRestaurant.id, menu.id, item.imageUrl);
      }
    }

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

export const createLayout = async (req: Request, res: Response) => {
  try {
    const layoutData = req.body;

    await outletService.createLayout(layoutData);

    res.status(201).json({ message: "Layout created successfully" });
  } catch (error) {
    console.error("Error creating layout:", error);
    res.status(500).json({ message: "Failed to create layout" });
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
