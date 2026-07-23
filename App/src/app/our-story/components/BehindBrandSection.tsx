"use client";

import { ourStoryData } from "../../data/ourStoryData";
import styles from "./BehindBrandSection.module.css";

export default function BehindBrandSection() {
  const { behindBrand } = ourStoryData;

  return (
    <section className={styles.section} aria-labelledby="behind-brand-title">
      <h2 id="behind-brand-title" className={styles.heading}>
        {behindBrand.heading}
      </h2>

      {/* 3-Card Grid Matching Reference Image */}
      <div className={styles.cardsGrid}>
        {behindBrand.cards.map((card, i) => (
          <div
            key={card.number}
            className={`${styles.card} ${i === 2 ? styles.cardFullWidth : ""}`}
          >
            <span className={styles.cardNumber}>{card.number}</span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom Tagline */}
      <p className={styles.tagline}>{behindBrand.footerText}</p>
    </section>
  );
}
