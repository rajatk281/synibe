import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;
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


const roomUsers = new Map();


const roomMessages = new Map();


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
  let currentRoom = null;
  let currentUser = null;

  
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
      
      const elapsed = (Date.now() - videoState.lastUpdated) / 1000;
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

    console.log(`[${roomId}] ${currentUser} joined. Online: ${onlineCount}`);
  });

  
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

  
  
  

  
  socket.on("video-action", ({ roomId, action, currentTime, userName }) => {
    
    roomVideoState.set(roomId, {
      currentTime,
      isPlaying: action === "play" || action === "seek-while-playing",
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
      `[${roomId}] ${userName} → video-action: ${action} @ ${currentTime.toFixed(1)}s`
    );
  });

  
  socket.on("video-heartbeat", ({ roomId, currentTime, isPlaying }) => {
    roomVideoState.set(roomId, {
      currentTime,
      isPlaying,
      lastUpdated: Date.now(),
      updatedBy: socket.id,
    });
  });

  
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
      io.to(currentRoom).emit("online-count", onlineCount);

      
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

httpServer.listen(PORT,  "0.0.0.0", () => {
  console.log(`\n🔌 Socket.io server running on http://localhost:${PORT}\n`);
});
