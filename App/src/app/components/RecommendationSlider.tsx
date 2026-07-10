"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import styles from "./RecommendationSlider.module.css";

interface Product {
  id: string;
  name: string;
  brand: string;
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
      brand: "Murakkaz",
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
      brand: "Murakkaz",
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
      brand: "Murakkaz",
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
      brand: "Murakkaz",
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
      brand: "Murakkaz",
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
      brand: "Murakkaz",
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
      brand: "Murakkaz",
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
      brand: "Murakkaz",
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
