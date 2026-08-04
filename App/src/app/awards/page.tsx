"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { awardsData, AwardPhoto } from "../data/awardsData";
import styles from "./page.module.css";

export default function AwardsGalleryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState<number | null>(null);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/our-story");
    }
  };

  // Filter sections and photos based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return awardsData;

    const q = searchQuery.toLowerCase().trim();
    return awardsData
      .map((sec) => {
        const matchingPhotos = sec.photos.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.date.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
        return {
          ...sec,
          photos: matchingPhotos,
        };
      })
      .filter((sec) => sec.photos.length > 0);
  }, [searchQuery]);

  // Flattened array of all currently visible photos for Lightbox navigation
  const allVisiblePhotos = useMemo(() => {
    const photos: AwardPhoto[] = [];
    filteredSections.forEach((sec) => {
      photos.push(...sec.photos);
    });
    return photos;
  }, [filteredSections]);

  const handlePhotoClick = (clickedPhoto: AwardPhoto) => {
    const globalIdx = allVisiblePhotos.findIndex((p) => p.id === clickedPhoto.id);
    if (globalIdx !== -1) {
      setLightboxActiveIndex(globalIdx);
    }
  };

  const handleNextLightbox = () => {
    if (lightboxActiveIndex === null) return;
    setLightboxActiveIndex((lightboxActiveIndex + 1) % allVisiblePhotos.length);
  };

  const handlePrevLightbox = () => {
    if (lightboxActiveIndex === null) return;
    setLightboxActiveIndex((lightboxActiveIndex - 1 + allVisiblePhotos.length) % allVisiblePhotos.length);
  };

  const currentLightboxPhoto = lightboxActiveIndex !== null ? allVisiblePhotos[lightboxActiveIndex] : null;

  return (
    <div className={styles.memoryPageWrapper}>
      <main className={styles.memoryMainContainer}>
        {/* Header Block */}
        <header className={styles.memoryHeaderContainer}>
          <button
            type="button"
            className={styles.backBtnCircle}
            onClick={handleBack}
            aria-label="Go back to our story"
          >
            <svg
              className={styles.backSvgIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <h1 className={styles.memoryMainTitle}>Awards & Recognitions</h1>
          <p className={styles.memorySubtitleParagraph}>
            Murakkaz's journey of craftsmanship and entrepreneurial success, marked by prestigious institutional honors, national business recognitions, and boutique fragrance showcases.
          </p>

          {/* Search Pill */}
          <div className={styles.searchPillWrapper}>
            <div className={styles.searchPillBox}>
              <svg
                className={styles.searchSvgIcon}
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7.5" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
              <input
                type="text"
                className={styles.searchInputField}
                placeholder="Search awards or honors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Award Sections */}
        <div className={styles.memorySectionsList}>
          {filteredSections.length > 0 ? (
            filteredSections.map((sec) => (
              <section key={sec.id} className={styles.sectionBlock}>
                <h2 className={styles.sectionHeaderTitle}>{sec.title}</h2>
                <div className={styles.galleryGrid}>
                  {sec.photos.map((photo, idx) => {
                    const isWide = idx % 3 === 0;
                    return (
                      <div
                        key={photo.id}
                        className={`${styles.masonryPhotoCard} ${
                          isWide ? styles.masonryCardWide : styles.masonryCardCompact
                        }`}
                        onClick={() => handlePhotoClick(photo)}
                      >
                        <div className={styles.photoWrap}>
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 500px"
                            className={styles.masonryImg}
                          />
                          <span className={styles.photoCategoryBadge}>
                            {photo.category}
                          </span>
                          <div className={styles.photoOverlayGradient}>
                            <h4 className={styles.photoCardTitle}>{photo.title}</h4>
                            <p className={styles.photoCardMeta}>
                              {photo.location} • {photo.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className={styles.noResultsBox}>
              <p className={styles.noResultsText}>
                No awards or honors found matching &quot;{searchQuery}&quot;.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Gallery Modal */}
      {lightboxActiveIndex !== null && currentLightboxPhoto && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxActiveIndex(null)}>
          <div className={styles.lightboxModal} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setLightboxActiveIndex(null)}
              aria-label="Close Lightbox"
            >
              ✕
            </button>

            {/* Photo Wrap */}
            <div className={styles.lightboxImageWrap}>
              <Image
                src={currentLightboxPhoto.src}
                alt={currentLightboxPhoto.alt}
                fill
                className={styles.lightboxImg}
                priority
              />

              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavPrev}`}
                onClick={handlePrevLightbox}
              >
                ‹
              </button>

              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavNext}`}
                onClick={handleNextLightbox}
              >
                ›
              </button>

              <span className={styles.lightboxCounter}>
                {lightboxActiveIndex + 1} / {allVisiblePhotos.length}
              </span>
            </div>

            {/* Caption */}
            <div className={styles.lightboxCaption}>
              <span className={styles.lightboxCategory}>
                {currentLightboxPhoto.category}
              </span>
              <h3 className={styles.lightboxTitle}>
                {currentLightboxPhoto.title}
              </h3>
              <p className={styles.lightboxSub}>
                {currentLightboxPhoto.location} • {currentLightboxPhoto.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
