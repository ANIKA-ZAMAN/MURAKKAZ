"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./homepage.module.css";
import { occasionsData as defaultOccasions, OccasionItem } from "@/app/data/occasionsData";

interface ShopByOccasionProps {
  items?: OccasionItem[];
  title?: string;
  subtitle?: string;
}

export default function ShopByOccasion({
  items = defaultOccasions,
  title = "Shop by Occasion",
  subtitle = "Find the perfect silhouette for any moment",
}: ShopByOccasionProps) {
  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionSubtitle}>{subtitle}</p>
        </div>

        <div className={styles.occasionsGrid}>
          {items.map((occ, idx) => (
            <Link
              href={occ.link}
              key={occ.id || idx}
              className={styles.occasionCard}
              style={{ "--delay": `${idx * 180}ms` } as React.CSSProperties}
              suppressHydrationWarning
            >
              <div className={styles.occasionImageContainer}>
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className={styles.occasionImage}
                />
              </div>
              <div className={styles.occasionOverlay}>
                <h3 className={styles.occasionName}>{occ.name}</h3>
                <span className={styles.occasionCta}>Explore Collection &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
