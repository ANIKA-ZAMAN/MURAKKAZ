import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import RecommendationSlider from "./components/RecommendationSlider";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header Row: Title & Search Bar */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>The Curated Collection</h1>
          <div className={styles.searchContainer}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Content Layout: Sidebar + Product Grid */}
        <div className={styles.contentLayout}>
          <FilterSidebar />
          <ProductGrid />
        </div>

        {/* Explore Our Recommendation Section */}
        <RecommendationSlider />
      </main>
    </div>
  );
}
