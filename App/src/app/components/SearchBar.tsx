"use client";

import { useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
}

export default function SearchBar({
  placeholder = "Search your perfume",
  onSearch,
  value,
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const query = value !== undefined ? value : internalQuery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (value === undefined) {
      setInternalQuery(val);
    }
    onSearch?.(val);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={styles.searchInput}
      />
      <svg
        className={styles.searchIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  );
}
