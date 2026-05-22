"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, AudioLines, PlusCircle, LogIn, X } from "lucide-react";

export default function CreateRoomPage() {
  const watchCardRef = useRef<HTMLDivElement>(null);
  const listenCardRef = useRef<HTMLDivElement>(null);
  const [showStreamModal, setShowStreamModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (watchCardRef.current) observer.observe(watchCardRef.current);
    if (listenCardRef.current) observer.observe(listenCardRef.current);

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showStreamModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showStreamModal]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-20">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-orange-500 to-transparent" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] ">
            Act II: Connection
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-16 max-w-2xl">
          What do you want to{" "}
          <br />
          <em className="not-italic bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent italic">
            do
          </em>{" "}
          together?
        </h1>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Watch Together Card ── */}
          <div
            ref={watchCardRef}
            className="group card-reveal relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a] hover:border-orange-500/20 transition-all duration-700"
          >
            {/* Video thumbnail background */}
            <div className="relative h-48 overflow-hidden">
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105 transition-transform"
                src="/Videos/Stranger_Things.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              {/* Top light flare effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-radial from-amber-400/15 to-transparent rounded-full blur-2xl" />
            </div>

            {/* Card content */}
            <div className="relative p-6 pt-2 -mt-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
                World 01
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                Watch Together
              </h2>
              <p className="text-sm text-slate-400 font-light leading-relaxed mb-6 max-w-sm">
                Synchronized frames, shared gasps, and the hushed silence of a
                collective premiere. Enter the cinematic void.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowStreamModal(true)}
                  id="initiate-stream-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg text-xs font-bold uppercase tracking-[0.1em] text-white hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Initiate Stream
                </button>
                <button
                  id="watch-play-btn"
                  className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white/60 hover:bg-white/[0.12] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Listen Together Card ── */}
          <div
            ref={listenCardRef}
            className="group card-reveal card-reveal-delayed relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a] hover:border-orange-500/20 transition-all duration-700 lg:mt-24"
          >
            {/* Waveform visual area */}
            <div className="relative h-48 overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
              {/* Animated audio icon */}
              <div className="relative">
                <AudioLines className="w-16 h-16 text-pink-500 group-hover:text-pink-500 transition-all duration-700" />
                {/* Pulse rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-pink-400/50 group-hover:border-pink-400/20 group-hover:scale-150 transition-all duration-1000" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-orange-400/5 group-hover:border-orange-400/10 group-hover:scale-125 transition-all duration-1000 delay-100" />
                </div>
              </div>

              {/* Waveform bars */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-center gap-[3px] h-12">
                {Array.from({ length: 40 }).map((_, i) => {
                  const height = Math.sin((i / 40) * Math.PI) * 100;
                  return (
                    <div
                      key={i}
                      className="w-[2px] rounded-full bg-gradient-to-r from-purple-400 to-pink-500 group-hover:from-purple-400 group-hover:to-pink-500 transition-all duration-500"
                      style={{
                        height: `${Math.max(8, height * 0.8)}%`,
                        animationDelay: `${i * 30}ms`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Card content */}
            <div className="relative p-6 pt-2 -mt-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
                World 02
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                Listen Together
              </h2>
              <p className="text-sm text-slate-400 font-light leading-relaxed mb-6 max-w-sm">
                Sonic landscapes mapped in real-time. Feel the pulse of the same
                rhythm, miles apart but in the same frequency.
              </p>

              <Link
                href="#"
                id="open-sonic-portal-btn"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] hover:text-orange-300 transition-colors duration-300 group/link"
              >
                Open Sonic Portal
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  STREAM MODAL — Create / Join a Room overlay   */}
      {/* ═══════════════════════════════════════════════ */}
      {showStreamModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center stream-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowStreamModal(false);
          }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#060608]/95 backdrop-blur-xl" />

          {/* Large faded background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <div className="text-[12vw] md:text-[10vw] font-black uppercase leading-none tracking-tighter text-white/[0.03] text-center whitespace-nowrap">
              WATCH
              <br />
              TOGETHER.
            </div>
          </div>

          {/* Close button */}
          <button
            id="close-stream-modal"
            onClick={() => setShowStreamModal(false)}
            className="absolute top-8 right-8 z-50 w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all duration-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 stream-modal-content">
            {/* Two options side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
              {/* ── Create a Room ── */}
              <Link
                href="/create-room/new"
                id="create-room-option"
                className="group flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center group-hover:border-purple-500/30 group-hover:bg-purple-500/[0.06] transition-all duration-500 group-hover:scale-110">
                    <PlusCircle className="w-8 h-8 text-purple-400/60 group-hover:text-purple-400 transition-all duration-500" />
                  </div>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-purple-500/0 group-hover:bg-purple-500/10 blur-xl transition-all duration-500" />
                </div>

                {/* Label */}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3 group-hover:text-purple-400/80 transition-colors duration-300">
                  Initiate Experience
                </span>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight group-hover:text-purple-100 transition-colors duration-300">
                  Create a Room
                </h2>
              </Link>

              {/* ── Join a Room ── */}
              <Link
                href="/create-room/join"
                id="join-room-option"
                className="group flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center group-hover:border-pink-500/30 group-hover:bg-pink-500/[0.06] transition-all duration-500 group-hover:scale-110">
                    <LogIn className="w-8 h-8 text-pink-400/60 group-hover:text-pink-400 transition-all duration-500" />
                  </div>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-pink-500/0 group-hover:bg-pink-500/10 blur-xl transition-all duration-500" />
                </div>

                {/* Label */}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3 group-hover:text-pink-400/80 transition-colors duration-300">
                  Enter Frequency
                </span>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight group-hover:text-pink-100 transition-colors duration-300">
                  Join a Room
                </h2>
              </Link>
            </div>

            {/* Bottom mascots */}
            <div className="absolute -bottom-32 left-0 right-0 flex justify-between px-4 pointer-events-none">
              {/* Host mascot — left */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/[0.06] flex items-center justify-center text-3xl">
                  🐼
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Host
                </span>
              </div>

              {/* Guest mascot — right */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/[0.06] flex items-center justify-center text-3xl">
                  🐯
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                  Guest
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
