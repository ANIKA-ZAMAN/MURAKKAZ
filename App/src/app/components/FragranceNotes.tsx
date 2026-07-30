"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./FragranceNotes.module.css";

export interface NoteItem {
  name: string;
  image: string;
}

interface FragranceNotesProps {
  topNotes?: NoteItem[];
  middleNotes?: NoteItem[];
  baseNotes?: NoteItem[];
  title?: string;
}

export const defaultTopNotes: NoteItem[] = [
  { name: "Osmanthus", image: "osmanthus.png" },
  { name: "Peach", image: "peach.png" },
  { name: "Neroli", image: "neroli.png" },
  { name: "Bergamot", image: "bergamot.png" },
  { name: "Mandarin", image: "mandarin.png" },
  { name: "Cinnamon", image: "cinnamon.png" },
];

export const defaultMiddleNotes: NoteItem[] = [
  { name: "Indian Tuberose", image: "indian_tuberose.png" },
  { name: "Jasmine", image: "jasmine.png" },
  { name: "Narcissus", image: "narcissus.png" },
  { name: "May Rose", image: "may_rose.png" },
];

export const defaultBaseNotes: NoteItem[] = [
  { name: "Amber", image: "amber.png" },
  { name: "Cedar", image: "cedar.png" },
  { name: "Sandalwood", image: "sandalwood.png" },
  { name: "Patchouli", image: "patchouli.png" },
  { name: "Vetiver", image: "vetiver.png" },
];

export default function FragranceNotes({
  topNotes = defaultTopNotes,
  middleNotes = defaultMiddleNotes,
  baseNotes = defaultBaseNotes,
  title = "SEE THE FRAGRANCE NOTES",
}: FragranceNotesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.notesSection}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${styles.notesHeaderBox} ${isOpen ? styles.notesHeaderBoxOpen : ""}`}
        aria-expanded={isOpen}
      >
        <span className={styles.notesHeaderTitle}>
          {title || "SEE THE FRAGRANCE NOTES"}
        </span>
        <span className={styles.toggleArrow}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.notesContainer}>
          {/* TOP NOTES */}
          {topNotes.length > 0 && (
            <div className={styles.notesGroup}>
              <h3 className={styles.notesGroupTitle}>TOP NOTES</h3>
              <div className={styles.notesGrid}>
                {topNotes.map((note) => (
                  <div key={note.name} className={styles.noteItem}>
                    <div className={styles.noteImageWrapper}>
                      <img
                        src={`/images/notes/${note.image}`}
                        alt={note.name}
                        className={styles.noteImage}
                      />
                    </div>
                    <span className={styles.noteName}>{note.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MIDDLE NOTES */}
          {middleNotes.length > 0 && (
            <div className={styles.notesGroup}>
              <h3 className={styles.notesGroupTitle}>MIDDLE NOTES</h3>
              <div className={styles.notesGrid}>
                {middleNotes.map((note) => (
                  <div key={note.name} className={styles.noteItem}>
                    <div className={styles.noteImageWrapper}>
                      <img
                        src={`/images/notes/${note.image}`}
                        alt={note.name}
                        className={styles.noteImage}
                      />
                    </div>
                    <span className={styles.noteName}>{note.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BASE NOTES */}
          {baseNotes.length > 0 && (
            <div className={styles.notesGroup}>
              <h3 className={styles.notesGroupTitle}>BASE NOTES</h3>
              <div className={styles.notesGrid}>
                {baseNotes.map((note) => (
                  <div key={note.name} className={styles.noteItem}>
                    <div className={styles.noteImageWrapper}>
                      <img
                        src={`/images/notes/${note.image}`}
                        alt={note.name}
                        className={styles.noteImage}
                      />
                    </div>
                    <span className={styles.noteName}>{note.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
