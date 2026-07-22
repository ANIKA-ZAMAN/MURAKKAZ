"use client";

import styles from "./MurakkazDifference.module.css";
import { differencePointsData, DifferencePoint } from "@/app/data/differenceData";

interface MurakkazDifferenceProps {
  items?: DifferencePoint[];
  title?: string;
  subtitle?: string;
}

export default function MurakkazDifference({
  items = differencePointsData,
  title = "The Murakkaz Difference",
  subtitle = "Standard of excellence in every bottle",
}: MurakkazDifferenceProps) {
  const getIcon = (type: DifferencePoint["iconType"]) => {
    switch (type) {
      case "globe":
        return (
          <svg className={styles.diffIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.35">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
          </svg>
        );
      case "leaf":
        return (
          <svg className={styles.diffIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.35">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18C8.5 7.5 4 12 4 12s4.5 4.5 8 9m0-18c3.5 4.5 8 9 8 9s-4.5 4.5-8 9" />
          </svg>
        );
      case "clock":
        return (
          <svg className={styles.diffIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.35">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "arrow":
      default:
        return (
          <svg className={styles.diffIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.35">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        );
    }
  };

  return (
    <section className={styles.section} suppressHydrationWarning>
      {/* Subtle radial glow behind heading */}
      <div className={styles.headingGlow} />

      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionSubtitle}>{subtitle}</p>
        </div>

        <div className={styles.diffGrid}>
          {items.map((pt, idx) => (
            <div
              key={pt.id || idx}
              className={styles.diffCard}
              style={{ "--delay": `${idx * 180}ms` } as React.CSSProperties}
              suppressHydrationWarning
            >
              {/* Gold Shimmer Sweep across top edge on hover */}
              <div className={styles.cardShimmer} />

              <div className={styles.diffIconWrapper}>
                {getIcon(pt.iconType)}
              </div>
              <h3 className={styles.diffCardTitle}>{pt.title}</h3>
              <p className={styles.diffCardDesc}>{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
