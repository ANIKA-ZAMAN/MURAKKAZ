"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./FindYourFragrance.module.css";

export default function FindYourFragrance() {
  return (
    <section className={styles.sectionContainer} suppressHydrationWarning>
      <div className={styles.splitWrapper}>
        {/* Left Column: Text & Editorial CTA Link */}
        <div className={styles.textContent}>
          <span className={styles.kicker}>SIGNATURE SCENT CONSULTATION</span>

          <h2 className={styles.title}>
            DISCOVER YOUR SCENT
          </h2>

          <p className={styles.description}>
            Allow our bespoke consultation to guide you through a refined selection of fragrances, thoughtfully matched to your lifestyle, memories, and personal aesthetic.
          </p>

          <div className={styles.metaRow}>
            <span>8 Questions</span>
            <span className={styles.dot}>·</span>
            <span>2 Minutes</span>
            <span className={styles.dot}>·</span>
            <span>Top 3 Matches</span>
          </div>

          <Link 
            href="/scent-index" 
            className="group relative inline-flex items-center justify-center gap-2.5 h-[44px] sm:h-[48px] min-w-[210px] sm:min-w-[250px] px-8 sm:px-10 rounded-xl sm:rounded-2xl border border-[#313134] bg-transparent text-[#1c1b18] text-[13px] sm:text-[14.5px] font-medium tracking-[0.08em] sm:tracking-[0.12em] uppercase transition-all duration-300 hover:bg-black/5 select-none text-center" 
            style={{ fontFamily: "var(--font-ibm-plex-serif), Georgia, serif" }}
            suppressHydrationWarning
          >
            <span className="relative z-10">Begin Consultation</span>
            <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1 text-[#1c1b18]">→</span>
          </Link>
        </div>

        {/* Right Column: Editorial Lifestyle Product Image */}
        <div className={styles.imageColumn}>
          <div className={styles.imageFrame}>
            <Image
              src="/images/scent-finder-discovery.jpg"
              alt="Murakkaz Scent Discovery Collection"
              width={800}
              height={600}
              className={styles.editorialImage}
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
