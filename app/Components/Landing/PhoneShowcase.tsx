"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const videoFeatures = [
  { title: "Perfect Sync", desc: "Zero lag video playback across all connected users", icon: "⚡" },
  { title: "4K Streaming", desc: "Crystal clear quality on any screen", icon: "📺" },
  { title: "Smart Buffering", desc: "Adapts to network conditions automatically", icon: "🛡️" },
  { title: "Live Reactions", desc: "React together in real-time as you watch", icon: "💬" },
];

const audioFeatures = [
  { title: "Audio Sync", desc: "Same beat, same moment, every time", icon: "🎵" },
  { title: "Shared Controls", desc: "Play, pause, skip — all synced across listeners", icon: "🎧" },
  { title: "Group Queue", desc: "Build playlists collaboratively together", icon: "📋" },
  { title: "Live Reactions", desc: "Feel the drops and vibes together instantly", icon: "🔥" },
];

export default function PhoneShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);
  const content2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const phone = phoneRef.current;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    const c1 = content1Ref.current;
    const c2 = content2Ref.current;
    if (!section || !phone || !v1 || !v2 || !c1 || !c2) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(phone, { rotation: -90, x: "18vw" });
      gsap.set(c2, { opacity: 0, x: 80 });
      gsap.set(v2, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=350%",
          scrub: 1.2,
          pin: true,
        },
      });

      // 0–1: Hold Section 1 (video sharing visible)

      // 1–1.5: Fade out content 1
      tl.to(c1, { opacity: 0, x: -80, duration: 0.5, ease: "power2.in" }, 1);

      // 1–2: Rotate phone landscape→portrait, move right→left
      tl.to(phone, { rotation: 0, x: "-18vw", duration: 1, ease: "power3.inOut" }, 1);

      // 1.2–1.8: Crossfade videos
      tl.to(v1, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 1.2);
      tl.to(v2, { opacity: 1, duration: 0.6, ease: "power1.inOut" }, 1.4);

      // 1.5–2: Fade in content 2
      tl.to(c2, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 1.5);

      // 2–3: Hold Section 2 (audio listening visible)
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* ── Content 1: Video Sharing (left side) ── */}
      <div
        ref={content1Ref}
        className="absolute left-[8%] top-1/2 -translate-y-1/2 w-[32%] z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-[2px]"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-soft))" }}
          />
          <span className="text-sm font-medium tracking-widest uppercase text-white/50">
            Watch Together
          </span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Watch Together,
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Stay Connected
          </span>
        </h2>

        <p className="text-white/50 text-base mb-8 leading-relaxed">
          Share your screen, sync your stream. Watch movies, series, and videos
          with friends — no matter where they are.
        </p>

        <div className="space-y-4">
          {videoFeatures.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{
                  background: "rgba(136,41,224,0.15)",
                  border: "1px solid rgba(136,41,224,0.25)",
                }}
              >
                {f.icon}
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{f.title}</h4>
                <p className="text-white/40 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Phone Container ── */}
      <div
        ref={phoneRef}
        className="absolute top-1/2 left-1/2 rounded-2xl "
        style={{
          width: 400,
          height: 610,
          marginLeft: -150,
          marginTop: -305,
          willChange: "transform",
          filter: "drop-shadow(0 0 40px rgba(var(--glow), 0.2))",
        }}
      >
        {/* Screen area — inset values measured from phone.com.png pixel data */}
        <div
          className="absolute overflow-hidden  mx-8"
          style={{
            top: '5.7%',
            left: '7.1%',
            right: '7.1%',
            bottom: '4.3%',
            borderRadius: '22px',
          }}
        >
          {/* Video 1: landscape video, counter-rotated +90° to appear correct when phone is at -90° */}
          <video
            ref={video1Ref}
            src="/videos/spidervid.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: 'rotate(90deg) scale(2)',
            }}
          />

          {/* Video 2: portrait video, normal orientation */}
          <video
            ref={video2Ref}
            src="/Videos/Listening.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Phone frame overlay — sits on top of everything */}
        <Image
          src="/phone.com.png"
          alt="Phone"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          width={3936}
          height={6000}
          draggable={false}
        />
      </div>

      {/* ── Content 2: Audio Listening (right side) ── */}
      <div
        ref={content2Ref}
        className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[32%] z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-[2px]"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-soft))" }}
          />
          <span className="text-sm font-medium tracking-widest uppercase text-white/50">
            Listen Together
          </span>
        </div>

        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Listen Together,
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Feel the Beat
          </span>
        </h2>

        <p className="text-white/50 text-base mb-8 leading-relaxed">
          Sync your music sessions with anyone. Drop the same beat at the same
          moment — together, anywhere in the world.
        </p>

        <div className="space-y-4">
          {audioFeatures.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{
                  background: "rgba(136,41,224,0.15)",
                  border: "1px solid rgba(136,41,224,0.25)",
                }}
              >
                {f.icon}
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{f.title}</h4>
                <p className="text-white/40 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(var(--glow),0.06) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}
