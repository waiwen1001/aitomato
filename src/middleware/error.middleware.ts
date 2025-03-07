import { Request, Response, NextFunction } from "express";
import { formatErrorResponse } from "../utils/error.utils";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: formatErrorResponse(err),
  });
};
