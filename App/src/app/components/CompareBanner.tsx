"use client";

import Link from "next/link";
import styles from "./homepage.module.css";

export default function CompareBanner() {
  return (
    <section className={`${styles.section} ${styles.discoverySection}`} suppressHydrationWarning>
      <div className={styles.spotlightGlow} />
      <div className={`${styles.container} ${styles.discoveryContainer}`}>
        <h2 className={styles.discoveryTitle}>Can&apos;t decide between two fragrances?</h2>
        <p className={styles.discoveryDesc}>
          Compare perfumes side by side before choosing your signature scent. Analyze their olfactory profiles, longevity, and key notes side by side.
        </p>
        <Link href="/compare" className={styles.discoveryBtn} suppressHydrationWarning>
          Compare Perfumes
        </Link>
      </div>
    </section>
  );
}
