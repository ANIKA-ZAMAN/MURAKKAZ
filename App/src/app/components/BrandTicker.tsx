"use client";

import styles from "./BrandTicker.module.css";
import { brandTickerList as defaultBrands } from "@/app/data/brandTickerData";

interface BrandTickerProps {
  brands?: string[];
}

export default function BrandTicker({ brands = defaultBrands }: BrandTickerProps) {
  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <div className={styles.tickerContainer} suppressHydrationWarning>
      <div className={styles.tickerTrack}>
        {displayBrands.map((brand, idx) => (
          <span key={idx} className={styles.tickerItem}>
            {brand}
            <span className={styles.tickerDot}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
