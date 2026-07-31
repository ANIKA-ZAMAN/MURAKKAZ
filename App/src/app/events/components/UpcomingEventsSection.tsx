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
      <div className={styles.headerGroup}>
        <span className={styles.headerEyebrow}>EXHIBITIONS & MEETUPS</span>
        <h1 className={styles.sectionHeadingLarge}>
          Upcoming Olfactory Masterclasses
        </h1>
        <p className={styles.sectionSubheading}>
          Join us live across campuses and luxury venues for hands-on scent profiling, new formulation reveals, and private consultations.
        </p>
      </div>

      <div className={styles.upcomingList}>
        {paginatedEvents.map((event, idx) => {
          const imageSrc = event.image.startsWith("/")
            ? event.image
            : `/images/events/${event.image}`;

          return (
            <div key={idx} className={styles.upcomingRow}>
              {/* Col 1: Gold Calendar Badge */}
              <div className={styles.dateBlock}>
                <span className={styles.dateDay}>{event.day}</span>
                <span className={styles.dateMonth}>{event.month}</span>
                <div className={styles.upcomingTimeBadge}>{event.time.replace('\n', ' ')}</div>
              </div>

              {/* Col 2: Event Details */}
              <div className={styles.upcomingInfo}>
                <div className={styles.daysLeftPill}>{event.daysLeft}</div>
                <h3 className={styles.upcomingTitle}>{event.title}</h3>
                <p className={styles.upcomingLocation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {event.location}
                </p>

                <button
                  className={styles.setReminderBtn}
                  onClick={() => onSetReminder(event)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  Set Event Reminder
                </button>
              </div>

              {/* Col 3: Image Banner */}
              <div className={styles.upcomingImageWrap}>
                <Image
                  src={imageSrc}
                  alt={event.title}
                  width={340}
                  height={220}
                  className={styles.boxSvgImage}
                  priority
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              {/* Col 4: Description */}
              <div className={styles.upcomingDescWrap}>
                <p className={styles.upcomingDesc}>{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={styles.paginationArrow}
            disabled={currentPage === 1}
            style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            ← Previous
          </button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`${styles.paginationNum} ${
                  currentPage === pageNum ? styles.paginationActive : ""
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={styles.paginationArrow}
            disabled={currentPage === totalPages}
            style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
