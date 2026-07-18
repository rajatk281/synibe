"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const videoFeatures = [
  { title: "Perfect Sync", desc: "Zero lag video playback across all connected users", icon: "⚡" },
  { title: "4K Streaming", desc: "Crystal clear quality on any screen", icon: "📺" },
  { title: "Smart Buffering", desc: "Adapts to network conditions automatically", icon: "🛡️" },
  { title: "Live Reactions", desc: "React together in real-time as you watch", icon: "💬" },
];

const audioFeatures = [
  { title: "Audio Sync", desc: "Same beat, same moment, every time", icon: "🎵" },
  { title: "Shared Controls", desc: "Play, pause, skip — all synced across listeners", icon: "🎧" },
  { title: "Group Queue", desc: "Build playlists collaboratively together", icon: "📋" },
  { title: "Live Reactions", desc: "Feel the drops and vibes together instantly", icon: "🔥" },
];

export default function PhoneShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const content1Ref = useRef<HTMLDivElement>(null);
  const content2Ref = useRef<HTMLDivElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    
    if (window.innerWidth >= 1024) {
      setLoadVideo(true);
    }
  }, []);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return; 

    const section = sectionRef.current;
    const phone = phoneRef.current;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    const c1 = content1Ref.current;
    const c2 = content2Ref.current;
    if (!section || !phone || !v1 || !v2 || !c1 || !c2) return;

    const ctx = gsap.context(() => {
      
      gsap.set(phone, { rotation: -90, x: "18vw" });
      gsap.set(c2, { opacity: 0, x: 80 });
      gsap.set(v2, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=350%",
          scrub: 0,
          pin: true,
        },
      });

      

      
      tl.to(c1, { opacity: 0, x: -80, duration: 0.5, ease: "power2.in" }, 0);

      
      tl.to(phone, { rotation: 0, x: "-20vw", y:"3vh", duration: 1, ease: "power3.inOut" }, 0.1);

      
      tl.to(v1, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 0.4);
      tl.to(v2, { opacity: 1, duration: 0.6, ease: "power1.inOut" }, 0.6);

      
      tl.to(c2, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.7);

      
    });

    return () => ctx.revert();
  }, []);

  
  const FeatureCard = ({ f }: { f: { title: string; desc: string; icon: string } }) => (
    <div className="flex items-start gap-3 sm:gap-4 ">
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-base sm:text-lg shrink-0"
        style={{
          background: "rgba(136,41,224,0.15)",
          border: "1px solid rgba(136,41,224,0.25)",
        }}
      >
        {f.icon}
      </div>
      <div>
        <h4 className="text-white font-semibold text-sm">{f.title}</h4>
        <p className="text-white/40 text-xs sm:text-sm">{f.desc}</p>
      </div>
    </div>
  );

  return (
    <>
      
      <section className="lg:hidden relative overflow-hidden bg-black pt-16 sm:py-24 select-none">
        
        <div className="max-w-lg mx-auto px-5 sm:px-6 sm:mb-20 mt-42 pt-4 ">
          <div className="flex items-center gap-3 mb-4 ">
            <div
              className="w-8 h-[2px]"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-soft))" }}
            />
            <span className="text-sm font-medium tracking-widest uppercase text-white/50">
              Watch Together
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Watch Together,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Stay Connected
            </span>
          </h2>

          <p className="text-white/50 text-sm sm:text-base mb-6 leading-relaxed">
            Share your screen, sync your stream. Watch movies, series, and videos
            with friends — no matter where they are.
          </p>

          <div className="space-y-2">
            {videoFeatures.map((f) => (
              <FeatureCard key={f.title} f={f} />
            ))}
          </div>
        </div>

        
        <div className="max-w-lg mx-auto px-5 sm:px-6 ">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-[2px]"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-soft))" }}
            />
            <span className="text-sm font-medium tracking-widest uppercase text-white/50">
              Listen Together
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Listen Together,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Feel the Beat
            </span>
          </h2>

          <p className="text-white/50 text-sm sm:text-base mb-6 leading-relaxed">
            Sync your music sessions with anyone. Drop the same beat at the same
            moment — together, anywhere in the world.
          </p>

          <div className="space-y-2">
            {audioFeatures.map((f) => (
              <FeatureCard key={f.title} f={f} />
            ))}
          </div>
        </div>

        
        <div
          className="absolute pointer-events-none z-0 "
          style={{
            width: 300,
            height: 300,
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle, rgba(var(--glow),0.2) 0%, transparent 70%)",
          }}
        />
      </section>

      
      <section
        ref={sectionRef}
        className="hidden lg:block relative w-full h-screen overflow-hidden bg-black"
      >
        
        <div
          ref={content1Ref}
          className="absolute left-[8%] top-1/2 -translate-y-1/2 w-[32%] z-10 ml-10 "
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-[2px]"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-soft))" }}
            />
            <span className="text-sm font-medium tracking-widest uppercase text-white/50">
              Watch Together
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Watch Together,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Stay Connected
            </span>
          </h2>

          <p className="text-white/50 text-base mb-8 leading-relaxed ">
            Share your screen, sync your stream. Watch movies, series, and videos
            with friends — no matter where they are.
          </p>

          <div className="space-y-2">
            {videoFeatures.map((f) => (
              <FeatureCard key={f.title} f={f} />
            ))}
          </div>
        </div>

        
        <div
          ref={phoneRef}
          className="absolute top-1/2 left-1/2 rounded-2xl z-10"
          style={{
            width: 400,
            height: 610,
            marginLeft: -150,
            marginTop: -305,
            willChange: "transform",
            filter: "drop-shadow(0 0 40px rgba(var(--glow), 0.2))",
          }}
        >
          
          <div
            className="absolute overflow-hidden rounded-4xl mx-8 "
            style={{
              top: '5.7%',
              left: '7.1%',
              right: '7.1%',
              bottom: '4.3%',
            }}
          >
            
            <video
              ref={video1Ref}
              src={loadVideo ? "https://res.cloudinary.com/dwect2foi/video/upload/v1781797821/35266-407130741_medium_jeogdj.mp4" : undefined}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: 'rotate(90deg) scale(2)',
              }}
            />

            
            <video
              ref={video2Ref}
              src={loadVideo ? "/Videos/musicplayer.mp4" : undefined}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover "
            />
          </div>

          
          <Image
            src="/phone.com.png"
            alt="Phone"
            className="absolute inset-0 w-full h-full pointer-events-none z-10 "
            width={3936}
            height={6000}
            draggable={false}
          />
        </div>

        
        <div
          ref={content2Ref}
          className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[32%] z-10 mr-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-[2px]"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-soft))" }}
            />
            <span className="text-sm font-medium tracking-widest uppercase text-white/50">
              Listen Together
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Listen Together,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Feel the Beat
            </span>
          </h2>

          <p className="text-white/50 text-base mb-8 leading-relaxed">
            Sync your music sessions with anyone. Drop the same beat at the same
            moment — together, anywhere in the world.
          </p>

          <div className="space-y-2">
            {audioFeatures.map((f) => (
              <FeatureCard key={f.title} f={f} />
            ))}
          </div>
        </div>

        
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: 600,
            height: 600,
            top: "50%",
            left: "50%",
            transform: "translate(-60%,-50%)",
            background: "radial-gradient(circle, rgba(var(--glow),0.3) 0%, transparent 70%)",
          }}
        />
      </section>
    </>
  );
}
