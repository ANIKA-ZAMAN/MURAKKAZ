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
        <div className={styles.sectionHeader} style={{ marginBottom: "2rem" }}>
          <h2 className={styles.sectionTitle}>
            Our <span style={{ color: "#8A6632", fontStyle: "normal" }}>Featured Collection</span>
          </h2>
          <p className={styles.sectionSubtitle}>Handpicked fragrances loved by our customers.</p>
        </div>

        <div className={styles.collectionsGrid}>
          {collections.map((col, idx) => (
            <Link 
              href={col.link} 
              key={idx} 
              className={styles.collectionCard} 
              style={{ "--delay": `${idx * 240}ms` } as React.CSSProperties}
              suppressHydrationWarning
            >
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
              <div className={styles.collectionContent}>
                <h3 className={styles.collectionTitle}>{col.title}</h3>
                <p className={styles.collectionDesc}>{col.desc}</p>
                <span className={styles.collectionLink}>
                  Explore Collection
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.centerActions} style={{ marginTop: "2.5rem" }}>
          <Link
            href="/collections"
            className="group relative inline-flex items-center justify-center min-w-[240px] sm:min-w-[265px] px-10 h-[54px] rounded-full border border-[#C5A880]/70 bg-gradient-to-r from-[#FAF6F0] via-[#F3E8D8] to-[#E2D2BC] text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.2em] uppercase shadow-[0_8px_28px_rgba(49,49,52,0.07)] transition-all duration-500 ease-out hover:-translate-y-[4px] hover:shadow-[0_16px_36px_rgba(197,168,128,0.45)] hover:border-[#C5A880] overflow-hidden select-none shrink-0 text-center"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            suppressHydrationWarning
          >
            {/* Shimmer light sweep on hover */}
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%] pointer-events-none" />
            <span className="relative z-10 w-full flex items-center justify-center gap-2.5 pl-[0.2em]">
              <span>View All Collections</span>
              <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 text-[#C5A880]">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
