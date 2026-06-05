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
  Minimize2,
  Settings,
  LayoutGrid,
  Users,
  Smile,
  Send,
  Volume2,
  VolumeX,
  MessageSquare,
} from "lucide-react";

const EMOJI_REACTIONS = ["😍", "🔥", "💀", "❤️", "💜", "😂", "👏", "🎬"];
const SOCKET_URL = "http://localhost:3001";
const HEARTBEAT_INTERVAL = 3000; // 3 seconds

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

interface SyncToast {
  id: number;
  text: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatVideoTime(seconds: number) {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/* ── YouTube URL detection ── */
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function RoomPage() {
  const params = useParams();
  const roomId = params?.id as string;
  const { data: session, status } = useSession();

  const userName =
    session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Anonymous";

  /* ── State ── */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [mySocketId, setMySocketId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [syncToasts, setSyncToasts] = useState<SyncToast[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenChat, setShowFullscreenChat] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [roomLoading, setRoomLoading] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isRemoteAction = useRef(false);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenChatEndRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytTimeUpdateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Derived: is this a YouTube URL? ── */
  const youtubeId = getYouTubeVideoId(videoUrl);
  const isYouTube = !!youtubeId;

  /* ── Helper: show a sync toast ── */
  const showSyncToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setSyncToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setSyncToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  /* ── Fetch room data from API ── */
  useEffect(() => {
    async function fetchRoom() {
      try {
        const res = await fetch(`/api/room/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setVideoUrl(data.videoUrl || "");
          setRoomName(data.destName || "");
        }
      } catch (err) {
        console.error("Failed to fetch room data:", err);
      } finally {
        setRoomLoading(false);
      }
    }
    if (roomId) fetchRoom();
  }, [roomId]);

  /* ── YouTube IFrame API ── */
  useEffect(() => {
    if (!youtubeId || roomLoading) return;

    function createPlayer() {
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch { /* noop */ }
        ytPlayerRef.current = null;
      }

      ytPlayerRef.current = new window.YT.Player("yt-player-target", {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            setDuration(event.target.getDuration());
            setIsPlaying(true);

            // Poll current time since YT has no native timeupdate
            if (ytTimeUpdateRef.current) clearInterval(ytTimeUpdateRef.current);
            ytTimeUpdateRef.current = setInterval(() => {
              if (ytPlayerRef.current?.getCurrentTime) {
                setCurrentTime(ytPlayerRef.current.getCurrentTime());
                // Also keep duration updated (YT reports 0 initially)
                const dur = ytPlayerRef.current.getDuration();
                if (dur > 0) setDuration(dur);
              }
            }, 250);
          },
          onStateChange: (event: any) => {
            const s = event.data;
            if (s === window.YT.PlayerState.PLAYING) {
              if (!isRemoteAction.current) setIsPlaying(true);
            } else if (s === window.YT.PlayerState.PAUSED) {
              if (!isRemoteAction.current) setIsPlaying(false);
            } else if (s === window.YT.PlayerState.ENDED) {
              // Loop: restart
              ytPlayerRef.current?.seekTo(0);
              ytPlayerRef.current?.playVideo();
            }
          },
        },
      });
    }

    // Load the IFrame API script if needed
    if (window.YT?.Player) {
      createPlayer();
    } else {
      if (!document.getElementById("yt-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (ytTimeUpdateRef.current) {
        clearInterval(ytTimeUpdateRef.current);
        ytTimeUpdateRef.current = null;
      }
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch { /* noop */ }
        ytPlayerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId, roomLoading]);

  /* ── Helper: emit video action ── */
  const emitVideoAction = useCallback(
    (action: string, time: number) => {
      if (!socketRef.current || isRemoteAction.current) return;
      socketRef.current.emit("video-action", {
        roomId,
        action,
        currentTime: time,
        userName,
      });
    },
    [roomId, userName]
  );

  /* ── Socket setup ── */
  useEffect(() => {
    if (status === "loading") return;

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

    // ── Message history from server (on join) ──
    socket.on("message-history", (history: Array<{
      id: number;
      type: "chat" | "system";
      socketId?: string;
      user?: string;
      text: string;
      timestamp: string;
    }>) => {
      const mapped: ChatMessage[] = history.map((msg) => ({
        id: msg.id,
        type: msg.type,
        side: msg.type === "system"
          ? "system"
          : msg.socketId === socket.id
            ? "right"
            : "left",
        user: msg.user,
        text: msg.text,
        timestamp: msg.timestamp,
      }));
      setMessages(mapped);
    });

    // ── User joined (system message comes from server) ──
    socket.on("user-joined", ({ message }: {
      userName: string;
      socketId: string;
      message: { id: number; type: "system"; text: string; timestamp: string };
    }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: message.id,
          type: "system",
          side: "system",
          text: message.text,
          timestamp: message.timestamp,
        },
      ]);
    });

    // ── User left (system message comes from server) ──
    socket.on("user-left", ({ message }: {
      userName: string;
      socketId: string;
      message: { id: number; type: "system"; text: string; timestamp: string };
    }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: message.id,
          type: "system",
          side: "system",
          text: message.text,
          timestamp: message.timestamp,
        },
      ]);
    });

    // ── New chat message ──
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

    // ═══════════════════════════════════════════════
    //  VIDEO SYNC — incoming events
    // ═══════════════════════════════════════════════

    // ── Video state on join (sync to room's current position) ──
    socket.on("video-state", ({ currentTime: time, isPlaying: playing }: {
      currentTime: number;
      isPlaying: boolean;
    }) => {
      isRemoteAction.current = true;

      if (ytPlayerRef.current?.seekTo) {
        ytPlayerRef.current.seekTo(time, true);
        if (playing) { ytPlayerRef.current.playVideo(); setIsPlaying(true); }
        else { ytPlayerRef.current.pauseVideo(); setIsPlaying(false); }
      } else {
        const video = videoRef.current;
        if (!video) { isRemoteAction.current = false; return; }
        video.currentTime = time;
        if (playing) { video.play().catch(() => {}); setIsPlaying(true); }
        else { video.pause(); setIsPlaying(false); }
      }

      setTimeout(() => { isRemoteAction.current = false; }, 200);
    });

    // ── Remote user performed a video action ──
    socket.on("video-sync", ({ action, currentTime: time, userName: who }: {
      action: string;
      currentTime: number;
      userName: string;
      socketId: string;
    }) => {
      isRemoteAction.current = true;

      const yt = ytPlayerRef.current;
      const video = videoRef.current;

      if (yt?.seekTo) {
        // YouTube player
        switch (action) {
          case "play":
            yt.seekTo(time, true); yt.playVideo(); setIsPlaying(true);
            showSyncToast(`${who} resumed playback`);
            break;
          case "pause":
            yt.seekTo(time, true); yt.pauseVideo(); setIsPlaying(false);
            showSyncToast(`${who} paused the video`);
            break;
          case "seek":
          case "seek-while-playing":
            yt.seekTo(time, true);
            if (action === "seek-while-playing") { yt.playVideo(); setIsPlaying(true); }
            showSyncToast(`${who} seeked to ${formatVideoTime(time)}`);
            break;
        }
      } else if (video) {
        // Native video player
        switch (action) {
          case "play":
            video.currentTime = time; video.play().catch(() => {}); setIsPlaying(true);
            showSyncToast(`${who} resumed playback`);
            break;
          case "pause":
            video.currentTime = time; video.pause(); setIsPlaying(false);
            showSyncToast(`${who} paused the video`);
            break;
          case "seek":
          case "seek-while-playing":
            video.currentTime = time;
            if (action === "seek-while-playing") { video.play().catch(() => {}); setIsPlaying(true); }
            showSyncToast(`${who} seeked to ${formatVideoTime(time)}`);
            break;
        }
      }

      setTimeout(() => { isRemoteAction.current = false; }, 200);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userName, status, showSyncToast]);

  /* ── Auto-scroll chat ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    fullscreenChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isFullscreen, showFullscreenChat]);

  /* ── Fullscreen change listener ── */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  /* ── Video time tracking ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  /* ── Heartbeat: send video position every 3s while playing ── */
  useEffect(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }

    if (isPlaying && socketRef.current && connected) {
      heartbeatRef.current = setInterval(() => {
        if (!socketRef.current) return;

        let time = 0;
        let playing = false;

        if (ytPlayerRef.current?.getCurrentTime) {
          time = ytPlayerRef.current.getCurrentTime();
          playing = ytPlayerRef.current.getPlayerState?.() === window.YT?.PlayerState?.PLAYING;
        } else {
          const video = videoRef.current;
          if (!video) return;
          time = video.currentTime;
          playing = !video.paused;
        }

        socketRef.current.emit("video-heartbeat", {
          roomId,
          currentTime: time,
          isPlaying: playing,
        });
      }, HEARTBEAT_INTERVAL);
    }

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [isPlaying, connected, roomId]);

  /* ── Handlers ── */
  const sendMessage = useCallback(() => {
    if (!newMsg.trim() || !socketRef.current) return;
    socketRef.current.emit("send-message", {
      roomId,
      text: newMsg.trim(),
      userName,
    });
    setNewMsg("");
  }, [newMsg, roomId, userName]);

  const triggerReaction = (emoji: string) => {
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 1200);
  };

  const togglePlay = () => {
    const yt = ytPlayerRef.current;
    const video = videoRef.current;

    if (yt?.playVideo) {
      const time = yt.getCurrentTime?.() ?? 0;
      if (isPlaying) {
        yt.pauseVideo();
        setIsPlaying(false);
        emitVideoAction("pause", time);
      } else {
        yt.playVideo();
        setIsPlaying(true);
        emitVideoAction("play", time);
      }
    } else if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
        emitVideoAction("pause", video.currentTime);
      } else {
        video.play().catch(() => {});
        setIsPlaying(true);
        emitVideoAction("play", video.currentTime);
      }
    }
  };

  const toggleMute = () => {
    const yt = ytPlayerRef.current;
    if (yt?.mute) {
      if (isMuted) { yt.unMute(); } else { yt.mute(); }
      setIsMuted(!isMuted);
    } else {
      setIsMuted((m) => !m);
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    if (!bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = fraction * duration;

    if (ytPlayerRef.current?.seekTo) {
      ytPlayerRef.current.seekTo(seekTime, true);
    } else if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }

    setCurrentTime(seekTime);
    const action = isPlaying ? "seek-while-playing" : "seek";
    emitVideoAction(action, seekTime);
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      container.requestFullscreen().catch(() => {});
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ── Render ── */
  return (
    <div className="h-screen bg-[#060612] flex overflow-hidden">
      {/* ═══════════════════════════════════════════════ */}
      {/*  LEFT — Video Player Area                      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col relative">
        {/* Video container */}
        <div ref={playerContainerRef} className="flex-1 relative overflow-hidden bg-black">
          {/* Conditional: YouTube embed or native <video> */}
          {isYouTube ? (
            <div className="absolute inset-0 w-full h-full">
              <div
                id="yt-player-target"
                className="w-full h-full"
              />
              {/* Transparent overlay to block YT clickjacking and let our controls work */}
              <div className="absolute inset-0 z-[1]" />
            </div>
          ) : (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={videoUrl || undefined}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onPlay={() => {
                if (!isRemoteAction.current) setIsPlaying(true);
              }}
              onPause={() => {
                if (!isRemoteAction.current) setIsPlaying(false);
              }}
            />
          )}

          {/* Loading overlay while fetching room data */}
          {roomLoading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#060612]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                  Loading room...
                </span>
              </div>
            </div>
          )}

          {/* No video URL fallback */}
          {!roomLoading && !videoUrl && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#060612]">
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <Play className="w-7 h-7 text-purple-400/60" />
                </div>
                <p className="text-sm font-semibold text-white/50">
                  No video URL configured for this room
                </p>
                <p className="text-xs text-white/30">
                  The host needs to provide a video link when creating the room
                </p>
              </div>
            </div>
          )}

          {/* ── Fullscreen Floating Chat Panel ── */}
          {isFullscreen && showFullscreenChat && (
            <div className="absolute top-20 right-5 bottom-28 w-80 lg:w-96 bg-transparent flex flex-col overflow-hidden z-30 room-msg-appear">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-transparent">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300 drop-shadow-md">
                    Live Chat
                  </span>
                </div>
                <button
                  onClick={() => setShowFullscreenChat(false)}
                  className="text-white/50 hover:text-white/90 transition-colors text-xs font-semibold px-2.5 py-1 rounded bg-[#0a0a14]/60 backdrop-blur-md border border-white/[0.08] cursor-pointer hover:bg-[#0a0a14]/80"
                >
                  Hide
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
                    <Users className="w-6 h-6 text-purple-400" />
                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                      No messages yet
                    </p>
                  </div>
                )}
                {messages.map((msg) => {
                  if (msg.type === "system") {
                    return (
                      <div key={msg.id} className="flex items-center gap-2 justify-center">
                        <div className="h-px flex-1 bg-white/[0.05]" />
                        <span className="text-[9px] text-purple-400/60 font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full bg-[#0a0a14]/40 backdrop-blur-sm border border-purple-500/10 whitespace-nowrap">
                          {msg.text}
                        </span>
                        <div className="h-px flex-1 bg-white/[0.05]" />
                      </div>
                    );
                  }
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.side === "right" ? "flex-row-reverse" : ""} room-msg-appear`}
                    >
                      <div className={`max-w-[85%] ${msg.side === "right" ? "items-end" : "items-start"} flex flex-col`}>
                        {msg.side === "left" && (
                          <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-purple-400/70 mb-0.5 ml-1 drop-shadow-md">
                            {msg.user}
                          </span>
                        )}
                        <div
                          className={`px-3 py-2 rounded-xl text-[12px] leading-relaxed font-medium ${
                            msg.side === "right"
                              ? "bg-gradient-to-br from-purple-600/70 to-pink-600/60 backdrop-blur-sm text-white rounded-tr-md border border-purple-500/20 shadow-lg shadow-purple-500/10"
                              : "bg-[#0a0a14]/70 backdrop-blur-sm text-white/95 rounded-tl-md border border-white/10 shadow-lg"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={fullscreenChatEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-2 bg-transparent">
                <div className="flex items-center gap-2 bg-[#0a0a14]/70 backdrop-blur-md rounded-lg border border-white/[0.1] px-2.5 py-1.5 focus-within:border-purple-500/50 transition-all duration-300 shadow-lg">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none font-medium"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!connected || !newMsg.trim()}
                    className="w-6 h-6 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:from-purple-400 hover:to-pink-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Top overlay gradient */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent z-10" />
          {/* Bottom overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060612] via-[#060612]/60 to-transparent z-10" />

          {/* ── Top-left: Title & viewers ── */}
          <div className="absolute top-5 left-5 z-20">
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {roomName || "Untitled Room"}
              </span>
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-white/50 tracking-wider uppercase">
                {onlineCount} watching
              </span>
            </div>
          </div>

          {/* ── Sync toast notifications ── */}
          <div className="absolute top-5 right-5 z-30 flex flex-col gap-2 items-end">
            {syncToasts.map((toast) => (
              <div
                key={toast.id}
                className="sync-toast px-3 py-2 rounded-lg bg-purple-500/20 backdrop-blur-xl border border-purple-500/20 text-xs font-medium text-purple-200 shadow-lg shadow-purple-500/10"
              >
                {toast.text}
              </div>
            ))}
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

            {/* Progress bar — clickable to seek */}
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="relative w-full h-1 bg-white/[0.08] rounded-full overflow-hidden group cursor-pointer mb-3"
            >
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
                  {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isFullscreen && (
                  <button
                    id="toggle-fullscreen-chat-btn"
                    onClick={() => setShowFullscreenChat(!showFullscreenChat)}
                    className={`w-9 h-9 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      showFullscreenChat
                        ? "bg-purple-500/25 border-purple-500/40 text-purple-300 hover:bg-purple-500/40"
                        : "bg-white/[0.08] border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15]"
                    }`}
                    title={showFullscreenChat ? "Hide Chat" : "Show Chat"}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                <button
                  id="fullscreen-btn"
                  onClick={toggleFullscreen}
                  className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all duration-300 cursor-pointer"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
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
