"use client";

import Link from "next/link";
import styles from "./homepage.module.css";

export default function ShopByOccasion() {
  const occasions = [
    {
      name: "Office",
      link: "/shop?occasion=Formal",
      bgGrad: "linear-gradient(135deg, #e4ded5 0%, #c3b9aa 100%)"
    },
    {
      name: "Daily Wear",
      link: "/shop?occasion=Daily+Wear",
      bgGrad: "linear-gradient(135deg, #dfd8cd 0%, #bdb2a1 100%)"
    },
    {
      name: "Date Night",
      link: "/shop?occasion=Date+Night",
      bgGrad: "linear-gradient(135deg, #d3c8b8 0%, #b2a490 100%)"
    },
    {
      name: "Wedding",
      link: "/shop?occasion=Formal",
      bgGrad: "linear-gradient(135deg, #cbbfaf 0%, #a79782 100%)"
    },
    {
      name: "Summer",
      link: "/shop?family=Citrus,Fresh",
      bgGrad: "linear-gradient(135deg, #e2dcd0 0%, #bfb4a1 100%)"
    },
    {
      name: "Winter",
      link: "/shop?family=Woody,Oriental",
      bgGrad: "linear-gradient(135deg, #c7baa7 0%, #a1907b 100%)"
    }
  ];

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Shop by Occasion</h2>
          <p className={styles.sectionSubtitle}>Find the perfect silhouette for any moment</p>
        </div>

        <div className={styles.occasionsGrid}>
          {occasions.map((occ, idx) => (
            <Link
              href={occ.link}
              key={idx}
              className={styles.occasionCard}
              style={{ background: occ.bgGrad }}
              suppressHydrationWarning
            >
              <div className={styles.occasionOverlay}>
                <h3 className={styles.occasionName}>{occ.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
