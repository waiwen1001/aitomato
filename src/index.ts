import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { restaurantRoutes } from "./routes/restaurant.routes";
import { queueRoutes } from "./routes/queue.routes";
import { outletRoutes } from "./routes/outlet.routes";
import { errorHandler } from "./middleware/error.middleware";
import { handleQueueSocket } from "./utils/socket.utils";
import { menuRoutes } from "./routes/menu.routers";
import { fileRoutes } from "./routes/file.routers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

export { io };

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/files", fileRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// socket.io connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Initialize queue socket handlers
  handleQueueSocket(socket);

  socket.on("test", ({ name, number }) => {
    console.log(name, number);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
