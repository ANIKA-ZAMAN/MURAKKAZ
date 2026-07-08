"use client";

import { useState } from "react";
import styles from "./FilterSidebar.module.css";

interface FilterCategory {
  id: string;
  name: string;
  options: string[];
}

export default function FilterSidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    family: true,
    gender: false,
    sensation: false,
    notes: false,
    price: false,
  });

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    family: [],
    gender: [],
    sensation: [],
    notes: [],
    price: [],
  });

  const categories: FilterCategory[] = [
    {
      id: "family",
      name: "Fragrance Family",
      options: ["Citrus", "Floral", "Woody", "Oriental", "Fresh"],
    },
    {
      id: "gender",
      name: "Gender",
      options: ["Unisex", "Men", "Women"],
    },
    {
      id: "sensation",
      name: "Sensation",
      options: ["Fresh", "Warm", "Spicy", "Cozy", "Energetic"],
    },
    {
      id: "notes",
      name: "Performance Notes",
      options: ["Long Lasting", "Moderate", "Intense"],
    },
    {
      id: "price",
      name: "Price Select",
      options: ["Under ৳1,000", "৳1,000 - ৳2,000", "Over ৳2,000"],
    },
  ];

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCheckboxChange = (categoryId: string, option: string) => {
    setSelectedFilters((prev) => {
      const currentSelected = prev[categoryId] || [];
      const updated = currentSelected.includes(option)
        ? currentSelected.filter((item) => item !== option)
        : [...currentSelected, option];

      return {
        ...prev,
        [categoryId]: updated,
      };
    });
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Filter</h2>
      <div className={styles.categoriesList}>
        {categories.map((category) => {
          const isExpanded = expanded[category.id];
          return (
            <div key={category.id} className={styles.categoryBlock}>
              <button
                className={styles.headerBtn}
                onClick={() => toggleExpand(category.id)}
                aria-expanded={isExpanded}
              >
                <span className={styles.categoryName}>{category.name}</span>
                <svg
                  className={`${styles.arrowIcon} ${
                    isExpanded ? styles.arrowExpanded : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                className={`${styles.optionsContainer} ${
                  isExpanded ? styles.expanded : styles.collapsed
                }`}
              >
                <div className={styles.optionsContent}>
                  {category.options.map((option) => {
                    const isChecked = selectedFilters[category.id]?.includes(option);
                    return (
                      <label key={option} className={styles.optionLabel}>
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(category.id, option)}
                        />
                        <span className={styles.optionText}>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
