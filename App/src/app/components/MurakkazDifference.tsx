"use client";

import styles from "./homepage.module.css";

export default function MurakkazDifference() {
  const points = [
    {
      title: "Inspired by Iconic Fragrances",
      desc: "Carefully matching the scent profile of history's most renowned creations, bringing premium luxury within reach.",
      icon: (
        <svg className={styles.diffIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
        </svg>
      )
    },
    {
      title: "Premium Ingredients",
      desc: "Formulated using only high-grade, responsibly sourced essential oils and fine raw aromatics from across the globe.",
      icon: (
        <svg className={styles.diffIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18C8.5 7.5 4 12 4 12s4.5 4.5 8 9m0-18c3.5 4.5 8 9 8 9s-4.5 4.5-8 9" />
        </svg>
      )
    },
    {
      title: "Long Lasting Performance",
      desc: "Formulated as high-concentration Extraits de Parfum to ensure outstanding projection, sillage, and all-day longevity.",
      icon: (
        <svg className={styles.diffIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Crafted with Care",
      desc: "Each bottle is hand-poured, quality-checked, and packaged in small batches to preserve consistency and olfactory purity.",
      icon: (
        <svg className={styles.diffIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg>
      )
    }
  ];

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>OUR PHILOSOPHY</span>
          <h2 className={styles.sectionTitle}>The Murakkaz Difference</h2>
          <p className={styles.sectionSubtitle}>Standard of excellence in every bottle</p>
        </div>

        <div className={styles.diffGrid}>
          {points.map((pt, idx) => (
            <div
              key={idx}
              className={styles.diffCard}
              style={{ "--delay": `${idx * 180}ms` } as React.CSSProperties}
              suppressHydrationWarning
            >
              <div className={styles.diffIconWrapper}>
                {pt.icon}
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
