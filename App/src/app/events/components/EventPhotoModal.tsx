"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import styles from "../page.module.css";
import { getEventImageMeta } from "../../data/eventsData";

export interface PreviewPhotoData {
  url: string;
  title: string;
  location?: string;
  date?: string;
  images?: string[];
  initialIndex?: number;
}

interface EventPhotoModalProps {
  photo: PreviewPhotoData | null;
  onClose: () => void;
}

export default function EventPhotoModal({ photo, onClose }: EventPhotoModalProps) {
  const images = photo?.images && photo.images.length > 0 
    ? photo.images 
    : (photo?.url ? [photo.url] : []);

  const [activeIndex, setActiveIndex] = useState(photo?.initialIndex || 0);

  useEffect(() => {
    if (photo && photo.initialIndex !== undefined) {
      setActiveIndex(photo.initialIndex);
    } else {
      setActiveIndex(0);
    }
  }, [photo]);

  const nextPhoto = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const prevPhoto = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        nextPhoto();
      } else if (e.key === "ArrowLeft") {
        prevPhoto();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, onClose, nextPhoto, prevPhoto]);

  if (!photo || images.length === 0) return null;

  const currentSrc = images[activeIndex] || photo.url;
  const currentMeta = getEventImageMeta(currentSrc, photo.title);

  return (
    <div
      className={styles.photoModalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo view: ${currentMeta.title}`}
    >
      <div
        className={styles.photoModalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Counter Badge */}
        {images.length > 1 && (
          <div className={styles.photoModalCounterBadge}>
            Photo {activeIndex + 1} of {images.length}
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          className={styles.photoModalCloseBtn}
          onClick={onClose}
          aria-label="Close photo preview"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Photo Viewport */}
        <div className={styles.photoModalImageFrame}>
          {images.length > 1 && (
            <button
              type="button"
              className={`${styles.photoModalNavArrow} ${styles.photoModalNavPrev}`}
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          <Image
            key={currentSrc}
            src={currentSrc}
            alt={currentMeta.title}
            width={900}
            height={1300}
            priority
            unoptimized
            className={styles.photoModalFullImage}
          />

          {images.length > 1 && (
            <button
              type="button"
              className={`${styles.photoModalNavArrow} ${styles.photoModalNavNext}`}
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>

        {/* Thumbnail Selector Strip if multiple images */}
        {images.length > 1 && (
          <div className={styles.photoModalThumbStrip}>
            {images.map((imgSrc, i) => {
              const meta = getEventImageMeta(imgSrc);
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  className={`${styles.photoModalThumbBtn} ${isActive ? styles.photoModalThumbActive : ""}`}
                  onClick={() => setActiveIndex(i)}
                  title={meta.shortLabel}
                >
                  <div className={styles.photoModalThumbImgWrap}>
                    <Image
                      src={imgSrc}
                      alt={meta.shortLabel || `Thumbnail ${i + 1}`}
                      fill
                      unoptimized
                      className={styles.photoModalThumbImg}
                    />
                  </div>
                  <span className={styles.photoModalThumbLabel}>{meta.shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Caption Bar */}
        <div className={styles.photoModalCaptionBar}>
          <div className={styles.photoModalTextWrap}>
            <h4 className={styles.photoModalTitle}>{currentMeta.title}</h4>
            {(currentMeta.subtitle || photo.location || photo.date) && (
              <p className={styles.photoModalSubtitle}>
                {currentMeta.subtitle || [photo.location, photo.date].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>
          <span className={styles.photoModalHint}>Use ‹ › keys to flip • Click outside or Esc to close</span>
        </div>
      </div>
    </div>
  );
}
