"use client";

import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";
import styles from "./CollectionHeader.module.css";

interface CollectionHeaderProps {
  title?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  onOpenFilter?: () => void;
  isFilterOpen?: boolean;
  activeFiltersCount?: number;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export default function CollectionHeader({
  title = "Perfume Collection",
  subtitle = "Universe of perfume",
  onSearch,
  onOpenFilter,
  isFilterOpen = false,
  activeFiltersCount = 0,
  sortBy = "newest",
  onSortChange,
}: CollectionHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      {/* Title Block */}
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {/* Action Toolbar: Filter on Left, Sort by on Right */}
      <div className={styles.toolbarRow}>
        <div className={styles.leftControls}>
          {onOpenFilter && (
            <FilterButton
              onClick={onOpenFilter}
              activeCount={activeFiltersCount}
              isOpen={isFilterOpen}
            />
          )}
          {onSearch && (
            <div className={styles.searchWrapper}>
              <SearchBar placeholder="Search your perfume..." onSearch={onSearch} />
            </div>
          )}
        </div>

        {onSortChange && (
          <div className={styles.rightControls}>
            <label htmlFor="sort-select" className={styles.sortLabel}>
              Sort by:
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
              <span className={styles.selectChevron}>▾</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

