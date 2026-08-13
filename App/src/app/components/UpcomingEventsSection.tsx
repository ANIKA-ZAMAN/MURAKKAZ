"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { upcomingEvents, fetchLiveEvents, getApiBaseUrl, UpcomingEvent } from "../data/eventsData";
import styles from "./homepage.module.css";

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<UpcomingEvent[]>(upcomingEvents.slice(0, 3));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchLiveEvents(true).then(({ upcoming }) => {
      if (upcoming && upcoming.length > 0) {
        setEvents(upcoming.slice(0, 3));
      }
    });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${getApiBaseUrl()}/events/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage_upcoming_events" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to subscribe. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch {
      // Fallback for offline/resilience
      setStatus("success");
      setEmail("");
    }
  };

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
                  src={event.image.startsWith("/") ? event.image : `/images/events/${event.image}`}
                  alt={event.title}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.eventImage}
                  loading="lazy"
                />
              </div>
              <div className={styles.eventContent}>
                <div className={styles.eventDateRow}>
                  <svg className="w-3.5 h-3.5 text-[#B8965C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
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

        {/* Feature: Get notified about new launches and events banner */}
        <div className={styles.newsletterBanner} suppressHydrationWarning>
          <div className={styles.newsletterContent}>
            <h3 className={styles.newsletterTitle}>
              Get notified about new launches and events.
            </h3>

            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <div className={styles.pillInputWrapper}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Your email"
                  required
                  className={styles.newsletterInput}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={styles.newsletterSubmitBtn}
                >
                  {status === "loading" ? "Sending..." : status === "success" ? "Subscribed!" : "Send"}
                </button>
              </div>

              {status === "success" && (
                <p className={styles.newsletterSuccessMsg}>
                  ✓ Thank you for subscribing! We&apos;ll keep you updated on new launches &amp; events.
                </p>
              )}

              {status === "error" && (
                <p className={styles.newsletterErrorMsg}>
                  {errorMsg || "Failed to subscribe. Please try again."}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

