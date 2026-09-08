"use client";

import React, { useState } from "react";
import styles from "./FragranceNotes.module.css";

export interface NoteItem {
  name: string;
  image?: string;
}

interface FragranceNotesProps {
  topNotes?: NoteItem[];
  middleNotes?: NoteItem[];
  baseNotes?: NoteItem[];
  title?: string;
}

export const defaultTopNotes: NoteItem[] = [
  { name: "Juniper Berry Essence" },
  { name: "Pink Pepper" },
  { name: "Mandarin Essence" },
];

export const defaultMiddleNotes: NoteItem[] = [
  { name: "Iris Concrete" },
  { name: "Clary Sage Essence" },
  { name: "Green Maté Absolute" },
];

export const defaultBaseNotes: NoteItem[] = [
  { name: "Green Leather Accord" },
  { name: "Cedarwood Essence" },
  { name: "Vetiver" },
  { name: "Birch" },
];

export default function FragranceNotes({
  topNotes = defaultTopNotes,
  middleNotes = defaultMiddleNotes,
  baseNotes = defaultBaseNotes,
  title = "SEE THE FRAGRANCE NOTES",
}: FragranceNotesProps) {
  const [isOpen, setIsOpen] = useState(false);

  /* Compute stagger indices */
  const groups = [
    { key: "top", label: "TOP NOTES", notes: topNotes },
    { key: "middle", label: "MIDDLE NOTES", notes: middleNotes },
    { key: "base", label: "BASE NOTES", notes: baseNotes },
  ].filter((g) => g.notes && g.notes.length > 0);

  let globalNoteIndex = 0;

  return (
    <section className={styles.notesSection}>
      {/* ── Header Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${styles.notesHeaderBox} ${isOpen ? styles.notesHeaderBoxOpen : ""}`}
        aria-expanded={isOpen}
      >
        <span className={styles.notesHeaderTitle}>{title}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* ── Expandable Container (always in DOM, toggled via CSS) ── */}
      <div className={`${styles.notesContainer} ${isOpen ? styles.notesContainerOpen : ""}`}>
        <div className={styles.notesContainerInner}>
          {groups.map((group, groupIdx) => {
            const groupDelay = groupIdx * 70;
            const itemsInGroup = group.notes.map((note) => {
              const itemDelay = globalNoteIndex * 25;
              globalNoteIndex++;
              return (
                <div
                  key={note.name}
                  className={`${styles.noteItem} ${isOpen ? styles.noteItemReveal : ""}`}
                  style={{ "--item-delay": `${itemDelay}ms` } as React.CSSProperties}
                >
                  <span className={styles.noteName}>{note.name}</span>
                </div>
              );
            });

            return (
              <div
                key={group.key}
                className={`${styles.notesGroup} ${isOpen ? styles.notesGroupReveal : ""}`}
                style={{ "--group-delay": `${groupDelay}ms` } as React.CSSProperties}
              >
                <h3 className={styles.notesGroupTitle}>{group.label}</h3>
                <div className={styles.notesGrid}>{itemsInGroup}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
