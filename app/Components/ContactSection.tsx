"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  MapPin,
  Send,
  MessageSquare,
  Code2,
  AtSign,
  Headphones,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Contact Methods ─── */
const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    desc: "Drop us a line and we'll get back within 24 hours.",
    detail: "hello@synibe.app",
    tag: "General Inquiries",
  },
  {
    icon: Headphones,
    title: "Live Support",
    desc: "Real-time assistance from our sync specialists.",
    detail: "Available 24/7",
    tag: "Priority Support",
  },
  {
    icon: MessageSquare,
    title: "Community",
    desc: "Join thousands of Synibe users in our Discord server.",
    detail: "discord.gg/synibe",
    tag: "Community Hub",
  },
];

/* ─── Social Links ─── */
const socials = [
  { icon: AtSign, name: "Twitter", handle: "@synibe_app" },
  { icon: Code2, name: "GitHub", handle: "github.com/synibe" },
  { icon: MessageSquare, name: "Discord", handle: "discord.gg/synibe" },
];

/* ─── FAQ ─── */
const faqs = [
  {
    q: "How quickly will I get a response?",
    a: "We aim to respond to all inquiries within 24 hours. Priority support tickets are usually resolved within 2 hours.",
  },
  {
    q: "Do you offer enterprise plans?",
    a: "Yes! For teams of 50+ or custom integrations, reach out via the form and we'll tailor a solution for you.",
  },
  {
    q: "Can I request a feature?",
    a: "Absolutely. We love hearing from our community. Submit your ideas through the form or our Discord server.",
  },
  {
    q: "Where are you based?",
    a: "Synibe is a remote-first team with contributors across the globe. Our core operations run from India.",
  },
];

/* ─── Component ─── */
export default function ContactSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const methodsRef = useRef<(HTMLDivElement | null)[]>([]);
  const socialsRef = useRef<HTMLDivElement>(null);
  const faqHeaderRef = useRef<HTMLDivElement>(null);
  const faqItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero entrance */
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

      /* Form entrance */
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.6,
          }
        );
      }

      /* Contact methods stagger */
      gsap.fromTo(
        methodsRef.current.filter(Boolean),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: methodsRef.current[0],
            start: "top 85%",
          },
        }
      );

      /* Socials */
      if (socialsRef.current) {
        gsap.fromTo(
          socialsRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: socialsRef.current,
              start: "top 85%",
            },
          }
        );
      }

      /* FAQ header */
      if (faqHeaderRef.current) {
        gsap.fromTo(
          faqHeaderRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: faqHeaderRef.current,
              start: "top 85%",
            },
          }
        );
      }

      /* FAQ items */
      gsap.fromTo(
        faqItemsRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: faqItemsRef.current[0],
            start: "top 85%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* ═══════════════ HERO + FORM ═══════════════ */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* Ambient glows */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 900,
            height: 900,
            top: "5%",
            left: "20%",
            transform: "translate(-50%, -20%)",
            background:
              "radial-gradient(circle, rgba(var(--glow), 0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            bottom: "10%",
            right: "5%",
            background:
              "radial-gradient(circle, rgba(250, 33, 189, 0.03) 0%, transparent 70%)",
          }}
        />

        {/* Grid lines */}
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left — Hero text */}
            <div ref={heroRef} className="flex-1 min-w-0 lg:pt-8">
              {/* Label */}
              <div className="flex items-center gap-3 mb-8" style={{ opacity: 0 }}>
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ background: "linear-gradient(180deg, var(--accent), var(--accent-soft))" }}
                />
                <span className="text-xs font-semibold tracking-[0.3em] uppercase"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Direct Signal
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6"
                style={{ opacity: 0 }}
              >
                Got something
                <br />
                on your{" "}
                <span
                  className="italic"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  mind?
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className="text-sm sm:text-base text-white/40 max-w-md leading-relaxed mb-10"
                style={{ opacity: 0 }}
              >
                Whether it&apos;s a creative sparks or a technical query, our auteur team
                is standing by to translate your vision into reality.
              </p>

              {/* Quick info cards */}
              <div className="flex flex-wrap gap-4" style={{ opacity: 0 }}>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center"
                    style={{ background: "rgba(var(--glow), 0.1)" }}
                  >
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50 italic">&ldquo;I don&apos;t bite, usually.&rdquo;</span>
                    </div>
                    <div
                      className="text-xs font-semibold"
                      style={{
                        background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Synibe Bot v2.4
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div
                      className="text-xs font-semibold"
                      style={{
                        background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Physical Studio
                    </div>
                    <div className="text-xs text-white/30">India</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Contact Form */}
            <div
              ref={formRef}
              className="w-full lg:w-[480px] shrink-0 rounded-2xl p-8 sm:p-10 relative"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                opacity: 0,
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-white/15" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-white/15" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-white/15" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-white/15" />

              {/* Glow */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at top right, rgba(var(--glow), 0.04) 0%, transparent 60%)",
                }}
              />

              <form className="relative z-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2 font-medium">
                      Nom de Plume
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full bg-transparent text-white text-sm placeholder:text-white/20 pb-3 border-b border-white/10 focus:border-purple-500/50 outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2 font-medium">
                      Digital Address
                    </label>
                    <input
                      type="email"
                      placeholder="email@domain.com"
                      className="w-full bg-transparent text-white text-sm placeholder:text-white/20 pb-3 border-b border-white/10 focus:border-purple-500/50 outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2 font-medium">
                    Signal Type
                  </label>
                  <select
                    className="w-full bg-transparent text-white text-sm pb-3 border-b border-white/10 focus:border-purple-500/50 outline-none transition-colors duration-300 cursor-pointer"
                    defaultValue=""
                    style={{ background: "rgba(0,0,0,0.9)" }}
                  >
                    <option value="" disabled className="text-white/30 ">Select a topic...</option>
                    <option value="general" className="bg-black text-white">General Inquiry</option>
                    <option value="support" className="bg-black text-white">Technical Support</option>
                    <option value="enterprise" className="bg-black text-white">Enterprise Plans</option>
                    <option value="feature" className="bg-black text-white">Feature Request</option>
                    <option value="bug" className="bg-black text-white">Bug Report</option>
                    <option value="partnership" className="bg-black text-white">Partnership</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2 font-medium">
                    The Manifesto
                  </label>
                  <textarea
                    rows={4}
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent text-white text-sm placeholder:text-white/20 pb-3 border-b border-white/10 focus:border-purple-500/50 outline-none transition-colors duration-300 resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="group flex items-center gap-3 px-8 py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                      boxShadow: "0 0 30px rgba(var(--glow), 0.2)",
                    }}
                  >
                    <span className="tracking-widest uppercase text-xs">Send Signal</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT METHODS ═══════════════ */}
      <section className="relative w-full py-24">
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(var(--glow), 0.03) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
            />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
              Other Channels
            </span>
            <div
              className="w-8 h-[2px]"
              style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
            />
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-14">
            More ways to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              connect
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contactMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <div
                  key={i}
                  ref={(el) => { methodsRef.current[i] = el; }}
                  className="group relative p-7 rounded-2xl transition-all duration-500 cursor-default"
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
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/15" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/15" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/15" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/15" />

                  {/* Tag */}
                  <div
                    className="inline-block px-3 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase mb-5"
                    style={{
                      background: "rgba(var(--glow), 0.08)",
                      color: "rgba(168, 85, 247, 0.8)",
                    }}
                  >
                    {method.tag}
                  </div>

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(var(--glow), 0.08)" }}
                  >
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>

                  <h4 className="text-lg font-semibold text-white mb-2">{method.title}</h4>
                  <p className="text-xs text-white/35 leading-relaxed mb-4">{method.desc}</p>

                  <div
                    className="text-sm font-medium"
                    style={{
                      background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {method.detail}
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-7 right-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

      {/* ═══════════════ SOCIALS BAR ═══════════════ */}
      <section className="relative w-full py-16">
        <div ref={socialsRef} className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity: 0 }}>
          <div
            className="rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Follow our signal</h3>
              <p className="text-sm text-white/35">Stay synced with product updates and community drops.</p>
            </div>

            <div className="flex gap-4">
              {socials.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    className="group flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(var(--glow), 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Icon className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">{s.name}</div>
                      <div className="text-[10px] text-white/30">{s.handle}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="relative w-full py-28">
        <div
          className="absolute pointer-events-none"
          style={{
            width: 700,
            height: 700,
            top: "30%",
            right: "10%",
            background: "radial-gradient(circle, rgba(250, 33, 189, 0.03) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div ref={faqHeaderRef} style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
              />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                Quick Answers
              </span>
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-14">
              Frequently{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                asked
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                ref={(el) => { faqItemsRef.current[i] = el; }}
                className="rounded-xl overflow-hidden transition-all duration-500"
                style={{
                  background: openFaq === i ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${openFaq === i ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
                  opacity: 0,
                }}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                  <span
                    className="text-white/40 text-xl shrink-0 transition-transform duration-300"
                    style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: openFaq === i ? "200px" : "0px",
                    opacity: openFaq === i ? 1 : 0,
                  }}
                >
                  <p className="px-5 pb-5 text-sm text-white/40 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM SPACER ═══════════════ */}
      <div className="relative w-full py-16">
        <div
          className="w-full max-w-md mx-auto h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(var(--glow), 0.2), transparent)",
          }}
        />
        <p className="text-center text-xs text-white/20 mt-8 tracking-wide">
          We read every message.{" "}
          <a
            href="/"
            className="underline underline-offset-4 text-white/40 hover:text-white/70 transition-colors"
          >
            Back to homepage
          </a>
        </p>
      </div>
    </div>
  );
}
