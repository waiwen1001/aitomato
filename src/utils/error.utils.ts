export const formatErrorResponse = (error: any) => {
  return {
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
  };
};
