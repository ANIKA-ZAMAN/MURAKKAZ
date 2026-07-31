"use client";

import { useState, useEffect } from "react";
import styles from "./FilterDrawer.module.css";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: Record<string, string[]>;
  onCheckboxChange: (categoryId: string, option: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
  onClearAll: () => void;
  totalMatching: number;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedFilters,
  onCheckboxChange,
  maxPrice,
  onPriceChange,
  onClearAll,
  totalMatching,
}: FilterDrawerProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    price: true,
    family: true,
    gender: true,
    occasion: true,
    meter: true,
    notes: true,
  });

  // Handle Escape key press to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const noteOptions = [
    "Bergamot",
    "Amber",
    "Vanilla",
    "Lavender",
    "Oud",
    "Saffron",
    "Jasmine",
    "Rose",
    "Lemon",
    "Cedarwood",
    "Sage",
    "Sea Salt",
    "Pineapple",
    "Grapefruit",
  ];

  const categories = [
    {
      id: "price",
      name: "Price Range",
      type: "slider",
    },
    {
      id: "family",
      name: "Fragrance Family",
      options: ["Citrus", "Floral", "Woody", "Oriental", "Fresh", "Gourmand", "Chypre"],
      type: "checkbox",
    },
    {
      id: "gender",
      name: "Gender",
      options: ["Unisex", "Men", "Women"],
      type: "checkbox",
    },
    {
      id: "occasion",
      name: "Occasion",
      options: ["Casual", "Formal", "Night Out", "Date Night", "Daily Wear"],
      type: "checkbox",
    },
    {
      id: "meter",
      name: "Performance Meter",
      options: ["Beast Mode", "Long Lasting", "Moderate", "Intimate"],
      type: "checkbox",
    },
    {
      id: "notes",
      name: "Scent Notes & Accords",
      options: noteOptions,
      type: "tags",
    },
  ];

  const activeCount = Object.values(selectedFilters).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  return (
    <>
      {/* Translucent Dark Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Half Page Drawer */}
      <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`} aria-label="Filter panel">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <svg
              className={styles.headerIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#820011"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <h2 className={styles.title}>FILTERS</h2>
            {activeCount > 0 && <span className={styles.headerBadge}>{activeCount}</span>}
          </div>

          <div className={styles.headerActions}>
            {activeCount > 0 && (
              <button className={styles.clearBtn} onClick={onClearAll}>
                Clear All
              </button>
            )}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close filter panel">
              ✕
            </button>
          </div>
        </div>

        {/* Filter Categories Body */}
        <div className={styles.body}>
          {categories.map((cat) => {
            const isExpanded = expanded[cat.id];
            return (
              <div key={cat.id} className={styles.categoryBlock}>
                <button
                  className={styles.categoryHeader}
                  onClick={() => toggleExpand(cat.id)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.categoryName}>{cat.name}</span>
                  <svg
                    className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className={styles.categoryContent}>
                    {cat.type === "slider" && (
                      <div className={styles.sliderWrapper}>
                        <div className={styles.sliderHeader}>
                          <span className={styles.sliderLabel}>Max Price</span>
                          <span className={styles.sliderValue}>{maxPrice.toLocaleString()}tk</span>
                        </div>
                        <input
                          type="range"
                          min="300"
                          max="10000"
                          step="100"
                          value={maxPrice}
                          onChange={(e) => onPriceChange(Number(e.target.value))}
                          className={styles.rangeInput}
                        />
                        <div className={styles.sliderLimits}>
                          <span>300tk</span>
                          <span>10,000tk</span>
                        </div>
                      </div>
                    )}

                    {cat.type === "checkbox" && (
                      <div className={styles.checkboxGrid}>
                        {cat.options?.map((option) => {
                          const isChecked = selectedFilters[cat.id]?.includes(option);
                          return (
                            <label key={option} className={styles.optionLabel}>
                              <input
                                type="checkbox"
                                className={styles.checkboxInput}
                                checked={!!isChecked}
                                onChange={() => onCheckboxChange(cat.id, option)}
                              />
                              <span className={styles.optionText}>{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {cat.type === "tags" && (
                      <div className={styles.tagsGrid}>
                        {cat.options?.map((note) => {
                          const isSelected = selectedFilters.notes?.includes(note);
                          return (
                            <button
                              key={note}
                              type="button"
                              className={`${styles.tagPill} ${
                                isSelected ? styles.tagPillSelected : ""
                              }`}
                              onClick={() => onCheckboxChange("notes", note)}
                            >
                              {note}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.applyBtn} onClick={onClose}>
            Apply Filters ({totalMatching} Perfumes)
          </button>
        </div>
      </aside>
    </>
  );
}
