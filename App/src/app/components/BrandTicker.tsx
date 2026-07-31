"use client";

import Link from "next/link";
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
          <Link
            key={idx}
            href={`/shop?q=${encodeURIComponent(brand)}`}
            className={styles.tickerItem}
            title={`View ${brand} Collection`}
          >
            <span>{brand}</span>
            <span className={styles.tickerDot}>✦</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
