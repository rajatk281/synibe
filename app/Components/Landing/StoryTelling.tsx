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
        duration: 1.5,
        ease: "power2.inOut",
      }, 0);

      // STEP 2: Fade out the overlay after text is large enough
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.in",
      }, 1.0);
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