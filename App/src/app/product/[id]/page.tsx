"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import { productsCatalog } from "../../data/products";
import styles from "./page.module.css";

// Dynamic database mapping for premium details page content
const productsDetailMap: Record<string, {
  name: string;
  inspiredBy: string;
  description: string;
  image: string;
  family: string;
  galleryImages: string[];
  topNotes: Array<{ name: string; image: string }>;
  middleNotes: Array<{ name: string; image: string }>;
  baseNotes: Array<{ name: string; image: string }>;
  accords: Array<{ name: string; pct: number; color: string; path: string }>;
  bestFor: Array<{ name: string; pct: number }>;
  ourTake: string;
}> = {
  "jade-serenity": {
    name: "Jade Serenity",
    inspiredBy: "Inspired by Creed Original Vetiver",
    description: "Jade Serenity is a masterclass in clean, sophisticated freshness engineered explicitly to conquer hot and humid weather. Opening with a crisp, rejuvenating burst of green tea and sharp citrus, it effortlessly settles into a calming, earthy base of rich vetiver and smooth cedarwood. This isn't just a fragrance—it's an invisible suit of armor that keeps you feeling fresh, composed, and undeniably premium from morning meetings to late-night lounge sessions.",
    image: "/images/products/jade_serenity.png",
    family: "Citrus",
    galleryImages: [
      "/images/products/jade_serenity.png",
      "/images/products/amber_gold.png",
      "/images/products/velvet_oud.png",
    ],
    topNotes: [
      { name: "Osmanthus", image: "osmanthus.png" },
      { name: "Peach", image: "peach.png" },
      { name: "Neroli", image: "neroli.png" },
      { name: "Bergamot", image: "bergamot.png" },
      { name: "Mandarin", image: "mandarin.png" },
      { name: "Cinnamon", image: "cinnamon.png" },
    ],
    middleNotes: [
      { name: "Indian Tuberose", image: "indian_tuberose.png" },
      { name: "Jasmine", image: "jasmine.png" },
      { name: "Narcissus", image: "narcissus.png" },
      { name: "May Rose", image: "may_rose.png" },
    ],
    baseNotes: [
      { name: "Amber", image: "amber.png" },
      { name: "Cedar", image: "cedar.png" },
      { name: "Sandalwood", image: "sandalwood.png" },
      { name: "Patchouli", image: "patchouli.png" },
      { name: "Vetiver", image: "vetiver.png" },
    ],
    accords: [
      { name: "Citrus", pct: 100, color: "#e2cc9e", path: "M12 12c2.5-4 5.5-5 7-3s0 5-3 7L12 12z" },
      { name: "Fresh", pct: 80, color: "#b9cad7", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
      { name: "Green", pct: 60, color: "#8fb39c", path: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
      { name: "Aromatic", pct: 40, color: "#a28c73", path: "M4 18L18 4" },
    ],
    bestFor: [
      { name: "Summer & Spring", pct: 90 },
      { name: "Winter & Autumn", pct: 40 },
      { name: "Daytime Wear", pct: 80 },
      { name: "Nightly Occasions", pct: 50 },
    ],
    ourTake: "An ultra-clean summer workhorse. Rejuvenating and sharp green-citrus freshness that outlasts typical fresh perfumes."
  },
  "coral-sea": {
    name: "Coral Sea",
    inspiredBy: "Inspired by Jo Malone Wood Sage & Sea Salt",
    description: "Coral Sea transports you to windswept coastal shores. A mineral, fresh scent blending sea salt spray, earthy wood sage, and a light grapefruit undertone. Perfect for daily wear, it feels airy, natural, and refreshingly clean, evoking the spirit of freedom and raw nature.",
    image: "/images/products/coral_sea.png",
    family: "Fresh",
    galleryImages: [
      "/images/products/coral_sea.png",
      "/images/products/jade_serenity.png",
      "/images/products/magnetism.png",
    ],
    topNotes: [
      { name: "Bergamot", image: "bergamot.png" },
      { name: "Mandarin", image: "mandarin.png" },
    ],
    middleNotes: [
      { name: "Peach", image: "peach.png" },
      { name: "Neroli", image: "neroli.png" },
    ],
    baseNotes: [
      { name: "Cedar", image: "cedar.png" },
      { name: "Sandalwood", image: "sandalwood.png" },
      { name: "Amber", image: "amber.png" },
    ],
    accords: [
      { name: "Marine", pct: 100, color: "#b9cad7", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
      { name: "Salty", pct: 85, color: "#e2e2e5", path: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
      { name: "Aromatic", pct: 70, color: "#a28c73", path: "M4 18L18 4" },
      { name: "Woody", pct: 55, color: "#8a735c", path: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
    ],
    bestFor: [
      { name: "Summer & Spring", pct: 85 },
      { name: "Winter & Autumn", pct: 45 },
      { name: "Daytime Wear", pct: 90 },
      { name: "Nightly Occasions", pct: 40 },
    ],
    ourTake: "The perfect casual signature. Mineral, salty, and wonderfully breezy—highly versatile for any office or daytime setting."
  },
  "murakkaz-noir": {
    name: "Murakkaz Noir",
    inspiredBy: "Inspired by Dior Sauvage Elixir",
    description: "Murakkaz Noir is an intense, concentrated fragrance for the bold and sophisticated. Opening with sweet cardamoms, hot cinnamon, and fiery spices, it transitions smoothly into a calming lavender heart and a deep base of dark cedar, patchouli, and licorice. A true masterpiece of projection and longevity.",
    image: "/images/products/magnetism.png",
    family: "Woody",
    galleryImages: [
      "/images/products/magnetism.png",
      "/images/products/hellenist.png",
      "/images/products/velvet_oud.png",
    ],
    topNotes: [
      { name: "Cinnamon", image: "cinnamon.png" },
      { name: "Bergamot", image: "bergamot.png" },
      { name: "Mandarin", image: "mandarin.png" },
    ],
    middleNotes: [
      { name: "Neroli", image: "neroli.png" },
      { name: "May Rose", image: "may_rose.png" },
    ],
    baseNotes: [
      { name: "Sandalwood", image: "sandalwood.png" },
      { name: "Vetiver", image: "vetiver.png" },
      { name: "Amber", image: "amber.png" },
      { name: "Patchouli", image: "patchouli.png" },
      { name: "Cedar", image: "cedar.png" },
    ],
    accords: [
      { name: "Warm Spicy", pct: 100, color: "#e89f65", path: "M4 18L18 4" },
      { name: "Woody", pct: 90, color: "#a28c73", path: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
      { name: "Aromatic", pct: 80, color: "#b9cad7", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
      { name: "Lavender", pct: 60, color: "#b8a3e0", path: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
    ],
    bestFor: [
      { name: "Winter & Autumn", pct: 95 },
      { name: "Summer & Spring", pct: 50 },
      { name: "Daytime Wear", pct: 40 },
      { name: "Nightly Occasions", pct: 85 },
    ],
    ourTake: "A powerhouse elixir dupe. Dark, rich, and commanding with beast-mode performance that draws attention instantly."
  },
  "hellenist": {
    name: "Hellenist",
    inspiredBy: "Inspired by Baccarat Rouge 540",
    description: "Hellenist is an exquisite, glowing amber floral fragrance that lays on the skin like a warm, sugary breeze. Precious saffron and sweet jasmine notes fuse with rich, warm ambergris and freshly cut cedarwood to create a poetic, highly addictive fragrance signature.",
    image: "/images/products/hellenist.png",
    family: "Oriental",
    galleryImages: [
      "/images/products/hellenist.png",
      "/images/products/magnetism.png",
      "/images/products/amber_gold.png",
    ],
    topNotes: [
      { name: "Jasmine", image: "jasmine.png" },
      { name: "Mandarin", image: "mandarin.png" },
    ],
    middleNotes: [
      { name: "Neroli", image: "neroli.png" },
      { name: "May Rose", image: "may_rose.png" },
    ],
    baseNotes: [
      { name: "Cedar", image: "cedar.png" },
      { name: "Amber", image: "amber.png" },
    ],
    accords: [
      { name: "Amber", pct: 100, color: "#e2cc9e", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
      { name: "Woody", pct: 80, color: "#a28c73", path: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
      { name: "Warm Spicy", pct: 65, color: "#e89f65", path: "M4 18L18 4" },
      { name: "Floral", pct: 50, color: "#e2e2e5", path: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
    ],
    bestFor: [
      { name: "Winter & Autumn", pct: 85 },
      { name: "Summer & Spring", pct: 60 },
      { name: "Daytime Wear", pct: 50 },
      { name: "Nightly Occasions", pct: 90 },
    ],
    ourTake: "Stunningly sweet amber profile. Highly projecting and elegant, ideal for special occasions and luxury events."
  }
};

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [countdown, setCountdown] = useState(9026); // 2 hours, 30 minutes, 26 seconds
  const [isMounted, setIsMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("performance");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Size and pricing configuration
  const sizeOptions = [
    { label: "12ml", price: 500 },
    { label: "30ml", price: 900 },
    { label: "55ml", price: 1500 },
    { label: "100ml", price: 2800 },
  ];

  const [selectedSizeOpt, setSelectedSizeOpt] = useState(sizeOptions[3]); // Default to 100ml

  // Dynamic targeting logic based on URL route ID
  const targetKey = React.useMemo(() => {
    if (!id) return "jade-serenity";
    const idClean = id.toLowerCase();
    
    // Exact match or contains search
    if (idClean === "1" || idClean === "jade-serenity" || idClean.includes("jade")) {
      return "jade-serenity";
    }
    if (idClean === "2" || idClean === "coral-sea" || idClean.includes("coral")) {
      return "coral-sea";
    }
    if (idClean === "3" || idClean === "magnetism" || idClean === "murakkaz-noir" || idClean.includes("noir") || idClean.includes("magnet")) {
      return "murakkaz-noir";
    }
    if (idClean === "4" || idClean === "hellenist" || idClean.includes("hellenist")) {
      return "hellenist";
    }
    
    // Fallback: search productsCatalog family
    const catalogItem = productsCatalog.find((p) => p.id === id);
    if (catalogItem) {
      const fam = catalogItem.family.toLowerCase();
      if (fam === "woody") return "murakkaz-noir";
      if (fam === "citrus") return "jade-serenity";
      if (fam === "fresh") return "coral-sea";
      if (fam === "oriental") return "hellenist";
    }
    
    // Default fallback
    return "jade-serenity";
  }, [id]);

  const details = productsDetailMap[targetKey] || productsDetailMap["jade-serenity"];

  // Reset indices on product change
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setSelectedSizeOpt(sizeOptions[3]);
  }, [targetKey]);

  // Dynamic countdown timer loop
  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 9026));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format countdown into HH.MM.SS
  const formatCountdown = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}.${mins}.${secs}`;
  };

  // Auto-hide toast messages
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart-items");
    let cartItems = [];
    if (savedCart) {
      try {
        cartItems = JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }

    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    const existingIndex = cartItems.findIndex(
      (item: any) => item.name === details.name && item.selectedSize === selectedSizeOpt.label
    );

    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      const newItem = {
        id: `cart-${targetKey}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: details.name,
        image: details.image,
        inspiredBy: details.inspiredBy,
        selectedSize: selectedSizeOpt.label,
        quantity: quantity,
        prices: {
          "12ml": 500,
          "30ml": 900,
          "55ml": 1500,
          "100ml": 2800,
        },
        originalPrices: {
          "12ml": 720,
          "30ml": 1200,
          "55ml": 2000,
          "100ml": 3500,
        },
        selected: true,
      };
      cartItems.push(newItem);
    }

    localStorage.setItem("cart-items", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated"));
    triggerToast(`Added ${quantity}x ${details.name} (${selectedSizeOpt.label}) to your bag!`);
  };

  const handleTryNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    triggerToast(
      !isWishlisted
        ? `Added ${details.name} to your wishlist!`
        : `Removed ${details.name} from your wishlist.`
    );
  };

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  // Up to date recommendations slider list
  const recommendations = [
    {
      name: "Jade Serenity",
      description: "Inspired by Creed Original Vetiver",
      rating: 4.9,
      reviews: 250,
      price: "2,800tk",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
      id: "jade-serenity"
    },
    {
      name: "Coral Sea",
      description: "Inspired by Jo Malone Wood Sage",
      rating: 4.8,
      reviews: 120,
      price: "2,800tk",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
      id: "coral-sea"
    },
    {
      name: "Murakkaz Noir",
      description: "Inspired by Dior Sauvage Elixir",
      rating: 4.7,
      reviews: 120,
      price: "2,800tk",
      volume: "100ml",
      image: "/images/products/magnetism.png",
      id: "murakkaz-noir"
    },
    {
      name: "Hellenist",
      description: "Inspired by Baccarat Rouge 540",
      rating: 4.9,
      reviews: 310,
      price: "2,800tk",
      volume: "100ml",
      image: "/images/products/hellenist.png",
      id: "hellenist"
    },
  ];

  return (
    <div className={styles.pageBackground}>
      {/* Toast Alert Box Wrapper (stable parent node prevents removeChild hydration/unmount crashes) */}
      <div className={styles.toastWrapper}>
        {toastMessage && (
          <div className={styles.toast}>
            <div className={styles.toastContent}>
              <span className={styles.toastCheck}>✓</span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.mainContainer}>
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <Link href="/shop" className={styles.backLink}>
            <span className={styles.arrowLeft}>←</span> Shop
          </Link>
        </div>

        {/* Product Details Section */}
        <section className={styles.productSection}>
          {/* Images Column */}
          <div className={styles.imageColumn}>
            <div className={styles.mainImageWrapper}>
              <Image
                src={details.galleryImages[activeImageIndex] || details.image}
                alt={`${details.name} Perfume Main`}
                width={500}
                height={500}
                className={styles.mainImage}
                priority
              />
            </div>
            <div className={styles.thumbnailRow}>
              {details.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`${styles.thumbnail} ${
                    activeImageIndex === idx ? styles.thumbnailActive : ""
                  }`}
                  aria-label={`View product image ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail view ${idx + 1}`}
                    width={100}
                    height={100}
                    className={styles.thumbnailImg}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className={styles.detailsColumn}>
            <div className={styles.titlePriceRow}>
              <div>
                <h1 className={styles.title}>{details.name}</h1>
                <p className={styles.subtitle}>{details.inspiredBy}</p>
                <div className={styles.badgeRow}>
                  <span className={styles.badge}>Recommended by Founder</span>
                </div>
              </div>
              <div className={styles.price}>{selectedSizeOpt.price.toLocaleString()}tk</div>
            </div>

            {/* Dynamic Countdown Delivery Pill */}
            <div className={styles.discountPill}>
              <svg
                className={styles.clockIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>
                Order in <strong className={styles.timerText} suppressHydrationWarning>{isMounted ? formatCountdown(countdown) : "02.30.26"}</strong> to get next day delivery
              </span>
            </div>

            {/* Size Selector */}
            <div className={styles.optionSection}>
              <span className={styles.optionLabel}>Select Size</span>
              <div className={styles.sizeRow}>
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSelectedSizeOpt(opt);
                      triggerToast(`Selected size: ${opt.label} (${opt.price}tk)`);
                    }}
                    className={`${styles.sizeBtn} ${
                      selectedSizeOpt.label === opt.label ? styles.sizeBtnActive : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className={styles.optionSection}>
              <span className={styles.optionLabel}>Select Quantity</span>
              <div className={styles.quantityWrapper}>
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className={styles.quantityBtn}
                >
                  —
                </button>
                <span className={styles.quantityVal}>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className={styles.quantityBtn}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionRow}>
              <button
                onClick={handleTryNow}
                className={styles.buyNowBtn}
              >
                Buy now
              </button>
              <button
                onClick={handleAddToCart}
                className={styles.addToCartBtn}
              >
                Add To Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`${styles.wishlistCircle} ${
                  isWishlisted ? styles.wishlistCircleActive : ""
                }`}
                aria-label="Add to wishlist"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isWishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={styles.heartIcon}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>

            {/* Accordion description */}
            <div className={styles.accordion}>
              <button
                onClick={() => setIsDescOpen(!isDescOpen)}
                className={styles.accordionHeader}
              >
                <span>Description & Fit</span>
                <span
                  className={`${styles.caret} ${
                    isDescOpen ? styles.caretOpen : ""
                  }`}
                >
                  ▲
                </span>
              </button>
              {isDescOpen && (
                <div className={styles.accordionContent}>
                  <p>{details.description}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Dedicated Fragrance Notes Section */}
        <section className={styles.notesSection}>
          <h2 className={styles.notesSectionTitle}>Fragrance Notes</h2>
          <div className={styles.notesContainer}>
            {/* Top Notes */}
            {details.topNotes.length > 0 && (
              <div className={styles.notesGroup}>
                <h3 className={styles.notesGroupTitle}>Top Notes</h3>
                <div className={styles.notesGrid}>
                  {details.topNotes.map((note) => (
                    <div key={note.name} className={styles.noteItem}>
                      <div className={styles.noteImageWrapper}>
                        <Image
                          src={`/images/notes/${note.image}`}
                          alt={note.name}
                          width={80}
                          height={80}
                          className={styles.noteImage}
                        />
                      </div>
                      <span className={styles.noteName}>{note.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Middle Notes */}
            {details.middleNotes.length > 0 && (
              <div className={styles.notesGroup}>
                <h3 className={styles.notesGroupTitle}>Middle Notes</h3>
                <div className={styles.notesGrid}>
                  {details.middleNotes.map((note) => (
                    <div key={note.name} className={styles.noteItem}>
                      <div className={styles.noteImageWrapper}>
                        <Image
                          src={`/images/notes/${note.image}`}
                          alt={note.name}
                          width={80}
                          height={80}
                          className={styles.noteImage}
                        />
                      </div>
                      <span className={styles.noteName}>{note.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Base Notes */}
            {details.baseNotes.length > 0 && (
              <div className={styles.notesGroup}>
                <h3 className={styles.notesGroupTitle}>Base Notes</h3>
                <div className={styles.notesGrid}>
                  {details.baseNotes.map((note) => (
                    <div key={note.name} className={styles.noteItem}>
                      <div className={styles.noteImageWrapper}>
                        <Image
                          src={`/images/notes/${note.image}`}
                          alt={note.name}
                          width={80}
                          height={80}
                          className={styles.noteImage}
                        />
                      </div>
                      <span className={styles.noteName}>{note.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Tab section: Performance / Ratings & Reviews */}
        <section className={styles.tabsSection}>
          <div className={styles.tabHeaders}>
            <button
              onClick={() => setActiveTab("performance")}
              className={`${styles.tabHeaderBtn} ${
                activeTab === "performance" ? styles.tabHeaderBtnActive : ""
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`${styles.tabHeaderBtn} ${
                activeTab === "reviews" ? styles.tabHeaderBtnActive : ""
              }`}
            >
              Ratings & Reviews
            </button>
          </div>

          {/* Stable Tab Content Wrapper */}
          <div className={styles.tabContentWrapper}>
            {activeTab === "performance" && (
              <div className={styles.performanceGrid}>
                {/* Card 1: Main Accords */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Main Accords</h3>
                  {details.accords.map((accord) => (
                    <div key={accord.name} className={styles.barGroup}>
                      <div className={styles.barLabelRow}>
                        <span className={styles.accordLabel}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={accord.color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.accordIcon}
                          >
                            <path d={accord.path} />
                          </svg>
                          {accord.name}
                        </span>
                        <span>{accord.pct}%</span>
                      </div>
                      <div className={styles.barOuter}>
                        <div
                          className={styles.barInner}
                          style={{ width: `${accord.pct}%`, backgroundColor: accord.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.sourceText}>Source: Murakkaz</div>
                </div>

                {/* Card 2: Best For */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Best For</h3>
                  {details.bestFor.map((bf) => (
                    <div key={bf.name} className={styles.barGroup}>
                      <div className={styles.barLabelRow}>
                        <span>{bf.name}</span>
                        <span>{bf.pct}%</span>
                      </div>
                      <div className={styles.barOuter}>
                        <div
                          className={styles.barInner}
                          style={{ width: `${bf.pct}%`, backgroundColor: "#313134" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.sourceText}>Source: Murakkaz</div>
                </div>

                {/* Card 3: Our Take */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Our Take</h3>
                  <p className={styles.ourTakeText}>
                    "{details.ourTake}"
                  </p>
                  <div className={styles.compareBtnContainer}>
                    <button
                      onClick={() => triggerToast("Loading duplicate fragrance comparison overlay...")}
                      className={styles.compareBtn}
                    >
                      Compare Now <span className={styles.btnArrow}>→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className={styles.reviewsPlaceholder}>
                <p>No reviews yet for this product.</p>
              </div>
            )}
          </div>
        </section>

        {/* Founder Review Section */}
        <section className={styles.founderSection}>
          <h2 className={styles.sectionTitle}>Founder Review</h2>
          <div className={styles.videoPlaceholder}>
            <button
              onClick={() => triggerToast("Founder fragrance review video playback starting...")}
              className={styles.playButton}
              aria-label="Play video"
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="32" fill="white" fillOpacity="0.8" />
                <path d="M42 32L26 42V22L42 32Z" fill="#313134" />
              </svg>
            </button>
          </div>
        </section>

        {/* Recommendations Slider Section */}
        <section className={styles.recommendationSection}>
          <h2 className={styles.sectionTitle}>You May Also Like</h2>
          <div className={styles.sliderWrapper}>
            {/* Left Nav Button */}
            <button
              onClick={() => scrollSlider("left")}
              className={styles.navBtn}
              aria-label="Previous"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="15.5" stroke="#820011" />
                <path
                  d="M18 10L12 16L18 22"
                  stroke="#820011"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Slider items */}
            <div className={styles.sliderGrid} ref={sliderRef}>
              {recommendations.map((item, idx) => (
                <ProductCard
                  key={idx}
                  id={item.id}
                  brand="Murakkaz"
                  name={item.name}
                  description={item.description}
                  rating={item.rating}
                  reviews={item.reviews}
                  price={item.price}
                  volume={item.volume}
                  image={item.image}
                />
              ))}
            </div>

            {/* Right Nav Button */}
            <button
              onClick={() => scrollSlider("right")}
              className={styles.navBtn}
              aria-label="Next"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="15.5" stroke="#820011" />
                <path
                  d="M14 10L20 16L14 22"
                  stroke="#820011"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
