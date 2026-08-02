"use client";

import { MemoryPhoto, MemorySectionData } from "../../../data/memoryData";
import MemoryCard from "./MemoryCard";
import styles from "../page.module.css";

interface MemorySectionProps {
  section: MemorySectionData;
  onPhotoClick: (photo: MemoryPhoto, index: number) => void;
}

export default function MemorySection({ section, onPhotoClick }: MemorySectionProps) {
  if (!section.photos || section.photos.length === 0) return null;

  return (
    <section className={styles.memorySectionGroup} aria-label={section.title}>
      {/* Section Date/Title Header */}
      <div className={styles.sectionHeaderRow}>
        <h2 className={styles.sectionTitle}>{section.title}</h2>
      </div>

      {/* 3-Column Responsive Grid */}
      <div className={styles.memoryGrid}>
        {section.photos.map((photo, idx) => (
          <MemoryCard
            key={photo.id}
            photo={photo}
            onClick={() => onPhotoClick(photo, idx)}
          />
        ))}
      </div>
    </section>
  );
}
