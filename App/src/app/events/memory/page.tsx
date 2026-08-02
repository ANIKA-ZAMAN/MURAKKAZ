"use client";

import { useState, useMemo } from "react";
import { memoryData, extraMemorySections, MemoryPhoto } from "../../data/memoryData";
import MemoryHeader from "./components/MemoryHeader";
import MemorySection from "./components/MemorySection";
import ShowMoreButton from "./components/ShowMoreButton";
import MemoryLightbox from "./components/MemoryLightbox";
import styles from "./page.module.css";

export default function MurakkazMemoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState<number | null>(null);

  // Combine initial sections and extra sections when expanded
  const allSectionsData = useMemo(() => {
    return isExpanded ? [...memoryData, ...extraMemorySections] : memoryData;
  }, [isExpanded]);

  // Filter sections and photos based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return allSectionsData;

    const q = searchQuery.toLowerCase().trim();
    return allSectionsData
      .map((sec) => {
        const matchingPhotos = sec.photos.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.date.toLowerCase().includes(q) ||
            (p.category && p.category.toLowerCase().includes(q))
        );
        return {
          ...sec,
          photos: matchingPhotos,
        };
      })
      .filter((sec) => sec.photos.length > 0);
  }, [allSectionsData, searchQuery]);

  // Flattened array of all currently visible photos for Lightbox navigation
  const allVisiblePhotos = useMemo(() => {
    const photos: MemoryPhoto[] = [];
    filteredSections.forEach((sec) => {
      photos.push(...sec.photos);
    });
    return photos;
  }, [filteredSections]);

  const handlePhotoClick = (clickedPhoto: MemoryPhoto) => {
    const globalIdx = allVisiblePhotos.findIndex((p) => p.id === clickedPhoto.id);
    if (globalIdx !== -1) {
      setLightboxActiveIndex(globalIdx);
    }
  };

  return (
    <div className={styles.memoryPageWrapper}>
      <main className={styles.memoryMainContainer}>
        {/* Header Block: Back Button, Main Title, Paragraph & Search Pill */}
        <MemoryHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Photo Sections Grouped by Date & Title */}
        <div className={styles.memorySectionsList}>
          {filteredSections.length > 0 ? (
            filteredSections.map((sec) => (
              <MemorySection
                key={sec.id}
                section={sec}
                onPhotoClick={(photo) => handlePhotoClick(photo)}
              />
            ))
          ) : (
            <div className={styles.noResultsBox}>
              <p className={styles.noResultsText}>
                No memory photos found for &quot;{searchQuery}&quot;. Try searching for another event or place.
              </p>
              <button
                type="button"
                className={styles.resetSearchBtn}
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Show More Pill Button */}
        {!searchQuery && (
          <ShowMoreButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded((prev) => !prev)}
          />
        )}
      </main>

      {/* Fullscreen Interactive Lightbox Gallery Modal */}
      <MemoryLightbox
        photos={allVisiblePhotos}
        activeIndex={lightboxActiveIndex}
        onClose={() => setLightboxActiveIndex(null)}
        onSelectIndex={(newIdx) => setLightboxActiveIndex(newIdx)}
      />
    </div>
  );
}
