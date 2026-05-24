"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function JoinRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "watch";
  const [code, setCode] = useState(["", "", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isJoining, setIsJoining] = useState(false);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;
    const upper = value.toUpperCase();
    const newCode = [...code];
    newCode[index] = upper;
    setCode(newCode);

    // Auto-advance to next input
    if (upper && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 7);
    const newCode = [...code];
    for (let i = 0; i < 7; i++) {
      newCode[i] = pasted[i] || "";
    }
    setCode(newCode);
    const nextEmpty = pasted.length < 7 ? pasted.length : 6;
    inputRefs.current[nextEmpty]?.focus();
  };

  const fullCode = code.join("");
  const isComplete = fullCode.length === 7;

  const handleJoin = () => {
    if (!isComplete) return;
    setIsJoining(true);
    // Simulate join handshake, then navigate to the correct room type
    setTimeout(() => {
      const roomId = fullCode.toLowerCase();
      if (mode === "listen") {
        router.push(`/room/listen/${roomId}`);
      } else {
        router.push(`/room/${roomId}`);
      }
    }, 1500);
  };

  return (
    <div className="h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-600/[0.04] rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-amber-700/[0.03] rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-6">
        {/* Mascot */}
        <div className="relative w-28 h-28 mb-4 join-mascot-float">
          <Image
            src="/join_mascot.png"
            alt="Join Room Mascot"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
          {/* Glow behind mascot */}
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl -z-10 scale-150" />
        </div>

        {/* Label */}
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">
          Ready to Begin?
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center leading-tight tracking-tight mb-10">
          Enter your
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            destination code.
          </span>
        </h1>

        {/* Code Input Area */}
        <div className="w-full rounded-2xl border border-white/[0.06] bg-[#0c0c0e] p-6 md:p-8 mb-5">
          <div className="flex items-center justify-center gap-1.5 md:gap-2" onPaste={handlePaste}>
            {code.map((char, i) => (
              <div key={i} className="flex items-center gap-1.5 md:gap-2">
                {/* Separator dash after index 3 */}
                {i === 4 && (
                  <span className="text-3xl md:text-4xl font-light text-white/20 mx-1 md:mx-2 select-none">
                    –
                  </span>
                )}
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  id={`code-input-${i}`}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-10 h-14 md:w-12 md:h-16 rounded-lg border text-center text-2xl md:text-3xl font-black uppercase tracking-widest transition-all duration-300 bg-transparent outline-none
                    ${char
                      ? "border-orange-500/30 text-white shadow-[0_0_12px_rgba(251,146,60,0.1)]"
                      : "border-white/[0.08] text-white/30"
                    }
                    focus:border-orange-500/50 focus:shadow-[0_0_20px_rgba(251,146,60,0.15)]
                    placeholder:text-white/10`}
                  placeholder="X"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-5 mb-8">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Private Room
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Encrypted Path
            </span>
          </div>
        </div>

        {/* Join Button */}
        <button
          id="join-room-btn"
          onClick={handleJoin}
          disabled={!isComplete || isJoining}
          className={`w-full max-w-xs py-4 rounded-xl text-sm font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition-all duration-500 cursor-pointer
            ${isComplete
              ? "bg-gradient-to-r from-purple-400 to-pink-500 text-black hover:from-purple-400 hover:to-pink-400 shadow-xl shadow-orange-600/20 hover:shadow-pink-500/30 hover:scale-[1.03]"
              : "bg-white/[0.04] text-slate-600 border border-white/[0.06] cursor-not-allowed"
            }`}
        >
          {isJoining ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            "Join Room"
          )}
        </button>

        {/* Lost key link */}
        <div className="mt-5 text-center">
          <Link
            href="#"
            id="request-access-link"
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600 hover:text-pink-500 transition-colors duration-300"
          >
            Lost your key?{"         "}
            <span className="text-slate-500 hover:text-pink-300 underline underline-offset-2 decoration-slate-700 hover:decoration-orange-400/50">
              Request Access
            </span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-700 text-center">
            © MMXXIV Synibe. Directed by Design. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JoinRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-black flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      }
    >
      <JoinRoomContent />
    </Suspense>
  );
}
