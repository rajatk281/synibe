import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

// HTTP server (required for Render port detection)
const httpServer = createServer((req, res) => {
  if (req.url === "/" || req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        service: "Synibe Socket Server",
      })
    );
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Track users per room: roomId -> Map<socketId, userName>
const roomUsers = new Map();

// Message history per room
const roomMessages = new Map();

// Video state per room
const roomVideoState = new Map();

const MAX_MESSAGES = 100;

function pushMessage(roomId, message) {
  if (!roomMessages.has(roomId)) {
    roomMessages.set(roomId, []);
  }

  const history = roomMessages.get(roomId);
  history.push(message);

  if (history.length > MAX_MESSAGES) {
    history.splice(0, history.length - MAX_MESSAGES);
  }
}

io.on("connection", (socket) => {
  console.log(`✅ Connected: ${socket.id}`);

  let currentRoom = null;
  let currentUser = null;

  // User joins room
  socket.on("join-room", ({ roomId, userName }) => {
    currentRoom = roomId;
    currentUser = userName || "Anonymous";

    socket.join(roomId);

    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Map());
    }

    roomUsers.get(roomId).set(socket.id, currentUser);

    const onlineCount = roomUsers.get(roomId).size;

    const history = roomMessages.get(roomId) || [];
    socket.emit("message-history", history);

    const videoState = roomVideoState.get(roomId);

    if (videoState) {
      const elapsed =
        (Date.now() - videoState.lastUpdated) / 1000;

      const estimatedTime = videoState.isPlaying
        ? videoState.currentTime + elapsed
        : videoState.currentTime;

      socket.emit("video-state", {
        currentTime: estimatedTime,
        isPlaying: videoState.isPlaying,
      });
    }

    const joinMsg = {
      id: Date.now(),
      type: "system",
      text: `${currentUser} joined the room`,
      timestamp: new Date().toISOString(),
    };

    pushMessage(roomId, joinMsg);

    io.to(roomId).emit("user-joined", {
      userName: currentUser,
      socketId: socket.id,
      message: joinMsg,
    });

    io.to(roomId).emit("online-count", onlineCount);

    console.log(
      `[${roomId}] ${currentUser} joined. Online: ${onlineCount}`
    );
  });

  // Chat messages
  socket.on("send-message", ({ roomId, text, userName }) => {
    const message = {
      id: Date.now(),
      type: "chat",
      socketId: socket.id,
      user: userName || "Anonymous",
      text,
      timestamp: new Date().toISOString(),
    };

    pushMessage(roomId, message);

    io.to(roomId).emit("new-message", message);
  });

  // Video actions
  socket.on(
    "video-action",
    ({ roomId, action, currentTime, userName }) => {
      roomVideoState.set(roomId, {
        currentTime,
        isPlaying:
          action === "play" ||
          action === "seek-while-playing",
        lastUpdated: Date.now(),
        updatedBy: socket.id,
      });

      socket.to(roomId).emit("video-sync", {
        action,
        currentTime,
        userName: userName || "Someone",
        socketId: socket.id,  
      });

      console.log(
        `[${roomId}] ${userName} → ${action} @ ${currentTime.toFixed(
          1
        )}s`
      );
    }
  );

  socket.on(
    "video-heartbeat",
    ({ roomId, currentTime, isPlaying }) => {
      roomVideoState.set(roomId, {
        currentTime,
        isPlaying,
        lastUpdated: Date.now(),
        updatedBy: socket.id,
      });
    }
  );

  // Join request
  socket.on("request-join", ({ roomId, userName }) => {
    io.to(roomId).emit("join-request", {
      socketId: socket.id,
      userName: userName || "Anonymous",
    });
  });

  // Join approval
  socket.on("respond-join", ({ targetSocketId, approved }) => {
    io.to(targetSocketId).emit(
      "join-response",
      approved
    );
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (!currentRoom || !currentUser) return;

    const users = roomUsers.get(currentRoom);

    if (users) {
      users.delete(socket.id);

      const onlineCount = users.size;

      const leaveMsg = {
        id: Date.now() + 1,
        type: "system",
        text: `${currentUser} left the room`,
        timestamp: new Date().toISOString(),
      };

      pushMessage(currentRoom, leaveMsg);

      io.to(currentRoom).emit("user-left", {
        userName: currentUser,
        socketId: socket.id,
        message: leaveMsg,
      });

      io.to(currentRoom).emit(
        "online-count",
        onlineCount
      );

      if (users.size === 0) {
        roomUsers.delete(currentRoom);
        roomMessages.delete(currentRoom);
        roomVideoState.delete(currentRoom);

        console.log(
          `[${currentRoom}] Room empty. Cleaned up state.`
        );
      }

      console.log(
        `[${currentRoom}] ${currentUser} left. Online: ${onlineCount}`
      );
    }
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🔌 Socket.IO ready`);
});