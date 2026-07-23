"use client";

import { UpcomingEvent } from "../../data/eventsData";
import styles from "../page.module.css";

interface ReminderModalProps {
  selectedEvent: UpcomingEvent | null;
  reminderName: string;
  reminderEmail: string;
  reminderSubmitted: boolean;
  onClose: () => void;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ReminderModal({
  selectedEvent,
  reminderName,
  reminderEmail,
  reminderSubmitted,
  onClose,
  onNameChange,
  onEmailChange,
  onSubmit,
}: ReminderModalProps) {
  if (!selectedEvent) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        {!reminderSubmitted ? (
          <form onSubmit={onSubmit}>
            <h3 className={styles.modalTitle}>Set Reminder</h3>
            <p className={styles.modalSubtitle}>Receive an email reminder before the event starts.</p>

            <div className={styles.modalEventSummary}>
              <div className={styles.modalEventDate}>
                <span className={styles.modalEventDay}>{selectedEvent.day}</span>
                <span className={styles.modalEventMonth}>{selectedEvent.month}</span>
              </div>
              <div className={styles.modalEventInfo}>
                <h4>{selectedEvent.title}</h4>
                <p>{selectedEvent.location}</p>
                <p className={styles.modalEventTime}>{selectedEvent.time.replace("\n", " ")}</p>
              </div>
            </div>

            <div className={styles.modalFormGroups}>
              <div className={styles.modalInputWrapper}>
                <input
                  type="text"
                  required
                  className={styles.modalInput}
                  placeholder="Your Name"
                  value={reminderName}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </div>
              <div className={styles.modalInputWrapper}>
                <input
                  type="email"
                  required
                  className={styles.modalInput}
                  placeholder="Email Address"
                  value={reminderEmail}
                  onChange={(e) => onEmailChange(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.modalSubmitBtn}>
              Confirm Reminder <span className={styles.btnArrow}>↗</span>
            </button>
          </form>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIconWrapper}>
              <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Reminder Saved!</h3>
            <p className={styles.successText}>
              We have queued your reminder registration. Click Close to return.
            </p>
            <div className={styles.successSummaryBox}>
              <p><strong>Event:</strong> {selectedEvent.title}</p>
              <p><strong>Registered Email:</strong> {reminderEmail}</p>
            </div>
            <button className={styles.modalCloseDoneBtn} onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
