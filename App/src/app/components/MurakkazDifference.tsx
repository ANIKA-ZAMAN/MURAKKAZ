"use client";

import styles from "./homepage.module.css";

export default function MurakkazDifference() {
  const points = [
    {
      title: "Inspired by Iconic Fragrances",
      desc: "Carefully matching the scent profile of history's most renowned creations, bringing premium luxury within reach.",
      icon: (
        <svg className="w-8 h-8 text-[#820011]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
        </svg>
      )
    },
    {
      title: "Premium Ingredients",
      desc: "Formulated using only high-grade, responsibly sourced essential oils and fine raw aromatics from across the globe.",
      icon: (
        <svg className="w-8 h-8 text-[#820011]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18C8.5 7.5 4 12 4 12s4.5 4.5 8 9m0-18c3.5 4.5 8 9 8 9s-4.5 4.5-8 9" />
        </svg>
      )
    },
    {
      title: "Long Lasting Performance",
      desc: "Formulated as high-concentration Extraits de Parfum to ensure outstanding projection, sillage, and all-day longevity.",
      icon: (
        <svg className="w-8 h-8 text-[#820011]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Crafted with Care",
      desc: "Each bottle is hand-poured, quality-checked, and packaged in small batches to preserve consistency and olfactory purity.",
      icon: (
        <svg className="w-8 h-8 text-[#820011]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
        </svg>
      )
    }
  ];

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>The Murakkaz Difference</h2>
          <p className={styles.sectionSubtitle}>Standard of excellence in every bottle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--border-gold)] rounded-xl p-8 flex flex-col items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              suppressHydrationWarning
            >
              <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-full flex items-center justify-center">
                {pt.icon}
              </div>
              <h3 className="font-serif-title font-medium text-lg text-[var(--foreground)]">{pt.title}</h3>
              <p className="font-serif-text text-sm text-neutral-500 leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
