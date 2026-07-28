"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import styles from "./homepage.module.css";

/* ── Featured Collection Products Data (8 Curated Items with Badges) ── */
const featuredProducts = [
  {
    id: "fc-layton",
    name: "Parfums De marly Layton",
    brand: "PARFUMS DE MARLY",
    description: "Layton offers a perfect blend of freshness, spice, and warmth—exuding modern sophistication with royal heritage.",
    rating: 4.8,
    reviews: 240,
    price: "৳400 – ৳6,500",
    volume: "12ml – 100ml",
    image: "/images/products/jade_serenity.png",
    badge: "BESTSELLER",
  },
  {
    id: "fc-percival",
    name: "Parfums De marly Percival",
    brand: "PARFUMS DE MARLY",
    description: "A fresh, sensual, and refined eau de parfum presenting subtle oceanic accords with lavender and mandarin.",
    rating: 4.7,
    reviews: 185,
    price: "৳450 – ৳6,800",
    volume: "12ml – 100ml",
    image: "/images/products/coral_sea.png",
    badge: "EXCLUSIVE",
  },
  {
    id: "fc-magnetism",
    name: "Murakkaz Magnetism Extrait",
    brand: "MURAKKAZ EXTRAITS",
    description: "Rich amber and rare dark woods fused with velvety vanilla for an intoxicating, long-lasting evening presence.",
    rating: 4.9,
    reviews: 310,
    price: "৳500 – ৳7,200",
    volume: "12ml – 100ml",
    image: "/images/products/magnetism.png",
    badge: "EXCLUSIVE",
  },
  {
    id: "fc-hellenist",
    name: "Murakkaz Hellenist Imperial",
    brand: "MURAKKAZ EXTRAITS",
    description: "Inspired by ancient Mediterranean gardens, featuring sun-drenched bergamot, fig leaf, and white cedarwood.",
    rating: 4.6,
    reviews: 165,
    price: "৳480 – ৳7,000",
    volume: "12ml – 100ml",
    image: "/images/products/hellenist.png",
    badge: "BESTSELLER",
  },
  {
    id: "fc-amber-gold",
    name: "Royal Amber Gold Extrait",
    brand: "MURAKKAZ EXTRAITS",
    description: "Ultra-concentrated rare extraits de parfum blended with wild vintage Oudh and rare Damask rose.",
    rating: 4.9,
    reviews: 210,
    price: "৳650 – ৳8,500",
    volume: "12ml – 100ml",
    image: "/images/products/amber_gold.png",
    badge: "EXCLUSIVE",
  },
  {
    id: "fc-silver-mountain",
    name: "Silver Mountain Accords",
    brand: "MURAKKAZ ESSENTIALS",
    description: "Harmonious scent compositions crafted without boundaries for every gender and occasion.",
    rating: 4.5,
    reviews: 145,
    price: "৳420 – ৳6,200",
    volume: "12ml – 100ml",
    image: "/images/products/silver_mountain.png",
    badge: "TOP PICK",
  },
  {
    id: "fc-rouge-540",
    name: "Rouge Elixir & Amber",
    brand: "MURAKKAZ EXTRAITS",
    description: "Deep, sensual amber and rich incense formulations engineered for memorable night occasions.",
    rating: 4.8,
    reviews: 220,
    price: "৳520 – ৳7,600",
    volume: "12ml – 100ml",
    image: "/images/products/rouge_540.png",
    badge: "LIMITED",
  },
  {
    id: "fc-velvet-oud",
    name: "Velvet Oud Discovery Vault",
    brand: "MURAKKAZ COLLECTION",
    description: "Exquisitely packaged discovery collections and duo gift sets for perfume connoisseurs.",
    rating: 4.7,
    reviews: 175,
    price: "৳950 – ৳9,800",
    volume: "12ml – 100ml",
    image: "/images/products/velvet_oud.png",
    badge: "BESTSELLER",
  },
];

export default function FeaturedCollections() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Duplicated dataset for smooth infinite looping
  const displayItems = [...featuredProducts, ...featuredProducts];
  const maxIndex = featuredProducts.length;

  // Handle responsive visible card counts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % maxIndex);
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
  }, [maxIndex]);

  // Auto-play every 3.5 seconds
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 3500);
  }, [handleNext]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  return (
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.sectionHeader} style={{ marginBottom: "2.5rem" }}>
          <h2 className={styles.sectionTitle}>
            Our <span style={{ color: "#8A6632", fontStyle: "normal" }}>Featured Collection</span>
          </h2>
          <p className={styles.sectionSubtitle}>Handpicked fragrances loved by our customers.</p>
          <div
            style={{
              width: "3.5rem",
              height: "2px",
              backgroundColor: "#B8965C",
              margin: "0.85rem auto 0",
              borderRadius: "9999px",
              opacity: 0.7,
            }}
          />
        </div>

        {/* Carousel Container */}
        <div
          className="relative w-full overflow-hidden py-4 px-10 sm:px-14 xl:px-14"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={() => {
              handlePrev();
              stopAutoPlay();
              startAutoPlay();
            }}
            className="absolute left-1 sm:left-2 md:left-3 xl:left-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] sm:w-11 sm:h-11 xl:w-11 xl:h-11 rounded-full bg-white/95 border border-[#D5C9B3] text-[#313134] hover:bg-[#820011] hover:text-white hover:border-[#820011] shadow-md flex items-center justify-center transition-all duration-300 z-20 active:scale-95 cursor-pointer"
            aria-label="Previous"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={() => {
              handleNext();
              stopAutoPlay();
              startAutoPlay();
            }}
            className="absolute right-1 sm:right-2 md:right-3 xl:right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] sm:w-11 sm:h-11 xl:w-11 xl:h-11 rounded-full bg-white/95 border border-[#D5C9B3] text-[#313134] hover:bg-[#820011] hover:text-white hover:border-[#820011] shadow-md flex items-center justify-center transition-all duration-300 z-20 active:scale-95 cursor-pointer"
            aria-label="Next"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Track Container (Fully Responsive & Perfectly Centered with Active Focus & Side Peeks) */}
          <div className="overflow-hidden w-full">
            <div
              className={`flex items-stretch gap-4 sm:gap-5 xl:gap-6 ${
                visibleCount === 1 ? "pl-[12%]" : visibleCount === 2 ? "pl-[16%]" : "pl-0"
              }`}
              style={{
                transition: "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",
                transform:
                  visibleCount === 1
                    ? `translateX(calc(-${currentIndex} * (76% + 1rem)))`
                    : visibleCount === 2
                    ? `translateX(calc(-${currentIndex} * (68% + 1.25rem)))`
                    : `translateX(calc(-${currentIndex} * (100% / 4 + 0.375rem)))`,
              }}
            >
              {displayItems.map((product, idx) => {
                const isActive = visibleCount < 4 ? (idx % maxIndex) === currentIndex : true;
                return (
                  <div
                    key={`${product.id}-${idx}`}
                    className={`w-[76%] sm:w-[68%] xl:w-[calc((100%-4.5rem)/4)] xl:min-w-[calc((100%-4.5rem)/4)] max-w-[320px] sm:max-w-[360px] xl:max-w-none shrink-0 flex flex-col transition-all duration-500 ease-out ${
                      isActive
                        ? "scale-100 opacity-100 z-10 shadow-lg xl:scale-100 xl:opacity-100"
                        : "scale-[0.93] opacity-70 z-0 xl:scale-100 xl:opacity-100"
                    }`}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      description={product.description}
                      rating={product.rating}
                      reviews={product.reviews}
                      price={product.price}
                      volume={product.volume}
                      image={product.image}
                      badge={product.badge}
                      delay={0}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* View All Collections Button */}
        <div className={styles.centerActions} style={{ marginTop: "2.75rem" }}>
          <Link
            href="/collections"
            className="group relative inline-flex items-center justify-center min-w-[240px] sm:min-w-[265px] px-10 h-[54px] rounded-full border-2 border-[#B8965C] bg-transparent text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.2em] uppercase transition-all duration-500 ease-out hover:-translate-y-[4px] hover:bg-gradient-to-r hover:from-[#FAF6F0] hover:via-[#F3E8D8] hover:to-[#E2D2BC] hover:shadow-[0_14px_32px_rgba(184,150,92,0.4)] hover:border-[#A8864C] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
            suppressHydrationWarning
          >
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%] pointer-events-none" />
            <span className="relative z-10 w-full flex items-center justify-center gap-2.5 pl-[0.2em]">
              <span>View All Collections</span>
              <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 text-[#B8965C]">→</span>
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
