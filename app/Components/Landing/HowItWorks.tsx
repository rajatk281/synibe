"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Create a Room",
    description:
      "Start a new watch room in one click and get a shareable invite link instantly.",
    video: "https://res.cloudinary.com/dwect2foi/video/upload/Steps/synibeStep-1_qcsjjq.mp4",
  },
  {
    number: "02",
    title: "Invite Your Friends",
    description:
      "Share the link — anyone with it can join your room instantly. No sign-up required.",
    video: "https://res.cloudinary.com/dwect2foi/video/upload/Steps/synibeStep-2_mwou1c.mp4",
  },
  {
    number: "03",
    title: "Pick Something to Watch",
    description:
      "Paste a video URL or choose from the library. Everyone sees the same thing.",
      video: "https://res.cloudinary.com/dwect2foi/video/upload/Steps/synibeStep-3_jus1dm.mp4",
    },
    {
      number: "04",
      title: "Vibe Together",
      description:
      "Play, pause, react — everything is synced in real-time. Just enjoy the moment.",
      video: "https://res.cloudinary.com/dwect2foi/video/upload/Steps/synibeStep-4_xmib8b.mp4",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Preload all videos
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.load();
      }
    });
  }, []);

  // Handle video switching
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeStep) {
        video.style.opacity = "1";
        video.play().catch(() => {});
      } else {
        video.style.opacity = "0";
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeStep]);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Steps entrance
      gsap.fromTo(
        stepItemsRef.current.filter(Boolean),
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: "top 80%",
          },
        }
      );

      // Video container entrance (desktop)
      if (videoContainerRef.current) {
        gsap.fromTo(
          videoContainerRef.current,
          { x: 60, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: "top 80%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleStepHover = useCallback((index: number) => {
    setActiveStep(index);
    setHasInteracted(true);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black select-none"
      style={{ minHeight: "100vh" }}
    >
      {/* ── Background ambient glows ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 800,
          height: 800,
          top: "10%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(var(--glow), 0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          bottom: "5%",
          right: "-5%",
          background:
            "radial-gradient(circle, rgba(250, 33, 189, 0.03) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="mb-16 sm:mb-20 lg:mb-24">
          {/* Label */}
          <div className="flex items-center gap-3 mb-6" style={{ opacity: 0 }}>
            <div
              className="w-8 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent))",
              }}
            />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
              How It Works
            </span>
            <div
              className="w-8 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />
          </div>

          {/* Title */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-4"
            style={{ opacity: 0 }}
          >
            Start vibing together
            <br />
            in just{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              few steps
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className="text-sm sm:text-base text-white/40 max-w-lg leading-relaxed"
            style={{ opacity: 0 }}
          >
            Hover over each step to see it in action. From creating a room to
            vibing together — it&apos;s that simple.
          </p>
        </div>

        {/* ── Main Content: Steps + Video ── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center">
          {/* LEFT: Steps List */}
          <div
            ref={stepsContainerRef}
            className="w-full lg:w-[45%] xl:w-[42%]"
          >
            <div className="space-y-2">
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <div
                    key={step.number}
                    ref={(el) => {
                      stepItemsRef.current[i] = el;
                    }}
                    className="group relative rounded-2xl cursor-pointer transition-all duration-500"
                    style={{
                      opacity: 0,
                      background: isActive
                        ? "rgba(255,255,255,0.05)"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={() => handleStepHover(i)}
                    onClick={() => handleStepHover(i)}
                  >
                    <div className="flex gap-4 sm:gap-5 items-start p-4 sm:p-5">
                      {/* Step number badge */}
                      <div
                        className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500"
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, var(--accent), var(--accent-soft))"
                            : "rgba(255,255,255,0.06)",
                          color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                          boxShadow: isActive
                            ? "0 0 30px rgba(var(--glow), 0.3)"
                            : "none",
                        }}
                      >
                        {step.number}
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-base sm:text-lg font-semibold mb-1 transition-colors duration-300"
                          style={{
                            color: isActive
                              ? "#fff"
                              : "rgba(255,255,255,0.55)",
                          }}
                        >
                          {step.title}
                        </h3>

                        {/* Description — expands on active */}
                        <div
                          className="overflow-hidden transition-all duration-500"
                          style={{
                            maxHeight: isActive ? 80 : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                        >
                          <p className="text-xs sm:text-sm text-white/40 leading-relaxed pt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Active indicator arrow */}
                      <div
                        className="hidden lg:flex shrink-0 items-center justify-center w-8 h-8 rounded-lg transition-all duration-300"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? "translateX(0)"
                            : "translateX(-8px)",
                          background: isActive
                            ? "rgba(var(--glow), 0.1)"
                            : "transparent",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M5 3L10 7L5 11"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Progress bar at bottom */}
                    <div
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-500"
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, var(--accent), var(--accent-soft))"
                          : "transparent",
                        opacity: isActive ? 0.6 : 0,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Video Preview Area */}
          <div
            ref={videoContainerRef}
            className="w-full lg:w-[55%] xl:w-[58%] relative"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "16/10",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/20 z-20" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-white/20 z-20" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-white/20 z-20" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/20 z-20" />

              {/* Video layers */}
              {steps.map((step, i) => (
                <video
                  key={step.number}
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  src={step.video}
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ))}

              {/* Placeholder state when no interaction yet */}
              {!hasInteracted && (
                <div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none lg:hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(var(--glow), 0.05), rgba(0,0,0,0.4))",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(var(--glow), 0.15)" }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M8 5.14v13.72a1 1 0 001.5.86l11.14-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z"
                        fill="rgba(255,255,255,0.6)"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-white/30 tracking-wide">
                    Tap a step to preview
                  </span>
                </div>
              )}

              {/* Step indicator overlay */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/70"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Step {steps[activeStep].number} —{" "}
                  {steps[activeStep].title}
                </div>
              </div>

              {/* Dot indicators */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-400"
                    style={{
                      width: activeStep === i ? 20 : 6,
                      height: 6,
                      background:
                        activeStep === i
                          ? "linear-gradient(90deg, var(--accent), var(--accent-soft))"
                          : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>

              {/* Subtle glow effect behind video */}
              <div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={{
                  boxShadow:
                    "inset 0 0 80px rgba(var(--glow), 0.05)",
                }}
              />
            </div>

            {/* Reflection / ambient glow below video */}
            <div
              className="absolute -bottom-8 left-[10%] right-[10%] h-16 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(var(--glow), 0.08) 0%, transparent 80%)",
                filter: "blur(20px)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;