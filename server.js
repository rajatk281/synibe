import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

// ── Configuration ──
const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const MAX_MESSAGES = 100;

// ── HTTP + Socket.IO ──
const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket server is running");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ── Redis clients ──
const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();
// General-purpose client for storing room state
const redisClient = pubClient.duplicate();

async function connectRedis() {
  try {
    await Promise.all([
      pubClient.connect(),
      subClient.connect(),
      redisClient.connect(),
    ]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log("✅ Redis connected & Socket.IO adapter attached");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
    console.log("⚠️  Falling back to in-memory adapter (no horizontal scaling)");
  }
}

// ── Redis key helpers ──
const keys = {
  users: (roomId) => `room:${roomId}:users`,
  messages: (roomId) => `room:${roomId}:messages`,
  video: (roomId) => `room:${roomId}:video`,
};

// ── Room state operations (Redis-backed) ──

async function addUser(roomId, socketId, userName) {
  await redisClient.hSet(keys.users(roomId), socketId, userName);
}

async function removeUser(roomId, socketId) {
  await redisClient.hDel(keys.users(roomId), socketId);
}

async function getUserCount(roomId) {
  const users = await redisClient.hGetAll(keys.users(roomId));
  return Object.keys(users).length;
}

async function isRoomEmpty(roomId) {
  return (await getUserCount(roomId)) === 0;
}

async function pushMessage(roomId, message) {
  await redisClient.rPush(keys.messages(roomId), JSON.stringify(message));
  // Cap at MAX_MESSAGES
  await redisClient.lTrim(keys.messages(roomId), -MAX_MESSAGES, -1);
}

async function getMessageHistory(roomId) {
  const raw = await redisClient.lRange(keys.messages(roomId), 0, -1);
  return raw.map((item) => JSON.parse(item));
}

async function setVideoState(roomId, state) {
  await redisClient.hSet(keys.video(roomId), {
    currentTime: String(state.currentTime),
    isPlaying: String(state.isPlaying),
    lastUpdated: String(state.lastUpdated),
    updatedBy: state.updatedBy,
  });
}

async function getVideoState(roomId) {
  const data = await redisClient.hGetAll(keys.video(roomId));
  if (!data || !data.currentTime) return null;
  return {
    currentTime: parseFloat(data.currentTime),
    isPlaying: data.isPlaying === "true",
    lastUpdated: parseInt(data.lastUpdated, 10),
    updatedBy: data.updatedBy,
  };
}

async function cleanupRoom(roomId) {
  await redisClient.del(keys.users(roomId));
  await redisClient.del(keys.messages(roomId));
  await redisClient.del(keys.video(roomId));
}

// ── Socket.IO event handlers ──

io.on("connection", (socket) => {
  let currentRoom = null;
  let currentUser = null;

  // User joins a room
  socket.on("join-room", async ({ roomId, userName }) => {
    currentRoom = roomId;
    currentUser = userName || "Anonymous";

    socket.join(roomId);

    // Track this user in Redis
    await addUser(roomId, socket.id, currentUser);

    const onlineCount = await getUserCount(roomId);

    // Send message history to the joining socket
    const history = await getMessageHistory(roomId);
    socket.emit("message-history", history);

    // Send current video state to the joining socket
    const videoState = await getVideoState(roomId);
    if (videoState) {
      const elapsed = (Date.now() - videoState.lastUpdated) / 1000;
      const estimatedTime = videoState.isPlaying
        ? videoState.currentTime + elapsed
        : videoState.currentTime;

      socket.emit("video-state", {
        currentTime: estimatedTime,
        isPlaying: videoState.isPlaying,
      });
    }

    // Create and store the system message
    const joinMsg = {
      id: Date.now(),
      type: "system",
      text: `${currentUser} joined the room`,
      timestamp: new Date().toISOString(),
    };
    await pushMessage(roomId, joinMsg);

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
  socket.on("send-message", async ({ roomId, text, userName }) => {
    const message = {
      id: Date.now(),
      type: "chat",
      socketId: socket.id,
      user: userName || "Anonymous",
      text,
      timestamp: new Date().toISOString(),
    };
    // Store in Redis
    await pushMessage(roomId, message);
    // Broadcast to everyone in the room
    io.to(roomId).emit("new-message", message);
  });

  // ═══════════════════════════════════════════════
  //  VIDEO SYNC EVENTS
  // ═══════════════════════════════════════════════

  // A user performed a video action (play, pause, seek)
  socket.on("video-action", async ({ roomId, action, currentTime, userName }) => {
    // Update the authoritative room state in Redis
    await setVideoState(roomId, {
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

  // Periodic heartbeat to keep room state fresh
  socket.on("video-heartbeat", async ({ roomId, currentTime, isPlaying }) => {
    await setVideoState(roomId, {
      currentTime,
      isPlaying,
      lastUpdated: Date.now(),
      updatedBy: socket.id,
    });
  });

  // User disconnects
  socket.on("disconnect", async () => {
    if (!currentRoom || !currentUser) return;

    await removeUser(currentRoom, socket.id);
    const onlineCount = await getUserCount(currentRoom);

    // Create and store the system message
    const leaveMsg = {
      id: Date.now() + 1,
      type: "system",
      text: `${currentUser} left the room`,
      timestamp: new Date().toISOString(),
    };
    await pushMessage(currentRoom, leaveMsg);

    // Notify remaining users
    io.to(currentRoom).emit("user-left", {
      userName: currentUser,
      socketId: socket.id,
      message: leaveMsg,
    });
    io.to(currentRoom).emit("online-count", onlineCount);

    // Clean up room data if empty
    if (await isRoomEmpty(currentRoom)) {
      await cleanupRoom(currentRoom);
      console.log(`[${currentRoom}] Room empty. Cleaned up Redis state.`);
    }

    console.log(
      `[${currentRoom}] ${currentUser} left. Online: ${onlineCount}`
    );
  });
});

// ── Start server ──
await connectRedis();

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🔌 Socket.io server running on http://localhost:${PORT}\n`);
});
