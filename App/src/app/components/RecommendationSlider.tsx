"use client";

import { useRef, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product, fetchLiveProducts } from "../data/products";
import styles from "./RecommendationSlider.module.css";

export default function RecommendationSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchLiveProducts().then((data) => {
      if (data) setProducts(data);
    });
  }, []);

  if (products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const cardWidth = 280;
      const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Explore Our Recommendations</h2>
        <div className={styles.headerNav}>
          <button
            className={styles.headerNavBtn}
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5495 26.2999L13.2511 20L19.5511 13.7M26.7495 20H13.2495H26.7495Z"
                stroke="#820011"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="20"
                cy="20"
                r="19"
                stroke="#820011"
                strokeWidth="1.2"
              />
            </svg>
          </button>
          <button
            className={styles.headerNavBtn}
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: "scaleX(-1)" }}
            >
              <path
                d="M19.5495 26.2999L13.2511 20L19.5511 13.7M26.7495 20H13.2495H26.7495Z"
                stroke="#820011"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="20"
                cy="20"
                r="19"
                stroke="#820011"
                strokeWidth="1.2"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.slider} ref={sliderRef}>
          {products.map((product) => (
            <div key={product.id} className={styles.slide}>
              <ProductCard
                id={product.id}
                slug={product.slug}
                brand={product.brand}
                name={product.name}
                category={product.category}
                badge={product.badge}
                inspiredBy={product.inspiredBy}
                description={product.description}
                rating={product.rating}
                reviews={product.reviews}
                price={product.price}
                volume={product.volume}
                image={product.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
