"use client";

import { useState, useEffect } from "react";
import { upcomingEvents, UpcomingEvent } from "../data/eventsData";
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

  // States for Event Reminder Modal
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);
  const [reminderName, setReminderName] = useState("");
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderSubmitted, setReminderSubmitted] = useState(false);

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

  const handleSetReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderName || !reminderEmail || !selectedEvent) return;

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

    const subject = encodeURIComponent(`Reminder Subscription: ${selectedEvent.title}`);
    const body = encodeURIComponent(
      `Hello Murakkaz Team,\n\n` +
      `I would like to set an email reminder for the following event:\n` +
      `- Event: ${selectedEvent.title}\n` +
      `- Date: ${selectedEvent.day} ${selectedEvent.month}\n` +
      `- Location: ${selectedEvent.location}\n\n` +
      `My Details:\n` +
      `- Name: ${reminderName}\n` +
      `- Email: ${reminderEmail}\n\n` +
      `Please notify me when this event is starting.\n\n` +
      `Thank you!\n` +
      `${reminderName}`
    );
    
    window.open(`mailto:sadid@murakkaz.com?subject=${subject}&body=${body}`, "_self");
    setReminderSubmitted(true);
  };

  const itemsPerPage = 3;
  const totalPages = Math.ceil(upcomingEvents.length / itemsPerPage);
  const paginatedEvents = upcomingEvents.slice(
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

        <PreviousEventsSection />

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
