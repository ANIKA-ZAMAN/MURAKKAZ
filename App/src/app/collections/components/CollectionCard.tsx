"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CollectionCard.module.css";

interface CollectionCardProps {
  id: string;
  name: string;
  brand: string;
  description?: string;
  rating: number;
  reviews: number;
  image: string;
  price?: string;
  originalPrice?: string;
}

export default function CollectionCard({
  id,
  name,
  brand,
  description = "",
  rating,
  reviews,
  image,
}: CollectionCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Sync wishlist status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist-items");
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items) && items.some((item: any) => item.id === id || item.name === name)) {
          setIsWishlisted(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [id, name]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = !isWishlisted;
    setIsWishlisted(newStatus);

    try {
      const saved = localStorage.getItem("wishlist-items");
      let items: any[] = saved ? JSON.parse(saved) : [];
      if (newStatus) {
        if (!items.some((item) => item.id === id || item.name === name)) {
          items.push({ id, name, brand, image, rating, ratingCount: reviews });
        }
      } else {
        items = items.filter((item) => item.id !== id && item.name !== name);
      }
      localStorage.setItem("wishlist-items", JSON.stringify(items));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{name}</h3>
          <button
            className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ""}`}
            onClick={toggleWishlist}
            aria-label="Add to Wishlist"
          >
            <svg
              className={styles.heartIcon}
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <div className={styles.brandRatingRow}>
          <span className={styles.brandText}>Brand: {brand}</span>
          <div className={styles.ratingGroup}>
            <span className={styles.star}>★</span>
            <span className={styles.ratingText}>
              {rating} ({reviews})
            </span>
          </div>
        </div>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.actions}>
          <button className={styles.compareBtn}>Compare</button>
          <button className={styles.readMoreBtn}>Read More</button>
        </div>
      </div>
    </div>
  );
}
