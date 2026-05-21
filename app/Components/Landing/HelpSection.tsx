"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MonitorPlay,
  Users,
  Settings,
  Headphones,
  Wifi,
  MessageSquare,
  Shield,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Help Topics Data ─── */
const helpTopics = [
  {
    number: "01",
    title: "How do I create or join a watch room?",
    content:
      'To create a room, click the "Start Watching" button on the homepage. You\'ll get a unique room link you can share with friends. To join a room, simply click any invite link shared with you — no account required. You can also enter a room code manually from the Join Room page.',
    highlights: [
      { text: "Start Watching", desc: "Creates a new private room" },
      { text: "Room Code", desc: "6-digit code for quick joins" },
    ],
  },
  {
    number: "02",
    title: "What are the system requirements?",
    content:
      "Synibe runs entirely in your browser — no downloads needed. We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend a stable internet connection of at least 5 Mbps and an updated browser version.",
    highlights: [
      { text: "Chrome 90+", desc: "Recommended browser" },
      { text: "5 Mbps", desc: "Minimum connection speed" },
    ],
  },
  {
    number: "03",
    title: "How does real-time sync work?",
    content:
      "Synibe uses WebSocket-based synchronization to keep all participants perfectly in sync. When anyone plays, pauses, or seeks through the video, the action is broadcast to everyone in the room with sub-100ms latency. Our adaptive sync engine automatically adjusts for network differences.",
    highlights: [
      { text: "Sub-100ms", desc: "Ultra-low latency sync" },
      { text: "Adaptive Engine", desc: "Auto-adjusts for network" },
    ],
  },
  {
    number: "04",
    title: "Is my data private and secure?",
    content:
      "Absolutely. Room sessions are end-to-end encrypted and no video data passes through our servers — it's all peer-to-peer. Guest sessions leave zero trace, and registered accounts can enable 2FA for added security. We never store or share your viewing history.",
    highlights: [
      { text: "E2E Encrypted", desc: "All room communications" },
      { text: "Zero Trace", desc: "Guest sessions leave no data" },
    ],
  },
];

/* ─── Quick Links Data ─── */
const quickLinks = [
  {
    icon: MonitorPlay,
    title: "Getting Started",
    desc: "Create your first room and invite friends in under 60 seconds.",
  },
  {
    icon: Users,
    title: "Room Management",
    desc: "Control permissions, manage participants, and customize your room.",
  },
  {
    icon: Settings,
    title: "Account Settings",
    desc: "Manage profile, notifications, privacy preferences and more.",
  },
  {
    icon: Headphones,
    title: "Audio & Video",
    desc: "Troubleshoot playback, adjust quality, and configure codecs.",
  },
  {
    icon: Wifi,
    title: "Connectivity",
    desc: "Network requirements, firewall settings, and buffering fixes.",
  },
  {
    icon: MessageSquare,
    title: "Chat & Reactions",
    desc: "Use live chat, emojis, reactions, and voice during sessions.",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    desc: "Encryption, data policies, guest sessions, and 2FA setup.",
  },
  {
    icon: Zap,
    title: "Performance Tips",
    desc: "Optimize your experience for smooth, lag-free watch parties.",
  },
];

/* ─── Help Topic Card ─── */
function HelpTopicCard({
  topic,
  index,
  isReversed,
}: {
  topic: (typeof helpTopics)[0];
  index: number;
  isReversed: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-14 items-start`}
    >
      {/* Number + Content */}
      <div className="flex-1 min-w-0">
        {/* Number badge */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
              boxShadow: "0 0 30px rgba(var(--glow), 0.3)",
            }}
          >
            {topic.number}
          </div>
          <div
            className="flex-1 h-[1px]"
            style={{
              background: `linear-gradient(90deg, rgba(var(--glow), 0.3), transparent)`,
            }}
          />
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4 leading-snug">
          {topic.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-white/50 leading-relaxed mb-6">
          {topic.content}
        </p>

        {/* Highlight chips */}
        <div className="flex flex-wrap gap-3">
          {topic.highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                className="text-xs font-semibold"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {h.text}
              </span>
              <span className="text-xs text-white/35">— {h.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual card on the side */}
      <div
        className="w-full lg:w-[280px] shrink-0 rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/20" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-white/20" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-white/20" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/20" />

        {/* Decorative content */}
        <div className="space-y-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
            style={{
              background: "rgba(var(--glow), 0.1)",
            }}
          >
            <span className="text-lg">
              {index === 0 && "🎬"}
              {index === 1 && "⚙️"}
              {index === 2 && "🔄"}
              {index === 3 && "🔒"}
            </span>
          </div>

          {/* Mini visual bars */}
          {[75, 60, 90, 45].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${w}%`,
                  background:
                    i === 0
                      ? "linear-gradient(90deg, var(--accent), var(--accent-soft))"
                      : "rgba(255,255,255,0.08)",
                }}
              />
            </div>
          ))}

          <p className="text-xs text-white/30 mt-4 leading-relaxed">
            {index === 0 && "Quick room setup takes under 10 seconds."}
            {index === 1 && "Works on any modern browser — zero installs."}
            {index === 2 && "Enterprise-grade sync for seamless playback."}
            {index === 3 && "Your privacy is our top priority. Always."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Help Section ─── */
export default function HelpSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<(HTMLDivElement | null)[]>([]);
  const quickLinksRef = useRef<HTMLDivElement>(null);
  const quickLinkItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Stagger topic cards
      gsap.fromTo(
        topicsRef.current.filter(Boolean),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: topicsRef.current[0],
            start: "top 85%",
          },
        }
      );

      // Quick links section
      if (quickLinksRef.current) {
        gsap.fromTo(
          quickLinksRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: quickLinksRef.current,
              start: "top 85%",
            },
          }
        );
      }

      // Quick link items stagger
      gsap.fromTo(
        quickLinkItemsRef.current.filter(Boolean),
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quickLinksRef.current,
            start: "top 75%",
          },
        }
      );

      // CTA entrance
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="help"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 overflow-hidden bg-black"
    >
      {/* Ambient glow top */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "800px",
          height: "800px",
          top: "0",
          left: "50%",
          transform: "translate(-50%, -30%)",
          background:
            "radial-gradient(circle, rgba(var(--glow), 0.04) 0%, transparent 70%)",
        }}
      />

      {/* Ambient glow bottom */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          bottom: "0",
          right: "10%",
          background:
            "radial-gradient(circle, rgba(var(--glow), 0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* ─── Section Header ─── */}
        <div ref={headerRef} className="mb-20" style={{ opacity: 0 }}>
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-[2px]"
              style={{
                background: "linear-gradient(90deg, transparent, var(--accent))",
              }}
            />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
              Signal Decoded
            </span>
            <div
              className="w-8 h-[2px]"
              style={{
                background: "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />
          </div>

          {/* Title */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
            Help{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Center
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/40 max-w-xl leading-relaxed">
            Find answers, explore features, and learn how to get the most out of Synibe .
          </p>

          {/* Decorative line */}
          <div
            className="w-full h-[1px] mt-10"
            style={{
              background:
                "linear-gradient(90deg, rgba(var(--glow), 0.3), transparent 60%)",
            }}
          />
        </div>

        {/* ─── Help Topics ─── */}
        <div className="space-y-20">
          {helpTopics.map((topic, i) => (
            <div
              key={topic.number}
              ref={(el) => {
                topicsRef.current[i] = el;
              }}
              style={{ opacity: 0 }}
            >
              <HelpTopicCard topic={topic} index={i} isReversed={i % 2 !== 0} />
            </div>
          ))}
        </div>

        {/* ─── Quick Links Grid ─── */}
        <div ref={quickLinksRef} className="mt-28" style={{ opacity: 0 }}>
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-8 h-[2px]"
              style={{
                background: "linear-gradient(90deg, transparent, var(--accent))",
              }}
            />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
              Quick Access
            </span>
            <div
              className="w-8 h-[2px]"
              style={{
                background: "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />
          </div>

          <h3 className="text-3xl sm:text-4xl font-semibold text-white mb-10">
            Browse by{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Topic
            </span>
          </h3>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <div
                  key={i}
                  ref={(el) => {
                    quickLinkItemsRef.current[i] = el;
                  }}
                  className="group relative p-5 rounded-2xl cursor-pointer transition-all duration-500"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(255,255,255,0.05)";
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = "0 8px 40px rgba(var(--glow), 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(255,255,255,0.02)";
                    el.style.borderColor = "rgba(255,255,255,0.06)";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(var(--glow), 0.08)",
                    }}
                  >
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-1.5">
                    {link.title}
                  </h4>
                  <p className="text-xs text-white/35 leading-relaxed">
                    {link.desc}
                  </p>

                  {/* Arrow */}
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M4 10L10 4M10 4H5M10 4V9"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Contact Us CTA ─── */}
        <div ref={ctaRef} className="mt-28" style={{ opacity: 0 }}>
          <div
            className="relative rounded-3xl p-10 sm:p-14 overflow-hidden text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Glow background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(var(--glow), 0.06) 0%, transparent 70%)",
              }}
            />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/15" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/15" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/15" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/15" />

            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Need more{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  help?
                </span>
              </h3>

              <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto mb-8 leading-relaxed">
                Our team is ready to help you with anything you need.
                Reach out and we&apos;ll get back to you in no time.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105 inline-block"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    boxShadow: "0 0 30px rgba(var(--glow), 0.25)",
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacer text */}
        <p className="text-center text-xs text-white/20 mt-12 tracking-wide">
          Can&apos;t find what you need?{" "}
          <Link
            href="/contact"
            className="underline underline-offset-4 text-white/40 hover:text-white/70 transition-colors"
          >
            Contact support
          </Link>
        </p>
      </div>
    </section>
  );
}
