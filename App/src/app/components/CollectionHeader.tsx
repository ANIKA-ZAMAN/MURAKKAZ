"use client";

import SearchBar from "./SearchBar";
import styles from "./CollectionHeader.module.css";

interface CollectionHeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
}

export default function CollectionHeader({
  title = "The Curated Collection",
  onSearch,
}: CollectionHeaderProps) {
  return (
    <div className={styles.headerRow}>
      <h1 className={styles.title}>{title}</h1>
      <SearchBar placeholder="Search" onSearch={onSearch} />
    </div>
  );
}
