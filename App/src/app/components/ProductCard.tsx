"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  volume: string;
  image: string;
  delay?: number;
}

export default function ProductCard({
  id,
  name,
  brand,
  description,
  rating,
  reviews,
  price,
  volume,
  image,
  delay = 0,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();

  const { displayName, inspiredBy } = useMemo(() => {
    if (image.includes("jade_serenity")) {
      return { displayName: "Jade Serenity", inspiredBy: "Inspired by Dio Savotage" };
    }
    if (image.includes("coral_sea")) {
      return { displayName: "Coral Sea", inspiredBy: "Inspired by Jo Malone Wood Sage & Sea Salt" };
    }
    if (image.includes("magnetism")) {
      return { displayName: "Murakkaz Noir", inspiredBy: "Inspired by Dior Sauvage Elixir" };
    }
    if (image.includes("hellenist")) {
      return { displayName: "Hellenist", inspiredBy: "Inspired by Baccarat Rouge 540" };
    }
    return { displayName: name, inspiredBy: `Inspired by ${brand}` };
  }, [name, image, brand]);

  // Auto-hide toast messages
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart-items");
    let cartItems = [];
    if (savedCart) {
      try {
        cartItems = JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }

    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    const existingIndex = cartItems.findIndex((item: any) => item.name === displayName && item.selectedSize === "12ml");
    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += 1;
    } else {
      const newItem = {
        id: `cart-${id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: displayName,
        image: image,
        inspiredBy: inspiredBy,
        selectedSize: "12ml",
        quantity: 1,
        prices: {
          "12ml": 500,
          "30ml": 900,
          "55ml": 1500,
          "100ml": 2800,
        },
        originalPrices: {
          "12ml": 720,
          "30ml": 1200,
          "55ml": 2000,
          "100ml": 3500,
        },
        selected: true,
      };
      cartItems.push(newItem);
    }

    localStorage.setItem("cart-items", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated"));
    setToastMessage(`Added 1x ${displayName} (12ml) to your bag!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(`.${styles.compareBtn}`) ||
      target.closest(`.${styles.wishlistBtn}`) ||
      target.closest(`.${styles.readMoreBtn}`)
    ) {
      return;
    }
    router.push(`/product/${id}`);
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      style={{ cursor: "pointer", "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {/* Product Image */}
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={displayName}
          width={240}
          height={240}
          className={styles.image}
        />
      </div>

      {/* Card Content */}
      <div className={styles.content}>
        {/* Row 1: Name + Heart Row */}
        <div className={styles.nameRow}>
          <h3 className={styles.name}>
            {displayName}
          </h3>
          <button
            className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
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

        {/* Row 2: Brand + Rating Row */}
        <div className={styles.brandRatingRow}>
          <span className={styles.brandText}>Brand: {brand}</span>
          <div className={styles.ratingGroup}>
            <span className={styles.star}>★</span>
            <span className={styles.ratingText}>{rating.toFixed(1)} ({reviews})</span>
          </div>
        </div>

        {/* Row 3: Description */}
        <p className={styles.description}>
          {description}
        </p>

        {/* Row 4: Action Buttons */}
        <div className={styles.actions}>
          <button 
            className={styles.compareBtn} 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/compare?p1=${id}`);
            }}
          >
            Compare
          </button>
          <button 
            className={styles.readMoreBtn} 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${id}`);
            }}
          >
            Read more
          </button>
        </div>
      </div>

      {/* Toast Alert Box Wrapper (stable parent node prevents removeChild hydration/unmount crashes) */}
      <div className={styles.toastWrapper}>
        {toastMessage && (
          <div className={styles.toast}>
            <div className={styles.toastText}>{toastMessage}</div>
            <div className={styles.toastActions}>
              <span className={styles.toastLink} onClick={() => router.push("/cart")}>
                View Bag
              </span>
              <button className={styles.toastClose} onClick={() => setToastMessage(null)}>
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
