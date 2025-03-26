import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { restaurantRoutes } from "./routes/restaurant.routes";
import { queueRoutes } from "./routes/queue.routes";
import { outletRoutes } from "./routes/outlet.routes";
import { errorHandler } from "./middleware/error.middleware";
import { menuRoutes } from "./routes/menu.routers";
import { fileRoutes } from "./routes/file.routers";
import { orderRoutes } from "./routes/order.routers";
import { layoutRoutes } from "./routes/layout.routers";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/layouts", layoutRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
