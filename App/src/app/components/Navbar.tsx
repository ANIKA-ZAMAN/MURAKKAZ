"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
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
          <Link href="/wishlist" className={styles.navOverlayLink} style={{ left: "86.5%", width: "3.5%" }} title="Wishlist" />
          <Link href="/cart" className={styles.navOverlayLink} style={{ left: "90.0%", width: "3.5%" }} title="Cart" />
          <Link href="/" className={styles.navOverlayLink} style={{ left: "93.5%", width: "3.5%" }} title="Profile" />
        </div>
      </nav>
    </header>
  );
}
