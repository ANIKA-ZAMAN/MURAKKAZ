"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { awardsData, AwardPhoto } from "../data/awardsData";
import styles from "./page.module.css";

export default function AwardsGalleryPage() {
  const router = useRouter();
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState<number | null>(null);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/our-story");
    }
  };

  // Flattened array of all photos for Lightbox navigation
  const allVisiblePhotos = useMemo(() => {
    const photos: AwardPhoto[] = [];
    awardsData.forEach((sec) => {
      photos.push(...sec.photos);
    });
    return photos;
  }, []);

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
    setLightboxActiveIndex(
      (lightboxActiveIndex - 1 + allVisiblePhotos.length) % allVisiblePhotos.length
    );
  };

  const currentLightboxPhoto =
    lightboxActiveIndex !== null ? allVisiblePhotos[lightboxActiveIndex] : null;

  return (
    <div className={styles.memoryPageWrapper}>
      <main className={styles.memoryMainContainer}>
        {/* Back Button */}
        <div className={styles.topNavRow}>
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
        </div>

        {/* Centered Header Block */}
        <header className={styles.memoryHeaderContainer}>
          <h1 className={styles.memoryMainTitle}>
            <span className={styles.titleBlack}>Awards</span>{" "}
            <span className={styles.titleAmpersand}>&amp;</span>{" "}
            <span className={styles.titleRed}>Recognitions</span>
          </h1>
          <p className={styles.memorySubtitleParagraph}>
            Murakkaz&apos;s journey of craftsmanship and entrepreneurial success, marked by prestigious institutional honors, national business recognitions, and boutique fragrance showcases.
          </p>
        </header>

        {/* Award Sections - Shifted Upwards */}
        <div className={styles.memorySectionsList}>
          {awardsData.map((sec) => (
            <section key={sec.id} className={styles.sectionBlock}>
              <h2 className={styles.sectionHeaderTitle}>{sec.title}</h2>
              <div className={styles.galleryGrid}>
                {sec.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={styles.masonryPhotoCard}
                    onClick={() => handlePhotoClick(photo)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && handlePhotoClick(photo)
                    }
                    aria-label={`View award: ${photo.title}`}
                  >
                    <div className={styles.photoWrap}>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 560px"
                        className={styles.masonryImg}
                      />
                      <span className={styles.photoCategoryBadge}>
                        {photo.category}
                      </span>
                      <div className={styles.photoOverlayGradient}>
                        <h3 className={styles.photoCardTitle}>{photo.title}</h3>
                        <p className={styles.photoCardMeta}>
                          {photo.location} • {photo.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Lightbox Gallery Modal */}
      {lightboxActiveIndex !== null && currentLightboxPhoto && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightboxActiveIndex(null)}
        >
          <div
            className={styles.lightboxModal}
            onClick={(e) => e.stopPropagation()}
          >
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
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxNavNext}`}
                onClick={handleNextLightbox}
                aria-label="Next image"
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
