import { Request, Response, NextFunction } from "express";

export const validateRestaurantInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Example validation logic
  const { name, location } = req.body; // Works for both JSON and form data

  if (!name || !location) {
    res.status(400).json({
      message: "Name and location are required",
      receivedData: req.body, // For debugging purposes
    });
    return;
  }

  next(); // Proceed to the next middleware/controller
};
