"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "../../data/eventsData";
import styles from "../page.module.css";

export default function EventGallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  return (
    <section className={styles.gallerySection}>
      <div className={styles.galleryMainRow}>
        {/* Left Column: Title, Description & Red Frame Details Button */}
        <div className={styles.galleryLeftCol}>
          <h2 className={styles.galleryPageTitle}>Event Gallery</h2>
          <p className={styles.galleryDescParagraph}>
            Catch the highlights and unforgettable moments from our past events.
            Browse through our created gallery of fragrance showcases, meetups,
            and exclusive product launches across Bangladesh and beyond.
          </p>
          <button
            type="button"
            className={styles.redFrameDetailsBtn}
            onClick={() => openLightbox(0)}
          >
            Details &gt;
          </button>
        </div>

        {/* Right Column: Staggered 2x2 Masonry Photo Grid */}
        <div className={styles.galleryRightGrid}>
          {galleryImages.map((img, idx) => {
            const isWide = idx === 0 || idx === 3;
            return (
              <div
                key={idx}
                className={`${styles.masonryPhotoCard} ${
                  isWide ? styles.masonryCardWide : styles.masonryCardCompact
                }`}
                onClick={() => openLightbox(idx)}
              >
                <div className={styles.photoWrap}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={styles.masonryImg}
                  />
                  {/* Category Pill Badge */}
                  <span className={styles.photoCategoryBadge}>
                    {img.category || "EXHIBITION"}
                  </span>
                  {/* Bottom Text Overlay */}
                  <div className={styles.photoOverlayGradient}>
                    <h4 className={styles.photoCardTitle}>{img.title}</h4>
                    <p className={styles.photoCardMeta}>
                      {img.location ? `${img.location} • ` : ""}
                      {img.date}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div className={styles.lightboxModal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.lightboxCloseBtn} onClick={closeLightbox}>
              ✕
            </button>
            <div className={styles.lightboxImageWrap}>
              <Image
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                fill
                className={styles.lightboxImg}
              />
            </div>
            <div className={styles.lightboxCaption}>
              <span className={styles.lightboxCategory}>{galleryImages[lightboxIndex].category}</span>
              <h3>{galleryImages[lightboxIndex].title}</h3>
              <p>{galleryImages[lightboxIndex].location} • {galleryImages[lightboxIndex].date}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
