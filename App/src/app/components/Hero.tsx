"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import BrandTicker from "./BrandTicker";

/* Deterministic Static Particles Array for SSR/CSR Hydration Consistency */
const dustParticlesData = [
  { size: 1.8, left: 24, top: 32, delay: 0.5, duration: 9.2, opacity: 0.35 },
  { size: 2.4, left: 68, top: 25, delay: 1.8, duration: 11.5, opacity: 0.42 },
  { size: 1.4, left: 42, top: 48, delay: 3.2, duration: 8.4, opacity: 0.22 },
  { size: 2.1, left: 35, top: 58, delay: 0.8, duration: 10.1, opacity: 0.38 },
  { size: 2.6, left: 72, top: 42, delay: 2.4, duration: 12.2, opacity: 0.32 },
  { size: 1.6, left: 55, top: 22, delay: 4.1, duration: 7.8, opacity: 0.28 },
  { size: 2.8, left: 62, top: 52, delay: 1.2, duration: 11.0, opacity: 0.40 },
  { size: 1.9, left: 30, top: 38, delay: 5.0, duration: 9.5, opacity: 0.30 },
  { size: 2.2, left: 78, top: 64, delay: 2.1, duration: 10.8, opacity: 0.36 },
  { size: 1.3, left: 48, top: 28, delay: 3.7, duration: 8.0, opacity: 0.25 },
  { size: 2.5, left: 60, top: 36, delay: 0.2, duration: 11.8, opacity: 0.44 },
  { size: 1.7, left: 38, top: 68, delay: 4.5, duration: 9.0, opacity: 0.26 },
  { size: 2.0, left: 75, top: 30, delay: 1.5, duration: 10.5, opacity: 0.33 },
  { size: 1.5, left: 28, top: 50, delay: 2.9, duration: 8.6, opacity: 0.24 },
  { size: 2.3, left: 66, top: 60, delay: 0.6, duration: 12.0, opacity: 0.39 },
  { size: 1.8, left: 50, top: 44, delay: 3.0, duration: 9.8, opacity: 0.31 },
  { size: 2.7, left: 32, top: 26, delay: 1.1, duration: 11.2, opacity: 0.41 },
  { size: 1.4, left: 70, top: 54, delay: 4.8, duration: 8.2, opacity: 0.23 },
  { size: 2.1, left: 44, top: 62, delay: 2.7, duration: 10.4, opacity: 0.37 },
  { size: 1.6, left: 58, top: 30, delay: 0.4, duration: 9.1, opacity: 0.29 },
  { size: 2.3, left: 22, top: 40, delay: 3.5, duration: 11.6, opacity: 0.38 },
  { size: 1.9, left: 82, top: 46, delay: 1.9, duration: 10.0, opacity: 0.34 },
];

/* Floating Golden Dust Ambient Particles Component */
function HeroDustParticles() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  if (!mounted) return null;
  const particles = isMobile ? dustParticlesData.slice(0, 6) : dustParticlesData;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" suppressHydrationWarning>
      {particles.map((p, idx) => (
        <span
          key={idx}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: "radial-gradient(circle, #D4AF37 0%, #C5A880 70%, transparent 100%)",
            boxShadow: isMobile ? "none" : "0 0 6px rgba(212, 175, 55, 0.6)",
            opacity: p.opacity,
            animation: `goldDustFloat ${p.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* Primary CTA Buttons Component */
function HeroActions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 lg:gap-5 pointer-events-auto z-30 px-3 max-w-full" suppressHydrationWarning>
      {/* 1. Shop Button */}
      <Link
        href="/shop"
        className="group relative inline-flex items-center justify-center gap-2 sm:gap-2.5 h-[38px] sm:h-[44px] lg:h-[48px] w-[160px] sm:w-[220px] lg:w-[250px] rounded-xl sm:rounded-2xl border border-black bg-transparent text-[#1c1b18] font-serif-text text-[12px] sm:text-[13.5px] lg:text-[14.5px] font-medium tracking-[0.12em] sm:tracking-[0.16em] uppercase transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FDFBF7] hover:via-[#F6EEDF] hover:to-[#E9D9C3] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:border-black overflow-hidden select-none shrink-0 text-center"
        style={{ fontFamily: "var(--font-ibm-plex-serif), Georgia, serif" }}
        suppressHydrationWarning
      >
        <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/75 to-transparent transition-all duration-800 ease-in-out group-hover:left-[100%] pointer-events-none rounded-xl sm:rounded-2xl" />
        <span className="relative z-10">Shop</span>
        <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-black">→</span>
      </Link>

      {/* 2. Find Your Fragrance Button */}
      <Link
        href="/scent-index"
        className="group relative inline-flex items-center justify-center gap-2 sm:gap-2.5 h-[38px] sm:h-[44px] lg:h-[48px] w-[160px] sm:w-[220px] lg:w-[250px] rounded-xl sm:rounded-2xl border border-black bg-transparent text-[#1c1b18] font-serif-text text-[11.5px] sm:text-[13px] lg:text-[14px] font-medium tracking-[0.06em] sm:tracking-[0.12em] uppercase transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FDFBF7] hover:via-[#F6EEDF] hover:to-[#E9D9C3] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:border-black overflow-hidden select-none shrink-0 text-center"
        style={{ fontFamily: "var(--font-ibm-plex-serif), Georgia, serif" }}
        suppressHydrationWarning
      >
        <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-all duration-800 ease-in-out group-hover:left-[100%] pointer-events-none rounded-xl sm:rounded-2xl" />
        <span className="relative z-10">Find Your Fragrance</span>
        <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1.5 text-black">→</span>
      </Link>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  /* Interactive 3D Parallax Mouse Tracking Animation (Desktop Only) */
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window === "undefined" || !sectionRef.current || window.innerWidth <= 1024) return;
    const { clientX, clientY } = e;
    const x = ((clientX / window.innerWidth) - 0.5) * 8;
    const y = ((clientY / window.innerHeight) - 0.5) * 8;
    
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (sectionRef.current) {
        sectionRef.current.style.setProperty('--parallax-x', `${x}px`);
        sectionRef.current.style.setProperty('--parallax-y', `${y}px`);
      }
    });
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden pt-2 sm:pt-4 pb-0" 
      style={{
        background: "linear-gradient(to bottom, #CBB9A1 0%, #CBB9A1 75%, #D7C9B9 85%, #E6DDD0 93%, #F5F1E8 100%)",
      }}
      suppressHydrationWarning
    >
      {/* Global CSS for Animations */}
      <style suppressHydrationWarning>{`
        :root {
          --bottle-base-y: 6.5vh;
        }
        @media (min-width: 640px) {
          :root {
            --bottle-base-y: 3.5vh;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --bottle-base-y: 1.5vh;
          }
        }
        .murakkaz-hero-title {
          font-size: clamp(3.2rem, 15vw, 5.0rem);
        }
        @media (min-width: 640px) {
          .murakkaz-hero-title {
            font-size: clamp(4.8rem, 13.5vw, 7.5rem);
          }
        }
        @media (min-width: 1024px) {
          .murakkaz-hero-title {
            font-size: clamp(6.8rem, 12vw, 9.2rem);
          }
        }
        @media (min-width: 1536px) {
          .murakkaz-hero-title {
            font-size: clamp(8.5rem, 12.5vw, 10.5rem);
          }
        }
        @keyframes goldDustFloat {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.15; }
          50% { transform: translateY(-16px) translateX(6px); opacity: 0.45; }
          100% { transform: translateY(-32px) translateX(-4px); opacity: 0.15; }
        }
        @keyframes bgLightSweep {
          0% { transform: translateX(-120%) rotate(25deg); opacity: 0; }
          15% { opacity: 0.14; }
          35% { transform: translateX(220%) rotate(25deg); opacity: 0; }
          100% { transform: translateX(220%) rotate(25deg); opacity: 0; }
        }
        @keyframes spotlightBreathe {
          0%, 100% { opacity: 0.72; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.03); }
        }
        @keyframes bottlePerpetualFloat {
          0%, 100% { transform: translateY(var(--bottle-base-y, 2vh)) rotate(0deg); }
          50% { transform: translateY(calc(var(--bottle-base-y, 2vh) - 8px)) rotate(0.6deg); }
        }
        @keyframes bottleShadowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.40; }
          50% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.28; }
        }
        @keyframes heroTextFadeIn {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-enter {
          animation: heroTextFadeIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (max-width: 768px) {
          .volumetric-ray {
            --ray-angle: 16.5deg !important;
          }
        }
        @media (min-width: 769px) {
          .volumetric-ray {
            --ray-angle: 42.5deg !important;
          }
        }
      `}</style>

      {/* Animated Light Sweep Beam Across Background from top right */}
      <div 
        className="absolute top-0 right-0 w-[45vw] h-[150vh] pointer-events-none z-0 opacity-60"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 245, 230, 0.35) 50%, transparent 100%)",
          animation: "bgLightSweep 14s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        }}
      />

      {/* Floating Golden Dust Ambient Particles */}
      <HeroDustParticles />

      {/* Volumetric Spotlight Rays & Warm Radiance */}
      <div className="absolute inset-0 max-h-screen pointer-events-none overflow-hidden" style={{ zIndex: 0 }} suppressHydrationWarning>
        <div 
          className="absolute inset-0 mix-blend-screen volumetric-ray"
          style={{
            animation: "spotlightBreathe 8s ease-in-out infinite alternate",
            background: `conic-gradient(from calc(180deg + var(--ray-angle, 42.5deg)) at 68% -5vh, 
                rgba(255, 248, 225, 0.78) 0deg, 
                rgba(255, 240, 210, 0.50) 15deg, 
                rgba(255, 235, 195, 0.25) 26deg, 
                rgba(255, 250, 235, 0) 38deg,
                rgba(255, 250, 235, 0) 322deg, 
                rgba(255, 235, 195, 0.25) 334deg, 
                rgba(255, 240, 210, 0.50) 345deg, 
                rgba(255, 248, 225, 0.78) 360deg
              )`,
            WebkitMaskImage: "radial-gradient(ellipse 110% 85% at 68% -5vh, black 20%, rgba(0, 0, 0, 0.85) 55%, transparent 82%)",
            maskImage: "radial-gradient(ellipse 110% 85% at 68% -5vh, black 20%, rgba(0, 0, 0, 0.85) 55%, transparent 82%)"
          }}
        />
        {/* Warm Golden Source Spotlight Glow */}
        <div 
          className="absolute top-[-5vh] left-[68%] -translate-x-1/2 w-[45%] aspect-square rounded-full opacity-85 mix-blend-screen"
          style={{
            background: "radial-gradient(circle at 50% 0%, rgba(255, 248, 225, 0.82) 0%, rgba(248, 222, 172, 0.45) 40%, transparent 70%)",
            filter: "blur(32px)",
          }}
        />

        {/* Secondary Centered Ambient Spotlight Highlight */}
        <div 
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[850px] h-[550px] rounded-full opacity-45 mix-blend-screen pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(255, 248, 225, 0.55) 0%, rgba(248, 222, 172, 0.20) 50%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Warm Golden Halo Rim Highlight around the Bottle with Subtle Parallax */}
      <div 
        className="absolute top-[50%] sm:top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[540px] rounded-full pointer-events-none mix-blend-screen z-0"
        style={{
          background: "radial-gradient(circle, rgba(248, 222, 172, 0.35) 0%, rgba(212, 175, 55, 0.14) 45%, transparent 75%)",
          filter: "blur(38px)",
          transform: "translate(calc(-50% + var(--parallax-x, 0px)), calc(-50% + var(--parallax-y, 0px)))",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          animation: "spotlightBreathe 7s ease-in-out infinite alternate"
        }}
      />
      
      {/* 1. Background Layers: Giant Watermark Engraved Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
        <div className="absolute w-full px-2 sm:px-4 text-center z-0 select-none opacity-100 -translate-y-[8vh] sm:-translate-y-[6vh] md:-translate-y-[7vh] hero-fade-enter" suppressHydrationWarning>
          <div className="inline-block text-center relative max-w-full overflow-hidden">
            <h1 
              className="murakkaz-hero-title font-serif-title font-semibold tracking-[0.02em] uppercase text-center leading-none select-none max-w-full shrink-0" 
              suppressHydrationWarning
              style={{ 
                fontFamily: "var(--font-playfair), Georgia, serif",
                background: "linear-gradient(180deg, #D4B890 0%, #BA9C72 45%, #9E8158 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0px 2px 3px rgba(255, 252, 242, 0.6)) drop-shadow(0px -1px 2px rgba(40, 25, 12, 0.35))"
              }}
            >
              MURAKKAZ
            </h1>

            {/* Subtext: Refined luxury typography */}
            <p 
              className="hidden sm:block absolute left-1/2 md:left-[4.5%] top-[100%] mt-3 sm:mt-5 md:mt-7 -translate-x-1/2 md:translate-x-0 font-serif-text text-[#3a3530] text-[13px] md:text-[14.5px] max-w-[320px] md:max-w-[340px] leading-[1.8] md:leading-[1.9] tracking-[0.04em] text-center md:text-left pointer-events-auto z-30 font-normal hero-fade-enter"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", animationDelay: "200ms" }}
              suppressHydrationWarning
            >
              Handpicked and crafted by Murakkaz, inspired by the world&apos;s most iconic fragrances.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Layer: Floating Transparent WebM Video with Synchronized Base Shadow */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full px-4 pt-1 sm:pt-4 pb-0" suppressHydrationWarning>
        <div 
          className="relative h-[44vh] sm:h-[56vh] md:h-[68vh] lg:h-[76vh] xl:h-[82vh] max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-190px)] lg:max-h-[calc(100vh-150px)] aspect-[9/16] transition-transform duration-500 hover:scale-[1.04] pointer-events-none flex flex-col items-center justify-center"
          style={{
            animation: "bottlePerpetualFloat 7s ease-in-out infinite alternate",
            transform: "translate(calc(var(--parallax-x, 0px) * 0.5), calc(var(--bottle-base-y, 2vh) + var(--parallax-y, 0px) * 0.5))",
            willChange: "transform"
          }}
          suppressHydrationWarning
        >
          <video
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-contain relative z-10 mix-blend-screen bg-transparent"
            style={{ mixBlendMode: "screen", backgroundColor: "transparent" }}
            suppressHydrationWarning
          >
            <source src="/videos/BottleAnimation.webm" type="video/webm" />
            <source src="/videos/bottleAnimation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Real Ground Shadow Effect: Tight Contact Shadow + Soft Ambient Shadow under the bottle base */}
          {/* 1. Soft Ambient Ground Shadow */}
          <div 
            className="absolute top-[82%] left-[48.5%] w-[64%] sm:w-[56%] h-[20px] sm:h-[26px] rounded-[50%] pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(20, 12, 7, 0.55) 0%, rgba(35, 20, 10, 0.22) 55%, transparent 88%)",
              filter: "blur(9px)",
              animation: "bottleShadowPulse 7s ease-in-out infinite alternate",
            }}
          />
          {/* 2. Dark Sharp Contact Shadow right where bottle base ends */}
          <div 
            className="absolute top-[80.5%] left-[48.5%] w-[44%] sm:w-[38%] h-[12px] sm:h-[16px] rounded-[50%] pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(10, 6, 3, 0.85) 0%, rgba(25, 14, 6, 0.40) 50%, transparent 85%)",
              filter: "blur(4px)",
              animation: "bottleShadowPulse 7s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>

      {/* 3. Action Buttons & Statistics Panel */}
      <div className="w-full z-30 mt-auto flex flex-col items-center justify-center pointer-events-auto pb-0 gap-2.5 sm:gap-4 hero-fade-enter" style={{ animationDelay: "350ms" }} suppressHydrationWarning>
        {/* CTA Buttons in lower-center area */}
        <div className="w-full mb-1 sm:mb-2 lg:mb-3 flex justify-center">
          <HeroActions />
        </div>

        {/* Infinite Fragrance Brand Ticker running along the very bottom */}
        <div className="w-full mt-1 mb-0">
          <BrandTicker />
        </div>
      </div>
    </section>
  );
}
