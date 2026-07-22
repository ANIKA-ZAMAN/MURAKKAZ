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
          <h2 className={styles.sectionTitle}>Best Sellers</h2>
          <p className={styles.sectionSubtitle}>Indulge in our most celebrated creations</p>
        </div>

        <div className={styles.bestSellersGrid}>
          {bestSellers.map((product, idx) => (
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
              delay={idx * 90}
            />
          ))}
        </div>

        <div className={styles.centerActions}>
          <Link
            href="/shop"
            className="group relative inline-flex items-center justify-center min-w-[240px] sm:min-w-[265px] px-10 h-[54px] rounded-full border border-[#C5A880]/70 bg-gradient-to-r from-[#FAF6F0] via-[#F3E8D8] to-[#E2D2BC] text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.2em] uppercase shadow-[0_8px_28px_rgba(49,49,52,0.07)] transition-all duration-500 ease-out hover:-translate-y-[4px] hover:shadow-[0_16px_36px_rgba(197,168,128,0.45)] hover:border-[#C5A880] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            suppressHydrationWarning
          >
            {/* Shimmer light sweep on hover */}
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%] pointer-events-none" />
            <span className="relative z-10 w-full flex items-center justify-center gap-2.5 pl-[0.2em]">
              <span>View All</span>
              <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 text-[#C5A880]">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
