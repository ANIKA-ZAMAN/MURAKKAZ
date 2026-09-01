"use client";

import { useState } from "react";
import styles from "./FloatingContact.module.css";

interface FloatingContactProps {
  align?: "left" | "right";
  positionType?: "absolute" | "fixed";
  disableHoverAnimation?: boolean;
}

export default function FloatingContact({
  align = "right",
  positionType = "fixed",
  disableHoverAnimation = false,
}: FloatingContactProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={`${styles.fabContainer} ${align === "right" ? styles.alignRight : styles.alignLeft} ${positionType === "fixed" ? styles.isFixed : ""} ${disableHoverAnimation ? styles.noHoverAnim : ""}`}
      style={{ position: positionType }}
    >
      {/* Vertical Slide-out Menu */}
      <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
        {/* Messenger Link */}
        <a
          href="https://www.facebook.com/profile.php?id=100063498011095"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.menuItem} ${styles.messenger}`}
          aria-label="Contact us on Messenger"
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.45 5.513 3.722 7.158V22l3.415-1.874a11.1 11.1 0 002.863.372c5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.096 12.35l-2.613-2.79-5.1 2.79 5.603-5.952 2.67 2.79 5.044-2.79-5.604 5.952z" />
          </svg>
        </a>

        {/* WhatsApp Link */}
        <a
          href="https://wa.me/8801997807701"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.menuItem} ${styles.whatsapp}`}
          aria-label="Contact us on WhatsApp"
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12.004 2c-5.51 0-9.993 4.483-9.993 9.993 0 1.763.461 3.486 1.336 5.006L2 22l5.127-1.345c1.472.802 3.125 1.226 4.869 1.228h.004c5.51 0 9.993-4.483 9.993-9.993 0-2.67-1.04-5.18-2.93-7.07A9.924 9.924 0 0 0 12.004 2zm6.758 13.916c-.278.78-1.618 1.528-2.222 1.62-.554.084-1.284.144-3.413-.744-2.723-1.135-4.478-3.905-4.613-4.088-.135-.183-1.099-1.464-1.099-2.793 0-1.33.697-1.982.94-2.25.244-.268.532-.335.71-.335.178 0 .355.002.51.01.164.007.385-.026.6.495.222.534.755 1.84.82 1.975.067.135.112.293.023.473-.09.18-.135.293-.267.45-.133.157-.28.35-.4.473-.135.138-.277.29-.12.56.157.27.7 1.15 1.502 1.866.802.715 1.478.937 1.77 1.05.292.115.461.097.633-.1.173-.198.754-.875.955-1.173.2-.3.4-.249.675-.15.278.1 1.758.877 2.062 1.03 2.361 1.18.298.15.496.223.574.356.078.13.078.752-.2 1.532z" />
          </svg>
        </a>

        {/* Phone Call Link */}
        <a
          href="tel:+8801997807701"
          className={`${styles.menuItem} ${styles.phone}`}
          aria-label="Call us"
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21.384 17.752a15.908 15.908 0 01-3.358-1.76 1.919 1.919 0 00-2.224.164l-1.63 1.63c-3.197-1.6-5.8-4.2-7.4-7.4l1.63-1.63a1.92 1.92 0 00.164-2.224 15.91 15.91 0 01-1.76-3.358A1.92 1.92 0 004.996 2H3.5A1.5 1.5 0 002 3.5c0 10.217 8.283 18.5 18.5 18.5a1.5 1.5 0 001.5-1.5v-1.496a1.92 1.92 0 00-1.116-1.752z" />
          </svg>
        </a>
      </div>

      {/* Main Trigger Button */}
      <button
        type="button"
        className={`${styles.mainBtn} ${isOpen ? styles.mainBtnActive : ""}`}
        onClick={toggleMenu}
        aria-label="Open contact options"
        aria-expanded={isOpen}
      >
        {/* Active Online Indicator on Corner */}
        <div className={styles.activeBadge} title="Active Now">
          <span className={styles.activePing} />
          <span className={styles.activeDot} />
        </div>

        {!disableHoverAnimation && <span className={styles.shine} />}
        <div className={`${styles.btnContent} ${align === "right" ? styles.rowReverse : ""}`}>
          {/* Toggle between Chat Bubble and Close Icon */}
          {isOpen ? (
            <svg
              className={styles.mainIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className={styles.mainIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}

          {!isOpen && !disableHoverAnimation && (
            <span className={styles.helpText}>Need any help?</span>
          )}
        </div>
      </button>
    </div>
  );
}
