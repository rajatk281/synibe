"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import {
  Play,
  Pause,
  Maximize2,
  Settings,
  LayoutGrid,
  Users,
  Smile,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";

const EMOJI_REACTIONS = ["😍", "🔥", "💀", "❤️", "💜", "😂", "👏", "🎬"];
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

/* ── Types ── */
type MessageSide = "left" | "right" | "system";

interface ChatMessage {
  id: number;
  type: "chat" | "system";
  side: MessageSide;
  user?: string;
  text: string;
  timestamp: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.id as string;
  const { data: session } = useSession();

  const userName =
    session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Anonymous";

  /* ── State ── */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(35);
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [mySocketId, setMySocketId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const isRemoteAction = useRef(false);

  /* ── Socket setup ── */
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setMySocketId(socket.id ?? null);
      setConnected(true);
      // Announce joining the room
      socket.emit("join-room", { roomId, userName });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("online-count", (count: number) => {
      setOnlineCount(count);
    });

    socket.on("user-joined", ({ userName: who }: { userName: string; socketId: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          side: "system",
          text: `${who} joined the room`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on("user-left", ({ userName: who }: { userName: string; socketId: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "system",
          side: "system",
          text: `${who} left the room`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on(
      "new-message",
      ({
        id,
        socketId,
        user,
        text,
        timestamp,
      }: {
        id: number;
        socketId: string;
        user: string;
        text: string;
        timestamp: string;
      }) => {
        setMessages((prev) => [
          ...prev,
          {
            id,
            type: "chat",
            side: socketId === socket.id ? "right" : "left",
            user,
            text,
            timestamp,
          },
        ]);
      }
    );

    /* ── Video sync listeners ── */
    socket.on("video-play", () => {
      isRemoteAction.current = true;
      setIsPlaying(true);
      videoRef.current?.play();
      isRemoteAction.current = false;
    });

    socket.on("video-pause", () => {
      isRemoteAction.current = true;
      setIsPlaying(false);
      videoRef.current?.pause();
      isRemoteAction.current = false;
    });

    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userName]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Progress simulation ── */
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.05));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  /* ── Handlers ── */
  const sendMessage = useCallback(() => {
    if (!newMsg.trim() || !socketRef.current) return;
    socketRef.current.emit("send-message", {
      roomId,
      text: newMsg.trim(),
      userName,
      socketId: mySocketId,
    });
    setNewMsg("");
  }, [newMsg, roomId, userName, mySocketId]);

  const triggerReaction = (emoji: string) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 1200);
  };

  const togglePlay = () => {
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    if (videoRef.current) {
      newPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
    // Broadcast to other users in the room (only if this was a local action)
    if (!isRemoteAction.current && socketRef.current) {
      socketRef.current.emit(newPlaying ? "video-play" : "video-pause", { roomId });
    }
  };

  const toggleMute = () => {
    setIsMuted((m) => !m);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  /* ── Render ── */
  return (
    <div className="h-screen bg-[#060612] flex overflow-hidden">
      {/* ═══════════════════════════════════════════════ */}
      {/*  LEFT — Video Player Area                      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col relative">
        {/* Video container */}
        <div className="flex-1 relative overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/Videos/Stranger_Things.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />

          {/* Top overlay gradient */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent z-10" />
          {/* Bottom overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060612] via-[#060612]/60 to-transparent z-10" />

          {/* ── Top-left: Title & viewers ── */}
          <div className="absolute top-5 left-5 z-20">
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Neon Nights
              </span>{" "}
              <span className="text-white/60 font-normal">Ep. 04</span>
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-white/50 tracking-wider uppercase">
                {onlineCount} watching
              </span>
            </div>
          </div>

          {/* ── Floating emoji reaction ── */}
          {activeReaction && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 text-6xl room-reaction-float pointer-events-none">
              {activeReaction}
            </div>
          )}

          {/* ── Bottom controls ── */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-4">
            {/* Emoji reaction bar */}
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.06]">
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.1] hover:scale-125 transition-all duration-200 text-lg cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative w-full h-1 bg-white/[0.08] rounded-full overflow-hidden group cursor-pointer mb-3">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-purple-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  id="play-pause-btn"
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all duration-300 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <button
                  id="mute-btn"
                  onClick={toggleMute}
                  className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all duration-300 cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <span className="text-[11px] font-medium text-white/40 tracking-wide tabular-nums">
                  12:47 / 36:20
                </span>
              </div>
              <button
                id="fullscreen-btn"
                className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all duration-300 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  RIGHT — Chat Panel                            */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="w-[340px] lg:w-[380px] flex flex-col bg-[#0a0a14] border-l border-white/[0.06]">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Live Chat
            </span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-[9px] font-bold text-purple-400 uppercase tracking-wider">
              {onlineCount} Online
            </span>
            {/* Connection indicator */}
            <span
              className={`w-1.5 h-1.5 rounded-full ml-1 ${
                connected ? "bg-green-400 animate-pulse" : "bg-red-500"
              }`}
              title={connected ? "Connected" : "Disconnected"}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="chat-layout-btn"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              id="chat-settings-btn"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
              <Users className="w-8 h-8 text-purple-400" />
              <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                No messages yet
              </p>
            </div>
          )}

          {messages.map((msg) => {
            /* System notification */
            if (msg.type === "system") {
              return (
                <div
                  key={msg.id}
                  className="flex items-center gap-2 justify-center room-msg-appear"
                >
                  <div className="h-px flex-1 bg-white/[0.05]" />
                  <span className="text-[10px] text-purple-400/60 font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-full bg-purple-500/[0.07] border border-purple-500/10 whitespace-nowrap">
                    {msg.text}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>
              );
            }

            /* Chat bubble */
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.side === "right" ? "flex-row-reverse" : ""
                } room-msg-appear`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[80%] ${
                    msg.side === "right" ? "items-end" : "items-start"
                  } flex flex-col`}
                >
                  {msg.side === "left" && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-purple-400/70 mb-1 ml-1">
                      {msg.user}
                    </span>
                  )}
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed font-medium ${
                      msg.side === "right"
                        ? "bg-gradient-to-br from-purple-600/30 to-pink-600/20 text-white/90 rounded-tr-md border border-purple-500/10"
                        : "bg-white/[0.05] text-white/80 rounded-tl-md border border-white/[0.06]"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-white/20 mt-1 mx-1 font-medium">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl border border-white/[0.06] px-3 py-2 focus-within:border-purple-500/30 transition-all duration-300">
            <button
              id="emoji-picker-btn"
              onClick={() => setShowEmojis(!showEmojis)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-purple-400 hover:bg-purple-500/[0.06] transition-all duration-300 cursor-pointer"
            >
              <Smile className="w-4 h-4" />
            </button>
            <input
              id="chat-input"
              type="text"
              placeholder="Send a reaction..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none font-medium"
            />
            <button
              id="send-msg-btn"
              onClick={sendMessage}
              disabled={!connected || !newMsg.trim()}
              className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:from-purple-400 hover:to-pink-400 hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick emoji picker */}
          {showEmojis && (
            <div className="mt-2 flex items-center gap-1 flex-wrap px-1 room-emojis-appear">
              {["😍", "🔥", "💀", "❤️", "💜", "😂", "👏", "🎬", "😮", "🥺", "💯", "🫡"].map(
                (emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setNewMsg((prev) => prev + emoji);
                      setShowEmojis(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.08] transition-all duration-200 text-base cursor-pointer"
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Bottom mascot peek */}
        <div className="relative h-16 overflow-hidden">
          <div className="absolute -bottom-4 left-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/[0.06]">
              <Image
                src="/wolf_avatar.png"
                alt="Your character"
                fill
                className="object-cover opacity-50"
              />
            </div>
          </div>
          <div className="absolute -bottom-4 right-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/[0.06]">
              <Image
                src="/avatar_unicorn.png"
                alt="Guest character"
                fill
                className="object-cover opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
