"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  const updateCount = () => {
    const saved = localStorage.getItem("cart-items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const total = parsed.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
          return;
        }
      } catch (e) {
        console.error("Error reading cart count", e);
      }
    }
    setCartCount(0);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navbarWrapper}>
          <img
            src="/images/navbar/navbar M.svg"
            alt="Murakkaz Navigation"
            width={1348}
            height={64}
            className={styles.navbarSvg}
          />

          {/* Absolute Clickable Transparent Overlay Links */}
          <Link href="/" className={styles.navOverlayLink} style={{ left: "21.2%", width: "6.5%" }} title="Our Story" />
          <Link href="/" className={styles.navOverlayLink} style={{ left: "29.3%", width: "4%" }} title="Shop" />
          <Link href="/events" className={styles.navOverlayLink} style={{ left: "34.4%", width: "4.5%" }} title="Event" />
          <Link href="/" className={styles.navOverlayLink} style={{ left: "40%", width: "6%" }} title="Library" />
          <Link href="/compare" className={styles.navOverlayLink} style={{ left: "48.3%", width: "6%" }} title="Compare" />
          <Link href="/" className={styles.navOverlayLink} style={{ left: "55.6%", width: "5%" }} title="Finder" />
          <Link href="/" className={styles.navOverlayLink} style={{ left: "62%", width: "4%" }} title="Vlog" />

          {/* Icon Overlays */}
          <Link href="/wishlist" className={styles.navOverlayLink} style={{ left: "90.4%", width: "2.5%" }} title="Wishlist" />
          <Link href="/cart" className={styles.navOverlayLink} style={{ left: "93.7%", width: "2.5%" }} title="Cart" />
          <Link href="/" className={styles.navOverlayLink} style={{ left: "96.0%", width: "2.5%" }} title="Profile" />

          {/* Cart Quantity Badge overlaying the Bag icon */}
          {cartCount > 0 && (
            <span className={styles.cartBadge}>
              {cartCount}
            </span>
          )}
        </div>
      </nav>
    </header>
  );
}
