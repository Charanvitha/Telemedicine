import { Server } from "socket.io";

const roomParticipants = new Map();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-room", ({ roomId, user }) => {
      const participants = roomParticipants.get(roomId) || [];
      roomParticipants.set(roomId, [...participants, socket.id]);
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { socketId: socket.id, user });
      socket.emit("room-users", participants);
    });

    socket.on("webrtc-offer", ({ roomId, offer, to }) => {
      io.to(to).emit("webrtc-offer", { offer, from: socket.id, roomId });
    });

    socket.on("webrtc-answer", ({ answer, to }) => {
      io.to(to).emit("webrtc-answer", { answer, from: socket.id });
    });

    socket.on("webrtc-ice-candidate", ({ candidate, to }) => {
      io.to(to).emit("webrtc-ice-candidate", { candidate, from: socket.id });
    });

    socket.on("disconnecting", () => {
      for (const roomId of socket.rooms) {
        if (roomId === socket.id) {
          continue;
        }

        const participants = roomParticipants.get(roomId) || [];
        roomParticipants.set(
          roomId,
          participants.filter((id) => id !== socket.id)
        );
        socket.to(roomId).emit("user-left", { socketId: socket.id });
      }
    });
  });
};
