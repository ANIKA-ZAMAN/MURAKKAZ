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
          <Link
            href="/events"
            className="group relative inline-flex items-center justify-center min-w-[240px] sm:min-w-[265px] px-10 h-[54px] rounded-full border-2 border-[#B8965C] bg-transparent text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ease-out hover:-translate-y-[4px] hover:bg-gradient-to-r hover:from-[#FAF6F0] hover:via-[#F3E8D8] hover:to-[#E2D2BC] hover:shadow-[0_14px_32px_rgba(184,150,92,0.4)] hover:border-[#A8864C] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            suppressHydrationWarning
          >
            {/* Shimmer light sweep on hover */}
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%] pointer-events-none" />
            <span className="relative z-10 w-full flex items-center justify-center gap-2.5 pl-[0.2em]">
              <span>View All</span>
              <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 text-[#B8965C]">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
