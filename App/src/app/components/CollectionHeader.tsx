"use client";

import SearchBar from "./SearchBar";
import styles from "./CollectionHeader.module.css";

interface CollectionHeaderProps {
  title?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
}

export default function CollectionHeader({
  title = "Perfume Collection",
  subtitle = "Universe of perfume",
  onSearch,
}: CollectionHeaderProps) {
  return (
    <div className={styles.headerRow}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <SearchBar placeholder="Search your perfume" onSearch={onSearch} />
    </div>
  );
}
