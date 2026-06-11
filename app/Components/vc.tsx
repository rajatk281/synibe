"use client";

import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";

export default function VideoCall({
  token,
  roomName,
}: {
  token: string;
  roomName: string;
}) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      video
      audio
    >
      <VideoConference />
    </LiveKitRoom>
  );
}