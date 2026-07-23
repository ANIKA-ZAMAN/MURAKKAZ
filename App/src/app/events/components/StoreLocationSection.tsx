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
  const filteredLocations = storeLocations.filter(
    (loc) =>
      loc.zone.toLowerCase().includes(locationSearch.toLowerCase()) ||
      loc.address.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <section className={styles.storeSection}>
      <h2 className={styles.sectionHeading}>Store Location</h2>

      <div className={styles.storeControlsRow}>
        {/* Zone dropdown */}
        <div className={styles.zoneDropdownWrapper}>
          <select className={styles.zoneSelect} defaultValue="">
            <option value="">Zone</option>
            <option value="dhaka">Dhaka</option>
            <option value="chattogram">Chattogram</option>
          </select>
          <span className={styles.zoneCaret}>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>

        {/* Search input with icon */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className={styles.storeSearchInput}
            placeholder="search your area"
            value={locationSearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.storeGrid}>
        {filteredLocations.map((loc, idx) => (
          <div key={idx} className={styles.storeCard}>
            <div className={styles.storeCardNum}>{loc.id}</div>
            <div className={styles.storeCardContent}>
              <h4 className={styles.storeCardAddress}>{loc.address}</h4>
              <p className={styles.storeCardZone}>Zone: {loc.zone}</p>
              <p className={styles.storeCardContract}>Contract: {loc.contract}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
