"use client";

import { useState } from "react";
import { storeLocations } from "../../data/eventsData";
import styles from "../page.module.css";

interface StoreLocationSectionProps {
  locationSearch: string;
  onSearchChange: (val: string) => void;
}

export default function StoreLocationSection({
  locationSearch,
  onSearchChange,
}: StoreLocationSectionProps) {
  const [selectedZone, setSelectedZone] = useState("");

  const filteredLocations = storeLocations.filter((loc) => {
    const matchesZone =
      !selectedZone || loc.zone.toLowerCase().includes(selectedZone.toLowerCase());
    const matchesSearch =
      !locationSearch ||
      loc.zone.toLowerCase().includes(locationSearch.toLowerCase()) ||
      loc.address.toLowerCase().includes(locationSearch.toLowerCase());
    return matchesZone && matchesSearch;
  });

  return (
    <section className={styles.storeSection}>
      <h2 className={styles.exactPageTitle}>Store Location</h2>

      {/* Control Bar: Zone Select & Search Input */}
      <div className={styles.exactStoreControlsRow}>
        <div className={styles.exactZoneDropdownWrapper}>
          <select
            className={styles.exactZoneSelect}
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            <option value="">Zone</option>
            <option value="banani">Dhaka, Banani</option>
            <option value="dhanmondi">Dhaka, Dhanmondi</option>
            <option value="chattogram">Chattogram</option>
            <option value="bashundhara">Dhaka, Bashundhara</option>
          </select>
          <span className={styles.exactZoneCaret}>⌄</span>
        </div>

        <div className={styles.exactSearchWrapper}>
          <span className={styles.exactSearchIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className={styles.exactStoreSearchInput}
            placeholder="search your area"
            value={locationSearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Store Location Cards Grid */}
      <div className={styles.exactStoreGrid}>
        {filteredLocations.map((loc, idx) => (
          <div key={idx} className={styles.exactStoreCard}>
            <span className={styles.exactStoreCardNum}>{loc.id}</span>
            <div className={styles.exactStoreCardBody}>
              <h4 className={styles.exactStoreAddress}>{loc.address}</h4>
              <p className={styles.exactStoreZone}>Zone: {loc.zone}</p>
              <p className={styles.exactStoreContract}>Contract: {loc.contract}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
