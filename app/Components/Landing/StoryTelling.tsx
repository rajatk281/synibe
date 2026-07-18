"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export default function StoryTelling() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",       
          end: "+=300%",          
          scrub: 1.5,             
          pin: true,              
        },
      });

      
      tl.to(textRef.current, {
        scale: 50,
        duration: 1,
        ease: "power2.inOut",
      }, 0);

      
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.in",
      },0.3);
    });

    return () => ctx.revert();
  }, []);

  return (
    
    <section className="select-none"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      
      <video
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src="https://res.cloudinary.com/dwect2foi/video/upload/v1781525186/spiderman-vid_t5dwqu.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      
      
      
      
      
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