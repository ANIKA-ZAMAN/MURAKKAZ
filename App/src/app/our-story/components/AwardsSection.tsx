"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "./AwardsSection.module.css";

export default function AwardsSection() {
  const { awards } = ourStoryData;
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const activeTab = awards.tabs[activeTabIdx] || awards.tabs[0];

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className={styles.wrapper} aria-labelledby="awards-section-title">
      <div className={styles.container}>
        {/* Desktop Left Column: Heading + Interactive Tabs + Detail Box */}
        <div className={styles.leftCol}>
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

        {/* Mobile & Tablet Stack: Heading + 3 Expandable Cards with See More */}
        <div className={styles.mobileCol}>
          <h2 className={styles.heading}>
            {awards.heading}
          </h2>

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

        {/* Right Column: Media Showcase Grid (Desktop) */}
        <div className={styles.rightCol} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className={styles.photoGrid}>
            {/* Row 1 */}
            <div className={`${styles.photoRow} ${styles.row1}`}>
              <div 
                className={`${styles.photoItem} ${styles.row1Left}`} 
                onClick={() => setLightboxImage({ src: "/images/events/sadid.jpg", alt: "Midas SME 2026 Presentation" })}
              >
                <Image
                  src="/images/events/sadid.jpg"
                  alt="Midas SME Award Presentation"
                  fill
                  sizes="232px"
                  className={styles.gridImage}
                />
                <div className={styles.photoItemLabel}>
                  <span>Midas SME 2026</span>
                </div>
              </div>
              <div 
                className={`${styles.photoItem} ${styles.row1Right}`}
                onClick={() => setLightboxImage({ src: "/images/events/blog1.jpg", alt: "BRAC University National Youth Entrepreneurship Accolades" })}
              >
                <Image
                  src="/images/events/blog1.jpg"
                  alt="BRAC Youth Entrepreneurship Showcase"
                  fill
                  sizes="348px"
                  className={styles.gridImage}
                />
                <div className={styles.photoItemLabel}>
                  <span>BRAC University Accolades</span>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className={`${styles.photoRow} ${styles.row2}`}>
              <div 
                className={`${styles.photoItem} ${styles.row2Left}`}
                onClick={() => setLightboxImage({ src: "/images/events/blog2.jpg", alt: "North South University Brand Excellence Honor" })}
              >
                <Image
                  src="/images/events/blog2.jpg"
                  alt="NSU School of Business Honor"
                  fill
                  sizes="348px"
                  className={styles.gridImage}
                />
                <div className={styles.photoItemLabel}>
                  <span>NSU Brand Excellence</span>
                </div>
              </div>
              <div 
                className={`${styles.photoItem} ${styles.row2Right}`}
                onClick={() => setLightboxImage({ src: "/images/events/eliyas.jpg", alt: "National SME Fair Recognition Ceremony" })}
              >
                <Image
                  src="/images/events/eliyas.jpg"
                  alt="National SME Fair Recognition"
                  fill
                  sizes="232px"
                  className={styles.gridImage}
                />
                <div className={styles.photoItemLabel}>
                  <span>SME Fair Recognition</span>
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

      {/* Lightbox / Modal Photo Viewer */}
      {lightboxImage && (
        <div className={styles.lightbox} onClick={() => setLightboxImage(null)}>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={() => setLightboxImage(null)} 
            aria-label="Close lightbox"
          >
            &times;
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage.src} alt={lightboxImage.alt} className={styles.lightboxImg} />
            <p className={styles.lightboxCaption}>{lightboxImage.alt}</p>
          </div>
        </div>
      )}
    </section>
  );
}
