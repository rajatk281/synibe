"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Play, ArrowRight, AudioLines } from "lucide-react";

export default function CreateRoomPage() {
  const watchCardRef = useRef<HTMLDivElement>(null);
  const listenCardRef = useRef<HTMLDivElement>(null);

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
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Act II: Connection
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-16 max-w-2xl">
          What do you want to{" "}
          <br />
          <em className="not-italic bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent italic">
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
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400/60 mb-2 block">
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
                <Link
                  href="#"
                  id="initiate-stream-btn"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg text-xs font-bold uppercase tracking-[0.1em] text-white hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300"
                >
                  Initiate Stream
                </Link>
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
                <AudioLines className="w-16 h-16 text-orange-400/40 group-hover:text-orange-400/70 transition-all duration-700" />
                {/* Pulse rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-orange-400/10 group-hover:border-orange-400/20 group-hover:scale-150 transition-all duration-1000" />
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
                      className="w-[2px] rounded-full bg-gradient-to-t from-orange-500/30 to-orange-400/60 group-hover:from-orange-500/50 group-hover:to-orange-400/80 transition-all duration-500"
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
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400/60 mb-2 block">
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
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-orange-400 hover:text-orange-300 transition-colors duration-300 group/link"
              >
                Open Sonic Portal
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
