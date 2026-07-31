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
      const sectionWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -sectionWidth : sectionWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Explore Our Recommendations</h2>
      <div className={styles.sliderContainer}>
        <button
          className={`${styles.navBtn} ${styles.leftBtn}`}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <svg
            className={styles.chevron}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5495 26.2999L13.2511 20L19.5511 13.7M26.7495 20H13.2495H26.7495Z"
              stroke="#820011"
              strokeWidth="1.025"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="20"
              cy="20"
              r="19.6583"
              stroke="#820011"
              strokeWidth="0.683333"
            />
          </svg>
        </button>

        <div className={styles.slider} ref={sliderRef}>
          {products.map((product) => (
            <div key={product.id} className={styles.slide}>
              <ProductCard
                id={product.id}
                brand={product.brand}
                name={product.name}
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

        <button
          className={`${styles.navBtn} ${styles.rightBtn}`}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <svg
            className={styles.chevron}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: "scaleX(-1)" }}
          >
            <path
              d="M19.5495 26.2999L13.2511 20L19.5511 13.7M26.7495 20H13.2495H26.7495Z"
              stroke="#820011"
              strokeWidth="1.025"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="20"
              cy="20"
              r="19.6583"
              stroke="#820011"
              strokeWidth="0.683333"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
