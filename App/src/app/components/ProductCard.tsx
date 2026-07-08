"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  name: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  volume: string;
  image: string;
}

export default function ProductCard({
  name,
  description,
  rating,
  reviews,
  price,
  volume,
  image,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={name}
          width={280}
          height={280}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.name}>{name}</h3>
          <button
            className={`${styles.wishlistBtn} ${
              isWishlisted ? styles.active : ""
            }`}
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label="Add to wishlist"
          >
            <svg
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              className={styles.heartIcon}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.ratingRow}>
          <span className={styles.star}>★</span>
          <span className={styles.ratingText}>
            {rating.toFixed(1)} <span className={styles.reviews}>({reviews})</span>
          </span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{price}</span>
          <span className={styles.volume}>{volume}</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.quickView}>Add to Bag</button>
          <button className={styles.bagNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}
