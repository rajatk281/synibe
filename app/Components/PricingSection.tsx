"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  Check,
  X,
  Zap,
  Crown,
  Users,
  Sparkles,
  ArrowRight,
  MonitorPlay,
  Headphones,
  Shield,
  Infinity,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Plan Data ─── */
const plans = [
  {
    id: "free",
    name: "Wanderer",
    tagline: "For casual watchers",
    price: "0",
    period: "forever",
    icon: Users,
    popular: false,
    cta: "Get Started Free",
    features: [
      { text: "Up to 4 users per room", included: true },
      { text: "720p streaming quality", included: true },
      { text: "Text chat during sessions", included: true },
      { text: "Basic sync engine", included: true },
      { text: "3 rooms per day", included: true },
      { text: "Community support", included: true },
      { text: "Custom room themes", included: false },
      { text: "Priority sync engine", included: false },
      { text: "Screen sharing", included: false },
    ],
  },
  {
    id: "pro",
    name: "Auteur",
    tagline: "For dedicated cinephiles",
    price: "9",
    period: "month",
    icon: Crown,
    popular: true,
    cta: "Start Free Trial",
    features: [
      { text: "Up to 25 users per room", included: true },
      { text: "4K HDR streaming", included: true },
      { text: "Voice + text chat", included: true },
      { text: "Priority sync engine", included: true },
      { text: "Unlimited rooms", included: true },
      { text: "Screen sharing", included: true },
      { text: "Custom room themes", included: true },
      { text: "Live reactions & emojis", included: true },
      { text: "Dedicated support", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Studio",
    tagline: "For teams & organizations",
    price: "29",
    period: "month",
    icon: Sparkles,
    popular: false,
    cta: "Contact Sales",
    features: [
      { text: "Unlimited users per room", included: true },
      { text: "4K HDR + Dolby Audio", included: true },
      { text: "Voice, video & text chat", included: true },
      { text: "Adaptive sync engine", included: true },
      { text: "Unlimited rooms", included: true },
      { text: "Screen sharing + annotation", included: true },
      { text: "Custom branding", included: true },
      { text: "API access & webhooks", included: true },
      { text: "Dedicated account manager", included: true },
    ],
  },
];

/* ─── Comparison Data ─── */
const comparisonCategories = [
  {
    name: "Streaming",
    features: [
      { name: "Max resolution", free: "720p", pro: "4K HDR", enterprise: "4K HDR + Dolby" },
      { name: "Max room size", free: "4 users", pro: "25 users", enterprise: "Unlimited" },
      { name: "Daily room limit", free: "3 rooms", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Sync latency", free: "<200ms", pro: "<100ms", enterprise: "<50ms" },
    ],
  },
  {
    name: "Communication",
    features: [
      { name: "Text chat", free: "✓", pro: "✓", enterprise: "✓" },
      { name: "Voice chat", free: "—", pro: "✓", enterprise: "✓" },
      { name: "Video chat", free: "—", pro: "—", enterprise: "✓" },
      { name: "Live reactions", free: "—", pro: "✓", enterprise: "✓" },
    ],
  },
  {
    name: "Platform",
    features: [
      { name: "Screen sharing", free: "—", pro: "✓", enterprise: "✓" },
      { name: "Custom themes", free: "—", pro: "✓", enterprise: "✓" },
      { name: "Custom branding", free: "—", pro: "—", enterprise: "✓" },
      { name: "API access", free: "—", pro: "—", enterprise: "✓" },
    ],
  },
];

/* ─── Perks Data ─── */
const perks = [
  {
    icon: MonitorPlay,
    title: "No Downloads",
    desc: "Everything runs in your browser. Zero installs, zero friction.",
  },
  {
    icon: Shield,
    title: "E2E Encrypted",
    desc: "All rooms are end-to-end encrypted. Your data stays yours.",
  },
  {
    icon: Headphones,
    title: "Spatial Audio",
    desc: "Immersive sound that makes you feel like you're in the same room.",
  },
  {
    icon: Infinity,
    title: "No Ads Ever",
    desc: "Clean experience on every plan. We never show ads. Period.",
  },
];

/* ─── FAQ Data ─── */
const pricingFaqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Absolutely. Upgrade or downgrade whenever you want — changes take effect immediately with prorated billing.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes! Both the Auteur and Studio plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, UPI, PayPal, and bank transfers for enterprise plans.",
  },
  {
    q: "Can I use Synibe without an account?",
    a: "Yes! Guest users can join rooms without creating an account. Some features are limited for guests.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes — students get 50% off any paid plan with a valid student email. Reach out to support to activate your discount.",
  },
];

/* ─── Component ─── */
export default function PricingSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const perksHeaderRef = useRef<HTMLDivElement>(null);
  const perksRef = useRef<(HTMLDivElement | null)[]>([]);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const faqHeaderRef = useRef<HTMLDivElement>(null);
  const faqItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [isAnnual, setIsAnnual] = useState(false);
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

      /* Toggle */
      if (toggleRef.current) {
        gsap.fromTo(
          toggleRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: 0.6,
          }
        );
      }

      /* Cards stagger */
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.2)",
          delay: 0.7,
        }
      );

      /* Perks header */
      if (perksHeaderRef.current) {
        gsap.fromTo(
          perksHeaderRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: perksHeaderRef.current, start: "top 85%" },
          }
        );
      }

      /* Perk items */
      gsap.fromTo(
        perksRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: perksRef.current[0], start: "top 85%" },
        }
      );

      /* Comparison table */
      if (comparisonRef.current) {
        gsap.fromTo(
          comparisonRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: comparisonRef.current, start: "top 85%" },
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
            scrollTrigger: { trigger: faqHeaderRef.current, start: "top 85%" },
          }
        );
      }

      /* FAQ items */
      gsap.fromTo(
        faqItemsRef.current.filter(Boolean),
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: faqItemsRef.current[0], start: "top 85%" },
        }
      );

      /* CTA */
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: ctaRef.current, start: "top 90%" },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const getPrice = (base: string) => {
    const num = parseInt(base);
    if (num === 0) return "0";
    return isAnnual ? Math.round(num * 0.8).toString() : base;
  };


  const createOrder = async(amount : String )=>{
    if (Number(amount) === 0) return; // Free plan, no payment needed

    const res = await fetch("/api/CreateOrder",  {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({amount})
    })
    if (!res.ok) {
      const errorText = await res.text();
      console.error("CreateOrder failed:", res.status, errorText);
      return;
    }
    const data = await res.json()

    if (!(window as any).Razorpay) {
      console.error("Razorpay SDK not loaded");
      return;
    }

    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Synibe",
      description: "Subscription Payment",
      order_id : data.id,
      handler : async function(response: any ){
        try {
          const res = await fetch("/api/auth/verifyOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          
          const data = await res.json();
          if (data.isOk) {
            console.log("Payment verification successful");
            // Add your success logic here (e.g. redirect, toast notification)
            alert("Payment successful!");
          } else {
            console.error("Payment verification failed:", data.message);
            alert("Payment verification failed.");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          alert("Something went wrong during payment verification.");
        }
      },
      theme: {
        color: "#a855f7"
      }
    }
    const payment = new (window as any).Razorpay(paymentData)
    payment.open()
  }

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative w-full pt-32 pb-10 overflow-hidden">
        {/* Ambient glows */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 900,
            height: 900,
            top: "5%",
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
            bottom: "10%",
            right: "5%",
            background:
              "radial-gradient(circle, rgba(250, 33, 189, 0.04) 0%, transparent 70%)",
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

        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Label */}
          <div className="flex items-center justify-center gap-3 mb-8" style={{ opacity: 0 }}>
            <div
              className="w-10 h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
            />
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-white/40">
              Simple Pricing
            </span>
            <div
              className="w-10 h-[2px]"
              style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
            />
          </div>

          {/* Title */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
            style={{ opacity: 0 }}
          >
            Choose your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              frequency
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ opacity: 0 }}
          >
            From free solo sessions to enterprise-grade productions —
            pick the plan that matches your vibe. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Billing toggle */}
        <div
          ref={toggleRef}
          className="relative z-10 flex items-center justify-center gap-4 mb-16"
          style={{ opacity: 0 }}
        >
          <span className={`text-sm transition-colors duration-300 ${!isAnnual ? "text-white" : "text-white/40"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 rounded-full cursor-pointer transition-all duration-300"
            style={{
              background: isAnnual
                ? "linear-gradient(135deg, var(--accent), var(--accent-soft))"
                : "rgba(255,255,255,0.1)",
              boxShadow: isAnnual ? "0 0 20px rgba(var(--glow), 0.3)" : "none",
            }}
          >
            <div
              className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300"
              style={{ left: isAnnual ? "calc(100% - 24px)" : "4px" }}
            />
          </button>
          <span className={`text-sm transition-colors duration-300 ${isAnnual ? "text-white" : "text-white/40"}`}>
            Annual
          </span>
          {isAnnual && (
            <span
              className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase"
              style={{
                background: "rgba(var(--glow), 0.12)",
                color: "rgba(168, 85, 247, 0.9)",
              }}
            >
              Save 20%
            </span>
          )}
        </div>
      </section>

      {/* ═══════════════ PRICING CARDS ═══════════════ */}
      <section className="relative w-full pb-18">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              const displayPrice = getPrice(plan.price);

              return (
                <div
                  key={plan.id}
                  ref={(el) => { cardsRef.current[i] = el; }}
                  className={`group relative rounded-2xl p-8 transition-all duration-500 flex flex-col ${plan.popular ? "lg:-mt-4 lg:mb-0" : ""}`}
                  style={{
                    background: plan.popular
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.02)",
                    border: plan.popular
                      ? "1px solid rgba(168, 85, 247, 0.3)"
                      : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: plan.popular
                      ? "0 0 60px rgba(var(--glow), 0.1)"
                      : "none",
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.popular) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = "0 12px 50px rgba(var(--glow), 0.08)";
                    } else {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 16px 60px rgba(var(--glow), 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.popular) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    } else {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 0 60px rgba(var(--glow), 0.1)";
                    }
                  }}
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/15" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/15" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/15" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/15" />

                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div
                        className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white"
                        style={{
                          background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                          boxShadow: "0 0 25px rgba(var(--glow), 0.3)",
                        }}
                      >
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6 pt-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(var(--glow), 0.08)" }}
                      >
                        <Icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                        <p className="text-xs text-white/30">{plan.tagline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-white/40 self-start mt-2">$</span>
                      <span
                        className="text-5xl font-bold"
                        style={{
                          background: plan.popular
                            ? "linear-gradient(135deg, var(--accent), var(--accent-soft))"
                            : "linear-gradient(135deg, #fff, rgba(255,255,255,0.7))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {displayPrice}
                      </span>
                      <span className="text-sm text-white/30 ml-1">
                        / {plan.period}
                      </span>
                    </div>
                    {isAnnual && plan.price !== "0" && (
                      <p className="text-xs text-purple-400/70 mt-1">
                        ${parseInt(displayPrice) * 12}/year — save ${parseInt(plan.price) * 12 - parseInt(displayPrice) * 12}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div
                    className="w-full h-[1px] mb-6"
                    style={{
                      background: plan.popular
                        ? "linear-gradient(90deg, transparent, rgba(var(--glow), 0.3), transparent)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  />

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-3">
                        {f.included ? (
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: "rgba(var(--glow), 0.1)" }}
                          >
                            <Check className="w-3 h-3 text-purple-400" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 bg-white/[0.03]">
                            <X className="w-3 h-3 text-white/15" />
                          </div>
                        )}
                        <span className={`text-sm ${f.included ? "text-white/60" : "text-white/20"}`}>
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div onClick={()=>{createOrder(plan.price)}} className="mt-8 ">
                    <Link
                      href={plan.id === "enterprise" ? "/contact" : "#"}
                      className={`group/btn w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.03] ${plan.popular ? "text-white" : "text-white/70 hover:text-white"}`}
                      style={
                        plan.popular
                          ? {
                              background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                              boxShadow: "0 0 30px rgba(var(--glow), 0.2)",
                            }
                          : {
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }
                      }
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 " />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ PERKS ═══════════════ */}
      <section className="relative w-full pb-12">
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
          <div ref={perksHeaderRef} className="text-center mb-14" style={{ opacity: 0 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
              />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                Every Plan Includes
              </span>
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1]">
              The{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                essentials
              </span>
              , always included
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  ref={(el) => { perksRef.current[i] = el; }}
                  className="group relative p-6 rounded-2xl text-center transition-all duration-500"
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
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(var(--glow), 0.08)" }}
                  >
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{perk.title}</h4>
                  <p className="text-xs text-white/35 leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
      <section className="relative w-full pb-12">
        <div
          className="absolute pointer-events-none"
          style={{
            width: 700,
            height: 700,
            top: "30%",
            right: "5%",
            background: "radial-gradient(circle, rgba(250, 33, 189, 0.03) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div ref={comparisonRef} style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
              />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                Feature Breakdown
              </span>
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-14">
              Compare{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                plans
              </span>
            </h2>

            {/* Table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Header */}
              <div
                className="grid grid-cols-4 gap-4 px-6 py-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-xs font-medium text-white/30 tracking-widest uppercase">
                  Feature
                </div>
                <div className="text-xs font-medium text-white/50 tracking-widest uppercase text-center">
                  Wanderer
                </div>
                <div className="text-center">
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{
                      background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Auteur
                  </span>
                </div>
                <div className="text-xs font-medium text-white/50 tracking-widest uppercase text-center">
                  Studio
                </div>
              </div>

              {/* Rows */}
              {comparisonCategories.map((cat, ci) => (
                <div key={ci}>
                  {/* Category label */}
                  <div
                    className="px-6 py-3"
                    style={{
                      background: "rgba(var(--glow), 0.03)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span className="text-xs font-semibold text-purple-400/70 tracking-wider uppercase">
                      {cat.name}
                    </span>
                  </div>
                  {cat.features.map((f, fi) => (
                    <div
                      key={fi}
                      className="grid grid-cols-4 gap-4 px-6 py-4 transition-colors duration-200 hover:bg-white/[0.02]"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="text-sm text-white/50">{f.name}</div>
                      <div className="text-sm text-white/40 text-center">{f.free}</div>
                      <div className="text-sm text-white/70 text-center font-medium">{f.pro}</div>
                      <div className="text-sm text-white/50 text-center">{f.enterprise}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="relative w-full">
        <div
          className="absolute pointer-events-none"
          style={{
            width: 800,
            height: 600,
            bottom: "10%",
            left: "10%",
            background: "radial-gradient(circle, rgba(var(--glow), 0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div ref={faqHeaderRef} style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent))" }}
              />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                Questions
              </span>
              <div
                className="w-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-14">
              Pricing{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                FAQ
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, i) => (
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

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative w-full">
        <div ref={ctaRef} className="relative z-10 max-w-5xl mx-auto px-6" style={{ opacity: 0 }}>
          <div
            className="relative rounded-3xl p-10 sm:p-16 overflow-hidden text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Glow */}
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
                Ready to{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  sync up?
                </span>
              </h3>

              <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto mb-8 leading-relaxed">
                Start free, upgrade when you&apos;re ready.
                14-day trial on all paid plans — no credit card required.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="#"
                  className="group/cta flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                    boxShadow: "0 0 30px rgba(var(--glow), 0.25)",
                  }}
                >
                  Start Watching Free
                  <Zap className="w-4 h-4 group-hover/cta:rotate-12 transition-transform duration-300" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white/60 transition-all duration-300 hover:text-white hover:scale-105"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-white/20 mt-12 tracking-wide">
          All prices in USD. Taxes may apply.{" "}
          <Link
            href="/contact"
            className="underline underline-offset-4 text-white/40 hover:text-white/70 transition-colors"
          >
            Need a custom plan?
          </Link>
        </p>
      </section>
    </div>
  );
}
