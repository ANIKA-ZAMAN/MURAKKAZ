"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./homepage.module.css";

export default function ShopByOccasion() {
  const occasions = [
    {
      name: "Office",
      link: "/shop?occasion=Formal",
      image: "/images/occasions/office.png"
    },
    {
      name: "Daily Wear",
      link: "/shop?occasion=Daily+Wear",
      image: "/images/occasions/daily.png"
    },
    {
      name: "Date Night",
      link: "/shop?occasion=Date+Night",
      image: "/images/occasions/date_night.png"
    },
    {
      name: "Wedding",
      link: "/shop?occasion=Formal",
      image: "/images/occasions/wedding.png"
    },
    {
      name: "Summer",
      link: "/shop?family=Citrus,Fresh",
      image: "/images/occasions/summer.png"
    },
    {
      name: "Winter",
      link: "/shop?family=Woody,Oriental",
      image: "/images/occasions/winter.png"
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
              style={{ "--delay": `${idx * 180}ms` } as React.CSSProperties}
              suppressHydrationWarning
            >
              <div className={styles.occasionImageContainer}>
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className={styles.occasionImage}
                />
              </div>
              <div className={styles.occasionOverlay}>
                <h3 className={styles.occasionName}>{occ.name}</h3>
                <span className={styles.occasionCta}>Explore Collection &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
