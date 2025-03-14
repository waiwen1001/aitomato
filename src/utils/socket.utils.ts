import { io } from "../index";
import { Socket } from "socket.io";

export const handleQueueSocket = (socket: Socket) => {
  socket.on("joinGroup", (groupId: string) => {
    if (!groupId.startsWith("queue:")) {
      return;
    }

    socket.join(groupId);
    console.log(`Client ${socket.id} joined group ${groupId}`);
  });
};

// Send notification to a specific queue group
export const sendQueueNotification = (queueId: string, message: string) => {
  io.to(`queue:${queueId}`).emit("notification", message);
};

// Example usage:
// When queue status changes, notify the queue group
export const notifyQueueStatusChange = (queueId: string, status: string) => {
  sendQueueNotification(queueId, `Queue status changed to: ${status}`);
};
