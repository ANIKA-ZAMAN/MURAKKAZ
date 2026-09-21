"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "../page.module.css";

export interface PreviewPhotoData {
  url: string;
  title: string;
  location?: string;
  date?: string;
}

interface EventPhotoModalProps {
  photo: PreviewPhotoData | null;
  onClose: () => void;
}

export default function EventPhotoModal({ photo, onClose }: EventPhotoModalProps) {
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className={styles.photoModalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo view: ${photo.title}`}
    >
      <div
        className={styles.photoModalContainer}
        onClick={(e) => e.stopPropagation()}
      >
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
          <Image
            src={photo.url}
            alt={photo.title}
            width={900}
            height={1300}
            priority
            unoptimized
            className={styles.photoModalFullImage}
          />
        </div>

        {/* Bottom Caption Bar */}
        <div className={styles.photoModalCaptionBar}>
          <div className={styles.photoModalTextWrap}>
            <h4 className={styles.photoModalTitle}>{photo.title}</h4>
            {(photo.location || photo.date) && (
              <p className={styles.photoModalSubtitle}>
                {photo.location}
                {photo.location && photo.date ? " • " : ""}
                {photo.date}
              </p>
            )}
          </div>
          <span className={styles.photoModalHint}>Click outside or press Esc to close</span>
        </div>
      </div>
    </div>
  );
}
