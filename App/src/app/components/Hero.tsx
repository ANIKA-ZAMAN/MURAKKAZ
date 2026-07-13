"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [lightStyle, setLightStyle] = useState<'sunbeams' | 'spotlight' | 'off'>('sunbeams');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.5;
    
    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };
    
    setRipples((prev) => [...prev, newRipple]);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  return (
    <section className="relative w-full h-[calc(100vh-120px)] flex flex-col justify-between items-center overflow-hidden bg-transparent py-2 select-none" suppressHydrationWarning>
      
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
      
      {/* 1. Background Layers: Giant Watermark Typography (No gold circle) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
        <div className="absolute w-full text-center z-0 select-none opacity-100 -translate-y-[6vh]" suppressHydrationWarning>
          <h1 
            className="font-serif-title font-normal tracking-[0.04em] uppercase text-[#BB9E78] text-[12vw] leading-none select-none" 
            suppressHydrationWarning
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            MURAKKAZ
          </h1>
        </div>
      </div>

      {/* 2. Middle Layer: Floating Transparent WebM Video (No loop, no entry transition animation) */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full px-4 pt-8 pb-2" suppressHydrationWarning>
        <div 
          className="relative h-[64vh] sm:h-[76vh] md:h-[88vh] max-h-[calc(100vh-280px)] aspect-[9/16] transition-transform duration-500 hover:scale-[1.05] pointer-events-none -translate-y-[4vh]"
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

      {/* 3. Foreground Layer: Subtext on bottom left, Button in bottom middle */}
      <div className="w-full max-w-[1348px] mx-auto px-6 flex flex-col md:grid md:grid-cols-3 items-center justify-between gap-6 md:gap-0 z-20 pb-6" suppressHydrationWarning>
        {/* Left Column: Description subtext */}
        <div className="w-full flex justify-center md:justify-start text-center md:text-left">
          <p 
            className="font-serif-text text-neutral-800 text-[13px] sm:text-sm max-w-[280px] sm:max-w-[320px] leading-relaxed"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            suppressHydrationWarning
          >
            Handpicked and crafted by Murkkaz, inspired by the world's most iconic fragrances.
          </p>
        </div>

        {/* Middle Column: Centered Shop Now Button */}
        <div className="w-full flex justify-center items-center">
          <Link
            href="/shop"
            suppressHydrationWarning
            onClick={handleClick}
            className={`group relative flex items-center justify-center bg-transparent border border-[#313134] text-[#313134] hover:bg-[#313134] hover:text-[#F5F1E8] transition-all duration-300 active:scale-[0.97] ease-out select-none overflow-hidden ${
              isClicked ? "animate-click-ring" : ""
            }`}
            style={{ 
              width: "229px", 
              height: "56px",
              borderRadius: "10px",
            }}
          >
            {/* Click Ripple elements */}
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-current opacity-25 animate-ripple pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
            
            {/* Clean, high-performance HTML text */}
            <span className="font-serif-text text-[13.5px] tracking-[0.15em] uppercase font-medium transition-colors duration-300 z-10">
              SHOP NOW
            </span>
          </Link>
        </div>
        
        {/* Right Column: Empty spacer to balance columns */}
        <div className="hidden md:block w-full"></div>
      </div>
      {/* Floating Glassmorphic Light Effect Selector Control Panel */}
      <div 
        className="fixed bottom-6 right-6 bg-[#F5F1E8]/90 border border-[#313134]/30 backdrop-blur-md px-3 py-2 rounded-full shadow-lg flex items-center gap-2 select-none"
        style={{ zIndex: 100000 }}
        suppressHydrationWarning
      >
        <span className="text-[10px] font-sans tracking-widest uppercase font-semibold text-[#313134]/60 px-2">
          Light Effect:
        </span>
        <button
          onClick={() => setLightStyle('sunbeams')}
          className={`text-[10px] font-sans tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
            lightStyle === 'sunbeams' 
              ? 'bg-[#313134] text-[#F5F1E8]' 
              : 'text-[#313134] hover:bg-[#313134]/10'
          }`}
        >
          Sunbeams
        </button>
        <button
          onClick={() => setLightStyle('spotlight')}
          className={`text-[10px] font-sans tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
            lightStyle === 'spotlight' 
              ? 'bg-[#313134] text-[#F5F1E8]' 
              : 'text-[#313134] hover:bg-[#313134]/10'
          }`}
        >
          Spotlight
        </button>
        <button
          onClick={() => setLightStyle('off')}
          className={`text-[10px] font-sans tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
            lightStyle === 'off' 
              ? 'bg-[#313134] text-[#F5F1E8]' 
              : 'text-[#313134] hover:bg-[#313134]/10'
          }`}
        >
          Off
        </button>
      </div>
    </section>
  );
}
