"use client";

import { useRef, useState, useEffect } from "react";
import { galleryImages } from "../../data/eventsData";
import styles from "../page.module.css";

export default function EventGallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = container.children;
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      let closestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const distance = Math.abs(containerCenter - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = i;
        }
      }
      setActiveIndex(closestIdx);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.sectionHeading}>Event Gallery</h2>

      <div className={styles.galleryLayout}>
        <div className={styles.galleryText}>
          <p className={styles.galleryDesc}>
            Catch the highlights and unforgettable moments from our past events.
            Browse through our created gallery of fragrance showcases, meetups,
            and exclusive product launches across Bangladesh and beyond.
          </p>
          <span className={styles.readMoreLink}>Details &gt;</span>
        </div>

        <div className={styles.galleryGrid} ref={scrollRef}>
          {galleryImages.map((img, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div
                key={idx}
                className={`${styles.galleryItem} ${
                  idx === 0 ? styles.galleryItemLarge : ""
                } ${isActive ? styles.galleryItemActive : styles.galleryItemInactive}`}
                style={{ backgroundColor: img.accentColor || "#ded6c9" }}
              >
                <div className={styles.placeholderImageFill} aria-label={img.alt}>
                  <div className={styles.galleryCardBadge}>{img.category || "Highlight"}</div>
                  <div className={styles.galleryCardContent}>
                    <h4 className={styles.galleryCardTitle}>{img.title}</h4>
                    <p className={styles.galleryCardSub}>
                      {img.location ? `${img.location} • ` : ""}{img.date}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

