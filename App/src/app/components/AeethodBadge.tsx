"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { trackAnalyticsEvent } from "./AnalyticsProvider";
import styles from "./AeethodBadge.module.css";

// Standard UTM Parameters for attribution in Google Analytics / Aeethod marketing analytics
const AEETHOD_URL =
  "https://aeethod.com/?utm_source=murakkaz.com&utm_medium=referral&utm_campaign=footer_credit&utm_content=crafted_by_aeethod";

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

  const handleOutboundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      trackAnalyticsEvent("OUTBOUND_CLICK", {
        target: "aeethod",
        url: AEETHOD_URL,
        placement: "footer_badge"
      });
    } catch {
      // non-blocking
    }
  };

  return (
    <div className={styles.badgeWrapper} ref={wrapperRef}>
      {/* 1. Main Interactive Pill / Trigger */}
      <button
        type="button"
        className={styles.pill}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-label="Crafted by Aeethod"
      >
        {/* Logo (Direct PNG from user) */}
        <div className={styles.logoWrap}>
          <Image
            src={isHovered ? "/images/aeethod_logo_gold.png" : "/images/aeethod_logo_white.png"}
            alt="Aeethod Logo"
            width={28}
            height={28}
            className={styles.logoImg}
            priority
          />
        </div>

        {/* Vertical Divider */}
        <div className={styles.divider} />

        {/* Text Area */}
        <div className={styles.contentArea}>
          {!isHovered ? (
            <span className={styles.defaultText}>CRAFTED BY AEETHOD</span>
          ) : (
            <div className={styles.hoverContainer}>
              <span className={styles.hoverLine1}>
                CRAFTED <span className={styles.goldHighlight}>BY AEETHOD</span>
              </span>
              <span className={styles.hoverLine2}>DIGITAL EXPERIENCES</span>
            </div>
          )}
        </div>

        {/* Accent Dot */}
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
          <a
            href={AEETHOD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.expandedLogoWrap}
            onClick={handleOutboundClick}
            title="Visit Aeethod (Opens in new window)"
          >
            <Image
              src="/images/aeethod_logo_gold.png"
              alt="Aeethod Agency"
              width={42}
              height={42}
              className={styles.expandedLogoImg}
            />
          </a>

          {/* Vertical Divider */}
          <div className={styles.expandedDivider} />

          {/* Expanded Body Content */}
          <div className={styles.expandedBody}>
            <a
              href={AEETHOD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.expandedBrandLink}
              onClick={handleOutboundClick}
              title="Visit Aeethod (Opens in new window)"
            >
              <h4 className={styles.expandedBrandName}>A E E T H O D</h4>
            </a>
            <p className={styles.expandedDesc}>
              We design and build digital experiences for ambitious brands.
            </p>
            <a
              href={AEETHOD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.expandedLink}
              onClick={handleOutboundClick}
              title="Visit Aeethod (Opens in new window)"
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
