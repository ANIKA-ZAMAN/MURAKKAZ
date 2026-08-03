import styles from "../page.module.css";

interface BlogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function BlogHeader({ searchQuery, onSearchChange }: BlogHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.pageTitle}>Vlog</h1>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search your perfume"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search your perfume"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className={styles.clearSearchBtn}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : (
          <span className={styles.searchIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a4a4c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
