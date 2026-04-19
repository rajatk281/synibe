"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function StoryTelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-driven timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",       // Start when section top reaches viewport top
          end: "+=300%",          // 3x viewport height of scroll distance
          scrub: 1.5,             // Smooth 1.5s delay scrubbing
          pin: true,              // Pin section during animation
        },
      });

      // STEP 1: Scale text from 1 → 50 (text grows, video fills screen)
      tl.to(textRef.current, {
        scale: 50,
        duration: 1,
        ease: "power2.inOut",
      }, 0);

      // STEP 2: Fade out the overlay after text is large enough
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.in",
      },0.3);
    });

    return () => ctx.revert();
  }, []);

  return (
    // CONTAINER — full viewport, black background, hide overflow
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* LAYER 1: Background video */}
      <video
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src="/videos/spidervid.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute bottom-10 right-10 max-w-sm backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 text-white shadow-xl">

        <h2 className="text-xl font-semibold mb-4 tracking-wide">
          Why Synibe?
        </h2>

        <ul className="space-y-3 text-sm text-white/80">

          <li className="flex items-start gap-3">
            <span className="">●</span>
            <p><span className="font-medium text-white">Perfect Sync</span> — Zero lag playback across all users</p>
          </li>

          <li className="flex items-start gap-3">
            <span className="">●</span>
            <p><span className="font-medium text-white">Auto Adjust Volume</span> — Auto adjust volume during watching</p>
          </li>

          <li className="flex items-start gap-3">
            <span className="">●</span>
            <p><span className="font-medium text-white">Smart Buffering</span> — Adjusts automatically for slow networks</p>
          </li>

          <li className="flex items-start gap-3">
            <span className="">●</span>
            <p><span className="font-medium text-white">Real-time Reactions</span> — Feel the moment together instantly</p>
          </li>

          <li className="flex items-start gap-3">
            <span className="">●</span>
            <p><span className="font-medium text-white">No Setup Hassle</span> — Join rooms in seconds</p>
          </li>

          <li className="flex items-start gap-3">
            <span className="">●</span>
            <p><span className="font-medium text-white">Ultra Low Latency</span> — Built for seamless group watching</p>
          </li>

        </ul>
      </div>

      {/* LAYER 2: Black overlay with white text */}
      {/* mix-blend-mode: multiply makes:       */}
      {/*   black areas → stay black (hide video) */}
      {/*   white areas → show video through     */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mixBlendMode: "multiply",
        }}
      >
        {/* White text — becomes a "window" into the video */}
        <div className="text-center"
          ref={textRef}
          style={{
            fontSize: "clamp(4rem, 12vw, 10rem)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            willChange: "transform",
            lineHeight: 1,
          }}
        >
          WATCH <br /> TOGETHER
        </div>
      </div>
    </section>
  );
}