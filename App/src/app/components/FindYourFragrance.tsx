"use client";

import Link from "next/link";
import styles from "./homepage.module.css";

export default function FindYourFragrance() {
  return (
    <section className={`${styles.section} ${styles.quizSection}`} suppressHydrationWarning>
      <div className={styles.quizRadialGlow} />
      <div className={`${styles.container} ${styles.quizContainer}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>SIGNATURE CONSULTATION</span>
          <h2 className={styles.sectionTitle}>Find Your Signature Fragrance</h2>
          <div className={styles.quizHeaderDivider} />
          <p className={styles.sectionSubtitle}>Your journey to signature discovery starts here</p>
        </div>
        
        <p className={styles.quizDesc}>
          Answer a few refined questions about your lifestyle, memories, and personal aesthetic to discover the Murakkaz creation that best complements your identity.
        </p>

        <div className={styles.quizButtonWrapper}>
          <Link href="/scent-index" className={styles.primaryButton} suppressHydrationWarning>
            Start the Quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
