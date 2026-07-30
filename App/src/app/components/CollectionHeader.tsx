"use client";

import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";
import styles from "./CollectionHeader.module.css";

interface CollectionHeaderProps {
  title?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  onOpenFilter?: () => void;
  activeFiltersCount?: number;
}

export default function CollectionHeader({
  title = "Perfume Collection",
  subtitle = "Universe of perfume",
  onSearch,
  onOpenFilter,
  activeFiltersCount = 0,
}: CollectionHeaderProps) {
  return (
    <div className={styles.headerRow}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.controlsGroup}>
        <SearchBar placeholder="Search your perfume" onSearch={onSearch} />
        {onOpenFilter && (
          <FilterButton onClick={onOpenFilter} activeCount={activeFiltersCount} />
        )}
      </div>
    </div>
  );
}

