"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { galleryImages } from "../../data/eventsData";
import styles from "../page.module.css";

export default function EventGallerySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Responsive state
  const [mobileFeaturedIndex, setMobileFeaturedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Desktop horizontal scroll detection (preserving exact existing desktop logic)
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

  // Lightbox keyboard navigation & body scroll lock
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : galleryImages.length - 1) : null
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev < galleryImages.length - 1 ? prev + 1 : 0) : null
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev < galleryImages.length - 1 ? prev + 1 : 0) : null
    );
  }, []);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev > 0 ? prev - 1 : galleryImages.length - 1) : null
    );
  }, []);

  // Split images into two columns for Tablet Masonry
  const col1Images = galleryImages.filter((_, idx) => idx % 2 === 0);
  const col2Images = galleryImages.filter((_, idx) => idx % 2 === 1);

  // Mobile thumbnails setup (5 direct + 1 "+X More" tile)
  const maxMobileThumbnails = 5;
  const displayedThumbnails = galleryImages.slice(0, maxMobileThumbnails);
  const remainingCount = galleryImages.length - maxMobileThumbnails;

  const featuredImg = galleryImages[mobileFeaturedIndex] || galleryImages[0];

  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.sectionHeading}>Event Gallery</h2>

      {/* ========================================================
          DESKTOP VIEW (>= 1280px) - UNTOUCHED, EXACT ORIGINAL
         ======================================================== */}
      <div className={`${styles.galleryLayout} ${styles.desktopOnlyGallery}`}>
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
                } ${
                  isActive
                    ? styles.galleryItemActive
                    : styles.galleryItemInactive
                }`}
                style={{ backgroundColor: img.accentColor || "#ded6c9" }}
                onClick={() => openLightbox(idx)}
              >
                <div className={styles.placeholderImageFill} aria-label={img.alt}>
                  {img.src && (
                    <img
                      src={img.src}
                      alt={img.alt}
                      className={styles.masonryCardImg}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className={styles.galleryCardBadge}>
                    {img.category || "Highlight"}
                  </div>
                  <div className={styles.galleryCardContent}>
                    <h4 className={styles.galleryCardTitle}>{img.title}</h4>
                    <p className={styles.galleryCardSub}>
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

      {/* ========================================================
          TABLET VIEW (768px - 1279px) - Proportional 2-Column CSS Grid
         ======================================================== */}
      <div className={styles.tabletOnlyGallery}>
        <p className={styles.galleryDescTablet}>
          Catch the highlights and unforgettable moments from our past events.
          Browse through our created gallery of fragrance showcases, meetups,
          and exclusive product launches across Bangladesh and beyond.
        </p>

        <div className={styles.tabletGrid}>
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className={`${styles.tabletGridItem} ${
                idx === 0 ? styles.tabletGridItemLarge : ""
              }`}
              style={{ backgroundColor: img.accentColor || "#ded6c9" }}
              onClick={() => openLightbox(idx)}
            >
              {img.src && (
                <img
                  src={img.src}
                  alt={img.alt}
                  className={styles.masonryCardImg}
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              )}
              <div className={styles.galleryCardBadge}>
                {img.category || "Highlight"}
              </div>
              <div className={styles.galleryCardContent}>
                <h4 className={styles.galleryCardTitle}>{img.title}</h4>
                <p className={styles.galleryCardSub}>
                  {img.location ? `${img.location} • ` : ""}
                  {img.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW (320px - 767px) - Text Top + 16:9 Featured Card + Thumbnails
         ======================================================== */}
      <div className={styles.mobileOnlyGallery}>
        <div className={styles.mobileTextWrap}>
          <p className={styles.galleryDescMobile}>
            Catch the highlights and unforgettable moments from our past events.
            Browse through our created gallery of fragrance showcases, meetups,
            and exclusive product launches across Bangladesh and beyond.
          </p>
          <span className={styles.readMoreLink}>Details &gt;</span>
        </div>

        {/* Featured Image Card (16:9, full width, fade transition) */}
        <div
          key={mobileFeaturedIndex}
          className={`${styles.mobileFeaturedCard} ${styles.featuredCardImgFade}`}
          style={{ backgroundColor: featuredImg.accentColor || "#ded6c9" }}
          onClick={() => openLightbox(mobileFeaturedIndex)}
        >
          {featuredImg.src && (
            <img
              src={featuredImg.src}
              alt={featuredImg.alt}
              className={styles.featuredCardImg}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
          )}
          <div className={styles.galleryCardBadge}>
            {featuredImg.category || "Highlight"}
          </div>
          <div className={styles.galleryCardContent}>
            <h4 className={styles.galleryCardTitle}>{featuredImg.title}</h4>
            <p className={styles.galleryCardSub}>
              {featuredImg.location ? `${featuredImg.location} • ` : ""}
              {featuredImg.date}
            </p>
          </div>
          <div className={styles.mobileExpandHint}>
            <span>Tap to expand ⤢</span>
          </div>
        </div>

        {/* Horizontally Scrollable Row of 80–100px Rounded Thumbnails */}
        <div className={styles.mobileThumbnailStrip}>
          {galleryImages.map((img, idx) => {
            const isSelected = mobileFeaturedIndex === idx;
            return (
              <div
                key={idx}
                className={`${styles.mobileThumbnailItem} ${
                  isSelected ? styles.mobileThumbnailItemActive : ""
                }`}
                style={{ backgroundColor: img.accentColor || "#ded6c9" }}
                onClick={() => setMobileFeaturedIndex(idx)}
              >
                {img.src && (
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={styles.thumbnailImg}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
                  />
                )}
                <span className={styles.thumbnailBadgeMini}>
                  {img.category || "Event"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          LIGHTBOX MODAL (All Viewports on click)
         ======================================================== */}
      {lightboxIndex !== null && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div
            className={styles.lightboxContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.lightboxCloseBtn}
              onClick={closeLightbox}
              aria-label="Close Lightbox"
            >
              ✕
            </button>

            <div className={styles.lightboxHeader}>
              <span className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {galleryImages.length}
              </span>
            </div>

            <div
              className={styles.lightboxImageCard}
              style={{
                backgroundColor:
                  galleryImages[lightboxIndex]?.accentColor || "#ded6c9",
              }}
            >
              {galleryImages[lightboxIndex]?.src && (
                <img
                  src={galleryImages[lightboxIndex].src}
                  alt={galleryImages[lightboxIndex].alt}
                  className={styles.lightboxImg}
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              )}
              <div className={styles.galleryCardBadge}>
                {galleryImages[lightboxIndex]?.category || "Highlight"}
              </div>
              <div className={styles.galleryCardContent}>
                <h3 className={styles.lightboxTitle}>
                  {galleryImages[lightboxIndex]?.title}
                </h3>
                <p className={styles.galleryCardSub}>
                  {galleryImages[lightboxIndex]?.location
                    ? `${galleryImages[lightboxIndex].location} • `
                    : ""}
                  {galleryImages[lightboxIndex]?.date}
                </p>
              </div>

              {/* Lightbox Navigation Buttons inside image card to prevent clipping */}
              <button
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


