"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowRight, RefreshCw, Loader2, Link2, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { createRoom } from "./actions";

function generateAccessHash() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const seg1 = "SNB";
  const seg2 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * 10)]).join("");
  const seg3 = chars[Math.floor(Math.random() * 26)];
  return `${seg1}-${seg2}-${seg3}`;
}

function NewRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "watch";
  const [roomName, setRoomName] = useState("");
  const [roomNameError, setRoomNameError] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoUrlError, setVideoUrlError] = useState(false);
  const [accessHash, setAccessHash] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [participants, setParticipants] = useState(12);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    setAccessHash(generateAccessHash());
  }, []);

  const{ data: session} = useSession()
  const handleDeploy = async () => {
    if (!roomName.trim()) {
      setRoomNameError(true);
      return;
    }
    if (!videoUrl.trim()) {
      setVideoUrlError(true);
      return;
    }
    setRoomNameError(false);
    setVideoUrlError(false);
    await createRoom({
      destName: roomName,
      accessHash: accessHash,
      visibility: visibility,
      participantLimit: participants,
      creatorId: session?.user?.id || "anonymous",
      videoUrl: videoUrl.trim(),
    });

    // alert("Room creation data saved successfully")

    setIsDeploying(true);
    // Simulate room deployment, then navigate to the correct room type
    setTimeout(() => {
      const roomId = accessHash.replace(/-/g, "").toLowerCase();
      if (mode === "listen") {
        router.push(`/room/listen/${roomId}`);
      } else {
        router.push(`/room/${roomId}`);
      }
    }, 1500);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-12 sm:pt-6 sm:pb-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 items-start">

          {/* ═══ LEFT COLUMN ═══ */}
          <div className="flex flex-col gap-4">
            {/* Character card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0c] overflow-hidden ">
              <div className="relative aspect-square max-h-[240px] sm:max-h-[300px] lg:max-h-[360px] overflow-hidden ">
                <Image
                  src="/wolf_avatar.png"
                  alt="Room Host Character"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
              </div>

              <div className="px-6 pb-6 -mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse mt-6" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-6">
                    Status: Initializing
                  </span>
                </div>
                <p className="text-xs text-slate-500 italic font-light leading-relaxed">
                  &quot;The stage is being set. Just a few final coordinates.&quot;
                </p>
              </div>
            </div>

            {/* NEW SCENE heading */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-none tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">New</span>
                <br />
                <span className="text-white">Scene</span>
              </h1>
              <p className="text-sm text-slate-500 font-light mt-3 leading-relaxed max-w-xs">
                Define the parameters of your digital sanctuary. Private or open to the void.
              </p>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN — Form ═══ */}
          <div className="flex flex-col gap-5 pt-2">

            {/* 01. Destination Name */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0c] p-6">
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                <span className="text-purple-400">01.</span> Destination Name
              </label>
              <input
                id="room-name-input"
                type="text"
                placeholder="ENTER REALM IDENTITY..."
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  if (e.target.value.trim()) setRoomNameError(false);
                }}
                className={`w-full bg-transparent border rounded-xl py-3.5 px-4 text-white placeholder-slate-600 text-sm font-medium uppercase tracking-wider focus:outline-none transition-all duration-300 ${
                  roomNameError
                    ? "border-red-500/60 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/20"
                    : "border-white/[0.08] focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20"
                }`}
              />
              {roomNameError && (
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-red-400/80">
                  ⚠ Realm identity is required to deploy
                </p>
              )}
            </div>

            {/* Row: Access Hash + Visibility */}
            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-5">
              {/* 02. Access Hash */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0c] p-6">
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                  <span className="text-purple-400">02.</span> Access Hash
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wider select-text ">
                    {accessHash}
                  </span>
                  <button
                    id="refresh-hash-btn"
                    onClick={() => setAccessHash(generateAccessHash())}
                    value={accessHash}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 hover:text-purple-400 hover:bg-purple-500/[0.06] hover:border-purple-500/20 transition-all duration-300 cursor-pointer"
                  >
                    {/* <RefreshCw className="w-3.5 h-3.5" /> */}
                    <Copy onClick={(e) => handleCopy(accessHash)} className="p-1 "/>
                  </button>
                </div>
              </div>

              {/* 03. Visibility Protocol */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0c] p-6">
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                  <span className="text-purple-400">03.</span> Visibility Protocol
                </label>
                <div className="flex gap-2 mt-1">
                  <button
                    id="visibility-public"
                    onClick={() => setVisibility("public")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer ${visibility === "public"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20"
                        : "bg-white/[0.03] text-slate-500 border border-white/[0.08] hover:bg-white/[0.06]"
                      }`}
                  >
                    Public
                  </button>
                  <button
                    id="visibility-private"
                    onClick={() => setVisibility("private")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 cursor-pointer ${visibility === "private"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20"
                        : "bg-white/[0.03] text-slate-500 border border-white/[0.08] hover:bg-white/[0.06]"
                      }`}
                  >
                    Private
                  </button>
                </div>
              </div>
            </div>

            {/* 04. Participant Limit */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0c] p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  <span className="text-purple-400">04.</span> Participant Limit
                </label>
                <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {participants}
                </span>
              </div>

              <div className="relative mt-1">
                <input
                  id="participant-slider"
                  type="range"
                  min={2}
                  max={30}
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none rounded-full bg-white/[0.06] cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-gradient-to-r
                    [&::-webkit-slider-thumb]:from-purple-500
                    [&::-webkit-slider-thumb]:to-pink-500
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-purple-500/40
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:hover:scale-125
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:duration-200
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-gradient-to-r
                    [&::-moz-range-thumb]:from-purple-500
                    [&::-moz-range-thumb]:to-pink-500
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600 mt-2">
                  <span>Min: 2 Seats</span>
                  <span>Constraints ← Adjusted</span>
                </div>
              </div>
            </div>

            {/* 05. Video URL */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0c] p-6">
              <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                <span className="text-purple-400">05.</span> Video / Stream URL
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Link2 className="w-4 h-4" />
                </div>
                <input
                  id="video-url-input"
                  type="url"
                  placeholder="PASTE VIDEO LINK HERE..."
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    if (e.target.value.trim()) setVideoUrlError(false);
                  }}
                  className={`w-full bg-transparent border rounded-xl py-3.5 px-4 text-white placeholder-slate-600 text-sm font-medium tracking-wider focus:outline-none transition-all duration-300 ${
                    videoUrlError
                      ? "border-red-500/60 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/20"
                      : "border-white/[0.08] focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20"
                  }`}
                />
              </div>
              {videoUrlError && (
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-red-400/80">
                  ⚠ A video link is required to deploy
                </p>
              )}
              <p className="mt-2 text-[10px] text-slate-600 font-medium tracking-wide">
                Supports Youtube Video URLs only...
              </p>
            </div>

            {/* Deploy Room button */}
            <button
              id="deploy-room-btn"
              onClick={handleDeploy}
              disabled={isDeploying}
              className={`w-full py-5 rounded-2xl text-white text-sm font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-xl transition-all duration-500 cursor-pointer ${isDeploying
                  ? "bg-gradient-to-r from-purple-800 via-pink-800 to-purple-800 shadow-purple-800/15"
                  : "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 shadow-purple-600/15 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 hover:shadow-purple-500/25 hover:scale-[1.02]"
                }`}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deploying Room...
                </>
              ) : (
                <>
                  Deploy Room
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-black flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      }
    >
      <NewRoomContent />
    </Suspense>
  );
}
