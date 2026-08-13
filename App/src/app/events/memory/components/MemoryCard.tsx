"use client";

import Image from "next/image";
import { MemoryPhoto } from "../../../data/memoryData";
import styles from "../page.module.css";

interface MemoryCardProps {
  photo: MemoryPhoto;
  onClick: () => void;
}

export default function MemoryCard({ photo, onClick }: MemoryCardProps) {
  return (
    <div
      className={styles.memoryCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View photo: ${photo.title}`}
    >
      <div className={styles.cardImageWrap}>
        <Image
          src={photo.src}
          alt={photo.alt || photo.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className={styles.cardImg}
        />

        {/* Top Category Badge if present */}
        {photo.category && (
          <span className={styles.cardCategoryBadge}>{photo.category}</span>
        )}

        {/* Dark Gradient Overlay with Title & Location */}
        <div className={styles.cardOverlay}>
          <h3 className={styles.cardTitle}>{photo.title}</h3>
          {photo.location && (
            <p className={styles.cardMeta}>
              <span>{photo.location}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
