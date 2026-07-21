"use client";

import styles from "./BrandTicker.module.css";

const brands = [
  "Dior Sauvage",
  "Bleu de Chanel",
  "Creed Aventus",
  "Versace Eros",
  "YSL Y Eau de Parfum",
  "Giorgio Armani Stronger With You",
  "Tom Ford Oud Wood",
  "Tom Ford Tobacco Vanille",
  "Acqua di Gio Profumo",
  "Parfums de Marly Layton",
  "Baccarat Rouge 540",
  "Louis Vuitton Imagination",
  "Louis Vuitton Afternoon Swim",
  "Chanel Allure Homme Sport",
  "Dior Homme Intense",
  "Jean Paul Gaultier Le Male Le Parfum",
  "Jean Paul Gaultier Ultra Male",
  "Xerjoff Erba Pura",
  "Nishane Hacivat",
  "Mancera Cedrat Boise",
  "Initio Side Effect",
  "Maison Margiela Jazz Club",
  "Maison Margiela By the Fireplace",
  "Tom Ford Lost Cherry",
  "Carolina Herrera 212 VIP Black",
  "Carolina Herrera Good Girl",
  "YSL Libre Intense",
  "Chanel Coco Mademoiselle",
  "Delina Exclusif",
  "Gucci Bloom"
];

export default function BrandTicker() {
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
