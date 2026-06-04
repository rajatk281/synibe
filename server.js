import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3001;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Track users per room: roomId -> Map<socketId, userName>
const roomUsers = new Map();

// Message history per room: roomId -> ChatMessage[] (capped at 100)
const roomMessages = new Map();

// Video state per room: roomId -> { currentTime, isPlaying, lastUpdated, updatedBy }
const roomVideoState = new Map();

const MAX_MESSAGES = 100;

function pushMessage(roomId, message) {
  if (!roomMessages.has(roomId)) {
    roomMessages.set(roomId, []);
  }
  const history = roomMessages.get(roomId);
  history.push(message);
  // Cap at MAX_MESSAGES
  if (history.length > MAX_MESSAGES) {
    history.splice(0, history.length - MAX_MESSAGES);
  }
}

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

    // ── Send message history to the joining socket ──
    const history = roomMessages.get(roomId) || [];
    socket.emit("message-history", history);

    // ── Send current video state to the joining socket ──
    const videoState = roomVideoState.get(roomId);
    if (videoState) {
      // Estimate current position based on elapsed time since last update
      const elapsed = (Date.now() - videoState.lastUpdated) / 1000;
      const estimatedTime = videoState.isPlaying
        ? videoState.currentTime + elapsed
        : videoState.currentTime;

      socket.emit("video-state", {
        currentTime: estimatedTime,
        isPlaying: videoState.isPlaying,
      });
    }

    // ── Create and store the system message ──
    const joinMsg = {
      id: Date.now(),
      type: "system",
      text: `${currentUser} joined the room`,
      timestamp: new Date().toISOString(),
    };
    pushMessage(roomId, joinMsg);

    // Notify everyone in the room (including sender)
    io.to(roomId).emit("user-joined", {
      userName: currentUser,
      socketId: socket.id,
      message: joinMsg,
    });

    // Broadcast updated count
    io.to(roomId).emit("online-count", onlineCount);

    console.log(`[${roomId}] ${currentUser} joined. Online: ${onlineCount}`);
  });

  // User sends a message
  socket.on("send-message", ({ roomId, text, userName, socketId }) => {
    const message = {
      id: Date.now(),
      type: "chat",
      socketId,
      user: userName || "Anonymous",
      text,
      timestamp: new Date().toISOString(),
    };
    // Store in history
    pushMessage(roomId, message);
    // Broadcast to everyone in the room
    io.to(roomId).emit("new-message", message);
  });

  // ═══════════════════════════════════════════════
  //  VIDEO SYNC EVENTS
  // ═══════════════════════════════════════════════

  // A user performed a video action (play, pause, seek)
  socket.on("video-action", ({ roomId, action, currentTime, userName }) => {
    // Update the authoritative room state
    roomVideoState.set(roomId, {
      currentTime,
      isPlaying: action === "play" || action === "seek-while-playing",
      lastUpdated: Date.now(),
      updatedBy: socket.id,
    });

    // Broadcast to all OTHER sockets in the room
    socket.to(roomId).emit("video-sync", {
      action,
      currentTime,
      userName: userName || "Someone",
      socketId: socket.id,
    });

    console.log(
      `[${roomId}] ${userName} → video-action: ${action} @ ${currentTime.toFixed(1)}s`
    );
  });

  // Periodic heartbeat to keep room state fresh (sent by the "oldest" connected client)
  socket.on("video-heartbeat", ({ roomId, currentTime, isPlaying }) => {
    roomVideoState.set(roomId, {
      currentTime,
      isPlaying,
      lastUpdated: Date.now(),
      updatedBy: socket.id,
    });
  });

  // User disconnects
  socket.on("disconnect", () => {
    if (!currentRoom || !currentUser) return;

    const users = roomUsers.get(currentRoom);
    if (users) {
      users.delete(socket.id);
      const onlineCount = users.size;

      // Create and store the system message
      const leaveMsg = {
        id: Date.now() + 1,
        type: "system",
        text: `${currentUser} left the room`,
        timestamp: new Date().toISOString(),
      };
      pushMessage(currentRoom, leaveMsg);

      // Notify remaining users
      io.to(currentRoom).emit("user-left", {
        userName: currentUser,
        socketId: socket.id,
        message: leaveMsg,
      });
      io.to(currentRoom).emit("online-count", onlineCount);

      // Clean up room data if empty
      if (users.size === 0) {
        roomUsers.delete(currentRoom);
        roomMessages.delete(currentRoom);
        roomVideoState.delete(currentRoom);
        console.log(`[${currentRoom}] Room empty. Cleaned up state.`);
      }

      console.log(
        `[${currentRoom}] ${currentUser} left. Online: ${onlineCount}`
      );
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`\n🔌 Socket.io server running on http://localhost:${PORT}\n`);
});
