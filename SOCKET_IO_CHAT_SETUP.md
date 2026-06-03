# Real-Time Chat with Socket.io Integration Guide

This document explains the architecture and data flow for the real-time chat feature implemented in the Next.js application using `socket.io`. It serves as a reference for understanding how the system works and how to maintain or extend it in the future.

## 1. Architectural Decision: Standalone Server

**Why a separate server?**
Next.js (especially the App Router) is heavily optimized for Serverless environments and HTTP request/response cycles. It does not natively support long-running custom WebSocket servers within the same process on the default dev server port in a reliable way.
To ensure production-grade stability and clean separation of concerns, the Socket.io server runs as a completely independent Node.js process.

- **Next.js App**: Runs on port `3000`
- **Socket Server**: Runs on port `3001` (`server.js`)

## 2. Server Setup (`server.js`)

The server is a lightweight Express/HTTP server that initializes `socket.io` with CORS configured to allow connections from the Next.js frontend.

### State Management
The server keeps track of users per room using a `Map`:
```javascript
// Track users per room: roomId -> Map<socketId, userName>
const roomUsers = new Map();
```

### Core Events Handled by Server
The server listens for the following events from connected clients:

1. **`join-room`**:
   - Client sends: `{ roomId, userName }`
   - Server adds the user to the `roomUsers` map for the specific `roomId`.
   - Server joins the socket to a specific room channel using `socket.join(roomId)`.
   - Server broadcasts `user-joined` (to notify others) and `online-count` (to update the viewer count).

2. **`send-message`**:
   - Client sends: `{ roomId, text, userName, socketId }`
   - Server formats the message payload (adding a timestamp and unique ID).
   - Server broadcasts `new-message` to everyone in the `roomId` via `io.to(roomId).emit(...)`.

3. **`disconnect`**:
   - Built-in event triggered when a user closes the tab or loses connection.
   - Server finds the user in `roomUsers`, removes them, and broadcasts `user-left` and updated `online-count` to the room.

## 3. Client Integration (`app/room/[id]/page.tsx`)

The frontend uses `socket.io-client` to connect to the standalone server. The connection lifecycle and event listeners are managed inside a `useEffect` hook to ensure they only run on the client side after the component mounts.

### Connection & Authentication
```typescript
const socket = io("http://localhost:3001", { transports: ["websocket"] });
```
Instead of complex token authentication, the client simply extracts the user's name from NextAuth's `useSession()` and passes it to the server when joining:
```typescript
socket.emit("join-room", { roomId, userName });
```

### Listening to Server Events
The client listens for updates from the server and updates local React state:

- **`new-message`**: Appends the incoming message to the `messages` array. It determines if the message was sent by the current user by comparing the sender's `socketId` with its own `socket.id`. If they match, the message is rendered on the right side; otherwise, on the left.
- **`user-joined` / `user-left`**: Appends a special "system" message to the chat array, which is rendered as a center-aligned notification pill in the UI.
- **`online-count`**: Updates the `onlineCount` state variable, which is displayed in the chat header.

### Sending Messages
When the user types a message and hits enter or clicks send, the client emits the event to the server:
```typescript
socketRef.current.emit("send-message", {
  roomId,
  text: newMsg.trim(),
  userName,
  socketId: mySocketId,
});
```
Notice that the client *does not* immediately append its own message to the UI. It waits for the server to broadcast the `new-message` event back to everyone (including the sender). This ensures messages are ordered correctly based on the server's timestamp.

## 4. Running the Servers

To make development easy, the `package.json` includes scripts to run both servers concurrently using the `concurrently` package.

Instead of running just `npm run dev`, you run:
```bash
npm run dev:all
```
This single command spins up both the Next.js dev server and the Socket.io Node server simultaneously.

## Summary Flow
1. User navigates to `/room/123`.
2. `useEffect` mounts, connects to `localhost:3001`.
3. Client emits `join-room` with `roomId: "123"` and `userName: "Rajat"`.
4. Server registers the user, emits `user-joined` and `online-count` to room `123`.
5. Other users in room `123` receive the events and see "Rajat joined" and an updated online count.
6. User types "Hello" and hits send. Client emits `send-message`.
7. Server receives message, adds timestamp, and broadcasts `new-message` to room `123`.
8. All clients (including Rajat) receive `new-message` and append it to their chat windows.
9. User closes tab. Server detects `disconnect`, removes user, and broadcasts `user-left` and updated `online-count`.
