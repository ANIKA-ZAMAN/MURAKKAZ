"use client";

import { useState } from "react";
import styles from "./FilterSidebar.module.css";

interface FilterCategory {
  id: string;
  name: string;
  options?: string[];
  type?: "checkbox" | "slider";
}

export default function FilterSidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    family: true,
    gender: false,
    occasion: false,
    meter: false,
    price: false,
  });

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    family: [],
    gender: [],
    occasion: [],
    meter: [],
  });

  const [maxPrice, setMaxPrice] = useState<number>(2500);

  const categories: FilterCategory[] = [
    {
      id: "family",
      name: "Fragrance Family",
      options: ["Citrus", "Floral", "Woody", "Oriental", "Fresh"],
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
      id: "price",
      name: "Price Slider",
      type: "slider",
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
                  strokeWidth="1.5"
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
                  {category.type === "slider" ? (
                    <div className={styles.sliderWrapper}>
                      <input
                        type="range"
                        min="1000"
                        max="3000"
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className={styles.rangeInput}
                      />
                      <div className={styles.sliderValues}>
                        <span className={styles.priceMin}>1,000tk</span>
                        <span className={styles.priceCurrent}>{maxPrice.toLocaleString()}tk</span>
                        <span className={styles.priceMax}>3,000tk</span>
                      </div>
                    </div>
                  ) : (
                    category.options?.map((option) => {
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
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
