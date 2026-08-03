"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import styles from "./homepage.module.css";

/* ── Curated Real Featured Collection Products (Matching Real Product Photos) ── */
const defaultFeaturedProducts = [
  {
    id: "fc-jade-serenity",
    name: "Jade Serenity",
    brand: "MURAKKAZ EXTRAITS",
    inspiredBy: "Inspired by Creed Original Vetiver",
    description: "Jade Serenity is a masterclass in clean, sophisticated freshness blending green tea, citrus, and rich vetiver.",
    rating: 4.9,
    reviews: 250,
    price: "500tk",
    originalPrice: "720tk",
    volume: "12ml",
    image: "/images/products/jade_serenity.png",
    badge: "BESTSELLER",
  },
  {
    id: "fc-coral-sea",
    name: "Coral Sea Extrait",
    brand: "MURAKKAZ EXTRAITS",
    inspiredBy: "Inspired by Louis Vuitton Pacific Chill",
    description: "Coral Sea transports you to windswept coastal shores with mineral fresh sea salt spray, wood sage, and grapefruit.",
    rating: 4.8,
    reviews: 185,
    price: "500tk",
    originalPrice: "680tk",
    volume: "12ml",
    image: "/images/products/coral_sea.png",
    badge: "EXCLUSIVE",
  },
  {
    id: "fc-murakkaz-noir",
    name: "Murakkaz Noir",
    brand: "MURAKKAZ EXTRAITS",
    inspiredBy: "Inspired by Dior Sauvage Elixir",
    description: "Intense, concentrated fragrance opening with sweet cardamom, hot cinnamon, and dark cedar base notes.",
    rating: 4.9,
    reviews: 310,
    price: "600tk",
    originalPrice: "850tk",
    volume: "12ml",
    image: "/images/products/magnetism.png",
    badge: "EXCLUSIVE",
  },
  {
    id: "fc-hellenist",
    name: "Hellenist Imperial",
    brand: "MURAKKAZ EXTRAITS",
    inspiredBy: "Inspired by MFK Baccarat Rouge 540",
    description: "Glowing amber floral fragrance with precious saffron, sweet jasmine, and freshly cut cedarwood.",
    rating: 4.9,
    reviews: 290,
    price: "550tk",
    originalPrice: "750tk",
    volume: "12ml",
    image: "/images/products/hellenist.png",
    badge: "BESTSELLER",
  },
  {
    id: "fc-amber-gold",
    name: "Royal Amber Gold Extrait",
    brand: "MURAKKAZ EXTRAITS",
    inspiredBy: "Inspired by Kilian Angels' Share",
    description: "Ultra-concentrated rare extraits de parfum blended with wild vintage Oudh and rare Damask rose.",
    rating: 4.9,
    reviews: 210,
    price: "650tk",
    originalPrice: "900tk",
    volume: "12ml",
    image: "/images/products/amber_gold.png",
    badge: "EXCLUSIVE",
  },
  {
    id: "fc-silver-mountain",
    name: "Silver Mountain Accords",
    brand: "MURAKKAZ EXTRAITS",
    inspiredBy: "Inspired by Creed Silver Mountain Water",
    description: "Harmonious scent compositions with crisp green tea, blackcurrant, and majestic mountain air accords.",
    rating: 4.8,
    reviews: 145,
    price: "500tk",
    originalPrice: "700tk",
    volume: "12ml",
    image: "/images/products/silver_mountain.png",
    badge: "TOP PICK",
  },
  {
    id: "fc-rouge-540",
    name: "Rouge Elixir & Amber",
    brand: "MURAKKAZ EXTRAITS",
    inspiredBy: "Inspired by MFK Grand Soir & BR540",
    description: "Deep, sensual amber and rich incense formulations engineered for memorable evening occasions.",
    rating: 4.8,
    reviews: 220,
    price: "580tk",
    originalPrice: "800tk",
    volume: "12ml",
    image: "/images/products/rouge_540.png",
    badge: "LIMITED",
  },
  {
    id: "fc-velvet-oud",
    name: "Velvet Oud Imperial",
    brand: "MURAKKAZ EXTRAITS",
    inspiredBy: "Inspired by MFK Oud Satin Mood",
    description: "Exquisitely packaged discovery collections and duo gift sets featuring Bulgarian rose and agarwood.",
    rating: 4.8,
    reviews: 175,
    price: "650tk",
    originalPrice: "950tk",
    volume: "12ml",
    image: "/images/products/velvet_oud.png",
    badge: "BESTSELLER",
  },
];

export default function FeaturedCollections() {
  const [featuredProducts, setFeaturedProducts] = useState(defaultFeaturedProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch live products from backend API if available
  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:5000/api/products?limit=12")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((json) => {
        if (isMounted && json.data && Array.isArray(json.data) && json.data.length > 0) {
          const liveList = json.data.map((item: any, idx: number) => ({
            id: item.id || `prod-${idx}`,
            name: item.name,
            brand: item.brand ? item.brand.toUpperCase() : "MURAKKAZ EXTRAITS",
            inspiredBy: item.inspiredBy || (item.description && item.description.includes("Inspired by") ? item.description.split(".")[0] : ""),
            description: item.description || item.ourTake || "",
            rating: item.rating || 4.8,
            reviews: item.reviewCount || 40 + idx * 5,
            price: item.sizes && item.sizes[0] ? `${item.sizes[0].price}tk` : `${item.priceVal || 500}tk`,
            originalPrice: item.sizes && item.sizes[0]?.originalPrice ? `${item.sizes[0].originalPrice}tk` : undefined,
            volume: item.sizes && item.sizes[0] ? item.sizes[0].size : "12ml",
            image: item.image,
            badge: item.isFeatured ? "EXCLUSIVE" : idx % 3 === 0 ? "BESTSELLER" : "TOP PICK",
          }));
          setFeaturedProducts(liveList);
        }
      })
      .catch(() => {
        // Keeps default matching curated collection products
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
    <section className={styles.section} suppressHydrationWarning>
      <div className={styles.container}>
        
        {/* Section Header */}
        <div className={styles.sectionHeader} style={{ marginBottom: "2.5rem" }}>
          <h2 className={styles.sectionTitle}>
            Our <span style={{ color: "#8A6632", fontStyle: "normal" }}>Featured Collection</span>
          </h2>
          <p className={styles.sectionSubtitle}>Handpicked fragrances loved by our customers.</p>
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
                      name={product.name}
                      brand={product.brand}
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
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
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

