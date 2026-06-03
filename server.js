import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.SOCKET_PORT || 3001;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Track users per room: roomId -> Map<socketId, userName>
const roomUsers = new Map();

io.on("connection", (socket) => {
  let currentRoom = null;
  let currentUser = null;

  // User joins a room
  socket.on("join-room", ({ roomId, userName }) => {
    currentRoom = roomId;
    currentUser = userName || "Anonymous";

    socket.join(roomId);

    // Track this user in the room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Map());
    }
    roomUsers.get(roomId).set(socket.id, currentUser);

    const onlineCount = roomUsers.get(roomId).size;

    // Notify everyone in the room (including sender)
    io.to(roomId).emit("user-joined", {
      userName: currentUser,
      socketId: socket.id,
    });

    // Broadcast updated count
    io.to(roomId).emit("online-count", onlineCount);

    console.log(`[${roomId}] ${currentUser} joined. Online: ${onlineCount}`);
  });

  // User sends a message
  socket.on("send-message", ({ roomId, text, userName, socketId }) => {
    const message = {
      id: Date.now(),
      socketId,
      user: userName || "Anonymous",
      text,
      timestamp: new Date().toISOString(),
    };
    // Broadcast to everyone in the room
    io.to(roomId).emit("new-message", message);
  });

  // Video play — broadcast to all OTHER users in the room
  socket.on("video-play", ({ roomId }) => {
    socket.to(roomId).emit("video-play");
  });

  // Video pause — broadcast to all OTHER users in the room
  socket.on("video-pause", ({ roomId }) => {
    socket.to(roomId).emit("video-pause");
  });

  // User disconnects
  socket.on("disconnect", () => {
    if (!currentRoom || !currentUser) return;

    const users = roomUsers.get(currentRoom);
    if (users) {
      users.delete(socket.id);
      const onlineCount = users.size;
      if (users.size === 0) roomUsers.delete(currentRoom);

      // Notify remaining users
      io.to(currentRoom).emit("user-left", {
        userName: currentUser,
        socketId: socket.id,
      });
      io.to(currentRoom).emit("online-count", onlineCount);

      console.log(
        `[${currentRoom}] ${currentUser} left. Online: ${onlineCount}`
      );
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`\n🔌 Socket.io server running on http://localhost:${PORT}\n`);
});
