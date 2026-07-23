"use client";

import Link from "next/link";
import styles from "./CompareBanner.module.css";

/* Deterministic Fragrance Note Particles for Consistent Hydration */
const particlesData = [
  { size: 2.2, left: 18, top: 25, delay: 0 },
  { size: 1.6, left: 78, top: 32, delay: 2.5 },
  { size: 2.8, left: 35, top: 72, delay: 1.2 },
  { size: 1.8, left: 85, top: 68, delay: 3.8 },
  { size: 2.4, left: 24, top: 60, delay: 4.5 },
  { size: 1.4, left: 65, top: 20, delay: 1.8 },
];

export default function CompareBanner() {
  return (
    <section className={styles.section} suppressHydrationWarning>
      {/* 1. Subtle Warm Ambient Spotlight Glow */}
      <div className={styles.spotlightGlow} />

      {/* 2. Floating Fragrance Note Ambient Particles */}
      <div className={styles.particlesOverlay}>
        {particlesData.map((p, i) => (
          <span
            key={i}
            className={styles.particle}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 3. Main Editorial Content Container */}
      <div className={styles.container}>
        {/* Elegant Gold Flourish Divider */}
        <div className={styles.flourishDivider}>
          <span className={styles.flourishLine} />
          <span className={styles.flourishDiamond}>◆</span>
          <span className={styles.flourishLine} />
        </div>

        {/* Cinematic Headline */}
        <h2 className={styles.heading}>
          Can&apos;t decide between two fragrances?
        </h2>

        {/* Refined Description */}
        <p className={styles.description}>
          Compare perfumes side by side before choosing your signature scent. Analyze their olfactory profiles, longevity, and key notes side by side.
        </p>

        {/* Exclusive Luxury CTA Button */}
        <Link 
          href="/compare" 
          className="group relative inline-flex items-center justify-center min-w-[240px] sm:min-w-[265px] px-10 h-[54px] rounded-full border-2 border-[#B8965C] bg-transparent text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ease-out hover:-translate-y-[3px] hover:bg-gradient-to-r hover:from-[#FAF6F0] hover:via-[#F3E8D8] hover:to-[#E2D2BC] hover:shadow-[0_14px_32px_rgba(184,150,92,0.4)] hover:border-[#A8864C] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center" 
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          suppressHydrationWarning
        >
          {/* Shimmer light sweep on hover */}
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%] pointer-events-none" />
          <span className="relative z-10 w-full flex items-center justify-center gap-2.5 pl-[0.2em]">
            <span>Compare Perfumes</span>
            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 text-[#B8965C]">→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
