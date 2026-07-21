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
    <div className="flex items-center justify-center gap-3 mt-4 pointer-events-auto z-30" suppressHydrationWarning>
      {/* 1. Shop Now Button (Exact match with Picture 1 spec) */}
      <Link
        href="/shop"
        className="inline-flex items-center justify-center px-7 h-11 rounded-[12px] border border-[#4a453e] bg-transparent text-[#313134] font-serif-text text-[14.5px] font-medium tracking-wide transition-all duration-300 hover:bg-[#313134] hover:text-[#F5F1E8] hover:shadow-md select-none shrink-0"
        style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
        suppressHydrationWarning
      >
        Shop Now
      </Link>

      {/* 2. Expandable Search Bar (Exact match with Picture 2 right pink mark) */}
      <form
        onSubmit={handleSearchSubmit}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          if (!searchQuery) setIsExpanded(false);
        }}
        className={`relative flex items-center h-11 rounded-[12px] border border-[#4a453e] bg-transparent transition-all duration-500 ease-out overflow-hidden ${
          isExpanded || searchQuery ? "w-64 px-3 bg-[#CBB9A1]/40 backdrop-blur-md shadow-sm" : "w-11 justify-center cursor-pointer"
        }`}
        suppressHydrationWarning
      >
        <button
          type="submit"
          className="flex items-center justify-center text-[#313134] hover:text-[#820011] transition-colors outline-none border-none bg-transparent cursor-pointer shrink-0"
          aria-label="Search Fragrances"
          onClick={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
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
          className={`ml-2 bg-transparent text-[#313134] font-serif-text text-[13.5px] outline-none border-none w-full placeholder:text-[#5f5950] ${
            isExpanded || searchQuery ? "opacity-100 block" : "opacity-0 hidden"
          }`}
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-[#5f5950] hover:text-[#313134] text-xs px-1 cursor-pointer"
          >
            ✕
          </button>
        )}
      </form>
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

            {/* Centered Content Block: Paragraph + Shop Now Button + Expanding Search Bar (Centered under MURAKKAZ) */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[100%] mt-6 w-full max-w-[520px] flex flex-col items-center justify-center text-center pointer-events-auto z-30">
              <p 
                className="font-serif-text text-[#313134] text-[14px] max-w-[400px] leading-relaxed text-center"
                style={{ fontFamily: "var(--font-lora), Georgia, serif", letterSpacing: "0.02em" }}
                suppressHydrationWarning
              >
                Handpicked and crafted by Murkkaz, inspired by the world&apos;s most iconic fragrances.
              </p>
              <HeroActions />
            </div>

          </div>
        </div>
      </div>

      {/* 2. Middle Layer: Floating Transparent WebM Video (No loop, no entry transition animation) */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full px-4 pt-8 pb-2" suppressHydrationWarning>
        <div 
          className="relative h-[64vh] sm:h-[76vh] md:h-[88vh] max-h-[calc(100vh-280px)] aspect-[9/16] transition-transform duration-500 hover:scale-[1.05] pointer-events-none -translate-y-[1.5vh]"
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

      {/* 3. Foreground Layer: Stats Bar & Brand Ticker */}
      <div className="w-full z-20 mt-auto flex flex-col items-center justify-center" suppressHydrationWarning>
        <PremiumStats />
        <BrandTicker />
      </div>
    </section>
  );
}
