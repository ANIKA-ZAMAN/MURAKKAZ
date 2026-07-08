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
      description: "Inspired by Creed Aventus",
      rating: 4.9,
      reviews: 180,
      price: "1,420tk",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
    },
    {
      id: "rec-2",
      name: "Jade Serenity",
      description: "Inspired by Dio Savotage",
      rating: 4.8,
      reviews: 250,
      price: "1,720tk",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      id: "rec-3",
      name: "Magnetism",
      description: "Inspired by YSL Y EDP",
      rating: 4.7,
      reviews: 120,
      price: "1,220tk",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      id: "rec-4",
      name: "Hellenist",
      description: "Inspired by Bleu De Chanel",
      rating: 4.9,
      reviews: 310,
      price: "1,320tk",
      volume: "100ml",
      image: "/images/products/hellenist.png",
    },
    {
      id: "rec-5",
      name: "Amber Gold",
      description: "Inspired by Xerjoff Erba Pura",
      rating: 4.9,
      reviews: 195,
      price: "2,120tk",
      volume: "100ml",
      image: "/images/products/amber_gold.png",
    },
    {
      id: "rec-6",
      name: "Velvet Oud",
      description: "Inspired by Tom Ford Oud Wood",
      rating: 4.8,
      reviews: 210,
      price: "2,420tk",
      volume: "100ml",
      image: "/images/products/velvet_oud.png",
    },
    {
      id: "rec-7",
      name: "Rouge 540",
      description: "Inspired by Baccarat Rouge 540",
      rating: 4.9,
      reviews: 420,
      price: "2,820tk",
      volume: "100ml",
      image: "/images/products/rouge_540.png",
    },
    {
      id: "rec-8",
      name: "Silver Mountain",
      description: "Inspired by Creed Silver Mountain",
      rating: 4.7,
      reviews: 135,
      price: "1,820tk",
      volume: "100ml",
      image: "/images/products/silver_mountain.png",
    },
  ];

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
