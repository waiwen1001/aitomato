import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { OutletService } from "../services/outlet.service";
import { MenuService } from "../services/menu.service";
import { QueueService } from "../services/queue.service";

const orderService = new OrderService();
const outletService = new OutletService();
const menuService = new MenuService();
const queueService = new QueueService();

export const addItemToCart = async (req: Request, res: Response) => {
  const { outletId, queueId, menuId, quantity, remarks } = req.body;

  const outlet = await outletService.getOutletById(outletId);

  if (!outlet) {
    res.status(404).json({ message: "Outlet not found" });
    return;
  }

  const queue = await queueService.getPendingQueuesById(queueId);

  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  const menu = await menuService.getMenuById(menuId);

  if (!menu) {
    res.status(404).json({ message: "Menu not found" });
    return;
  }

  const order = await orderService.addItemToCart(
    outletId,
    queueId,
    menu,
    quantity,
    remarks
  );

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  res.status(200).json(order);
};

export const getOrders = async (req: Request, res: Response) => {
  const { id } = req.params;

  const queue = await queueService.getQueueById(id);
  if (!queue) {
    res.status(404).json({ message: "Queue not found" });
    return;
  }

  const orders = await orderService.getOrders(id);
  res.status(200).json(orders);
};
