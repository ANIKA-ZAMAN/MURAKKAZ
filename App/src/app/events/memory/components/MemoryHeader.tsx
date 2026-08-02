"use client";

import { useRouter } from "next/navigation";
import styles from "../page.module.css";

interface MemoryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function MemoryHeader({ searchQuery, onSearchChange }: MemoryHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/events");
    }
  };

  return (
    <header className={styles.memoryHeaderContainer}>
      {/* Top Circular Back Navigation Button */}
      <button
        type="button"
        className={styles.backBtnCircle}
        onClick={handleBack}
        aria-label="Go back to events"
      >
        <span className={styles.backArrowIcon}>←</span>
      </button>

      {/* Main Page Title */}
      <h1 className={styles.memoryMainTitle}>Murakkaz’s Memory</h1>

      {/* Subtitle Description Paragraph */}
      <p className={styles.memorySubtitleParagraph}>
        This gallery is a living archive of our journey across Bangladesh—from the energy
        of packed campus pop-ups to elite lifestyle exhibitions. Every frame captures a real
        face, a live scent discovery, and the incredible community helping us redefine fine
        fragrances. Revisit our favorite chapters, find yourself in the crowd, and see the
        passion that drives our house forward.
      </p>

      {/* Pill Search Input Bar */}
      <div className={styles.searchPillWrapper}>
        <div className={styles.searchPillBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInputField}
            placeholder="Search the event or place"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search the event or place"
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
