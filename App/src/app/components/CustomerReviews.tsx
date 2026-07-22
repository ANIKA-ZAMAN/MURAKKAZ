"use client";

import { useState } from "react";
import styles from "./homepage.module.css";

export default function CustomerReviews() {
  const [current, setCurrent] = useState(0);

  const reviews = [
    {
      stars: 5,
      quote: "The longevity of Murakkaz Noir is absolutely incredible. It lasted over 12 hours on my skin and the projection was outstanding.",
      name: "Adnan S.",
      meta: "Verified Buyer"
    },
    {
      stars: 5,
      quote: "Jade Serenity is a masterpiece. Clean, elegant, and matches the premium quality of high-end designers.",
      name: "Tasnim R.",
      meta: "Verified Buyer"
    },
    {
      stars: 5,
      quote: "An exquisite fragrance experience. The quiz recommended Coral Sea, and it is exactly what I was looking for.",
      name: "Farhan K.",
      meta: "Verified Buyer"
    }
  ];

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Customer Reviews</h2>
          <p className={styles.sectionSubtitle}>Words from our fragrance collectors</p>
        </div>

        <div className={styles.reviewsCarousel}>
          <div className={styles.reviewCardWrapper}>
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className={styles.reviewCard}
                style={{
                  display: idx === current ? "flex" : "none",
                  opacity: idx === current ? 1 : 0,
                  transform: idx === current ? "scale(1)" : "scale(0.98)",
                }}
              >
                <div className={styles.starsRow}>
                  {Array.from({ length: rev.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <blockquote className={styles.reviewQuote}>
                  &ldquo;{rev.quote}&rdquo;
                </blockquote>
                <div className={styles.reviewerMeta}>
                  <div className={styles.reviewerAvatar}>
                    <div className={styles.reviewerInitials}>
                      {rev.name.charAt(0)}
                    </div>
                  </div>
                  <div className={styles.reviewerInfo}>
                    <h4 className={styles.reviewerName}>{rev.name}</h4>
                    <span className={styles.reviewerVerified}>{rev.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.carouselControls}>
            <button className={styles.carouselBtn} onClick={handlePrev} aria-label="Previous review">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="font-serif-text text-sm text-neutral-400">
              {current + 1} / {reviews.length}
            </span>
            <button className={styles.carouselBtn} onClick={handleNext} aria-label="Next review">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
