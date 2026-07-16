"use client";

import Link from "next/link";
import styles from "./homepage.module.css";

export default function ShopByNotes() {
  const notes = [
    {
      name: "Bergamot",
      link: "/shop?notes=Bergamot",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* citrus outline */}
          <circle cx="12" cy="12" r="8" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          <path d="M4 12h16" />
        </svg>
      )
    },
    {
      name: "Vanilla",
      link: "/shop?notes=Vanilla",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* vanilla orchid/pod style */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18C8.5 7.5 4 12 4 12s4.5 4.5 8 9m0-18c3.5 4.5 8 9 8 9s-4.5 4.5-8 9" />
        </svg>
      )
    },
    {
      name: "Rose",
      link: "/shop?notes=Rose",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* rose spiral outline */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 0a6 6 0 110-12 6 6 0 010 12zm0 0a8 8 0 100-16 8 8 0 000 16zm0 0v8" />
        </svg>
      )
    },
    {
      name: "Leather",
      link: "/shop?notes=Leather",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* leather hide/shield style */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )
    },
    {
      name: "Vetiver",
      link: "/shop?notes=Vetiver",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* botanical roots/grass style */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12m-9 0h6m-6-12h6m-3 0v12" />
        </svg>
      )
    },
    {
      name: "Amber",
      link: "/shop?notes=Amber",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* diamond/crystal style */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Shop by Notes</h2>
          <p className={styles.sectionSubtitle}>Discover key ingredients that define your scent</p>
        </div>

        <div className={styles.notesGrid}>
          {notes.map((note, idx) => (
            <Link href={note.link} key={idx} className={styles.noteCard} suppressHydrationWarning>
              <div className={styles.noteCircle}>{note.icon}</div>
              <span className={styles.noteName}>{note.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
