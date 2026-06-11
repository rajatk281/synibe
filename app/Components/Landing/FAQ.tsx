"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Do I need to pay for a subscription?",
    answer:
      "No! Synibe is completely free to use. Create rooms, invite friends, and watch together without any subscription fees or hidden charges.",
  },
  {
    question: "Which streaming services are supported?",
    answer:
      "Synibe supports a wide range of platforms including YouTube, Twitch, Vimeo, and direct video URLs. We're constantly adding support for more services.",
  },
  {
    question: "How many people can join a room?",
    answer:
      "Each room supports up to 50 participants simultaneously. Whether it's a movie night with close friends or a larger watch party, Synibe handles it smoothly.",
  },
  {
    question: "Is there any latency during playback?",
    answer:
      "Synibe uses ultra-low latency sync technology. All participants experience near-zero delay, so every laugh, gasp, and reaction happens together in real-time.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "You can join rooms as a guest with just a link. Creating an account unlocks extras like saved rooms, custom avatars, and watch history — but it's totally optional.",
  },
];

/* ─── Accordion Item ─── */
function AccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !innerRef.current) return;

    if (isOpen) {
      const height = innerRef.current.scrollHeight;
      gsap.to(contentRef.current, {
        height,
        duration: 0.45,
        ease: "power3.inOut",
      });
      gsap.to(innerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        delay: 0.1,
        ease: "power2.out",
      });
    } else {
      gsap.to(innerRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.4,
        delay: 0.1,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div
      className="group"
      style={{
        background: isOpen
          ? "rgba(255,255,255,0.04)"
          : "rgba(255,255,255,0.02)",
        border: "1px solid",
        borderColor: isOpen
          ? "rgba(255,255,255,0.1)"
          : "rgba(255,255,255,0.06)",
        borderRadius: "16px",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Question button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-7 py-5 cursor-pointer"
        style={{ outline: "none" }}
        aria-expanded={isOpen}
        id={`faq-btn-${index}`}
      >
        <span
          className="text-left text-[15px] sm:text-base font-medium tracking-wide"
          style={{
            color: isOpen ? "#fff" : "rgba(255,255,255,0.7)",
            transition: "color 0.3s ease",
          }}
        >
          {faq.question}
        </span>

        {/* Animated chevron */}
        <div
          className="shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: isOpen
              ? "linear-gradient(135deg, var(--accent), var(--accent-soft))"
              : "rgba(255,255,255,0.06)",
            transition: "background 0.35s ease",
            boxShadow: isOpen
              ? "0 0 20px rgba(var(--glow), 0.3)"
              : "none",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <path
              d="M3 5L7 9L11 5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Answer panel */}
      <div
        ref={contentRef}
        style={{ height: 0, overflow: "hidden" }}
      >
        <div
          ref={innerRef}
          className="px-7 pb-6"
          style={{ opacity: 0, transform: "translateY(-8px)" }}
        >
          <div
            className="w-12 h-[1px] mb-4"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), transparent)",
            }}
          />
          <p className="text-sm leading-relaxed text-white/50">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── FAQ Section ─── */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Stagger FAQ items
      gsap.fromTo(
        itemsRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 overflow-hidden bg-black"
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "700px",
          height: "700px",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(var(--glow), 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6">
        {/* Section heading */}
        <div ref={headingRef} className="text-center mb-14" style={{ opacity: 0 }}>
          {/* Label */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div
              className="w-8 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent))",
              }}
            />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
              FAQ
            </span>
            <div
              className="w-8 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent), transparent)",
              }}
            />
          </div>

          <h2 className="text-4xl sm:text-5xl font-semibold text-white leading-tight">
            Frequently Asked
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Questions
            </span>
          </h2>
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              style={{ opacity: 0 }}
            >
              <AccordionItem
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            </div>
          ))}
        </div>

        {/* Bottom helper text */}
        <p className="text-center text-xs text-white/30 mt-10 tracking-wide">
          Still have questions?{" "}
          <a
            href="/contact"
            className="underline underline-offset-4 text-white/50 hover:text-white/80 transition-colors"
          >
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
}
