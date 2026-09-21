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
  onOpenPhoto?: (photo: { url: string; title: string; location?: string; date?: string }) => void;
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
          paginatedEvents.map((event, idx) => {
            const hasImage = Boolean(event.image && event.image.trim() !== "");
            const imageSrc = hasImage
              ? (event.image.startsWith("/") || event.image.startsWith("http")
                  ? event.image
                  : `/images/events/${event.image}`)
              : "";

            return (
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

                {/* Col 3: Image Banner or Placeholder Space */}
                <div
                  className={`${styles.exactColImageWrap} ${hasImage ? styles.exactColImageClickable : ""}`}
                  onClick={() => {
                    if (hasImage && onOpenPhoto) {
                      onOpenPhoto({
                        url: imageSrc,
                        title: event.title,
                        location: event.location,
                        date: event.month && event.day ? `${event.month} ${event.day}` : undefined,
                      });
                    }
                  }}
                  role={hasImage ? "button" : undefined}
                  tabIndex={hasImage ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (hasImage && onOpenPhoto && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onOpenPhoto({
                        url: imageSrc,
                        title: event.title,
                        location: event.location,
                        date: event.month && event.day ? `${event.month} ${event.day}` : undefined,
                      });
                    }
                  }}
                  title={hasImage ? "Click to view full photo" : undefined}
                >
                  {hasImage ? (
                    <>
                      <Image
                        src={imageSrc}
                        alt={event.title}
                        fill
                        unoptimized
                        sizes="(max-width: 860px) 100vw, 320px"
                        className={styles.exactMockImage}
                        priority={idx === 0}
                      />
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
                    </>
                  ) : (
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
                  )}
                </div>
              </div>
            );
          })
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
