"use client";

import Link from "next/link";
import styles from "./FindYourFragrance.module.css";

export default function FindYourFragrance() {
  return (
    <section className={styles.invitationSection} suppressHydrationWarning>
      {/* Soft golden ambient glow behind card */}
      <div className={styles.ambientGlow} />

      {/* Floating invitation card */}
      <div className={styles.cardWrapper}>
        <div className={styles.invitationCard}>
          {/* Embossed wax seal at top */}
          <div className={styles.waxSeal}>
            <div className={styles.sealInner}>
              <span className={styles.sealLetter}>M</span>
            </div>
          </div>

          {/* Decorative top flourish */}
          <div className={styles.flourishLine}>
            <span className={styles.flourishDash} />
            <span className={styles.flourishDiamond}>◆</span>
            <span className={styles.flourishDash} />
          </div>

          {/* Section label */}
          <span className={styles.sectionLabel}>SIGNATURE FINDER</span>

          {/* Heading */}
          <h2 className={styles.heading}>Find Your Perfect Match</h2>

          {/* Description */}
          <p className={styles.description}>
            Allow our curated consultation to guide you through a refined selection 
            of fragrances, thoughtfully matched to your lifestyle, memories, and 
            personal aesthetic.
          </p>

          {/* Metadata row */}
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>2 Minutes</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaItem}>8 Questions</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaItem}>Top 3 Recommendations</span>
          </div>

          {/* CTA button */}
          <Link href="/scent-index" className={styles.ctaButton} suppressHydrationWarning>
            <span className={styles.ctaText}>Begin Consultation</span>
            <span className={styles.ctaArrow}>→</span>
          </Link>

          {/* Bottom flourish */}
          <div className={styles.bottomFlourish}>
            <span className={styles.flourishDash} />
            <span className={styles.flourishDiamond}>◆</span>
            <span className={styles.flourishDash} />
          </div>
        </div>
      </div>
    </section>
  );
}
