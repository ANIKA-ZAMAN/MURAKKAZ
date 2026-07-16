"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./homepage.module.css";

export default function Hero() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [lightStyle, setLightStyle] = useState<'sunbeams' | 'spotlight' | 'off'>('spotlight');

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
        className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[580px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(197, 168, 128, 0.12) 0%, rgba(197, 168, 128, 0.02) 65%, transparent 100%)",
          filter: "blur(40px)",
          zIndex: 0
        }}
      />
      
      {/* 1. Background Layers: Giant Watermark Typography (No gold circle) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden" suppressHydrationWarning>
        <div className="absolute w-full text-center z-0 select-none opacity-100 -translate-y-[6vh]" suppressHydrationWarning>
          <div className="inline-block text-left relative">
            <h1 
              className="font-serif-title font-normal tracking-[0.04em] uppercase text-[#BB9E78] text-[12vw] leading-none select-none" 
              suppressHydrationWarning
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              MURAKKAZ
            </h1>
            <p 
              className="hidden md:block absolute left-[4.5%] top-[100%] mt-6 font-serif-text text-[#313134] text-[13.5px] max-w-[340px] leading-loose text-left pointer-events-auto"
              style={{ fontFamily: "var(--font-lora), Georgia, serif", letterSpacing: "0.02em" }}
              suppressHydrationWarning
            >
              Handpicked and crafted by Murkkaz, inspired by the world&apos;s most iconic fragrances.
            </p>
          </div>
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
      <div className="w-full max-w-[1348px] mx-auto px-6 flex flex-col md:grid md:grid-cols-3 items-center justify-between gap-6 md:gap-0 z-20 pb-10" suppressHydrationWarning>
        {/* Left Column: Description subtext */}
        <div className="w-full flex justify-center md:justify-start text-center md:text-left">
          <p 
            className="md:hidden font-serif-text text-[#313134] text-[13.5px] max-w-[300px] leading-relaxed"
            style={{ fontFamily: "var(--font-lora), Georgia, serif", letterSpacing: "0.02em" }}
            suppressHydrationWarning
          >
            Handpicked and crafted by Murkkaz, inspired by the world&apos;s most iconic fragrances.
          </p>
        </div>

        {/* Middle Column: Centered Shop Collection Button */}
        <div className="w-full flex flex-col justify-center items-center">
          <Link
            href="/shop"
            suppressHydrationWarning
            onClick={handleClick}
            className={`${styles.heroPrimaryBtn} ${isClicked ? "animate-click-ring" : ""}`}
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
            
            <span className="z-10">
              SHOP COLLECTION
            </span>
          </Link>

          {/* Elegant Divider */}
          <div className={styles.heroDivider}>
            <span className={styles.heroDividerLine} />
            <span className={styles.heroDividerText}>Explore More</span>
            <span className={styles.heroDividerLine} />
          </div>

          {/* Centered Dual Text Links */}
          <div className={styles.heroLinksContainer}>
            <Link
              href="/scent-index"
              className={`group ${styles.heroLink} nav-link-underline`}
              suppressHydrationWarning
            >
              Find Your Perfect Fragrance <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link
              href="/compare"
              className={`group ${styles.heroLink} nav-link-underline`}
              suppressHydrationWarning
            >
              Compare Perfumes <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
        
        {/* Right Column: Empty spacer to balance columns */}
        <div className="hidden md:block w-full"></div>
      </div>
    </section>
  );
}
