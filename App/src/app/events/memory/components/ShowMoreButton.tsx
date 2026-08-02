"use client";

import styles from "../page.module.css";

interface ShowMoreButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export default function ShowMoreButton({ isExpanded, onClick }: ShowMoreButtonProps) {
  return (
    <div className={styles.showMoreContainer}>
      <button
        type="button"
        className={styles.showMorePillBtn}
        onClick={onClick}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? "Show Less" : "Show More"}</span>
        <span className={styles.chevronIcon}>{isExpanded ? "˄" : "˅"}</span>
      </button>
    </div>
  );
}
