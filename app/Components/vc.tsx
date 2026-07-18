"use client";

import { useState } from "react";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  useParticipants,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";


function VideoCallInner({
  onLeave,
  compact = false,
}: {
  onLeave?: () => void;
  compact?: boolean;
}) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const participants = useParticipants();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="vc-container flex flex-col h-full">
      
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "rgba(var(--glow), 0.15)" }}
            >
              <Video className="w-3 h-3 text-purple-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
              Video Call
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 text-[8px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-2.5 h-2.5" />
            {participants.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      
      <div
        className="relative overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          height: isCollapsed ? 0 : compact ? 180 : 220,
          opacity: isCollapsed ? 0 : 1,
        }}
      >
        {tracks.length > 0 ? (
          <GridLayout
            tracks={tracks}
            style={{
              height: "100%",
              padding: "4px",
              gap: "4px",
            }}
          >
            <ParticipantTile />
          </GridLayout>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <VideoOff className="w-6 h-6 text-white/20" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">
                No participants
              </span>
            </div>
          </div>
        )}
      </div>

      
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          height: isCollapsed ? 0 : "auto",
          opacity: isCollapsed ? 0 : 1,
        }}
      >
        <ControlBar
          variation="minimal"
          controls={{
            microphone: true,
            camera: true,
            screenShare: true,
            leave: true,
            chat: false,
            settings: false,
          }}
          saveUserChoices={true}
        />
      </div>

      <RoomAudioRenderer />
    </div>
  );
}


function VideoCallFloating({
  onLeave,
}: {
  onLeave?: () => void;
}) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const participants = useParticipants();

  return (
    <div className="vc-container flex flex-col h-full w-full">
      
      <div className="flex-1 relative overflow-hidden">
        {tracks.length > 0 ? (
          <GridLayout
            tracks={tracks}
            style={{
              height: "100%",
              padding: "2px",
              gap: "2px",
            }}
          >
            <ParticipantTile />
          </GridLayout>
        ) : (
          <div className="flex items-center justify-center h-full bg-black/60">
            <VideoOff className="w-5 h-5 text-white/20" />
          </div>
        )}
      </div>

      
      <ControlBar
        variation="minimal"
        controls={{
          microphone: true,
          camera: true,
          screenShare: false,
          leave: true,
          chat: false,
          settings: false,
        }}
      />

      <RoomAudioRenderer />
    </div>
  );
}


export default function VideoCall({
  token,
  serverUrl,
  variant = "sidebar",
  audioOnly = false,
  onLeave,
}: {
  token: string;
  serverUrl: string;
  variant?: "sidebar" | "floating";
  audioOnly?: boolean;
  onLeave?: () => void;
}) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={!audioOnly}
      audio={true}
      onDisconnected={() => {
        console.log("LiveKit disconnected");
        onLeave?.();
      }}
      data-lk-theme="default"
    >
      {variant === "floating" ? (
        <VideoCallFloating onLeave={onLeave} />
      ) : (
        <VideoCallInner onLeave={onLeave} compact={false} />
      )}
    </LiveKitRoom>
  );
}