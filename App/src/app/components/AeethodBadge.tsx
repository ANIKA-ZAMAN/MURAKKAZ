"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./AeethodBadge.module.css";

export default function AeethodBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close expanded card on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isExpanded]);

  return (
    <div className={styles.badgeWrapper} ref={wrapperRef}>
      {/* 1. Main Pill Badge (Default & Hover States) */}
      <button
        type="button"
        className={styles.pill}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-label="Engineered by Aeethod"
      >
        {/* Logo */}
        <div className={styles.logoWrap}>
          <Image
            src="/images/aeethod_logo.png"
            alt="Aeethod Logo"
            width={24}
            height={24}
            className={styles.logoImg}
            priority
          />
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Text Zone: Switches smoothly on Hover */}
        <div className={styles.contentArea}>
          {!isHovered ? (
            <span className={styles.defaultText}>CRAFTED BY AEETHOD</span>
          ) : (
            <div className={styles.hoverContainer}>
              <span className={styles.hoverLine1}>
                ENGINEERED <span className={styles.goldHighlight}>BY AEETHOD</span>
              </span>
              <span className={styles.hoverLine2}>DIGITAL EXPERIENCES</span>
            </div>
          )}
        </div>

        {/* Dot Indicator */}
        <div className={styles.dot} />
      </button>

      {/* 3. Click / Expanded State Popover Card */}
      {isExpanded && (
        <div className={styles.expandedCard}>
          {/* Close (X) */}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Expanded Logo */}
          <div className={styles.expandedLogoWrap}>
            <Image
              src="/images/aeethod_logo.png"
              alt="Aeethod Agency"
              width={40}
              height={40}
              className={styles.expandedLogoImg}
            />
          </div>

          {/* Vertical Divider */}
          <div className={styles.expandedDivider} />

          {/* Expanded Body Content */}
          <div className={styles.expandedBody}>
            <h4 className={styles.expandedBrandName}>A E E T H O D</h4>
            <p className={styles.expandedDesc}>
              We design and build digital experiences for ambitious brands.
            </p>
            <a
              href="https://aeethod.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.expandedLink}
              onClick={(e) => e.stopPropagation()}
            >
              <span>aeethod.com</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
