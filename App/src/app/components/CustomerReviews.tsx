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
  subtitle = "Words from our valuable customers",
}: CustomerReviewsProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    src: string;
    title: string;
    facebookUrl?: string;
    isVideo?: boolean;
  } | null>(null);
  const [isInView, setIsInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const reviewItems = items || defaultReviews;
  const total = reviewItems.length;

  // Viewport Intersection Observer (pause animation when off-screen to save CPU/battery)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ESC Key Listener to close photo lightbox
  useEffect(() => {
    if (!lightboxPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxPhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxPhoto]);

  // Auto-play interval (5.5s) — runs ONLY when in viewport and not paused
  useEffect(() => {
    if (isPaused || !isInView || total === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, isInView, total]);

  if (total === 0) return null;

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

    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;

    if (offset === 0) {
      return {
        transform: "translateX(0%) scale(1) translateZ(0px)",
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    } else if (offset === 1) {
      return {
        transform: isSmallScreen ? "translateX(105%) scale(0.88)" : "translateX(58%) scale(0.9) translateZ(-40px)",
        opacity: isSmallScreen ? 0 : 0.55,
        filter: isSmallScreen ? "blur(0px)" : "blur(2px)",
        zIndex: 5,
        pointerEvents: "auto" as const,
      };
    } else if (offset === -1) {
      return {
        transform: isSmallScreen ? "translateX(-105%) scale(0.88)" : "translateX(-58%) scale(0.9) translateZ(-40px)",
        opacity: isSmallScreen ? 0 : 0.55,
        filter: isSmallScreen ? "blur(0px)" : "blur(2px)",
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
    <section ref={sectionRef} className={styles.section} suppressHydrationWarning>
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
          {reviewItems.map((rev, idx) => {
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

                  {/* Quote Body with See More / See Less toggle */}
                  {(() => {
                    const cardKey = rev.id || String(idx);
                    const isExpanded = expandedCardId === cardKey;
                    const isLongQuote = rev.quote.length > 115;

                    return (
                      <div className={styles.quoteWrap}>
                        <blockquote
                          className={`${styles.quoteText} ${
                            isExpanded ? styles.quoteExpanded : ""
                          }`}
                        >
                          &ldquo;{rev.quote}&rdquo;
                        </blockquote>
                        {isLongQuote && (
                          <button
                            type="button"
                            className={styles.seeMoreBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCardId(isExpanded ? null : cardKey);
                            }}
                          >
                            {isExpanded ? "See less ▲" : "See more ▼"}
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Review Photo Attachment Thumbnail */}
                  {rev.photo && (
                    <div
                      className={styles.reviewPhotoWrap}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxPhoto({
                          src: rev.photo!,
                          title: `${rev.name}'s Perfume Review Photo`,
                          facebookUrl: rev.facebookUrl,
                          isVideo: rev.isVideo,
                        });
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="View full review photo"
                    >
                      <img
                        src={rev.photo}
                        alt={`${rev.name} perfume review`}
                        className={styles.reviewPhotoImg}
                      />
                      <span className={styles.photoZoomBadge}>🔍 Click to enlarge</span>
                    </div>
                  )}
                </div>

                <div>
                  {/* Author Details Footer */}
                  <div className={styles.authorFooter}>
                    <div className={styles.authorMeta}>
                      <div className={styles.authorAvatar}>
                        {rev.avatar ? (
                          <img src={rev.avatar} alt={rev.name} className={styles.avatarImg} />
                        ) : (
                          <span>{rev.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className={styles.authorDetails}>
                        <h4 className={styles.authorName}>{rev.name}</h4>
                      </div>
                    </div>

                    {rev.facebookUrl && (
                      <a
                        href={rev.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.fbReviewBtn}
                        onClick={(e) => e.stopPropagation()}
                        title={rev.isVideo ? "Watch on Facebook" : "View on Facebook"}
                      >
                        {rev.isVideo ? (
                          <svg className={styles.fbBtnIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        ) : (
                          <svg className={styles.fbBtnIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        )}
                        <span>{rev.isVideo ? "Watch on Facebook" : "View on Facebook"}</span>
                        <svg className={styles.fbExternalArrow} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
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

      {/* Full Photo Lightbox Overlay Modal */}
      {lightboxPhoto && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxPhoto(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close photo"
            >
              ✕
            </button>
            <img src={lightboxPhoto.src} alt={lightboxPhoto.title} className={styles.fullPhotoImg} />
            <div className={styles.lightboxFooterRow}>
              <p className={styles.lightboxCaption}>{lightboxPhoto.title}</p>
              {lightboxPhoto.facebookUrl && (
                <a
                  href={lightboxPhoto.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.lightboxFbBtn}
                >
                  {lightboxPhoto.isVideo ? "Watch on Facebook ↗" : "View on Facebook ↗"}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
