"use client";

import { useState } from "react";
import Image from "next/image";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "./AwardsSection.module.css";

export default function AwardsSection() {
  const { awards } = ourStoryData;
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

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

        {/* Right Column: Media Showcase Frame (Desktop) */}
        <div className={styles.rightCol}>
          <div className={styles.mediaFrame}>
            {activeTab.image && (
              <Image
                src={activeTab.image}
                alt={activeTab.title}
                fill
                sizes="(max-width: 900px) 100vw, 580px"
                className={styles.mediaImage}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
