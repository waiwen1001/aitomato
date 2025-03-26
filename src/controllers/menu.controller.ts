import { Request, Response } from "express";
import { MenuService } from "../services/menu.service";
import { OutletService } from "../services/outlet.service";
import { notFoundImage } from "../utils/func.utils";

const menuService = new MenuService();
const outletService = new OutletService();

export const createMenu = async (req: Request, res: Response) => {
  const { outletId, name, price, images, categoryId } = req.body;

  const outlet = await outletService.getOutletById(outletId);

  if (!outlet) {
    res.status(404).json({ message: "Outlet not found" });
    return;
  }

  if (categoryId) {
    const category = await menuService.getCategoryById(categoryId, outletId);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
  }

  const menu = await menuService.createMenu({
    outletId,
    name,
    price,
    categoryId,
  });

  if (images && images.length > 0) {
    await menuService.createMenuImages(menu.id, images);
  } else {
    await menuService.createMenuImages(menu.id, [notFoundImage()]);
  }

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
