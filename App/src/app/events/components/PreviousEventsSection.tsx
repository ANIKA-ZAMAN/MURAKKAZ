import { previousEvents } from "../../data/eventsData";
import styles from "../page.module.css";

export default function PreviousEventsSection() {
  return (
    <section className={styles.previousSection}>
      <h2 className={styles.sectionHeading}>Previous Events</h2>

      <div className={styles.previousGrid}>
        {previousEvents.map((event, idx) => (
          <div key={idx} className={styles.previousCard}>
            <div className={styles.previousImageWrap}>
              <div className={styles.placeholderImageTall} aria-label={event.title} />
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
