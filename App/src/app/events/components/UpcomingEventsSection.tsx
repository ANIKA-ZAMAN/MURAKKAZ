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
      <h1 className={styles.sectionHeadingLarge}>
        Upcoming Events &amp; Meetups
      </h1>

      <div className={styles.upcomingList}>
        {paginatedEvents.map((event, idx) => (
          <div key={idx} className={styles.upcomingRow}>
            {/* Col 1: Date */}
            <div className={styles.dateBlock}>
              <span className={styles.dateDay}>{event.day}</span>
              <span className={styles.dateMonth}>{event.month}</span>
              <p className={styles.upcomingTime}>{event.time}</p>
            </div>

            {/* Col 2: Title + Location + Days Left + Button */}
            <div className={styles.upcomingInfo}>
              <h3 className={styles.upcomingTitle}>{event.title}</h3>
              <p className={styles.upcomingLocation}>{event.location}</p>
              <p className={styles.upcomingDaysLeft}>{event.daysLeft}</p>
              <button
                className={styles.setReminderBtn}
                onClick={() => onSetReminder(event)}
              >
                Set Reminder
              </button>
            </div>

            {/* Col 3 & 4: Image and Description — alternating */}
            {idx % 2 === 0 ? (
              <>
                <div className={styles.upcomingImageWrap}>
                  <Image
                    src={`/images/events/${event.image}`}
                    alt="Event Image"
                    width={302}
                    height={212}
                    className={styles.boxSvgImage}
                    priority
                  />
                </div>
                <div className={styles.upcomingDescWrap}>
                  <p className={styles.upcomingDesc}>{event.description}</p>
                </div>
              </>
            ) : (
              <>
                <div className={styles.upcomingDescWrap}>
                  <p className={styles.upcomingDesc}>{event.description}</p>
                </div>
                <div className={styles.upcomingImageWrap}>
                  <Image
                    src={`/images/events/${event.image}`}
                    alt="Event Image"
                    width={302}
                    height={212}
                    className={styles.boxSvgImage}
                    priority
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className={styles.paginationArrow}
          disabled={currentPage === 1}
          style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
        >
          &lt;
        </button>
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
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className={styles.paginationArrow}
          disabled={currentPage === totalPages}
          style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}
