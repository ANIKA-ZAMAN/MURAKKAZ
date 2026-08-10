import Image from "next/image";
import { previousEvents, PreviousEvent } from "../../data/eventsData";
import styles from "../page.module.css";

interface PreviousEventsSectionProps {
  events?: PreviousEvent[];
}

export default function PreviousEventsSection({ events }: PreviousEventsSectionProps) {
  const displayEvents = events && events.length > 0 ? events : previousEvents;

  return (
    <section className={styles.previousSection}>
      <h2 className={styles.sectionHeading}>Previous Events</h2>

      <div className={styles.previousGrid}>
        {displayEvents.map((event, idx) => (
          <div key={idx} className={styles.previousCard}>
            <div className={styles.previousImageWrap}>
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className={styles.previousCardImage}
              />
            </div>
            <div className={styles.previousCardBody}>
              <h4 className={styles.previousCardTitle}>{event.title}</h4>
              <p className={styles.previousCardDate}>{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
