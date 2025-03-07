/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler for async routes
 */
export const asyncHandler =
  (fn: Function) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Format error response
 */
export const formatErrorResponse = (error: any) => {
  return {
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
  };
};
