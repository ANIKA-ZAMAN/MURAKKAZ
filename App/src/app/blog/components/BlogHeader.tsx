"use client";

import styles from "../page.module.css";

interface BlogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORIES = ["All", "Guides", "Reviews", "Behind the Scenes", "Stories"];

export default function BlogHeader({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
}: BlogHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <span className={styles.brandEyebrow}>MURAKKAZ</span>
        <h1 className={styles.pageTitle}>Fragrance Videos</h1>
        <p className={styles.pageSubtitle}>
          <span className={styles.pageSubtitleLine}>Behind the scents, beyond the bottle.</span>
          <span className={styles.pageSubtitleLine}>Discover our videos, guides and moments.</span>
        </p>
      </div>

      <div className={styles.headerRight}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search videos, topics or fragrances..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search videos, topics or fragrances"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className={styles.clearSearchBtn}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterPills} role="tablist" aria-label="Category filters">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(category)}
                className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ""}`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
