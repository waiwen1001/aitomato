import { Request, Response } from "express";
import { MenuService } from "../services/menu.service";
import { OutletService } from "../services/outlet.service";

const menuService = new MenuService();
const outletService = new OutletService();

export const getAllMenus = async (req: Request, res: Response) => {
  const menus = await menuService.getAllMenus();
  res.status(200).json(menus);
};

export const getMenuById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const menu = await menuService.getMenuById(id);
  res.status(200).json(menu);
};

export const createMenu = async (req: Request, res: Response) => {
  const { outletId, name, price } = req.body;

  const outlet = await outletService.getOutletById(outletId);

  if (!outlet) {
    res.status(404).json({ message: "Outlet not found" });
    return;
  }

  const menu = await menuService.createMenu({ outletId, name, price });
  res.status(201).json(menu);
};

export const updateMenu = async (req: Request, res: Response) => {
  const { id } = req.params;

  const menu = await menuService.getMenuById(id);

  if (!menu) {
    res.status(404).json({ message: "Menu not found" });
    return;
  }

  const { name, price } = req.body;
  const updatedMenu = await menuService.updateMenu(id, { name, price });
  res.status(200).json(updatedMenu);
};
