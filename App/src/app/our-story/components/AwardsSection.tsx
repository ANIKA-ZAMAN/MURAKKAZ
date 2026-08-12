"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "./AwardsSection.module.css";

export interface AwardShowcaseItem {
  id: string;
  src: string;
  alt: string;
  badge: string;
  title: string;
  event: string;
  objectPosition?: string;
}

// Exactly 4 featured award images for the front section matching design
export const FRONT_AWARDS_SHOWCASE: AwardShowcaseItem[] = [
  {
    id: "brac-edf",
    src: "/images/awards/brac-edf-token.jpg",
    alt: "Token of Appreciation trophy presented by BRAC University Entrepreneurship Development Forum during Eid Bazaar",
    badge: "BRAC UNIVERSITY",
    title: "Token of Appreciation",
    event: "EDF Eid Bazaar",
    objectPosition: "center 22%",
  },
  {
    id: "brac-buma",
    src: "/images/awards/brac-buma-token.jpg",
    alt: "Token of Gratitude trophy presented by BRAC University Marketing Association at Nobanno Utshob 2024",
    badge: "BRAC UNIVERSITY",
    title: "Token of Gratitude",
    event: "BUMA • Nobanno Utshob 2024",
    objectPosition: "center 25%",
  },
  {
    id: "buysell-eid",
    src: "/images/awards/buysell-eid-mela.jpg",
    alt: "Commemorative crest presented to Murakkaz as an Honorable Participant at Buy Sell Eid Mela 2024",
    badge: "BUY SELL MELA",
    title: "Honorable Participant",
    event: "Buy Sell Eid Mela 2024",
    objectPosition: "center 28%",
  },
  {
    id: "ninetyeight",
    src: "/images/awards/ninetyeight-rendezvous.jpg",
    alt: "Handcrafted wooden tribute plaque with engraved portrait of perfumer Eliyash Hossain at Ninety Eight Rendezvous",
    badge: "NINETY EIGHT",
    title: "Rendezvous Plaque",
    event: "Artisanal Honor 2024",
    objectPosition: "center 25%",
  },
];

export default function AwardsSection() {
  const { awards } = ourStoryData;
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeTab = awards.tabs[activeTabIdx] || awards.tabs[0];

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const showNextLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % FRONT_AWARDS_SHOWCASE.length));
  }, []);

  const showPrevLightbox = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + FRONT_AWARDS_SHOWCASE.length) % FRONT_AWARDS_SHOWCASE.length
    );
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNextLightbox();
      if (e.key === "ArrowLeft") showPrevLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, showNextLightbox, showPrevLightbox]);

  const currentPhoto = lightboxIndex !== null ? FRONT_AWARDS_SHOWCASE[lightboxIndex] : null;

  return (
    <section className={styles.wrapper} aria-labelledby="awards-section-title">
      <div className={styles.container}>
        {/* Desktop Left Column: Heading + Interactive Tabs + Detail Box */}
        <div className={styles.leftCol}>
          <div className={styles.stickyLeftInner}>
            <h2 id="awards-section-title" className={styles.heading}>
              {awards.heading}
            </h2>

            {/* Interactive Award Tabs */}
            <div className={styles.tabsGrid} role="tablist">
              {awards.tabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTabIdx === idx}
                  className={`${styles.tabBtn} ${
                    activeTabIdx === idx ? styles.activeTabBtn : ""
                  }`}
                  onClick={() => setActiveTabIdx(idx)}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Detail Description Box */}
            <div className={styles.detailBox}>
              <p className={styles.detailText}>{activeTab.description}</p>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Stack: Heading + Expandable Cards with See More */}
        <div className={styles.mobileCol}>
          <h2 className={styles.heading}>{awards.heading}</h2>

          <div className={styles.mobileCardsStack}>
            {awards.tabs.map((tab) => {
              const isExpanded = !!expandedCards[tab.id];
              return (
                <div key={tab.id} className={styles.awardCardMobile}>
                  <h3 className={styles.mobileCardTitle}>{tab.title}</h3>
                  <p
                    className={`${styles.mobileCardDesc} ${
                      !isExpanded ? styles.clampedText : ""
                    }`}
                  >
                    {tab.description}
                  </p>
                  <button
                    type="button"
                    className={styles.seeMoreBtn}
                    onClick={() => toggleExpand(tab.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "See less ↑" : "See more ↓"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Exactly 4 Media Showcase Grid (Desktop 2x2 & Responsive) */}
        <div className={styles.rightCol}>
          <div className={styles.photoGrid}>
            {/* Row 1 */}
            <div className={styles.photoRow}>
              {/* Item 0: Token of Appreciation */}
              <div
                className={`${styles.photoItem} ${styles.row1Left}`}
                onClick={() => openLightbox(0)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(0)}
                aria-label={`View award photo: ${FRONT_AWARDS_SHOWCASE[0].title}`}
              >
                <Image
                  src={FRONT_AWARDS_SHOWCASE[0].src}
                  alt={FRONT_AWARDS_SHOWCASE[0].alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 240px"
                  style={{ objectPosition: FRONT_AWARDS_SHOWCASE[0].objectPosition }}
                  className={styles.gridImage}
                  priority
                />
                <div className={styles.photoItemOverlay}>
                  <span className={styles.badgeTag}>{FRONT_AWARDS_SHOWCASE[0].badge}</span>
                  <div className={styles.photoItemLabel}>
                    <span>{FRONT_AWARDS_SHOWCASE[0].title}</span>
                  </div>
                </div>
              </div>

              {/* Item 1: Token of Gratitude */}
              <div
                className={`${styles.photoItem} ${styles.row1Right}`}
                onClick={() => openLightbox(1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(1)}
                aria-label={`View award photo: ${FRONT_AWARDS_SHOWCASE[1].title}`}
              >
                <Image
                  src={FRONT_AWARDS_SHOWCASE[1].src}
                  alt={FRONT_AWARDS_SHOWCASE[1].alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 360px"
                  style={{ objectPosition: FRONT_AWARDS_SHOWCASE[1].objectPosition }}
                  className={styles.gridImage}
                  priority
                />
                <div className={styles.photoItemOverlay}>
                  <span className={styles.badgeTag}>{FRONT_AWARDS_SHOWCASE[1].badge}</span>
                  <div className={styles.photoItemLabel}>
                    <span>{FRONT_AWARDS_SHOWCASE[1].title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className={styles.photoRow}>
              {/* Item 2: Honorable Participant */}
              <div
                className={`${styles.photoItem} ${styles.row2Left}`}
                onClick={() => openLightbox(2)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(2)}
                aria-label={`View award photo: ${FRONT_AWARDS_SHOWCASE[2].title}`}
              >
                <Image
                  src={FRONT_AWARDS_SHOWCASE[2].src}
                  alt={FRONT_AWARDS_SHOWCASE[2].alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 360px"
                  style={{ objectPosition: FRONT_AWARDS_SHOWCASE[2].objectPosition }}
                  className={styles.gridImage}
                />
                <div className={styles.photoItemOverlay}>
                  <span className={styles.badgeTag}>{FRONT_AWARDS_SHOWCASE[2].badge}</span>
                  <div className={styles.photoItemLabel}>
                    <span>{FRONT_AWARDS_SHOWCASE[2].title}</span>
                  </div>
                </div>
              </div>

              {/* Item 3: Rendezvous Plaque */}
              <div
                className={`${styles.photoItem} ${styles.row2Right}`}
                onClick={() => openLightbox(3)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openLightbox(3)}
                aria-label={`View award photo: ${FRONT_AWARDS_SHOWCASE[3].title}`}
              >
                <Image
                  src={FRONT_AWARDS_SHOWCASE[3].src}
                  alt={FRONT_AWARDS_SHOWCASE[3].alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 240px"
                  style={{ objectPosition: FRONT_AWARDS_SHOWCASE[3].objectPosition }}
                  className={styles.gridImage}
                />
                <div className={styles.photoItemOverlay}>
                  <span className={styles.badgeTag}>{FRONT_AWARDS_SHOWCASE[3].badge}</span>
                  <div className={styles.photoItemLabel}>
                    <span>{FRONT_AWARDS_SHOWCASE[3].title}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View More Link Button (Centered under Grid) */}
          <div className={styles.viewMoreContainer}>
            <Link href="/awards" className={styles.viewMoreBtn}>
              View More
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal Photo Viewer with Navigation */}
      {currentPhoto && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            &times;
          </button>

          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.lightboxImageWrap}>
              <img
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                className={styles.lightboxImg}
              />

              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavPrev}`}
                onClick={showPrevLightbox}
                aria-label="Previous image"
              >
                &#8249;
              </button>

              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavNext}`}
                onClick={showNextLightbox}
                aria-label="Next image"
              >
                &#8250;
              </button>

              <span className={styles.lightboxCounter}>
                {(lightboxIndex ?? 0) + 1} / {FRONT_AWARDS_SHOWCASE.length}
              </span>
            </div>

            <div className={styles.lightboxMeta}>
              <span className={styles.lightboxBadge}>{currentPhoto.badge}</span>
              <h3 className={styles.lightboxTitle}>{currentPhoto.title}</h3>
              <p className={styles.lightboxEvent}>{currentPhoto.event}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
