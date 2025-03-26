import { Request, Response, NextFunction } from "express";

export const validateRestaurantInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, address } = req.body;

  if (!name || !address) {
    res.status(400).json({
      message: "Name and address are required",
      receivedData: req.body,
    });
    return;
  }

  next();
};

export const validateQueueInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { outletId, pax } = req.body;

  if (!outletId || !pax) {
    res.status(400).json({
      message: "OutletId and pax are required",
      receivedData: req.body,
    });
    return;
  }

  next();
};

export const validateTableInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { outletId, layout } = req.body;

  if (!outletId || !layout || layout.length === 0) {
    res.status(400).json({
      message: "OutletId and layout are required",
      receivedData: req.body,
    });
    return;
  }

  next();
};

export const validateMenuInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { outletId, name, price } = req.body;

  if (!outletId || !name || !price) {
    res.status(400).json({
      message: "OutletId, name, and price are required",
      receivedData: req.body,
    });
    return;
  }

  next();
};

export const validateFileInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const file = req.file;

  if (!file) {
    res.status(400).json({
      message: "File is required",
      receivedData: req.body,
    });
    return;
  }

  next();
};

export const validateOrderInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { outletId, queueId, menuId, quantity, remarks } = req.body;

  if (!outletId || !queueId || !menuId || !quantity) {
    res.status(400).json({
      message: "OutletId, queueId, menuId, and quantity are required",
      receivedData: req.body,
    });
    return;
  }

  next();
};

export const validateQueueOrderInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { queueId } = req.body;

  if (!queueId) {
    res.status(400).json({
      message: "QueueId is required",
      receivedData: req.body,
    });
    return;
  }

  next();
};
