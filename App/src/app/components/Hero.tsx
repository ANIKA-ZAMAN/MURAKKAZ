"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PremiumStats from "./PremiumStats";
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

/* Floating Golden Dust Particles Component */
function HeroDustParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" suppressHydrationWarning>
      {dustParticlesData.map((p, idx) => (
        <span
          key={idx}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: "radial-gradient(circle, #D4AF37 0%, #C5A880 70%, transparent 100%)",
            boxShadow: "0 0 6px rgba(212, 175, 55, 0.6)",
            opacity: p.opacity,
            animation: `goldDustFloat ${p.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/* Primary CTA Buttons Component - Unchanged styling as requested */
function HeroActions() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-4 pointer-events-auto z-30 px-2 sm:px-3 w-full" suppressHydrationWarning>
      {/* Primary CTA + Search Bar Row */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-full">
        {/* 1. Primary Luxury CTA Button */}
        <Link
          href="/shop"
          className="group relative inline-flex items-center justify-center min-w-[170px] sm:min-w-[230px] lg:min-w-[270px] px-5 sm:px-8 lg:px-10 h-[44px] sm:h-[50px] lg:h-[56px] rounded-full border-2 border-[#B8965C] bg-transparent text-[#313134] font-serif-text text-[11px] sm:text-[12.5px] lg:text-[13px] font-medium tracking-[0.14em] sm:tracking-[0.18em] lg:tracking-[0.2em] uppercase transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) hover:-translate-y-[4px] hover:scale-[1.025] hover:bg-gradient-to-r hover:from-[#FDFBF7] hover:via-[#F6EEDF] hover:to-[#E9D9C3] hover:shadow-[0_14px_32px_rgba(184,150,92,0.45),0_0_20px_rgba(197,168,128,0.35)] hover:border-[#A8864C] active:scale-[0.96] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/75 to-transparent transition-all duration-800 ease-in-out group-hover:left-[100%] pointer-events-none" />
          <span className="relative z-10 w-full flex items-center justify-center gap-2 pl-[0.1em]">
            <span>Shop Collection</span>
            <span className="inline-block transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) group-hover:translate-x-2 text-[#B8965C]">→</span>
          </span>
        </Link>

        {/* 2. Search Expand Button */}
        <form
          onSubmit={handleSearchSubmit}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => {
            if (!searchQuery && document.activeElement?.tagName !== "INPUT") {
              setIsExpanded(false);
            }
          }}
          onClick={() => setIsExpanded(true)}
          className={`group relative flex items-center h-[44px] sm:h-[50px] lg:h-[56px] rounded-full border-2 border-[#B8965C] bg-transparent text-[#313134] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden ${
            isExpanded || searchQuery 
              ? "w-48 sm:w-56 lg:w-64 px-4 sm:px-5.5 bg-gradient-to-r from-[#FDFBF7] via-[#F6EEDF] to-[#E9D9C3] shadow-[0_14px_32px_rgba(184,150,92,0.45)] border-[#A8864C]" 
              : "w-[44px] sm:w-[50px] lg:w-[56px] justify-center cursor-pointer hover:-translate-y-[4px] hover:scale-[1.05] hover:bg-gradient-to-r hover:from-[#FDFBF7] hover:via-[#F6EEDF] hover:to-[#E9D9C3] hover:shadow-[0_14px_32px_rgba(184,150,92,0.45),0_0_20px_rgba(197,168,128,0.35)] hover:border-[#A8864C] active:scale-[0.96] active:translate-y-0"
          }`}
          suppressHydrationWarning
        >
          <button
            type="submit"
            className="flex items-center justify-center w-5 h-5 text-[#313134] group-hover:scale-120 hover:text-[#B8965C] transition-all duration-400 outline-none border-none bg-transparent cursor-pointer shrink-0"
            aria-label="Search Fragrances"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <input
            type="text"
            placeholder="Search any perfume..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => {
              if (!searchQuery) setIsExpanded(false);
            }}
            className={`ml-2 sm:ml-3 bg-transparent text-[#313134] font-serif-text text-[12px] sm:text-[13.5px] font-medium outline-none border-none w-full placeholder:text-[#6e675d]/80 ${
              isExpanded || searchQuery ? "opacity-100 block" : "opacity-0 hidden"
            }`}
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
              }}
              className="text-[#6e675d] hover:text-[#B8965C] text-xs px-1.5 py-1 cursor-pointer shrink-0 ml-1 mr-2 transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Secondary Actions: Find Your Fragrance + Compare Perfumes */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 mt-1 sm:mt-2 lg:mt-4 max-w-full" suppressHydrationWarning>
        <Link
          href="/scent-index"
          className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 h-[42px] sm:h-[48px] lg:h-[56px] min-w-[145px] sm:min-w-[220px] lg:min-w-[280px] px-3.5 sm:px-8 lg:px-12 rounded-xl sm:rounded-2xl border-2 border-[#B8965C] bg-transparent text-[#313134] font-serif-text text-[10.5px] sm:text-[12px] lg:text-[13px] font-medium tracking-[0.06em] sm:tracking-[0.12em] uppercase transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) hover:-translate-y-[4px] hover:scale-[1.025] hover:bg-gradient-to-r hover:from-[#FDFBF7] hover:via-[#F6EEDF] hover:to-[#E9D9C3] hover:shadow-[0_14px_32px_rgba(184,150,92,0.45),0_0_20px_rgba(197,168,128,0.35)] hover:border-[#A8864C] active:scale-[0.96] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-all duration-800 ease-in-out group-hover:left-[100%] pointer-events-none rounded-2xl" />
          <span className="relative z-10">Find Your Fragrance</span>
          <span className="relative z-10 inline-block transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) group-hover:translate-x-2 text-[#B8965C]">→</span>
        </Link>

        <Link
          href="/compare"
          className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 h-[42px] sm:h-[48px] lg:h-[56px] min-w-[145px] sm:min-w-[220px] lg:min-w-[280px] px-3.5 sm:px-8 lg:px-12 rounded-xl sm:rounded-2xl border-2 border-[#B8965C] bg-transparent text-[#313134] font-serif-text text-[10.5px] sm:text-[12px] lg:text-[13px] font-medium tracking-[0.06em] sm:tracking-[0.12em] uppercase transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) hover:-translate-y-[4px] hover:scale-[1.025] hover:bg-gradient-to-r hover:from-[#FDFBF7] hover:via-[#F6EEDF] hover:to-[#E9D9C3] hover:shadow-[0_14px_32px_rgba(184,150,92,0.45),0_0_20px_rgba(197,168,128,0.35)] hover:border-[#A8864C] active:scale-[0.96] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-all duration-800 ease-in-out group-hover:left-[100%] pointer-events-none rounded-2xl" />
          <span className="relative z-10">Compare Perfumes</span>
          <span className="relative z-10 inline-block transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) group-hover:translate-x-2 text-[#B8965C]">→</span>
        </Link>
      </div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const { clientX, clientY } = e;
    const x = ((clientX / window.innerWidth) - 0.5) * 6; // 3px max shift
    const y = ((clientY / window.innerHeight) - 0.5) * 6;
    
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
      className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden bg-transparent pt-2 sm:pt-4 pb-0 select-none" 
      suppressHydrationWarning
    >
      {/* Global CSS for Animations */}
      <style suppressHydrationWarning>{`
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
          0%, 100% { transform: translateY(2vh) rotate(0deg); }
          50% { transform: translateY(calc(2vh - 8px)) rotate(0.6deg); }
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
            --ray-angle: 13.8deg !important;
          }
        }
        @media (min-width: 769px) {
          .volumetric-ray {
            --ray-angle: 37.8deg !important;
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

      {/* Enhanced Visible Volumetric Spotlight Rays & Glow */}
      <div className="absolute inset-0 max-h-screen pointer-events-none overflow-hidden" style={{ zIndex: 0 }} suppressHydrationWarning>
        <div 
          className="absolute inset-0 mix-blend-screen volumetric-ray"
          style={{
            animation: "spotlightBreathe 8s ease-in-out infinite alternate",
            background: `conic-gradient(from calc(180deg + var(--ray-angle, 37.8deg)) at 68% -5vh, 
                rgba(255, 248, 225, 0.78) 0deg, 
                rgba(255, 240, 210, 0.48) 12deg, 
                rgba(255, 235, 195, 0.22) 20deg, 
                rgba(255, 250, 235, 0) 30deg,
                rgba(255, 250, 235, 0) 330deg, 
                rgba(255, 235, 195, 0.22) 340deg, 
                rgba(255, 240, 210, 0.48) 348deg, 
                rgba(255, 248, 225, 0.78) 360deg
              )`,
            WebkitMaskImage: "radial-gradient(ellipse 95% 75% at 68% -5vh, black 15%, rgba(0, 0, 0, 0.85) 45%, transparent 75%)",
            maskImage: "radial-gradient(ellipse 95% 75% at 68% -5vh, black 15%, rgba(0, 0, 0, 0.85) 45%, transparent 75%)"
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

      {/* Grounding Contact Shadow positioned directly under bottle base */}
      <div 
        className="absolute top-[52%] sm:top-[55%] md:top-[63%] lg:top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] sm:w-[240px] h-[34px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(25, 15, 10, 0.40) 0%, rgba(30, 20, 15, 0.12) 50%, transparent 85%)",
          filter: "blur(8px)",
          zIndex: 5
        }}
      />
      
      {/* 1. Background Layers: Giant Watermark Engraved Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
        <div className="absolute w-full px-2 sm:px-4 text-center z-0 select-none opacity-100 -translate-y-[6vh] sm:-translate-y-[7vh] hero-fade-enter" suppressHydrationWarning>
          <div className="inline-block text-center relative max-w-full overflow-hidden">
            <h1 
              className="font-serif-title font-semibold tracking-[0.02em] uppercase text-center leading-none select-none max-w-full shrink-0" 
              suppressHydrationWarning
              style={{ 
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(3.8rem, 16.8vw, 12rem)",
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
              Handpicked and crafted by Murkkaz, inspired by the world&apos;s most iconic fragrances.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Layer: Floating Transparent WebM Video with Perpetual Gentle Float */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full px-4 pt-1 sm:pt-4 pb-0" suppressHydrationWarning>
        <div 
          className="relative h-[40vh] sm:h-[54vh] md:h-[68vh] lg:h-[78vh] max-h-[calc(100vh-230px)] aspect-[9/16] transition-transform duration-500 hover:scale-[1.04] pointer-events-none translate-y-[2vh]"
          style={{
            animation: "bottlePerpetualFloat 7s ease-in-out infinite alternate",
            transform: "translate(calc(var(--parallax-x, 0px) * 0.5), calc(2vh + var(--parallax-y, 0px) * 0.5))",
            willChange: "transform"
          }}
          suppressHydrationWarning
        >
          <video
            autoPlay
            muted
            playsInline
            onEnded={(e) => {
              e.currentTarget.pause();
            }}
            className="w-full h-full object-contain"
            suppressHydrationWarning
          >
            <source src="/videos/BottleAnimation.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* 3. Action Buttons & Statistics Panel */}
      <div className="w-full z-30 mt-auto flex flex-col items-center justify-center pointer-events-auto pb-0 gap-2.5 sm:gap-4 hero-fade-enter" style={{ animationDelay: "350ms" }} suppressHydrationWarning>
        {/* CTA Buttons in lower-center area */}
        <div className="w-full mb-1 sm:mb-2 lg:mb-3 flex justify-center">
          <HeroActions />
        </div>

        {/* Premium Statistics Stack positioned on the bottom right as designed */}
        <PremiumStats />

        {/* Infinite Fragrance Brand Ticker running along the very bottom */}
        <div className="w-full mt-1 mb-0">
          <BrandTicker />
        </div>
      </div>
    </section>
  );
}
