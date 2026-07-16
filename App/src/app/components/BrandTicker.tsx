"use client";

import styles from "./BrandTicker.module.css";

const brands = [
  "Amouage", "Armaf", "Armani", "Azzaro", "Bentley", "Burberry", "Bvlgari", 
  "Carolina Herrera", "Chanel", "Creed", "Dior", "Dolce & Gabbana", 
  "Tom Ford", "Versace", "Yves Saint Laurent", "Roja Parfums", 
  "Maison Francis Kurkdjian", "Byredo", "Xerjoff", "Nishane", "Le Labo"
];

export default function BrandTicker() {
  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <div className={styles.tickerContainer} suppressHydrationWarning>
      <div className={styles.tickerTrack}>
        {displayBrands.map((brand, idx) => (
          <span key={idx} className={styles.tickerItem}>
            {brand}
            <span className={styles.tickerDot}>&bull;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
