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

          <Link href="/scent-index" className={styles.editorialCta} suppressHydrationWarning>
            <span>BEGIN CONSULTATION</span>
            <span className={styles.arrow}>→</span>
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
