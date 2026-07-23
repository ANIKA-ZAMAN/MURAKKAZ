"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./homepage.module.css";
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
    <div className="flex flex-col items-center justify-center gap-4.5 -translate-y-14 sm:-translate-y-[64px] pointer-events-auto z-30" suppressHydrationWarning>
      {/* Primary CTA + Search Bar Row */}
      <div className="flex items-center justify-center gap-4">
        {/* 1. Primary Luxury CTA Button with Sliding Arrow & Subtle Pulse Glow */}
        <Link
          href="/shop"
          className="group relative inline-flex items-center justify-center min-w-[250px] sm:min-w-[270px] px-10 h-[56px] rounded-full border border-[#C5A880] bg-gradient-to-r from-[#FDFBF7] via-[#F6EEDF] to-[#E9D9C3] text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.2em] uppercase shadow-[0_8px_28px_rgba(49,49,52,0.08)] transition-all duration-500 ease-out hover:-translate-y-[3px] hover:shadow-[0_16px_36px_rgba(197,168,128,0.45)] hover:border-[#B8965C] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
          style={{ 
            fontFamily: "var(--font-lora), Georgia, serif",
            animation: "ctaPulseGlow 5s ease-in-out infinite alternate"
          }}
          suppressHydrationWarning
        >
          {/* Shimmer light sweep on hover */}
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%] pointer-events-none" />
          <span className="relative z-10 w-full flex items-center justify-center gap-2.5 pl-[0.2em]">
            <span>Shop Collection</span>
            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-2 text-[#B8965C]">→</span>
          </span>
        </Link>

        {/* 2. Search Button (Perfect Height & Design System Match) */}
        <form
          onSubmit={handleSearchSubmit}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => {
            if (!searchQuery && document.activeElement?.tagName !== "INPUT") {
              setIsExpanded(false);
            }
          }}
          onClick={() => setIsExpanded(true)}
          className={`group relative flex items-center h-[56px] rounded-full border border-[#C5A880] bg-gradient-to-r from-[#FDFBF7]/95 via-[#F6EEDF]/95 to-[#E9D9C3]/95 backdrop-blur-md shadow-[0_8px_28px_rgba(49,49,52,0.08)] transition-all duration-500 ease-out overflow-hidden ${
            isExpanded || searchQuery 
              ? "w-64 px-5.5 shadow-[0_14px_32px_rgba(197,168,128,0.4)] border-[#B8965C]" 
              : "w-[56px] justify-center cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_16px_36px_rgba(197,168,128,0.45)] hover:border-[#B8965C] active:scale-[0.97] active:translate-y-0"
          }`}
          suppressHydrationWarning
        >
          <button
            type="submit"
            className="flex items-center justify-center w-5 h-5 text-[#313134] group-hover:scale-115 hover:text-[#B8965C] transition-all duration-400 outline-none border-none bg-transparent cursor-pointer shrink-0"
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
            className={`ml-3 bg-transparent text-[#313134] font-serif-text text-[13.5px] font-medium outline-none border-none w-full placeholder:text-[#6e675d]/80 ${
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
              className="text-[#6e675d] hover:text-[#B8965C] text-xs px-1.5 py-1 cursor-pointer shrink-0 ml-1 mr-3.5 transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Secondary Actions: Equalized Dimensions & Smooth Hover Lift */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4" suppressHydrationWarning>
        {/* Button 1: Find Your Fragrance */}
        <Link
          href="/scent-index"
          className="group relative inline-flex items-center justify-center gap-3 h-[56px] min-w-[260px] sm:min-w-[280px] px-10 sm:px-12 rounded-2xl border border-[#C5A880]/80 bg-gradient-to-r from-[#FDFBF7]/95 via-[#F6EEDF]/95 to-[#E9D9C3]/95 backdrop-blur-md text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.12em] uppercase shadow-[0_6px_22px_rgba(49,49,52,0.07)] transition-all duration-500 ease-out hover:-translate-y-[3px] hover:shadow-[0_14px_32px_rgba(197,168,128,0.4)] hover:border-[#B8965C] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          {/* Subtle light sweep shimmer on hover */}
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%] pointer-events-none rounded-2xl" />
          <span className="relative z-10">Find Your Fragrance</span>
          <span className="relative z-10 inline-block transition-transform duration-400 ease-out group-hover:translate-x-1.5 text-[#B8965C]">→</span>
        </Link>

        {/* Button 2: Compare Perfumes */}
        <Link
          href="/compare"
          className="group relative inline-flex items-center justify-center gap-3 h-[56px] min-w-[260px] sm:min-w-[280px] px-10 sm:px-12 rounded-2xl border border-[#C5A880]/80 bg-gradient-to-r from-[#FDFBF7]/95 via-[#F6EEDF]/95 to-[#E9D9C3]/95 backdrop-blur-md text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.12em] uppercase shadow-[0_6px_22px_rgba(49,49,52,0.07)] transition-all duration-500 ease-out hover:-translate-y-[3px] hover:shadow-[0_14px_32px_rgba(197,168,128,0.4)] hover:border-[#B8965C] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          {/* Subtle light sweep shimmer on hover */}
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%] pointer-events-none rounded-2xl" />
          <span className="relative z-10">Compare Perfumes</span>
          <span className="relative z-10 inline-block transition-transform duration-400 ease-out group-hover:translate-x-1.5 text-[#B8965C]">→</span>
        </Link>
      </div>
    </div>
  );
}

export default function Hero() {
  const [lightStyle, setLightStyle] = useState<'sunbeams' | 'spotlight' | 'off'>('spotlight');
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window === "undefined") return;
    const { clientX, clientY } = e;
    const x = ((clientX / window.innerWidth) - 0.5) * 6; // 3px max shift
    const y = ((clientY / window.innerHeight) - 0.5) * 6;
    setParallax({ x, y });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden bg-transparent pt-20 pb-0 select-none" 
      suppressHydrationWarning
    >
      
      {/* Global CSS for GPU Animations */}
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
          0%, 100% { opacity: 0.48; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.02); }
        }
        @keyframes bottlePerpetualFloat {
          0%, 100% { transform: translateY(2vh) rotate(0deg); }
          50% { transform: translateY(calc(2vh - 8px)) rotate(0.6deg); }
        }
        @keyframes heroTextFadeIn {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaPulseGlow {
          0%, 100% { box-shadow: 0 8px 28px rgba(49, 49, 52, 0.08), 0 0 0 0 rgba(197, 168, 128, 0); }
          50% { box-shadow: 0 12px 32px rgba(197, 168, 128, 0.28), 0 0 18px 2px rgba(197, 168, 128, 0.35); }
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


      {/* Animated Light Sweep Beam Across Background every 14 seconds */}
      <div 
        className="absolute top-0 left-0 w-[40vw] h-[150vh] pointer-events-none z-0"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 245, 230, 0.22) 50%, transparent 100%)",
          animation: "bgLightSweep 14s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        }}
      />

      {/* Floating Golden Dust Ambient Particles */}
      <HeroDustParticles />

      {/* Background Volumetric Light Ray & Glow (Constrained to bottle height with breathing animation) */}
      {lightStyle !== 'off' && (
        <div className="absolute inset-0 max-h-screen pointer-events-none overflow-hidden" style={{ zIndex: 0 }} suppressHydrationWarning>
          <div 
            className="absolute inset-0 mix-blend-screen volumetric-ray"
            style={{
              animation: "spotlightBreathe 8s ease-in-out infinite alternate",
              background: lightStyle === 'sunbeams'
                ? `conic-gradient(from calc(180deg + var(--ray-angle, 37.8deg)) at 68% -5vh, 
                    rgba(255, 250, 235, 0.48) 0deg, rgba(255, 250, 235, 0.26) 2deg, rgba(255, 250, 235, 0) 4deg,
                    rgba(255, 250, 235, 0) 10deg, rgba(255, 250, 235, 0.26) 12.5deg, rgba(255, 250, 235, 0.35) 14deg, rgba(255, 250, 235, 0.26) 15.5deg, rgba(255, 250, 235, 0) 18deg,
                    rgba(255, 250, 235, 0) 342deg, rgba(255, 250, 235, 0.26) 344.5deg, rgba(255, 250, 235, 0.35) 346deg, rgba(255, 250, 235, 0.26) 347.5deg, rgba(255, 250, 235, 0) 350deg,
                    rgba(255, 250, 235, 0) 356deg, rgba(255, 250, 235, 0.26) 358deg, rgba(255, 250, 235, 0.48) 360deg
                  )`
                : `conic-gradient(from calc(180deg + var(--ray-angle, 37.8deg)) at 68% -5vh, 
                    rgba(255, 250, 235, 0.52) 0deg, rgba(255, 250, 235, 0.28) 12deg, rgba(255, 250, 235, 0) 25deg,
                    rgba(255, 250, 235, 0) 335deg, rgba(255, 250, 235, 0.28) 348deg, rgba(255, 250, 235, 0.52) 360deg
                  )`,
              WebkitMaskImage: "radial-gradient(ellipse 90% 62% at 68% -5vh, black 10%, rgba(0, 0, 0, 0.75) 35%, transparent 60%)",
              maskImage: "radial-gradient(ellipse 90% 62% at 68% -5vh, black 10%, rgba(0, 0, 0, 0.75) 35%, transparent 60%)"
            }}
          />
          {/* Soft ambient source glow */}
          <div 
            className="absolute top-[-5vh] left-[68%] -translate-x-1/2 w-[40%] aspect-square rounded-full opacity-60 mix-blend-screen"
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(255, 250, 235, 0.50) 0%, rgba(255, 250, 235, 0) 70%)",
              filter: "blur(35px)",
            }}
          />
        </div>
      )}

      {/* Foreground Volumetric Light Ray Overlay (Terminates at bottle base) */}
      {lightStyle !== 'off' && (
        <div 
          className="absolute inset-0 max-h-screen pointer-events-none overflow-hidden" 
          style={{ 
            zIndex: 15, 
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)"
          }} 
          suppressHydrationWarning
        >
          <div 
            className="absolute inset-0 mix-blend-screen volumetric-ray"
            style={{
              animation: "spotlightBreathe 8s ease-in-out infinite alternate",
              background: lightStyle === 'sunbeams'
                ? `conic-gradient(from calc(180deg + var(--ray-angle, 37.8deg)) at 68% -5vh, 
                    rgba(255, 250, 235, 0.44) 0deg, rgba(255, 250, 235, 0.24) 2deg, rgba(255, 250, 235, 0) 4deg,
                    rgba(255, 250, 235, 0) 10deg, rgba(255, 250, 235, 0.24) 12.5deg, rgba(255, 250, 235, 0.32) 14deg, rgba(255, 250, 235, 0.24) 15.5deg, rgba(255, 250, 235, 0) 18deg,
                    rgba(255, 250, 235, 0) 342deg, rgba(255, 250, 235, 0.24) 344.5deg, rgba(255, 250, 235, 0.32) 346deg, rgba(255, 250, 235, 0.24) 347.5deg, rgba(255, 250, 235, 0) 350deg,
                    rgba(255, 250, 235, 0) 356deg, rgba(255, 250, 235, 0.24) 358deg, rgba(255, 250, 235, 0.44) 360deg
                  )`
                : `conic-gradient(from calc(180deg + var(--ray-angle, 37.8deg)) at 68% -5vh, 
                    rgba(255, 250, 235, 0.48) 0deg, rgba(255, 250, 235, 0.25) 12deg, rgba(255, 250, 235, 0) 25deg,
                    rgba(255, 250, 235, 0) 335deg, rgba(255, 250, 235, 0.25) 348deg, rgba(255, 250, 235, 0.48) 360deg
                  )`,
              WebkitMaskImage: "radial-gradient(ellipse 90% 62% at 68% -5vh, black 10%, rgba(0, 0, 0, 0.7) 35%, transparent 60%)",
              maskImage: "radial-gradient(ellipse 90% 62% at 68% -5vh, black 10%, rgba(0, 0, 0, 0.7) 35%, transparent 60%)"
            }}
          />
        </div>
      )}
      


      {/* Ambient Depth Shadow behind bottle separating it from MURAKKAZ typography */}
      <div 
        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[520px] rounded-full pointer-events-none opacity-30 z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(30, 20, 15, 0.45) 0%, rgba(40, 25, 15, 0.15) 50%, transparent 80%)",
          filter: "blur(42px)",
        }}
      />

      {/* Warm Golden Halo Rim Highlight around the Bottle with Subtle Parallax */}
      <div 
        className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[540px] rounded-full pointer-events-none mix-blend-screen z-0"
        style={{
          background: "radial-gradient(circle, rgba(248, 222, 172, 0.35) 0%, rgba(212, 175, 55, 0.14) 45%, transparent 75%)",
          filter: "blur(38px)",
          transform: `translate(calc(-50% + ${parallax.x}px), calc(-50% + ${parallax.y}px))`,
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          animation: "spotlightBreathe 7s ease-in-out infinite alternate"
        }}
      />

      {/* Grounding Contact Shadow positioned directly under bottle base */}
      <div 
        className="absolute top-[67%] sm:top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[36px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(25, 15, 10, 0.35) 0%, rgba(30, 20, 15, 0.10) 50%, transparent 85%)",
          filter: "blur(8px)",
          zIndex: 5
        }}
      />
      
      {/* 1. Background Layers: Giant Watermark Engraved Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
        <div className="absolute w-full text-center z-0 select-none opacity-100 -translate-y-[6vh] hero-fade-enter" suppressHydrationWarning>
          <div className="inline-block text-center relative">
            <h1 
              className="font-serif-title font-normal tracking-[0.04em] uppercase text-[12vw] leading-none select-none text-center" 
              suppressHydrationWarning
              style={{ 
                fontFamily: "var(--font-playfair), Georgia, serif",
                background: "linear-gradient(180deg, #D4B890 0%, #BA9C72 45%, #9E8158 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0px 1.5px 2px rgba(255, 252, 242, 0.55)) drop-shadow(0px -1px 2px rgba(40, 25, 12, 0.30))"
              }}
            >
              MURAKKAZ
            </h1>

            {/* Subtext: Refined luxury typography */}
            <p 
              className="hidden md:block absolute left-[4.5%] top-[100%] mt-7 font-serif-text text-[#3a3530] text-[14px] md:text-[14.5px] max-w-[340px] leading-[1.9] tracking-[0.04em] text-left pointer-events-auto z-30 font-normal hero-fade-enter"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", animationDelay: "200ms" }}
              suppressHydrationWarning
            >
              Handpicked and crafted by Murkkaz, inspired by the world&apos;s most iconic fragrances.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Layer: Floating Transparent WebM Video with Perpetual Gentle Float */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full px-4 pt-4 pb-0" suppressHydrationWarning>
        <div 
          className="relative h-[58vh] sm:h-[70vh] md:h-[80vh] max-h-[calc(100vh-270px)] aspect-[9/16] transition-transform duration-500 hover:scale-[1.04] pointer-events-none translate-y-[2vh]"
          style={{
            animation: "bottlePerpetualFloat 7s ease-in-out infinite alternate",
            transform: `translate(${parallax.x * 0.5}px, calc(2vh + ${parallax.y * 0.5}px))`,
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

      {/* 3. Horizontal Statistics Cards (Pinned on the right side of Hero Section) */}
      <PremiumStats />

      {/* 4. Foreground Layer: Centered Action Buttons & Brand Ticker */}
      <div className="w-full z-30 mt-auto flex flex-col items-center justify-center pointer-events-auto pb-0 gap-0 hero-fade-enter" style={{ animationDelay: "350ms" }} suppressHydrationWarning>
        <HeroActions />
        <div className="w-full mt-1 mb-0">
          <BrandTicker />
        </div>
      </div>
    </section>
  );
}


