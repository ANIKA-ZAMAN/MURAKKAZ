"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import {
  upcomingEvents,
  previousEvents,
  galleryImages,
  storeLocations,
} from "../data/eventsData";

export default function EventsPage() {
  const [meetGreetName, setMeetGreetName] = useState("");
  const [meetGreetEmail, setMeetGreetEmail] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const filteredLocations = storeLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
      loc.address.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* ======================= */}
        {/* SECTION 1: Upcoming Events & Meetups */}
        {/* ======================= */}
        <section className={styles.upcomingSection}>
          <h1 className={styles.sectionHeadingLarge}>
            Upcoming Events &amp; Meetups
          </h1>

          <div className={styles.upcomingList}>
            {upcomingEvents.map((event, idx) => (
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
                  <button className={styles.setReminderBtn}>Set Reminder</button>
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
            <button className={styles.paginationArrow}>&lt;</button>
            <button className={`${styles.paginationNum} ${styles.paginationActive}`}>1</button>
            <button className={styles.paginationNum}>2</button>
            <button className={styles.paginationNum}>3</button>
            <button className={styles.paginationArrow}>&gt;</button>
          </div>
        </section>

        {/* ======================= */}
        {/* SECTION 2: Previous Events */}
        {/* ======================= */}
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

        {/* ======================= */}
        {/* SECTION 3: Event Gallery */}
        {/* ======================= */}
        <section className={styles.gallerySection}>
          <h2 className={styles.sectionHeading}>Event Gallery</h2>

          <div className={styles.galleryLayout}>
            <div className={styles.galleryText}>
              <p className={styles.galleryDesc}>
                Catch the highlights and unforgettable moments from our past events.
                Browse through our curated gallery of fragrance showcases, meetups,
                and exclusive product launches across Bangladesh and beyond.
              </p>
              <a href="#" className={styles.readMoreLink}>Read More &gt;</a>
            </div>

            <div className={styles.galleryGrid}>
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`${styles.galleryItem} ${
                    idx === 0 ? styles.galleryItemLarge : ""
                  }`}
                >
                  <div className={styles.placeholderImageFill} aria-label={img.alt} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================= */}
        {/* SECTION 4: Meet-and-Greet */}
        {/* ======================= */}
        <section className={styles.meetGreetSection}>
          <h2 className={styles.sectionHeading}>Meet-and-Greet</h2>
          <p className={styles.meetGreetDesc}>
            Whether you&apos;re a first-time visitor or a loyal customer, our events are a great place
            to meet the team behind the fragrances, explore exclusive scents, and participate
            in interactive sessions with our in-house perfumers.
          </p>

          <div className={styles.meetGreetFormContainer}>
            <h3 className={styles.meetGreetFormTitle}>Everyone Registers &amp; Enters</h3>

            <div className={styles.meetGreetFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="mg-name">
                  Name
                </label>
                <input
                  id="mg-name"
                  type="text"
                  className={styles.fieldInput}
                  placeholder="Your full name"
                  value={meetGreetName}
                  onChange={(e) => setMeetGreetName(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="mg-email">
                  Email
                </label>
                <input
                  id="mg-email"
                  type="email"
                  className={styles.fieldInput}
                  placeholder="you@example.com"
                  value={meetGreetEmail}
                  onChange={(e) => setMeetGreetEmail(e.target.value)}
                />
              </div>
            </div>

            <button className={styles.submitBtn}>Submit</button>
          </div>
        </section>

        {/* ======================= */}
        {/* SECTION 5: Store Location */}
        {/* ======================= */}
        <section className={styles.storeSection}>
          <h2 className={styles.sectionHeading}>Store Location</h2>

          <div className={styles.storeSearchRow}>
            <input
              type="text"
              className={styles.storeSearchInput}
              placeholder="Search location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
          </div>

          <div className={styles.storeGrid}>
            {filteredLocations.map((loc, idx) => (
              <div key={idx} className={styles.storeCard}>
                <div className={styles.storeIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className={styles.storeInfo}>
                  <h4 className={styles.storeName}>{loc.name}</h4>
                  <p className={styles.storeAddress}>{loc.address}</p>
                  <p className={styles.storePhone}>{loc.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
