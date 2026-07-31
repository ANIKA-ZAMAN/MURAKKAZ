import styles from "../page.module.css";

interface BlogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function BlogHeader({ searchQuery, onSearchChange }: BlogHeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTextGroup}>
        <span className={styles.headerEyebrow}>Editorial Journal</span>
        <h1 className={styles.pageTitle}>The Olfactory Journal</h1>
        <p className={styles.pageSubtitle}>
          Curated insights on haute perfumery, artisanal extraction, and sensory living.
        </p>
      </div>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search articles & scent guides..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search blog posts"
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}
