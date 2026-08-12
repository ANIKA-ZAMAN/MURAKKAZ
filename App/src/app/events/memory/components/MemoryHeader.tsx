"use client";

import { useRouter } from "next/navigation";
import styles from "../page.module.css";

interface MemoryHeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function MemoryHeader({ searchQuery = "", onSearchChange }: MemoryHeaderProps) {
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
        <svg
          className={styles.backSvgIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* Main Page Title centered with signature Murakkaz Red & Deep Charcoal */}
      <h1 className={styles.memoryMainTitle}>
        <span className={styles.brandRed}>Murakkaz</span>
        <span className={styles.brandDark}>’s Memory</span>
      </h1>

      {/* Subtitle Description Paragraph centered */}
      <p className={styles.memorySubtitleParagraph}>
        This gallery is a living archive of our journey across Bangladesh—from the energy
        of packed campus pop-ups to elite lifestyle exhibitions. Every frame captures a real
        face, a live scent discovery, and the incredible community helping us redefine fine
        fragrances. Revisit our favorite chapters, find yourself in the crowd, and see the
        passion that drives our house forward.
      </p>
    </header>
  );
}
