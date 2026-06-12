# LiveKit Video Call Setup & Integration Guide

This document provides a detailed, step-by-step breakdown of how LiveKit is set up and integrated into the Synibe video call feature.

---

## Table of Contents
1. [Overview](#1-overview)
2. [Step 1: LiveKit Server & Credentials Setup](#2-step-1-livekit-server--credentials-setup)
3. [Step 2: Environment Configuration](#3-step-2-environment-configuration)
4. [Step 3: Backend Token Generation (`/api/livekit-token`)](#4-step-3-backend-token-generation-apilivekit-token)
5. [Step 4: Frontend LiveKit Component (`VideoCall`)](#5-step-4-frontend-livekit-component-videocall)
6. [Step 5: Room Page Integration (`/room/[id]`)](#6-step-5-room-page-integration-roomid)
7. [Troubleshooting & Common Pitfalls](#7-troubleshooting--common-pitfalls)

---

## 1. Overview

Synibe uses **LiveKit** to power its real-time video and audio communication alongside synced video playback. The architecture consists of:
- **LiveKit Cloud / Server**: Handles selective forwarding unit (SFU) media routing.
- **Next.js Backend**: Generates secure access tokens using `livekit-server-sdk` so users can authenticate and join room-specific calls.
- **Next.js Frontend**: Uses `@livekit/components-react` to render the user interfaces, handle device permissions, and stream media.

---

## 2. Step 1: LiveKit Server & Credentials Setup

To connect to LiveKit, you need a running LiveKit instance. For production and deployment ease, **LiveKit Cloud** is highly recommended:

1. Sign up/Log in at [cloud.livekit.io](https://cloud.livekit.io).
2. Create a new Project.
3. Head to the project **Settings** dashboard to find:
   - **WSS URL / Project URL** (e.g., `wss://synibe-xxxxxx.livekit.cloud`)
   - **API Key** (e.g., `APIxxxxxxxxxxxxx`)
   - **API Secret** (e.g., `secret-key-xxxxxxxxxx`)

---

## 3. Step 2: Environment Configuration

Save your credentials to your project's root `.env` file. You must define both the server-side environment variables and a browser-accessible variable prefixed with `NEXT_PUBLIC_`.

Open or create `[c:/Projects/synibe/.env](file:///c:/Projects/synibe/.env)` and configure the following:

```env
# Server-side environment variables (Hidden from client)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# Client-side environment variables (Visible in the browser)
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

> [!IMPORTANT]
> The `NEXT_PUBLIC_` prefix is required by Next.js to compile and bundle the variable into the browser. Without this, `process.env.NEXT_PUBLIC_LIVEKIT_URL` will return `undefined` on the frontend.

---

## 4. Step 3: Backend Token Generation (`/api/livekit-token`)

Users cannot join a LiveKit room without a secure cryptographic token. We expose a POST endpoint that takes the `roomName` and a `participantName` and returns a JSON Web Token (JWT).

File: `[app/api/livekit-token/route.ts](file:///c:/Projects/synibe/app/api/livekit-token/route.ts)`

```typescript
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: Request) {
  const { roomName, participantName } = await req.json();

  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    return Response.json(
      { error: "LiveKit API credentials not configured" },
      { status: 500 }
    );
  }

  // Create an Access Token instance
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantName,
      ttl: "10m", // Time to live
    }
  );

  // Grant permissions (Publish and subscribe are necessary for interactive video calls)
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return Response.json({
    token: await at.toJwt(),
  });
}
```

---

## 5. Step 4: Frontend LiveKit Component (`VideoCall`)

We build a reusable React component that consumes the LiveKit React SDK, connects to the server, and renders the default grid layout UI (`VideoConference`).

File: `[app/Components/vc.tsx](file:///c:/Projects/synibe/app/Components/vc.tsx)`

```tsx
"use client";

import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";

export default function VideoCall({
  token,
  serverUrl,
}: {
  token: string;
  serverUrl: string;
}) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={() => console.log("LiveKit disconnected")}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
```

---

## 6. Step 5: Room Page Integration (`/room/[id]`)

In the active watch room page, we handle the workflow to ask the user if they'd like to join the video call, fetch the token asynchronously, and display the Video Call interface inside the right-hand panel.

File: `[app/room/[id]/page.tsx](file:///c:/Projects/synibe/app/room/%5Bid%5D/page.tsx)`

### 1. State Variables & Setup
```typescript
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL ?? "";

const [showVcPrompt, setShowVcPrompt] = useState(true);
const [inVideoCall, setInVideoCall] = useState(false);
const [liveKitToken, setLiveKitToken] = useState<string | null>(null);
const [joiningVc, setJoiningVc] = useState(false);
```

### 2. Joining Handler
Fetches the token from our custom `/api/livekit-token` API route:
```typescript
const handleJoinVideoCall = async () => {
  try {
    setJoiningVc(true);
    const res = await fetch("/api/livekit-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName: roomId, participantName: userName }),
    });
    const data = await res.json();
    setLiveKitToken(data.token);
    setInVideoCall(true);
    setShowVcPrompt(false);
  } catch (err) {
    console.error("Failed to get token:", err);
  } finally {
    setJoiningVc(false);
  }
};
```

### 3. Video Call Layout Rendering
Renders inside the sidebar when `inVideoCall` and `liveKitToken` are both present:
```tsx
{inVideoCall && liveKitToken && (
  <div className="h-[40vh] border-b border-white/[0.06] bg-black/50 relative overflow-hidden shrink-0 flex">
    <VideoCall token={liveKitToken} serverUrl={LIVEKIT_URL} />
  </div>
)}
```

---

## 7. Troubleshooting & Common Pitfalls

### 1. `relation "rooms" does not exist`
If you encounter database errors trying to query or insert rooms, the Drizzle migrations might not have been applied directly to your Neon instance. Run:
```bash
npx tsx scripts/setup-db.ts
```
to force-create the tables using the raw postgres driver.

### 2. Video call is blank or stuck on connecting
- Make sure `NEXT_PUBLIC_LIVEKIT_URL` in `.env` starts with `wss://` and is spelled correctly.
- If using `ws://localhost:7880` for local development, make sure a local LiveKit CLI server is running in the background. If you're not hosting a local server, switch to a **LiveKit Cloud** instance URL instead.
- Ensure the API keys inside `.env` match the ones generated in your LiveKit Cloud project settings.

### 3. Users cannot hear or see each other
- Make sure the browser has been granted Camera and Microphone permissions.
- Verify that `canPublish` and `canSubscribe` are both set to `true` in `[route.ts](file:///c:/Projects/synibe/app/api/livekit-token/route.ts)` when generating the token grants. Without these, LiveKit will connect successfully but will block media transmission.
