"use client";

import Link from "next/link";
import Image from "next/image";
import { upcomingEvents } from "../data/eventsData";
import styles from "./homepage.module.css";

export default function UpcomingEventsSection() {
  const events = upcomingEvents.slice(0, 3);

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <p className={styles.sectionSubtitle}>Join us in person to explore our collection</p>
        </div>

        <div className={styles.eventsGrid}>
          {events.map((event, idx) => (
            <div 
              key={idx} 
              className={styles.eventCard} 
              style={{ "--delay": `${idx * 90}ms` } as React.CSSProperties}
              suppressHydrationWarning
            >
              <div className={styles.eventImageWrap}>
                <Image
                  src={`/images/events/${event.image}`}
                  alt={event.title}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.eventImage}
                  loading="lazy"
                />
                <span className={styles.eventGoldLabel}>{event.daysLeft}</span>
              </div>
              <div className={styles.eventContent}>
                <div className={styles.eventDateRow}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span>{event.day} {event.month}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDesc}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.centerActions}>
          <Link href="/events" className={styles.secondaryButton} suppressHydrationWarning>
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
