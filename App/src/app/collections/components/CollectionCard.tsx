"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./CollectionCard.module.css";

interface CollectionCardProps {
  id: string;
  name: string;
  brand: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
}

export default function CollectionCard({
  id,
  name,
  brand,
  description,
  rating,
  reviews,
  image,
}: CollectionCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Initialize wishlist state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wishlist-items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.includes(id)) {
          setIsWishlisted(true);
        }
      } catch (e) {
        console.error("Error checking wishlist", e);
      }
    }
  }, [id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !isWishlisted;
    setIsWishlisted(nextVal);

    const saved = localStorage.getItem("wishlist-items");
    let wishlist: string[] = [];
    if (saved) {
      try {
        wishlist = JSON.parse(saved);
        if (!Array.isArray(wishlist)) wishlist = [];
      } catch (e) {
        wishlist = [];
      }
    }
    if (nextVal) {
      if (!wishlist.includes(id)) wishlist.push(id);
    } else {
      wishlist = wishlist.filter((item) => item !== id);
    }
    localStorage.setItem("wishlist-items", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/compare?add=${id}&image=${encodeURIComponent(image)}&name=${encodeURIComponent(name)}`);
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/product/${id}`);
  };

  const handleCardClick = () => {
    router.push(`/product/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {/* Product Image */}
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={name}
          width={280}
          height={280}
          className={styles.image}
          loading="lazy"
        />
      </div>

      {/* Card Content */}
      <div className={styles.content}>
        {/* Name + Heart Row */}
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{name}</h3>
          <button
            className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ""}`}
            onClick={handleWishlistToggle}
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

        {/* Brand + Rating Row */}
        <div className={styles.brandRatingRow}>
          <span className={styles.brandText}>Brand: {brand}</span>
          <div className={styles.ratingGroup}>
            <span className={styles.star}>★</span>
            <span className={styles.ratingText}>
              {rating.toFixed(1)} ({reviews})
            </span>
          </div>
        </div>

        {/* Description */}
        <p className={styles.description}>{description}</p>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button className={styles.compareBtn} onClick={handleCompare}>
            Compare
          </button>
          <button className={styles.readMoreBtn} onClick={handleReadMore}>
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
