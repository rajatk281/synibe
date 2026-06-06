"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Create a Room",
    description: "Start a new watch room in one click and get a shareable invite link.",
  },
  {
    number: "02",
    title: "Invite Your Friends",
    description: "Share the link — anyone with it can join your room instantly.",
  },
  {
    number: "03",
    title: "Pick Something to Watch",
    description: "Paste a video URL or choose from the library. Everyone sees the same thing.",
  },
  {
    number: "04",
    title: "Vibe Together",
    description: "Play, pause, react — everything is synced in real-time. Just enjoy.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const stepsBoxRef = useRef<HTMLDivElement>(null);
  const stepItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Skip GSAP pinning on mobile

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1.2,
          pin: true,
        },
      });

      // STEP 1: Slide text box from center to left
      tl.to(
        textBoxRef.current,
        {
          x: 0,
          duration: 1,
          ease: "power3.inOut",
        },
        0
      );

      // Shrink the decorative line
      tl.to(
        lineRef.current,
        {
          width: 0,
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        0
      );

      // STEP 2: Reveal the steps box
      tl.fromTo(
        stepsBoxRef.current,
        {
          x: 80,
          opacity: 0,
          scale: 0.95,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
        0.3
      );

      // STEP 3: Stagger each step item in
      tl.fromTo(
        stepItemsRef.current.filter(Boolean),
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        },
        0.5
      );
    });

    return () => ctx.revert();
  }, [isMobile]);

  /* ── Mobile Layout ── */
  if (isMobile) {
    return (
      <section
        id="how-it-works"
        className="relative w-full overflow-hidden bg-black py-16 sm:py-24"
      >
        <div className="max-w-lg mx-auto px-5 sm:px-6">
          {/* Heading */}
          <div className="mb-10 sm:mb-14">
            <div
              className="relative border border-white/10 p-6 sm:p-8"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30" />

              <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-tight text-center">
                Start vibing together
                <br />
                in just few steps.
              </h2>
            </div>
          </div>

          {/* Steps */}
          <div className="w-full max-w-md mx-auto space-y-4 sm:space-y-5">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div
                className="w-8 h-[2px]"
                style={{
                  background: "linear-gradient(90deg, var(--accent), var(--accent-soft))",
                }}
              />
              <span className="text-sm font-medium tracking-widest uppercase text-white/50">
                Getting Started
              </span>
            </div>

            {/* Step cards */}
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="group relative flex gap-4 sm:gap-5 items-start p-3 sm:p-4 rounded-xl transition-colors duration-300 hover:bg-white/[0.04]"
              >
                {/* Step number */}
                <div
                  className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, var(--accent), var(--accent-soft))`,
                    color: "#fff",
                    boxShadow: "0 0 20px rgba(var(--glow), 0.25)",
                  }}
                >
                  {step.number}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/45 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting line to next step */}
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-[1.6rem] sm:left-[2.05rem] top-12 sm:top-14 w-[2px] h-4 sm:h-5"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(var(--glow), 0.3), transparent)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Subtle ambient glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "300px",
            height: "300px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(var(--glow), 0.06) 0%, transparent 70%)",
          }}
        />
      </section>
    );
  }

  /* ── Desktop Layout (GSAP pinned) ── */
  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Main flex container */}
      <div className="flex h-full w-full items-center justify-center">
        {/* LEFT: Heading text box — starts centered, slides to left half */}
        <div
          ref={textBoxRef}
          className="w-1/2 flex flex-col items-center justify-center px-8"
          style={{
            transform: "translateX(50%)", // starts centered
            willChange: "transform",
          }}
        >
          {/* Decorative horizontal line */}
          <div
            ref={lineRef}
            className="w-full h-[1px] mb-8"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
          />

          {/* Text card */}
          <div
            className="relative border border-white/10 p-8 px-10"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30" />

            <h2 className="text-5xl lg:text-6xl font-semibold text-white leading-tight text-center">
              Start vibing together
              <br />
              in just few steps.
            </h2>
          </div>
        </div>

        {/* RIGHT: Steps box — initially hidden, slides in from right */}
        <div
          ref={stepsBoxRef}
          className="w-1/2 flex items-center justify-center px-8"
          style={{
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          <div className="w-full max-w-md space-y-5">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-[2px]"
                style={{
                  background: "linear-gradient(90deg, var(--accent), var(--accent-soft))",
                }}
              />
              <span className="text-sm font-medium tracking-widest uppercase text-white/50">
                Getting Started
              </span>
            </div>

            {/* Step cards */}
            {steps.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { stepItemsRef.current[i] = el; }}
                className="group relative flex gap-5 items-start p-4 rounded-xl transition-colors duration-300 hover:bg-white/[0.04]"
                style={{ opacity: 0 }}
              >
                {/* Step number */}
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, var(--accent), var(--accent-soft))`,
                    color: "#fff",
                    boxShadow: "0 0 20px rgba(var(--glow), 0.25)",
                  }}
                >
                  {step.number}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting line to next step */}
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-[2.05rem] top-14 w-[2px] h-5"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(var(--glow), 0.3), transparent)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(var(--glow), 0.06) 0%, transparent 70%)",
        }}
      />
    </section>
  );
};

export default HowItWorks;