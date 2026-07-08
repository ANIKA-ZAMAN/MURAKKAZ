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
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(upcomingEvents.length / itemsPerPage);
  const paginatedEvents = upcomingEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className={styles.paginationArrow}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`${styles.paginationNum} ${
                  currentPage === pageNum ? styles.paginationActive : ""
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className={styles.paginationArrow}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
            >
              &gt;
            </button>
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

        <section className={styles.meetGreetSection}>
          <h2 className={styles.sectionHeading}>Meet-and-Greet</h2>
          <p className={styles.meetGreetDesc}>
            Are you organizing a premium lifestyle exhibition, corporate gala, or an exclusive fashion event in Bangladesh? Partner with Murakkaz to bring a live olfactory blending station or an award-winning luxury pop-up stall to your venue.
          </p>

          <div className={styles.meetGreetFormContainer}>
            <h3 className={styles.meetGreetFormTitle}>Business Inquiries &amp; Meetup</h3>

            <div className={styles.formLayout}>
              {/* Row 1: Name, Company/Event Name, Book Button */}
              <div className={styles.formRow1}>
                <input
                  type="text"
                  className={styles.fieldInput}
                  placeholder="Name"
                  value={meetGreetName}
                  onChange={(e) => setMeetGreetName(e.target.value)}
                />
                <input
                  type="text"
                  className={styles.fieldInput}
                  placeholder="Company/Event Name"
                  value={meetGreetEmail}
                  onChange={(e) => setMeetGreetEmail(e.target.value)}
                />
                <button className={styles.submitBtn}>
                  Book <span className={styles.btnArrow}>↗</span>
                </button>
              </div>

              {/* Row 2: Date, Location */}
              <div className={styles.formRow2}>
                <div className={styles.selectWrapper}>
                  <select className={styles.fieldSelect} defaultValue="">
                    <option value="" disabled>Date</option>
                    <option value="nsu">05 July (NSU)</option>
                    <option value="bracu">11 July (BRACU)</option>
                    <option value="iccb">05 July (ICCB)</option>
                  </select>
                  <span className={styles.selectCaret}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <input
                  type="text"
                  className={styles.fieldInput}
                  placeholder="Location"
                />
              </div>

              {/* Row 3: Message Textarea */}
              <div className={styles.formRow3}>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Message"
                  rows={6}
                />
              </div>
            </div>
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
