"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Tv,
  Users,
  Globe,
  Zap,
  Heart,
  Shield,
  Sparkles,
  Music,
} from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);



const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "<100ms", label: "Sync Latency" },
  { value: "4K", label: "Stream Quality" },
  { value: "99.9%", label: "Uptime" },
];

const values = [
  {
    icon: Heart,
    title: "Human Connection",
    desc: "We believe watching should be a shared experience. Synibe bridges the gap between screens and souls.",
  },
  {
    icon: Zap,
    title: "Zero Friction",
    desc: "No downloads, no sign-ups required. Just share a link and you're watching together in seconds.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "End-to-end encrypted rooms, zero-trace guest sessions, and no data harvesting. Ever.",
  },
  {
    icon: Globe,
    title: "Borderless",
    desc: "Watch with anyone, anywhere. Our adaptive sync engine handles any network condition seamlessly.",
  },
  {
    icon: Music,
    title: "Beyond Video",
    desc: "Movies, series, music, podcasts — if it plays, you can sync it. One platform, every format.",
  },
  {
    icon: Sparkles,
    title: "Crafted Experience",
    desc: "Every interaction is designed to feel cinematic. From room creation to live reactions, we sweat the details.",
  },
];

const timeline = [
  {
    year: "2024",
    title: "The Spark",
    desc: "Born from late-night watch parties ruined by out-of-sync streams. We knew there had to be a better way.",
  },
  {
    year: "2024",
    title: "First Prototype",
    desc: "Sub-100ms sync achieved using WebSocket architecture. The first room held 4 friends across 3 time zones.",
  },
  {
    year: "2025",
    title: "Public Beta",
    desc: "Thousands of watch parties later, Synibe opened its doors to the world. Audio sync and reactions went live.",
  },
  {
    year: "2025",
    title: "Today & Beyond",
    desc: "4K streaming, adaptive engines, and a community that watches together every single day. This is just the beginning.",
  },
];

const team = [
  {
    name: "Rajat K.",
    role: "Founder & Lead Engineer",
    desc: "Full-stack architect obsessed with real-time systems and seamless UX.",
    initial: "RK",
  },
  {
    name: "Synibe Team",
    role: "Engineering",
    desc: "A small, passionate crew building the future of shared experiences.",
    initial: "ST",
  },
  {
    name: "Community",
    role: "Early Adopters",
    desc: "The thousands of users whose feedback shapes every feature we ship.",
    initial: "CO",
  },
];



export default function AboutSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesHeaderRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const teamRef = useRef<HTMLDivElement>(null);
  const teamCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      }

      
      gsap.fromTo(
        statsRef.current.filter(Boolean),
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: statsRef.current[0],
            start: "top 85%",
          },
        }
      );

      
      if (storyRef.current) {
        gsap.fromTo(
          storyRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top 80%",
            },
          }
        );
      }

      
      if (valuesHeaderRef.current) {
        gsap.fromTo(
          valuesHeaderRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: valuesHeaderRef.current,
              start: "top 85%",
            },
          }
        );
      }

      
      gsap.fromTo(
        valuesRef.current.filter(Boolean),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: valuesRef.current[0],
            start: "top 85%",
          },
        }
      );

      
      if (timelineRef.current) {
        gsap.fromTo(
          timelineRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 85%",
            },
          }
        );
      }

      
      gsap.fromTo(
        timelineItemsRef.current.filter(Boolean),
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineItemsRef.current[0],
            start: "top 85%",
          },
        }
      );

      
      if (teamRef.current) {
        gsap.fromTo(
          teamRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: teamRef.current,
              start: "top 85%",
            },
          }
        );
      }

      
      gsap.fromTo(
        teamCardsRef.current.filter(Boolean),
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: teamCardsRef.current[0],
            start: "top 85%",
          },
        }
      );

      
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
    <div className="relative w-full bg-black overflow-hidden">
      
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        
        <div
          className="absolute pointer-events-none"
          style={{
            width: 900,
            height: 900,
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            background:
              "radial-gradient(circle, rgba(var(--glow), 0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            bottom: "5%",
            right: "10%",
            background:
              "radial-gradient(circle, rgba(250, 33, 189, 0.04) 0%, transparent 70%)",
          }}
        />

        
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-32 pb-12 sm:pb-20">
          
          <div className="flex items-center justify-center gap-3 mb-8" style={{ opacity: 0 }}>
            <div
              className="w-10 h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
            />
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-white/40">
              Our Story
            </span>
            <div
              className="w-10 h-[2px]"
              style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
            />
          </div>

          
          <h1
            className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6"
            style={{ opacity: 0 }}
          >
            Built for the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              moments
            </span>
            <br />
            we share
          </h1>

          
          <p
            className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-12"
            style={{ opacity: 0 }}
          >
            Synibe isn&apos;t just a streaming tool — it&apos;s a bridge between people.
            We&apos;re building the future of shared digital experiences, one perfectly
            synced moment at a time.
          </p>

          
          <div
            className="w-full max-w-md mx-auto h-[1px]"
            style={{
              opacity: 0,
              background: "linear-gradient(90deg, transparent, rgba(var(--glow), 0.3), transparent)",
            }}
          />
        </div>
      </section>

      
      <section className="relative w-full py-16">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(var(--glow), 0.02), transparent)",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                ref={(el) => { statsRef.current[i] = el; }}
                className="relative text-center p-6 rounded-2xl group transition-all duration-500"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 40px rgba(var(--glow), 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/15" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/15" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/15" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/15" />

                <div
                  className="text-3xl sm:text-4xl font-bold mb-2"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 tracking-widest uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="relative w-full py-28">
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            top: "20%",
            left: "5%",
            background: "radial-gradient(circle, rgba(var(--glow), 0.04) 0%, transparent 70%)",
          }}
        />

        <div ref={storyRef} className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity: 0 }}>
          <div className="flex flex-col lg:flex-row gap-14 items-start">
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-8 h-[2px]"
                  style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
                />
                <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                  The Beginning
                </span>
                <div
                  className="w-8 h-[2px]"
                  style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
                />
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-6">
                Some things are{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  better
                </span>{" "}
                together.
              </h2>

              <p className="text-sm sm:text-base text-white/45 leading-relaxed mb-6">
                It started with a simple frustration — trying to watch a movie with friends
                across different cities, only to spend more time counting &ldquo;3… 2… 1… play!&rdquo;
                than actually watching. The sync was never quite right, the audio drifted,
                and the magic of watching together was lost.
              </p>

              <p className="text-sm sm:text-base text-white/45 leading-relaxed">
                So we built Synibe — a platform where distance disappears and every laugh,
                gasp, and reaction happens at exactly the same moment. Because the best
                stories are the ones we experience together.
              </p>
            </div>

            
            <div
              className="w-full lg:w-[320px] shrink-0 rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/20" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-white/20" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-white/20" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/20" />

              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(var(--glow), 0.1)" }}
                >
                  <Tv className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Our Mission</div>
                  <div className="text-xs text-white/30">Since 2024</div>
                </div>
              </div>

              <p className="text-sm text-white/40 leading-relaxed mb-6">
                To make every shared viewing experience feel like sitting on the same couch —
                no matter the distance.
              </p>

              
              <div className="space-y-2">
                {[
                  { label: "Sync Accuracy", width: 95 },
                  { label: "User Satisfaction", width: 92 },
                  { label: "Uptime", width: 99 },
                ].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-white/30 mb-1">
                      <span>{bar.label}</span>
                      <span>{bar.width}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${bar.width}%`,
                          background:
                            i === 0
                              ? "linear-gradient(90deg, var(--accent), var(--accent-soft))"
                              : "rgba(255,255,255,0.15)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="relative w-full py-28">
        <div
          className="absolute pointer-events-none"
          style={{
            width: 700,
            height: 700,
            top: "50%",
            right: "5%",
            transform: "translateY(-50%)",
            background: "radial-gradient(circle, rgba(250, 33, 189, 0.03) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div ref={valuesHeaderRef} style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
              />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                What We Believe
              </span>
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-4">
              Crafted with{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                purpose
              </span>
            </h2>

            <p className="text-base text-white/40 max-w-xl leading-relaxed mb-14">
              Every feature, every pixel, every millisecond of latency we shave off
              is driven by a set of core beliefs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  ref={(el) => { valuesRef.current[i] = el; }}
                  className="group relative p-6 rounded-2xl cursor-default transition-all duration-500"
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
                    el.style.boxShadow = "0 8px 40px rgba(var(--glow), 0.08)";
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
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(var(--glow), 0.08)" }}
                  >
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>

                  <h4 className="text-base font-semibold text-white mb-2">{v.title}</h4>
                  <p className="text-xs text-white/35 leading-relaxed">{v.desc}</p>

                  
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
      </section>

      
      <section className="relative w-full py-28">
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(var(--glow), 0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div ref={timelineRef} style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
              />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                Our Journey
              </span>
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-14">
              From idea to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                reality
              </span>
            </h2>
          </div>

          
          <div className="relative">
            
            <div
              className="absolute left-[23px] top-0 bottom-0 w-[2px]"
              style={{
                background: "linear-gradient(180deg, var(--accent), rgba(var(--glow), 0.1), transparent)",
              }}
            />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { timelineItemsRef.current[i] = el; }}
                  className="relative flex gap-6 items-start pl-2"
                  style={{ opacity: 0 }}
                >
                  
                  <div
                    className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{
                      background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                      boxShadow: "0 0 25px rgba(var(--glow), 0.3)",
                    }}
                  >
                    {item.year.slice(-2)}
                  </div>

                  
                  <div
                    className="flex-1 p-5 rounded-xl transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-white/30 tracking-widest">{item.year}</span>
                      <div className="flex-1 h-[1px] bg-white/5" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      <section className="relative w-full py-28">
        <div
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            top: "30%",
            right: "10%",
            background: "radial-gradient(circle, rgba(var(--glow), 0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div ref={teamRef} style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
              />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                The Crew
              </span>
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-4">
              Meet the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ensemble
              </span>
            </h2>

            <p className="text-base text-white/40 max-w-xl leading-relaxed mb-14">
              A tight-knit team of builders, dreamers, and binge-watchers on a mission
              to make distance irrelevant.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                ref={(el) => { teamCardsRef.current[i] = el; }}
                className="group relative p-7 rounded-2xl text-center transition-all duration-500"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.05)";
                  el.style.borderColor = "rgba(255,255,255,0.12)";
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 12px 50px rgba(var(--glow), 0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.02)";
                  el.style.borderColor = "rgba(255,255,255,0.06)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/15" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/15" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/15" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/15" />

                
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold text-white mx-auto mb-5"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    boxShadow: "0 0 30px rgba(var(--glow), 0.2)",
                  }}
                >
                  {member.initial}
                </div>

                <h4 className="text-base font-semibold text-white mb-1">{member.name}</h4>
                <div
                  className="text-xs font-medium mb-3"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {member.role}
                </div>
                <p className="text-xs text-white/35 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="relative w-full py-28">
        <div ref={ctaRef} className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity: 0 }}>
          <div
            className="relative rounded-3xl p-10 sm:p-16 overflow-hidden text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(var(--glow), 0.06) 0%, transparent 70%)",
              }}
            />

            
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/15" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/15" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/15" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/15" />

            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to join{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  the ensemble?
                </span>
              </h3>

              <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto mb-8 leading-relaxed">
                Start a Synibe room in seconds. Share stories, sync moments, and experience
                entertainment the way it was meant to be — together.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="create-room/new"><button
                  className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    boxShadow: "0 0 30px rgba(var(--glow), 0.25)",
                  }}
                >
                  Start Watching
                </button></Link>
                <Link href="/"><button
                  className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white/60 cursor-pointer transition-all duration-300 hover:text-white hover:scale-105"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Explore Features
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        
        <p className="text-center text-xs text-white/20 mt-12 tracking-wide">
          No credit card required.{" "}
          <a
            href="/"
            className="underline underline-offset-4 text-white/40 hover:text-white/70 transition-colors"
          >
            Learn more on our homepage
          </a>
        </p>
      </section>
    </div>
  );
}
