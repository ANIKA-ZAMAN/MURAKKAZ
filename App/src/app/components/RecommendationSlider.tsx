"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import styles from "./RecommendationSlider.module.css";

interface Product {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  volume: string;
  image: string;
}

export default function RecommendationSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const products: Product[] = [
    {
      id: "rec-1",
      name: "Coral Sea",
      description: "created by the perfumer",
      rating: 4.8,
      reviews: 35,
      price: "1,450৳",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
    },
    {
      id: "rec-2",
      name: "Jade Serenity",
      description: "created by the perfumer",
      rating: 4.9,
      reviews: 42,
      price: "1,750৳",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      id: "rec-3",
      name: "Magnetism",
      description: "created by the perfumer",
      rating: 4.7,
      reviews: 29,
      price: "1,250৳",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      id: "rec-4",
      name: "Hellenist",
      description: "created by the perfumer",
      rating: 4.9,
      reviews: 51,
      price: "1,350৳",
      volume: "100ml",
      image: "/images/products/hellenist.png",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 300; // Approx card width + gap
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Explore Our Recommendation</h2>
      <div className={styles.sliderContainer}>
        <button
          className={`${styles.navBtn} ${styles.leftBtn}`}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <svg
            className={styles.chevron}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.slider} ref={sliderRef}>
          {products.map((product) => (
            <div key={product.id} className={styles.slide}>
              <ProductCard
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
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
