"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "../data/products";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  description?: string;
  rating: number;
  reviews: number;
  price: string;
  originalPrice?: string;
  volume?: string;
  image: string;
  delay?: number;
  badge?: string;
  inspiredBy?: string;
  notes?: string[];
  variant?: "default" | "featured";
}

export default function ProductCard({
  id,
  slug,
  name,
  brand,
  description,
  rating,
  reviews,
  price,
  originalPrice,
  volume,
  image,
  delay = 0,
  badge,
  inspiredBy,
  notes,
  variant = "default",
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();

  const targetSlug = useMemo(() => {
    if (slug) return slug;
    if (name) return slugify(name);
    return id;
  }, [slug, name, id]);

  const { displayName, subTitleText } = useMemo(() => {
    if (inspiredBy) {
      return { displayName: name, subTitleText: inspiredBy };
    }
    if (description && description.includes("Inspired by")) {
      return { displayName: name, subTitleText: description };
    }
    return { displayName: name, subTitleText: `Inspired by ${brand}` };
  }, [name, brand, inspiredBy, description]);

  // Check wishlist state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("wishlist-items");
        if (saved) {
          const wishlist = JSON.parse(saved);
          if (Array.isArray(wishlist)) {
            const found = wishlist.some((item) =>
              typeof item === "string"
                ? item === id || item.toLowerCase() === displayName.toLowerCase()
                : item.id === id || item.name?.toLowerCase() === displayName.toLowerCase()
            );
            setIsWishlisted(found);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [id, displayName]);

  // Auto-hide toast messages
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    const saved = localStorage.getItem("wishlist-items");
    let wishlist: any[] = [];
    if (saved) {
      try {
        wishlist = JSON.parse(saved);
        if (!Array.isArray(wishlist)) wishlist = [];
      } catch (err) {
        wishlist = [];
      }
    }

    if (nextState) {
      const exists = wishlist.some((item) =>
        typeof item === "string"
          ? (item === id || item.toLowerCase() === displayName.toLowerCase())
          : (item.id === id || item.name?.toLowerCase() === displayName.toLowerCase())
      );
      if (!exists) {
        wishlist.push({ id, name: displayName, brand: subTitleText, image, rating, ratingCount: reviews });
      }
    } else {
      wishlist = wishlist.filter((item) =>
        typeof item === "string"
          ? (item !== id && item.toLowerCase() !== displayName.toLowerCase())
          : (item.id !== id && item.name?.toLowerCase() !== displayName.toLowerCase())
      );
    }

    localStorage.setItem("wishlist-items", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(`.${styles.compareBtn}`) ||
      target.closest(`.${styles.detailsBtn}`) ||
      target.closest(`.${styles.wishlistBtn}`)
    ) {
      return;
    }
    router.push(`/product/${targetSlug}`);
  };

  // Display price range format (e.g. "300 - 2500tk")
  const rawPrice = price || "300 - 2500tk";
  const displayPrice = (rawPrice.includes("-") || rawPrice.includes("–"))
    ? rawPrice
    : "300 - 2500tk";

  const displayOriginalPrice = originalPrice ? (originalPrice.includes("tk") ? originalPrice : `${originalPrice}tk`) : "";

  return (
    <div
      className={`${styles.card} ${variant === "featured" ? styles.featuredCard : ""}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer", "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {/* Product Image */}
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={displayName}
          width={280}
          height={280}
          className={styles.image}
        />
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>

      {/* Card Content */}
      <div className={styles.content}>
        {/* Row 1: Product Title + Wishlist Button */}
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{displayName}</h3>
          <button
            className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ""}`}
            onClick={handleToggleWishlist}
            aria-label="Add to wishlist"
          >
            <svg
              viewBox="0 0 24 24"
              fill={isWishlisted ? "#820011" : "none"}
              stroke={isWishlisted ? "#820011" : "#313134"}
              strokeWidth="2"
              className={styles.heartIcon}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* Row 2: Subtitle Text */}
        <div className={styles.brandRow}>
          <span className={styles.brandText}>{subTitleText}</span>
        </div>

        {/* Row 4: Rating (Left) & Pricing (Right) */}
        <div className={styles.ratingPriceRow}>
          <div className={styles.ratingGroup}>
            <span className={styles.star}>★</span>
            <span className={styles.ratingText}>
              {rating.toFixed(1)} <span className={styles.reviewsCount}>({reviews})</span>
            </span>
          </div>

          <div className={styles.priceGroup}>
            <span className={styles.currentPrice}>{displayPrice}</span>
          </div>
        </div>

        {/* Row 5: Action Buttons */}
        <div className={styles.actions}>
          <button
            className={styles.buyNowBtn}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/cart?add=${id}`);
            }}
          >
            Buy Now
          </button>
          <button
            className={styles.addBagBtn}
            onClick={(e) => {
              e.stopPropagation();
              try {
                const saved = localStorage.getItem("cart-items");
                let cart: any[] = saved ? JSON.parse(saved) : [];
                const existing = cart.find((i) => i.id === id);
                if (existing) {
                  existing.quantity = (existing.quantity || 1) + 1;
                } else {
                  cart.push({ id, name: displayName, price: displayPrice, image, quantity: 1 });
                }
                localStorage.setItem("cart-items", JSON.stringify(cart));
                window.dispatchEvent(new Event("cart-updated"));
                setToastMessage(`Added ${displayName} to your bag!`);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Add to Bag
          </button>
        </div>
      </div>

      {/* Toast Alert Box Wrapper */}
      <div className={styles.toastWrapper}>
        {toastMessage && (
          <div className={styles.toast}>
            <div className={styles.toastText}>{toastMessage}</div>
            <div className={styles.toastActions}>
              <span
                className={styles.toastLink}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/cart");
                }}
              >
                View Bag
              </span>
              <button
                className={styles.toastClose}
                onClick={(e) => {
                  e.stopPropagation();
                  setToastMessage(null);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
