"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Share2,
  Smile,
  Send,
} from "lucide-react";

/* ── Fake chat data ── */
const INITIAL_MESSAGES = [
  {
    id: 1,
    user: "Milo",
    avatar: "/avatar_cat.png",
    text: "This bridge is actually insane 🔊",
    time: "2m ago",
  },
  {
    id: 2,
    user: "Sara",
    avatar: "/avatar_unicorn.png",
    text: "Spatial audio hits different today. 💜",
    time: "now",
  },
];

/* ── Fake playlist ── */
const TRACKS = [
  { title: "Ethereal Drift", artist: "Auteur Soul", listeners: 126, cover: "/album_art.png" },
  { title: "Midnight Protocol", artist: "Void Signal", listeners: 89, cover: "/album_art.png" },
  { title: "Neon Pulse", artist: "CyberSynth", listeners: 214, cover: "/album_art.png" },
];

export default function ListenRoomPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMsg, setNewMsg] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(30);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = TRACKS[currentTrack];

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Progress bar simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.08));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You",
        avatar: "/wolf_avatar.png",
        text: newMsg,
        time: "now",
      },
    ]);
    setNewMsg("");
  };

  const nextTrack = () => {
    setCurrentTrack((c) => (c + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack((c) => (c - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="h-screen bg-[#060612] flex overflow-hidden">
      {/* Audio element (for future real audio) */}
      <audio ref={audioRef} src="/Videos/Listening.mp4" loop />

      {/* ═══════════════════════════════════════════════ */}
      {/*  LEFT — Music Player Area                      */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/[0.04] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-pink-600/[0.03] rounded-full blur-[180px] pointer-events-none" />

        {/* Player content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
          {/* Album Art */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-purple-900/20 mb-8 group">
            <Image
              src={track.cover}
              alt={track.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Top-right share button */}
            <button
              id="share-track-btn"
              className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-all duration-300 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Heart badge */}
            <button
              id="like-track-btn"
              onClick={() => setLiked(!liked)}
              className="absolute bottom-3 left-3 cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  liked
                    ? "fill-purple-400 text-purple-400 scale-110"
                    : "text-white/40 hover:text-purple-400"
                }`}
              />
            </button>
          </div>

          {/* Track info */}
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight text-center mb-1">
            {track.title}
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-8">
            {track.artist} • {track.listeners} Listeners
          </p>

          {/* Controls */}
          <div className="flex items-center gap-6 mb-6">
            <button
              id="prev-track-btn"
              onClick={prevTrack}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 cursor-pointer hover:scale-110"
            >
              <SkipBack className="w-5 h-5" fill="currentColor" />
            </button>

            <button
              id="listen-play-pause-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-600/30 hover:from-purple-400 hover:to-pink-400 hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>

            <button
              id="next-track-btn"
              onClick={nextTrack}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 cursor-pointer hover:scale-110"
            >
              <SkipForward className="w-5 h-5" fill="currentColor" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs">
            <div className="relative w-full h-1 bg-white/[0.08] rounded-full overflow-hidden group cursor-pointer mb-2">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-lg shadow-purple-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-white/20 tabular-nums">
              <span>{formatTime(progress * 2.4)}</span>
              <span>4:00</span>
            </div>
          </div>

          {/* Listener avatars */}
          <div className="flex items-center gap-2 mt-8">
            <div className="flex -space-x-2">
              {["/wolf_avatar.png", "/avatar_cat.png", "/avatar_unicorn.png"].map(
                (src, i) => (
                  <div
                    key={i}
                    className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#060612]"
                  >
                    <Image src={src} alt="Listener" fill className="object-cover" />
                  </div>
                )
              )}
            </div>
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider ml-1">
              +{track.listeners - 3} listening
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  RIGHT — Chat Panel                            */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="w-[300px] lg:w-[340px] flex flex-col bg-[#0a0a14] border-l border-white/[0.06]">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Live Reactions
          </span>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className="room-msg-appear">
              {/* Username */}
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-400/70 mb-1.5 block">
                {msg.user}
              </span>
              {/* Bubble */}
              <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-md bg-white/[0.05] border border-white/[0.06] text-[13px] text-white/80 font-medium leading-relaxed">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl border border-white/[0.06] px-3 py-2 focus-within:border-purple-500/30 transition-all duration-300">
            <button
              id="listen-emoji-btn"
              onClick={() => setShowEmojis(!showEmojis)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-purple-400 hover:bg-purple-500/[0.06] transition-all duration-300 cursor-pointer"
            >
              <Smile className="w-4 h-4" />
            </button>
            <input
              id="listen-chat-input"
              type="text"
              placeholder="Share your thoughts..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none font-medium"
            />
            <button
              id="listen-send-btn"
              onClick={sendMessage}
              className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:from-purple-400 hover:to-pink-400 hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick emoji picker */}
          {showEmojis && (
            <div className="mt-2 flex items-center gap-1 flex-wrap px-1 room-emojis-appear">
              {["🔥", "💜", "🎧", "✨", "🎵", "💫", "🫠", "🥹", "💀", "🙌"].map(
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
      </div>
    </div>
  );
}

/* ── Helper ── */
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
