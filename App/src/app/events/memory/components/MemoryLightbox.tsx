"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { MemoryPhoto } from "../../../data/memoryData";
import styles from "../page.module.css";

interface MemoryLightboxProps {
  photos: MemoryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export default function MemoryLightbox({
  photos,
  activeIndex,
  onClose,
  onSelectIndex,
}: MemoryLightboxProps) {
  const isVisible = activeIndex !== null && photos.length > 0;
  const currentPhoto = isVisible ? photos[activeIndex] : null;

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    onSelectIndex((activeIndex + 1) % photos.length);
  }, [activeIndex, photos.length, onSelectIndex]);

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    onSelectIndex((activeIndex - 1 + photos.length) % photos.length);
  }, [activeIndex, photos.length, onSelectIndex]);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, handleNext, handlePrev, onClose]);

  if (!isVisible || !currentPhoto) return null;

  return (
    <div className={styles.lightboxBackdrop} onClick={onClose}>
      <div
        className={styles.lightboxModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo view: ${currentPhoto.title}`}
      >
        {/* Top Header Bar */}
        <div className={styles.lightboxHeader}>
          <div className={styles.headerInfoGroup}>
            <span className={styles.lightboxBadge}>{currentPhoto.category || "MEMORY"}</span>
            <span className={styles.lightboxCounter}>
              {activeIndex + 1} of {photos.length}
            </span>
          </div>
          <button
            type="button"
            className={styles.lightboxCloseBtn}
            onClick={onClose}
            aria-label="Close photo gallery"
          >
            ✕
          </button>
        </div>

        {/* Main Photo Display Area */}
        <div className={styles.lightboxMainArea}>
          <button
            type="button"
            className={`${styles.lightboxNavBtn} ${styles.lightboxNavPrev}`}
            onClick={handlePrev}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <div className={styles.lightboxImageWrap}>
            <Image
              src={currentPhoto.src}
              alt={currentPhoto.alt || currentPhoto.title}
              fill
              sizes="(max-width: 1200px) 90vw, 1000px"
              className={styles.lightboxImg}
              priority
            />
          </div>

          <button
            type="button"
            className={`${styles.lightboxNavBtn} ${styles.lightboxNavNext}`}
            onClick={handleNext}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>

        {/* Bottom Caption Information */}
        <div className={styles.lightboxCaptionRow}>
          <h3 className={styles.lightboxPhotoTitle}>{currentPhoto.title}</h3>
          {currentPhoto.location && (
            <p className={styles.lightboxPhotoMeta}>
              <span>{currentPhoto.location}</span>
            </p>
          )}
        </div>

        {/* Bottom Thumbnail Navigation Strip */}
        <div className={styles.thumbnailStrip}>
          {photos.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.thumbBtn} ${
                activeIndex === idx ? styles.activeThumbBtn : ""
              }`}
              onClick={() => onSelectIndex(idx)}
              aria-label={`Jump to photo ${idx + 1}`}
            >
              <Image
                src={p.src}
                alt={p.title}
                fill
                sizes="70px"
                className={styles.thumbImg}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
