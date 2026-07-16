"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { productsCatalog } from "../data/products";
import styles from "./homepage.module.css";

export default function BestSellersSection() {
  // Get exactly 6 featured perfumes from the catalog
  const bestSellers = productsCatalog.slice(0, 6);

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>THE BEST SELLERS</span>
          <h2 className={styles.sectionTitle}>Best Sellers</h2>
          <p className={styles.sectionSubtitle}>Indulge in our most celebrated creations</p>
        </div>

        <div className={styles.bestSellersGrid}>
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              description={product.description}
              rating={product.rating}
              reviews={product.reviews}
              price={product.price}
              volume={product.volume}
              image={product.image}
            />
          ))}
        </div>

        <div className={styles.centerActions}>
          <Link href="/shop" className={styles.secondaryButton} suppressHydrationWarning>
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
