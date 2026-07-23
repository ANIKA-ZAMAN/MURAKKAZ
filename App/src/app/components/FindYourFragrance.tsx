"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./FindYourFragrance.module.css";

export default function FindYourFragrance() {
  return (
    <section className={styles.invitationSection} suppressHydrationWarning>
      {/* Soft golden ambient glow behind card */}
      <div className={styles.ambientGlow} />

      {/* Floating invitation card */}
      <div className={styles.cardWrapper}>
        <div className={styles.invitationCard}>
          {/* Murakkaz Logo */}
          <div className={`${styles.logoWrapper} ${styles.slideLeft}`}>
            <Image
              src="/images/logo-murakkaz.svg"
              alt="Murakkaz"
              width={120}
              height={50}
              className={styles.invitationLogo}
            />
          </div>

          {/* Section label */}
          <span className={`${styles.sectionLabel} ${styles.slideLeft}`}>SIGNATURE FINDER</span>

          {/* Heading */}
          <h2 className={`${styles.heading} ${styles.slideLeft}`}>Find Your Perfect Match</h2>

          {/* Description */}
          <p className={`${styles.description} ${styles.slideRight}`}>
            Allow our created consultation to guide you through a refined selection 
            of fragrances, thoughtfully matched to your lifestyle, memories, and 
            personal aesthetic.
          </p>

          {/* Metadata row */}
          <div className={`${styles.metaRow} ${styles.slideRight}`}>
            <span className={styles.metaItem}>
              <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15.5 13.5" />
              </svg>
              <span>2 Minutes</span>
            </span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaItem}>
              <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <span>8 Questions</span>
            </span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaItem}>
              <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Top 3 Recommendations</span>
            </span>
          </div>

          {/* CTA button */}
          <Link 
            href="/scent-index" 
            className="group relative inline-flex items-center justify-center min-w-[240px] sm:min-w-[265px] px-10 h-[54px] rounded-full border-2 border-[#B8965C] bg-transparent text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ease-out hover:-translate-y-[3px] hover:bg-gradient-to-r hover:from-[#FAF6F0] hover:via-[#F3E8D8] hover:to-[#E2D2BC] hover:shadow-[0_14px_32px_rgba(184,150,92,0.4)] hover:border-[#A8864C] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center" 
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            suppressHydrationWarning
          >
            {/* Shimmer light sweep on hover */}
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%] pointer-events-none" />
            <span className="relative z-10 w-full flex items-center justify-center gap-2.5 pl-[0.2em]">
              <span>Begin Consultation</span>
              <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 text-[#B8965C]">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
