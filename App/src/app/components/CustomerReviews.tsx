"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./CustomerReviews.module.css";
import { reviewsData as defaultReviews, Review } from "@/app/data/reviewsData";

interface CustomerReviewsProps {
  items?: Review[];
  title?: string;
  subtitle?: string;
}

export default function CustomerReviews({
  items = defaultReviews,
  title = "Customer Reviews",
  subtitle = "Words from our fragrance collectors",
}: CustomerReviewsProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const total = items.length;

  // Continuous Auto-play interval (4s)
  useEffect(() => {
    if (isPaused || total === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  const handlePrev = () => {
    if (total === 0) return;
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    if (total === 0) return;
    setCurrent((prev) => (prev + 1) % total);
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Continuous 3D conveyor positioning logic
  const getCardPositionStyle = (idx: number) => {
    let offset = idx - current;
    if (offset < -Math.floor(total / 2)) offset += total;
    if (offset > Math.floor(total / 2)) offset -= total;

    if (offset === 0) {
      return {
        transform: "translateX(0%) scale(1) translateZ(0px)",
        opacity: 1,
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    } else if (offset === 1) {
      return {
        transform: "translateX(58%) scale(0.88) translateZ(-40px)",
        opacity: 0.55,
        zIndex: 5,
        pointerEvents: "auto" as const,
      };
    } else if (offset === -1) {
      return {
        transform: "translateX(-58%) scale(0.88) translateZ(-40px)",
        opacity: 0.55,
        zIndex: 5,
        pointerEvents: "auto" as const,
      };
    } else if (offset === 2) {
      return {
        transform: "translateX(110%) scale(0.76) translateZ(-80px)",
        opacity: 0,
        zIndex: 2,
        pointerEvents: "none" as const,
      };
    } else if (offset === -2) {
      return {
        transform: "translateX(-110%) scale(0.76) translateZ(-80px)",
        opacity: 0,
        zIndex: 2,
        pointerEvents: "none" as const,
      };
    } else {
      const direction = offset > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 150}%) scale(0.70) translateZ(-120px)`,
        opacity: 0,
        zIndex: 1,
        pointerEvents: "none" as const,
      };
    }
  };

  const formatNumber = (num: number) => (num < 9 ? `0${num + 1}` : `${num + 1}`);

  return (
    <section className={styles.section} suppressHydrationWarning>
      {/* Ambient Spotlight & Vignette Glow */}
      <div className={styles.spotlightGlow} />
      <div className={styles.vignetteOverlay} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionSubtitle}>{subtitle}</p>
        </div>

        {/* Stacked 3D Continuous Conveyor Stage */}
        <div
          className={styles.carouselStage}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((rev, idx) => {
            let offset = idx - current;
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            const isCenter = offset === 0;
            const isSide = offset === -1 || offset === 1;

            return (
              <div
                key={idx}
                className={`${styles.card} ${isCenter ? styles.activeCard : ""} ${isSide ? styles.sideCard : ""}`}
                style={getCardPositionStyle(idx)}
                onClick={() => {
                  if (offset === -1) handlePrev();
                  if (offset === 1) handleNext();
                }}
              >
                <div>
                  {/* Card Header: Perfume Badge & Star Rating */}
                  <div className={styles.cardHeader}>
                    <div className={styles.perfumeBadge}>
                      <span className={styles.perfumeName}>{rev.perfume}</span>
                      <span className={styles.inspiredTag}>{rev.inspired}</span>
                    </div>

                    <div className={styles.starsRow}>
                      {Array.from({ length: rev.stars }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>

                  {/* Quote Body */}
                  <blockquote className={styles.quoteText}>
                    &ldquo;{rev.quote}&rdquo;
                  </blockquote>
                </div>

                <div>
                  {/* Performance Ratings Pills */}
                  <div className={styles.performanceRow}>
                    <span className={styles.perfPill}>
                      <span className={styles.pillIcon}>⏳</span> {rev.longevity}
                    </span>
                    <span className={styles.perfPill}>
                      <span className={styles.pillIcon}>✨</span> {rev.projection}
                    </span>
                    <span className={styles.perfPill}>
                      <span className={styles.pillIcon}>💬</span> {rev.compliments}
                    </span>
                  </div>

                  {/* Author Details Footer */}
                  <div className={styles.authorFooter}>
                    <div className={styles.authorMeta}>
                      <div className={styles.authorAvatar}>
                        {rev.name.charAt(0)}
                      </div>
                      <div className={styles.authorDetails}>
                        <h4 className={styles.authorName}>{rev.name}</h4>
                        <span className={styles.verifiedBadge}>
                          <span className={styles.verifiedCheck}>✓</span> {rev.verified}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circular Navigation Buttons & Progress Counter */}
        <div className={styles.controlsRow}>
          <button
            className={styles.navButton}
            onClick={handlePrev}
            aria-label="Previous Review"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className={styles.progressCounter}>
            <span className={styles.currentNum}>{formatNumber(current)}</span>
            <span className={styles.totalNum}> / {formatNumber(total - 1)}</span>
          </div>

          <button
            className={styles.navButton}
            onClick={handleNext}
            aria-label="Next Review"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
