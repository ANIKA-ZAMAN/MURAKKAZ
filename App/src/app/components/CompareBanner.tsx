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
        <Link href="/compare" className={styles.ctaButton} suppressHydrationWarning>
          <span className={styles.buttonShimmer} />
          <span className={styles.ctaText}>Compare Perfumes</span>
          <span className={styles.ctaArrow}>→</span>
        </Link>
      </div>
    </section>
  );
}
