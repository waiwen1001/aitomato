import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { restaurantRoutes } from "./routes/restaurant.routes";
import { queueRoutes } from "./routes/queue.routes";
import { outletRoutes } from "./routes/outlet.routes";
import { errorHandler } from "./middleware/error.middleware";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/outlets", outletRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware (should be after routes)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
