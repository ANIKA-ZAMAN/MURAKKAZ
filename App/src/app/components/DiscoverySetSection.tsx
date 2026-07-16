"use client";

import Link from "next/link";
import styles from "./homepage.module.css";

export default function DiscoverySetSection() {
  return (
    <section className={`${styles.section} ${styles.discoverySection}`} suppressHydrationWarning>
      <div className={`${styles.container} ${styles.discoveryContainer}`}>
        <h2 className={styles.discoveryTitle}>Build Your Discovery Set</h2>
        <p className={styles.discoveryDesc}>
          Choose any five fragrances and discover your signature scent before committing to a full bottle. Poured by hand, packaged with care, and shipped to your door.
        </p>
        <Link href="/shop" className={styles.discoveryBtn} suppressHydrationWarning>
          Build Yours
        </Link>
      </div>
    </section>
  );
}
