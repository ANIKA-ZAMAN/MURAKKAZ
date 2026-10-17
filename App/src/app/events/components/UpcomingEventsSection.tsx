"use client";

import Image from "next/image";
import { UpcomingEvent } from "../../data/eventsData";
import styles from "../page.module.css";

interface UpcomingEventsSectionProps {
  paginatedEvents: UpcomingEvent[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSetReminder: (event: UpcomingEvent) => void;
  onOpenPhoto?: (photo: {
    url: string;
    title: string;
    location?: string;
    date?: string;
    images?: string[];
    initialIndex?: number;
  }) => void;
}

import { useState } from "react";
import { getEventImageMeta } from "../../data/eventsData";

function EventCardImageVisual({
  event,
  idx,
  onOpenPhoto,
}: {
  event: UpcomingEvent;
  idx: number;
  onOpenPhoto?: UpcomingEventsSectionProps["onOpenPhoto"];
}) {
  const images = (event.images && event.images.length > 0
    ? event.images
    : (event.image ? [event.image] : [])
  ).map((img) => (img.startsWith("/") || img.startsWith("http") ? img : `/images/events/${img}`));

  const [activeIdx, setActiveIdx] = useState(0);

  const hasImages = images.length > 0;
  const currentImage = images[activeIdx] || images[0] || "";
  const currentMeta = getEventImageMeta(currentImage, event.title);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleOpen = () => {
    if (hasImages && onOpenPhoto) {
      onOpenPhoto({
        url: currentImage,
        title: event.title,
        location: event.location,
        date: event.month && event.day ? `${event.month} ${event.day}` : undefined,
        images: images,
        initialIndex: activeIdx,
      });
    }
  };

  if (!hasImages) {
    return (
      <div className={styles.exactColImageContainer}>
        <div className={styles.exactColImageWrap}>
          <div className={styles.exactPlaceholderImage}>
            <div className={styles.placeholderIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <span className={styles.placeholderLabel}>Photo Space</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.exactColImageContainer}>
      {/* Main Image Box */}
      <div
        className={`${styles.exactColImageWrap} ${styles.exactColImageClickable}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
        title="Click to view full photo gallery"
      >
        <Image
          key={currentImage}
          src={currentImage}
          alt={currentMeta.title}
          fill
          unoptimized
          sizes="(max-width: 860px) 100vw, 320px"
          className={styles.exactMockImage}
          priority={idx === 0}
        />

        {/* Counter Badge if multiple images */}
        {images.length > 1 && (
          <div className={styles.cardPhotoCounterBadge}>
            Photo {activeIdx + 1} of {images.length}
          </div>
        )}

        {/* Previous / Next Slide Buttons on Card */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.cardArrowBtn} ${styles.cardArrowPrev}`}
              onClick={handlePrev}
              aria-label="Previous slide"
              title="Slide to previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.cardArrowBtn} ${styles.cardArrowNext}`}
              onClick={handleNext}
              aria-label="Next slide"
              title="Slide to next photo"
            >
              ›
            </button>
          </>
        )}

        {/* View Full Badge */}
        <div className={styles.imageExpandBadge}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
          <span>View Full</span>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      {images.length > 1 && (
        <div className={styles.cardSlideControlBar}>
          <button
            type="button"
            className={styles.cardSlideNavBtn}
            onClick={handlePrev}
            aria-label="Previous slide"
            title="Previous photo"
          >
            ‹ Prev
          </button>

          <div className={styles.cardSlideDots}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.cardSlideDot} ${i === activeIdx ? styles.cardSlideDotActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveIdx(i);
                }}
                aria-label={`Slide to photo ${i + 1}`}
                title={`Slide to Photo ${i + 1}: ${getEventImageMeta(images[i]).shortLabel}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={styles.cardSlideNavBtn}
            onClick={handleNext}
            aria-label="Next slide"
            title="Next photo"
          >
            Next ›
          </button>
        </div>
      )}

      {/* Mini 3-Thumbnail Preview Selector Strip */}
      {images.length > 1 && (
        <div className={styles.cardThumbnailRow}>
          {images.map((imgSrc, i) => {
            const meta = getEventImageMeta(imgSrc);
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveIdx(i);
                }}
                className={`${styles.cardThumbItem} ${isActive ? styles.cardThumbActive : ""}`}
                title={`Click to view: ${meta.shortLabel}`}
                aria-label={`View ${meta.shortLabel}`}
              >
                <Image
                  src={imgSrc}
                  alt={meta.shortLabel || `Thumbnail ${i + 1}`}
                  fill
                  unoptimized
                  className={styles.cardThumbImg}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function UpcomingEventsSection({
  paginatedEvents,
  currentPage,
  totalPages,
  onPageChange,
  onSetReminder,
  onOpenPhoto,
}: UpcomingEventsSectionProps) {
  return (
    <section className={styles.upcomingSection}>
      {/* Title matching exact screenshot */}
      <h1 className={styles.exactPageTitle}>Upcoming Events &amp; Meetups</h1>

      {/* Events Card List */}
      <div className={styles.exactEventsList}>
        {(!paginatedEvents || paginatedEvents.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#8C857B' }}>
            <p style={{ fontSize: '1.25rem', fontFamily: 'serif', marginBottom: '0.5rem', color: '#2B2621', fontWeight: 500 }}>No upcoming events for now.</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Check back soon for new campus pop-ups, olfactory workshops &amp; exclusive exhibitions!</p>
          </div>
        ) : (
          paginatedEvents.map((event, idx) => (
            <div key={idx} className={styles.exactCardRow}>
              {/* Col 1: Title, Location, Set Reminder Button */}
              <div className={styles.exactColTitle}>
                <h3 className={styles.exactCardTitle}>{event.title}</h3>
                <div className={styles.exactCardLocation}>{event.location}</div>
                <button
                  type="button"
                  className={styles.exactSetReminderBtn}
                  onClick={() => onSetReminder(event)}
                >
                  Set Reminder
                </button>
              </div>

              {/* Col 2: Description Paragraph */}
              <div className={styles.exactColDesc}>
                <p className={styles.exactDescText}>{event.description}</p>
              </div>

              {/* Col 3: Event Photos Carousel & Thumbnails */}
              <EventCardImageVisual
                event={event}
                idx={idx}
                onOpenPhoto={onOpenPhoto}
              />
            </div>
          ))
        )}
      </div>

      {/* Exact Pagination Bar matching screenshot */}
      {totalPages > 1 && (
        <div className={styles.exactPaginationContainer}>
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={styles.exactArrowBtn}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            ‹
          </button>

          <div className={styles.exactPageNumbersGroup}>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`${styles.exactPageNumBtn} ${
                  currentPage === pageNum ? styles.exactPageNumActive : ""
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={styles.exactArrowBtn}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
