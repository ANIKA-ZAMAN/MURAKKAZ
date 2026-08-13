"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryImages } from "../../data/eventsData";
import styles from "../page.module.css";

export default function EventGallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev < galleryImages.length - 1 ? prev + 1 : 0) : null
    );
  }, []);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev > 0 ? prev - 1 : galleryImages.length - 1) : null
    );
  }, []);

  // Keyboard navigation listener (ArrowRight, ArrowLeft, Escape)
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        nextLightboxImage();
      } else if (e.key === "ArrowLeft") {
        prevLightboxImage();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, nextLightboxImage, prevLightboxImage]);

  return (
    <section className={styles.gallerySection}>
      <div className={styles.galleryMainRow}>
        {/* Left Column: Title, Description & Red Frame Details Button */}
        <div className={styles.galleryLeftCol}>
          <h2 className={styles.galleryPageTitle}>Event Gallery</h2>
          <p className={styles.galleryDescParagraph}>
            Catch the highlights and unforgettable moments from our past events.
            Browse through our created gallery of fragrance showcases, meetups,
            and exclusive product launches across Bangladesh and beyond.
          </p>
          <Link href="/events/memory" className={styles.redFrameDetailsBtn}>
            View More &gt;
          </Link>
        </div>

        {/* Right Column: Staggered 2x2 Masonry Photo Grid */}
        <div className={styles.galleryRightGrid}>
          {galleryImages.slice(0, 4).map((img, idx) => {
            const isWide = idx === 0 || idx === 3;
            return (
              <Link
                key={idx}
                href="/events/memory"
                className={`${styles.masonryPhotoCard} ${
                  isWide ? styles.masonryCardWide : styles.masonryCardCompact
                }`}
              >
                <div className={styles.photoWrap}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={styles.masonryImg}
                  />
                  {/* Category Pill Badge */}
                  <span className={styles.photoCategoryBadge}>
                    {img.category || "EXHIBITION"}
                  </span>
                  {/* Bottom Text Overlay */}
                  <div className={styles.photoOverlayGradient}>
                    <h4 className={styles.photoCardTitle}>{img.title}</h4>
                    {img.location && (
                      <p className={styles.photoCardMeta}>{img.location}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal with Next / Prev Scroll Navigation */}
      {lightboxIndex !== null && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className={styles.lightboxModal} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={closeLightbox}
              aria-label="Close Lightbox"
            >
              ✕
            </button>

            {/* Photo Slide Container */}
            <div className={styles.lightboxImageWrap}>
              <Image
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                fill
                className={styles.lightboxImg}
                priority
              />

              {/* Previous Photo Scroll Button */}
              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavPrev}`}
                onClick={prevLightboxImage}
                aria-label="Previous Photo"
              >
                ‹
              </button>

              {/* Next Photo Scroll Button */}
              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavNext}`}
                onClick={nextLightboxImage}
                aria-label="Next Photo"
              >
                ›
              </button>

              {/* Slide Counter Indicator (e.g. 1 / 4) */}
              <span className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {galleryImages.length}
              </span>
            </div>

            {/* Caption Info */}
            <div className={styles.lightboxCaption}>
              <span className={styles.lightboxCategory}>
                {galleryImages[lightboxIndex].category}
              </span>
              <h3 className={styles.lightboxTitle}>
                {galleryImages[lightboxIndex].title}
              </h3>
              {galleryImages[lightboxIndex].location && (
                <p className={styles.lightboxSub}>
                  {galleryImages[lightboxIndex].location}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
