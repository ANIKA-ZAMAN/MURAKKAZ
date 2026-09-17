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
}

export default function UpcomingEventsSection({
  paginatedEvents,
  currentPage,
  totalPages,
  onPageChange,
  onSetReminder,
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
                <div className={styles.exactColImageWrap}>
                  {hasImage ? (
                    <Image
                      src={imageSrc}
                      alt={event.title}
                      fill
                      unoptimized
                      sizes="(max-width: 860px) 100vw, 280px"
                      className={styles.exactMockImage}
                      priority={idx === 0}
                    />
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
