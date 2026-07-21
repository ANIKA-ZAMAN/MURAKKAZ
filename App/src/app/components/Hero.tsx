"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./homepage.module.css";
import PremiumStats from "./PremiumStats";
import BrandTicker from "./BrandTicker";

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
    <div className="flex flex-col items-center justify-center gap-5 mt-2 pointer-events-auto z-30" suppressHydrationWarning>
      {/* Primary CTA + Search Bar Row */}
      <div className="flex items-center justify-center gap-3.5">
        {/* 1. Primary Luxury CTA Button */}
        <Link
          href="/shop"
          className="group relative inline-flex items-center justify-center min-w-[210px] sm:min-w-[220px] px-12 h-12 rounded-full border border-[#B8A082]/70 bg-gradient-to-r from-[#FAF6F0] via-[#EFE6D8] to-[#E2D4BF] text-[#313134] font-serif-text text-[13.5px] font-medium tracking-[0.14em] uppercase shadow-[0_4px_20px_rgba(49,49,52,0.08)] transition-all duration-350 ease-out hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(184,160,130,0.45)] hover:border-[#820011]/40 overflow-hidden select-none shrink-0 text-center"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          {/* Subtle light sweep shimmer effect on hover */}
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%] pointer-events-none" />
          <span className="relative z-10 w-full text-center pl-[0.14em]">Shop Now</span>
        </Link>

        {/* 2. Expandable Luxury Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => {
            if (!searchQuery && document.activeElement?.tagName !== "INPUT") {
              setIsExpanded(false);
            }
          }}
          onClick={() => setIsExpanded(true)}
          className={`relative flex items-center h-12 rounded-full border border-[#B8A082]/70 bg-gradient-to-r from-[#FAF6F0]/90 via-[#EFE6D8]/90 to-[#E2D4BF]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(49,49,52,0.06)] transition-all duration-500 ease-out overflow-hidden ${
            isExpanded || searchQuery 
              ? "w-64 px-5.5 shadow-[0_8px_25px_rgba(184,160,130,0.35)] border-[#820011]/30" 
              : "w-12 justify-center cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(184,160,130,0.3)]"
          }`}
          suppressHydrationWarning
        >
          <button
            type="submit"
            className="flex items-center justify-center w-5 h-5 text-[#313134] hover:text-[#820011] transition-colors outline-none border-none bg-transparent cursor-pointer shrink-0"
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
              className="text-[#6e675d] hover:text-[#820011] text-xs px-1.5 py-1 cursor-pointer shrink-0 ml-1 mr-3.5 transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {/* Secondary Text Links (Find Your Fragrance → & Compare Perfumes →) */}
      <div className="flex items-center gap-7 mt-1.5" suppressHydrationWarning>
        <Link
          href="/scent-index"
          className="group relative font-serif-text text-[13px] font-medium tracking-[0.08em] text-[#3d3832] transition-colors duration-300 hover:text-[#820011] inline-flex items-center gap-1.5 after:block after:absolute after:bottom-[-2px] after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#820011] after:transition-all after:duration-300 ease-out"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          <span>Find Your Fragrance</span>
          <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-[#820011]">→</span>
        </Link>

        <span className="text-[#B8A082]/50 text-xs font-serif-text">•</span>

        <Link
          href="/compare"
          className="group relative font-serif-text text-[13px] font-medium tracking-[0.08em] text-[#3d3832] transition-colors duration-300 hover:text-[#820011] inline-flex items-center gap-1.5 after:block after:absolute after:bottom-[-2px] after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#820011] after:transition-all after:duration-300 ease-out"
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          <span>Compare Perfumes</span>
          <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-[#820011]">→</span>
        </Link>
      </div>
    </div>
  );
}

export default function Hero() {
  const [lightStyle, setLightStyle] = useState<'sunbeams' | 'spotlight' | 'off'>('spotlight');

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden bg-transparent pt-20 pb-0 select-none" suppressHydrationWarning>
      
      {/* Responsive Conic Ray Angle Style Block */}
      <style suppressHydrationWarning>{`
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

      {/* Background Volumetric Light Ray & Glow (Option 1 & 2) */}
      {lightStyle !== 'off' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} suppressHydrationWarning>
          <div 
            className="absolute inset-0 opacity-55 mix-blend-screen volumetric-ray"
            style={{
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
              WebkitMaskImage: "radial-gradient(circle at 68% -5vh, black 15%, rgba(0, 0, 0, 0.8) 45%, transparent 145%)",
              maskImage: "radial-gradient(circle at 68% -5vh, black 15%, rgba(0, 0, 0, 0.8) 45%, transparent 145%)"
            }}
          />
          {/* Soft ambient source glow */}
          <div 
            className="absolute top-[-5vh] left-[68%] -translate-x-1/2 w-[40%] aspect-square rounded-full opacity-55 mix-blend-screen"
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(255, 250, 235, 0.45) 0%, rgba(255, 250, 235, 0) 70%)",
              filter: "blur(35px)",
            }}
          />
        </div>
      )}

      {/* Foreground Volumetric Light Ray Overlay (crosses on top of the bottle animation video) */}
      {lightStyle !== 'off' && (
        <div 
          className="fixed inset-0 pointer-events-none overflow-hidden" 
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
              opacity: 0.48,
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
              WebkitMaskImage: "radial-gradient(circle at 68% -5vh, black 15%, rgba(0, 0, 0, 0.8) 45%, transparent 145%)",
              maskImage: "radial-gradient(circle at 68% -5vh, black 15%, rgba(0, 0, 0, 0.8) 45%, transparent 145%)"
            }}
          />
        </div>
      )}
      
      {/* Soft vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, transparent 65%, rgba(47, 9, 9, 0.05) 100%)",
          zIndex: 1
        }}
      />

      {/* Gentle ambient glow around the bottle area */}
      <div 
        className="absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[580px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(197, 168, 128, 0.12) 0%, rgba(197, 168, 128, 0.02) 65%, transparent 100%)",
          filter: "blur(40px)",
          zIndex: 0
        }}
      />
      
      {/* 1. Background Layers: Giant Watermark Typography (No gold circle) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
        <div className="absolute w-full text-center z-0 select-none opacity-100 -translate-y-[6vh]" suppressHydrationWarning>
          <div className="inline-block text-center relative">
            <h1 
              className="font-serif-title font-normal tracking-[0.04em] uppercase text-[#BB9E78] text-[12vw] leading-none select-none text-center" 
              suppressHydrationWarning
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              MURAKKAZ
            </h1>

            {/* 1. Subtext: Refined luxury typography and line height */}
            <p 
              className="hidden md:block absolute left-[4.5%] top-[100%] mt-6 font-serif-text text-[#3a3530] text-[14px] md:text-[14.5px] max-w-[360px] leading-[1.8] text-left pointer-events-auto z-30 font-normal"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", letterSpacing: "0.03em" }}
              suppressHydrationWarning
            >
              Handpicked and crafted by Murkkaz, inspired by the world&apos;s most iconic fragrances.
            </p>

          </div>
        </div>
      </div>

      {/* 2. Middle Layer: Floating Transparent WebM Video (No loop, no entry transition animation) */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full px-4 pt-4 pb-0" suppressHydrationWarning>
        <div 
          className="relative h-[58vh] sm:h-[70vh] md:h-[80vh] max-h-[calc(100vh-290px)] aspect-[9/16] transition-transform duration-500 hover:scale-[1.05] pointer-events-none translate-y-[5.5vh]"
          suppressHydrationWarning
        >
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
            suppressHydrationWarning
          >
            <source src="/videos/BottleAnimation.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* 3. Foreground Layer: Centered Action Buttons, Stats Bar & Brand Ticker */}
      <div className="w-full z-30 mt-auto flex flex-col items-center justify-center pointer-events-auto pb-0 gap-0" suppressHydrationWarning>
        <HeroActions />
        <PremiumStats />
        <div className="w-full mt-1 mb-0">
          <BrandTicker />
        </div>
      </div>
    </section>
  );
}
