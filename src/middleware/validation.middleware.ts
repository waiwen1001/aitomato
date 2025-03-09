import { Request, Response, NextFunction } from "express";

export const validateRestaurantInput = (req: Request, res: Response, next: NextFunction): void => {
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

export const validateQueueInput = (req: Request, res: Response, next: NextFunction): void => {
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


