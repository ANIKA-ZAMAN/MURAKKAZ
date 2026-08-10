"use client";

import { useState, useEffect } from "react";
import { upcomingEvents, previousEvents, UpcomingEvent, PreviousEvent, fetchLiveEvents } from "../data/eventsData";
import UpcomingEventsSection from "./components/UpcomingEventsSection";
import PreviousEventsSection from "./components/PreviousEventsSection";
import EventGallerySection from "./components/EventGallerySection";
import MeetGreetSection from "./components/MeetGreetSection";
import StoreLocationSection from "./components/StoreLocationSection";
import ReminderModal from "./components/ReminderModal";
import styles from "./page.module.css";

export default function EventsPage() {
  const [meetGreetName, setMeetGreetName] = useState("");
  const [meetGreetEmail, setMeetGreetEmail] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Live Backend Data States
  const [liveUpcoming, setLiveUpcoming] = useState<UpcomingEvent[]>(upcomingEvents);
  const [livePrevious, setLivePrevious] = useState<PreviousEvent[]>(previousEvents);

  // States for Event Reminder Modal
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);
  const [reminderName, setReminderName] = useState("");
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderSubmitted, setReminderSubmitted] = useState(false);

  useEffect(() => {
    fetchLiveEvents().then((result) => {
      if (result.upcoming && result.upcoming.length > 0) {
        setLiveUpcoming(result.upcoming);
      }
      if (result.previous && result.previous.length > 0) {
        setLivePrevious(result.previous);
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && selectedEvent) {
      const savedUser = localStorage.getItem("murakkaz-user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.name) setReminderName(parsed.name);
          if (parsed.email) setReminderEmail(parsed.email);
        } catch (e) {
          console.error("Failed to parse user session", e);
        }
      }
    }
  }, [selectedEvent]);

  const handleSetReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderName || !reminderEmail || !selectedEvent) return;

    // Send reminder subscription to backend API
    const targetSlug = selectedEvent.slug || selectedEvent.id || "general";
    const apiBase = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:5000/api"
      : `${window.location.origin}/api`;

    try {
      await fetch(`${apiBase}/events/${targetSlug}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: reminderName, email: reminderEmail }),
      });
    } catch (err) {
      console.warn("Backend API reminder save fallback to local storage:", err);
    }

    const newReminder = {
      eventName: selectedEvent.title,
      eventDate: `${selectedEvent.day} ${selectedEvent.month}`,
      eventLocation: selectedEvent.location,
      name: reminderName,
      email: reminderEmail,
      registeredAt: new Date().toISOString(),
    };

    const existingRemindersRaw = localStorage.getItem("murakkaz-event-reminders");
    let reminders = [];
    if (existingRemindersRaw) {
      try {
        reminders = JSON.parse(existingRemindersRaw);
      } catch (err) {
        console.error(err);
      }
    }
    reminders.push(newReminder);
    localStorage.setItem("murakkaz-event-reminders", JSON.stringify(reminders));

    setReminderSubmitted(true);
  };

  const itemsPerPage = 3;
  const totalPages = Math.ceil(liveUpcoming.length / itemsPerPage);
  const paginatedEvents = liveUpcoming.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <UpcomingEventsSection
          paginatedEvents={paginatedEvents}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onSetReminder={(event) => {
            setSelectedEvent(event);
            setReminderSubmitted(false);
          }}
        />

        <PreviousEventsSection events={livePrevious} />

        <EventGallerySection />

        <MeetGreetSection
          name={meetGreetName}
          email={meetGreetEmail}
          onNameChange={setMeetGreetName}
          onEmailChange={setMeetGreetEmail}
        />

        <StoreLocationSection
          locationSearch={locationSearch}
          onSearchChange={setLocationSearch}
        />
      </main>

      <ReminderModal
        selectedEvent={selectedEvent}
        reminderName={reminderName}
        reminderEmail={reminderEmail}
        reminderSubmitted={reminderSubmitted}
        onClose={() => setSelectedEvent(null)}
        onNameChange={setReminderName}
        onEmailChange={setReminderEmail}
        onSubmit={handleSetReminderSubmit}
      />
    </div>
  );
}
