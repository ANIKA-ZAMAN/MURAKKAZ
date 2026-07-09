"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  volume: string;
  image: string;
}

export default function ProductCard({
  id,
  name,
  description,
  rating,
  reviews,
  price,
  volume,
  image,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleAddToBag = () => {
    // Extract price number from string (e.g. "1,735tk" -> 1735)
    const priceVal = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    
    // Load current cart
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

    // Check if item already exists by name
    const existingIndex = cartItems.findIndex((item: any) => item.name === name);
    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += 1;
    } else {
      const newItem = {
        id: `cart-${id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: name,
        image: image,
        inspiredBy: description,
        selectedSize: "5ml",
        quantity: 1,
        prices: {
          "5ml": priceVal,
          "10ml": Math.round(priceVal * 1.8),
          "100ml": Math.round(priceVal * 9.0),
        },
        selected: true,
      };
      cartItems.push(newItem);
    }

    // Save cart
    localStorage.setItem("cart-items", JSON.stringify(cartItems));
    
    // Dispatch event
    window.dispatchEvent(new Event("cart-updated"));

    // Trigger toast
    setToastMessage(`"${name}" has been added to your bag.`);
    
    // Clear toast after 4s
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    
    return () => clearTimeout(timer);
  };

  const handleBuyNow = () => {
    handleAddToBag();
    router.push("/cart");
  };

  return (
    <div className={styles.card}>
      <Link href="/product/jade-serenity" className={styles.imageContainer} style={{ display: "block" }}>
        <Image
          src={image}
          alt={name}
          width={280}
          height={280}
          className={styles.image}
        />
      </Link>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.name}>
            <Link href="/product/jade-serenity" style={{ textDecoration: "none", color: "inherit" }}>
              {name}
            </Link>
          </h3>

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

        <div className={styles.descriptionRow}>
          <p className={styles.description}>{description}</p>
          <div className={styles.priceRow}>
            <span className={styles.price}>{price}</span>
            <span className={styles.volume}>{volume}</span>
          </div>
        </div>

        <div className={styles.ratingRow}>
          <span className={styles.star}>★</span>
          <span className={styles.ratingText}>
            {rating.toFixed(1)} <span className={styles.reviews}>({reviews})</span>
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.quickView} onClick={handleAddToBag}>Add to Bag</button>
          <button className={styles.bagNow} onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>

      {/* Premium Toast Popup */}
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
  );
}
