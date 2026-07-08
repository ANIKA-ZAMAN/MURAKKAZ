import CollectionHeader from "./components/CollectionHeader";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import RecommendationSlider from "./components/RecommendationSlider";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header Row: Title & Search Bar */}
        <CollectionHeader />

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
