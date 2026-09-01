"use client";

import { useState } from "react";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
  selectedFilters: Record<string, string[]>;
  onCheckboxChange: (categoryId: string, option: string) => void;
  onClearAll: () => void;
  totalMatching: number;
}

export default function FilterSidebar({
  selectedFilters,
  onCheckboxChange,
  onClearAll,
  totalMatching,
}: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    category: true,
    gender: true,
    family: true,
    meter: true,
    occasion: true,
    notes: false,
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = [
    {
      id: "category",
      name: "Perfume Category",
      options: ["Exclusive", "Regular"],
    },
    {
      id: "gender",
      name: "Gender",
      options: ["Unisex", "Men", "Women"],
    },
    {
      id: "family",
      name: "Fragrance Family",
      options: ["Citrus", "Floral", "Woody", "Oriental", "Fresh", "Gourmand", "Chypre"],
    },
    {
      id: "meter",
      name: "Projection Meter",
      options: ["Beast Mode", "Moderate", "Intimate"],
    },
    {
      id: "occasion",
      name: "Occasion",
      options: ["Daily Wear", "Date Night", "Evening Gala", "Outdoor and Sport", "Office / Formal"],
    },
    {
      id: "notes",
      name: "Key Scent Notes",
      options: [
        "Bergamot", "Amber", "Vanilla", "Lavender", "Oud", "Saffron",
        "Jasmine", "Rose", "Lemon", "Cedarwood", "Sage", "Sea Salt"
      ],
    },
  ];

  const activeFiltersCount = Object.values(selectedFilters).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  return (
    <aside className={styles.sidebarCard}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.title}>Filters</span>
          {activeFiltersCount > 0 && (
            <span className={styles.activeBadge}>{activeFiltersCount}</span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button onClick={onClearAll} className={styles.clearBtn}>
            Clear all
          </button>
        )}
      </div>

      <div className={styles.categoriesList}>
        {/* Dynamic Category Accordions */}
        {categories.map((cat) => {
          const isExpanded = !!expanded[cat.id];
          const selectedInCat = selectedFilters[cat.id] || [];

          return (
            <div key={cat.id} className={styles.section}>
              <div
                className={styles.sectionHeader}
                onClick={() => toggleExpand(cat.id)}
              >
                <div className={styles.sectionTitleGroup}>
                  <span className={styles.sectionTitle}>{cat.name}</span>
                  {selectedInCat.length > 0 && (
                    <span className={styles.catCountBadge}>{selectedInCat.length}</span>
                  )}
                </div>
                <span className={styles.chevron}>{isExpanded ? "−" : "+"}</span>
              </div>

              {isExpanded && (
                <div className={styles.optionsList}>
                  {cat.options.map((opt) => {
                    const isChecked = selectedInCat.includes(opt);
                    return (
                      <label key={opt} className={styles.optionItem}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onCheckboxChange(cat.id, opt)}
                          className={styles.checkbox}
                        />
                        <span className={styles.optionLabel}>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Results Count Footer */}
      <div className={styles.footer}>
        <span className={styles.matchCount}>
          {totalMatching} {totalMatching === 1 ? "perfume" : "perfumes"} found
        </span>
      </div>
    </aside>
  );
}
