"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import styles from "./homepage.module.css";

import { luxuryProducts, fetchLiveProducts } from "../data/products";

/* ── Curated Real Featured Collection Products (From 63 Master PDF Catalog) ── */
const defaultFeaturedProducts = luxuryProducts.slice(0, 8).map((p, idx) => ({
  id: p.id || `fc-${idx}`,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  inspiredBy: p.inspiredBy || `Master Fragrance`,
  description: p.description,
  rating: p.rating || 4.9,
  reviews: p.reviews || 45,
  price: p.price,
  originalPrice: p.originalPrice || "650tk",
  volume: p.volume || "12ml",
  image: p.image,
  badge: p.badge || (p.category === "Exclusive" ? "EXCLUSIVE" : idx % 2 === 0 ? "BESTSELLER" : undefined),
}));

export default function FeaturedCollections() {
  const [featuredProducts, setFeaturedProducts] = useState(defaultFeaturedProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch live products from backend API via unified fetchLiveProducts single source of truth
  useEffect(() => {
    let isMounted = true;
    fetchLiveProducts().then((data) => {
      if (isMounted && data && data.length > 0) {
        const liveList = data.slice(0, 12).map((item, idx) => ({
          id: item.id || `prod-${idx}`,
          slug: item.slug,
          name: item.name,
          brand: item.brand || "MURAKKAZ",
          category: item.category,
          inspiredBy: item.inspiredBy || "",
          description: item.description || "",
          rating: item.rating || 4.9,
          reviews: item.reviews || 45,
          price: item.price,
          originalPrice: item.originalPrice || "650tk",
          volume: item.volume || "12ml",
          image: item.image,
          badge: item.badge || (item.category === "Exclusive" ? "EXCLUSIVE" : idx % 2 === 0 ? "BESTSELLER" : undefined),
        }));
        setFeaturedProducts(liveList);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

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
    <section 
      className={styles.section} 
      style={{
        background: "linear-gradient(to bottom, #CBB9A1 0%, #D4C5B3 10%, #E3D9CC 22%, #F5F1E8 33.3%, #F5F1E8 100%)",
      }}
      suppressHydrationWarning
    >
      <div className={styles.container}>
        
        {/* Section Header - Left Aligned "Most Loved" with Libertinus Serif Display & Added Spacing */}
        <div className="w-full px-4 sm:px-10 xl:px-14" style={{ textAlign: "left", marginBottom: "4rem" }}>
          <h2 
            className={styles.sectionTitle} 
            style={{ 
              fontFamily: "var(--font-libertinus-display), 'Libertinus Serif Display', 'Libertinus Serif', Georgia, serif",
              textAlign: "left", 
              margin: "0",
              fontSize: "clamp(2.0rem, 3.6vw, 2.8rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Most <span style={{ color: "#8A6632", fontStyle: "normal" }}>Loved</span>
          </h2>
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
          <div className="overflow-hidden w-full py-6 -my-6 px-1 -mx-1">
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
                        ? "opacity-100 z-10"
                        : "opacity-80 z-0"
                    }`}
                  >
                    <ProductCard
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      brand={product.brand}
                      category={product.category}
                      inspiredBy={product.inspiredBy}
                      description={product.description}
                      rating={product.rating}
                      reviews={product.reviews}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      volume={product.volume}
                      image={product.image}
                      badge={product.badge}
                      delay={0}
                      variant="featured"
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
            className="group relative inline-flex items-center justify-center min-w-[285px] sm:min-w-[320px] px-12 sm:px-14 h-[54px] rounded-full border-2 border-[#B8965C] bg-transparent text-[#313134] font-serif-text text-[13px] font-medium tracking-[0.18em] uppercase transition-all duration-500 ease-out hover:-translate-y-[4px] hover:bg-gradient-to-r hover:from-[#FAF6F0] hover:via-[#F3E8D8] hover:to-[#E2D2BC] hover:shadow-[0_14px_32px_rgba(184,150,92,0.4)] hover:border-[#A8864C] active:scale-[0.97] active:translate-y-0 overflow-hidden select-none shrink-0 text-center"
            style={{ fontFamily: "var(--font-ibm-plex-serif), Georgia, serif" }}
            suppressHydrationWarning
          >
            <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[100%] pointer-events-none" />
            <span className="relative z-10 w-full flex items-center justify-center gap-3">
              <span>View All Collections</span>
              <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 text-[#B8965C]">→</span>
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}

