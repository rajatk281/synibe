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