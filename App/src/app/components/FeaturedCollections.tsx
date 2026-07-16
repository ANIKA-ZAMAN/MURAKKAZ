"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./homepage.module.css";

export default function FeaturedCollections() {
  const collections = [
    {
      title: "Best Sellers",
      desc: "Our most sought-after formulations, celebrated for their outstanding performance and captivating sillage.",
      image: "/images/products/jade_serenity.png",
      link: "/shop?occasion=Formal"
    },
    {
      title: "New Arrivals",
      desc: "Explore our latest olfactory innovations, introducing modern silhouettes and rare botanical accords.",
      image: "/images/products/coral_sea.png",
      link: "/shop?family=Fresh"
    },
    {
      title: "Signature Collection",
      desc: "Timeless extraits de parfum capturing the core essence of Murakkaz craftsmanship.",
      image: "/images/products/magnetism.png",
      link: "/shop?gender=Unisex"
    },
    {
      title: "Seasonal Collection",
      desc: "Curated fragrances selected to complement the weather, shifting with temperature and humidity.",
      image: "/images/products/hellenist.png",
      link: "/shop?occasion=Night+Out"
    }
  ];

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Collections</h2>
          <p className={styles.sectionSubtitle}>Curated profiles for every fragrance connoisseur</p>
        </div>

        <div className={styles.collectionsGrid}>
          {collections.map((col, idx) => (
            <Link href={col.link} key={idx} className={styles.collectionCard} suppressHydrationWarning>
              <div className={styles.collectionImageWrap}>
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={styles.collectionImage}
                  loading="lazy"
                />
              </div>
              <h3 className={styles.collectionTitle}>{col.title}</h3>
              <p className={styles.collectionDesc}>{col.desc}</p>
              <span className={styles.collectionLink}>
                Explore Collection
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
