"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import styles from "./page.module.css";

export default function JadeSerenityProductPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(9026); // 2 hours, 30 minutes, 26 seconds (02.30.26)
  const [isMounted, setIsMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("performance"); // Restored default tab to performance
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Size and pricing configuration requested by the user
  const sizeOptions = [
    { label: "12ml", price: 500 },
    { label: "30ml", price: 900 },
    { label: "55ml", price: 1500 },
    { label: "100ml", price: 2800 },
  ];

  const [selectedSizeOpt, setSelectedSizeOpt] = useState(sizeOptions[3]); // Default to 100ml

  // Gallery images list using existing high-quality assets
  const galleryImages = [
    "/images/products/jade_serenity.png",
    "/images/products/amber_gold.png",
    "/images/products/velvet_oud.png",
  ];

  // Reusable fragrance notes data list
  const topNotes = [
    { name: "Osmanthus", image: "osmanthus.png" },
    { name: "Peach", image: "peach.png" },
    { name: "Neroli", image: "neroli.png" },
    { name: "Bergamot", image: "bergamot.png" },
    { name: "Mandarin", image: "mandarin.png" },
    { name: "Cinnamon", image: "cinnamon.png" },
  ];

  const middleNotes = [
    { name: "Indian Tuberose", image: "indian_tuberose.png" },
    { name: "Jasmine", image: "jasmine.png" },
    { name: "Narcissus", image: "narcissus.png" },
    { name: "May Rose", image: "may_rose.png" },
  ];

  const baseNotes = [
    { name: "Amber", image: "amber.png" },
    { name: "Cedar", image: "cedar.png" },
    { name: "Sandalwood", image: "sandalwood.png" },
    { name: "Patchouli", image: "patchouli.png" },
    { name: "Vetiver", image: "vetiver.png" },
  ];

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
      (item: any) => item.name === "Jade Serenity" && item.selectedSize === selectedSizeOpt.label
    );

    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      const newItem = {
        id: `cart-jade-serenity-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: "Jade Serenity",
        image: "/images/products/jade_serenity.png",
        inspiredBy: "Inspired by Dio Savotage",
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
    triggerToast(`Added ${quantity}x Jade Serenity (${selectedSizeOpt.label}) to your bag!`);
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
        ? "Added Jade Serenity to your wishlist!"
        : "Removed Jade Serenity from your wishlist."
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

  const recommendations = [
    {
      name: "Devil King",
      description: "Inspired by Kilian Black Phantom",
      rating: 4.8,
      reviews: 120,
      price: "1,650tk",
      volume: "100ml",
      image: "/images/products/velvet_oud.png",
    },
    {
      name: "Jade Serenity",
      description: "Inspired by Dio Savotage",
      rating: 4.9,
      reviews: 250,
      price: "1,720tk",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      name: "Magnetism",
      description: "Inspired by YSL Y EDP",
      rating: 4.7,
      reviews: 120,
      price: "1,220tk",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      name: "Hellenist",
      description: "Inspired by Bleu De Chanel",
      rating: 4.9,
      reviews: 310,
      price: "1,320tk",
      volume: "100ml",
      image: "/images/products/hellenist.png",
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
          <Link href="/" className={styles.backLink}>
            <span className={styles.arrowLeft}>←</span> Shop
          </Link>
          <span className={styles.divider}>/</span>
          <span className={styles.currentBreadcrumb}>Jade Serenity</span>
        </div>

        {/* Product Details Section */}
        <section className={styles.productSection}>
          {/* Images Column */}
          <div className={styles.imageColumn}>
            <div className={styles.mainImageWrapper}>
              <Image
                src={galleryImages[activeImageIndex]}
                alt="Jade Serenity Perfume Main"
                width={500}
                height={500}
                className={styles.mainImage}
                priority
              />
            </div>
            <div className={styles.thumbnailRow}>
              {galleryImages.map((img, idx) => (
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
                <h1 className={styles.title}>Jade Serenity</h1>
                <p className={styles.subtitle}>Inspired by Dio Savotage</p>
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
                Try Now
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
                  <p>
                    Jade Serenity is a masterclass in clean, sophisticated freshness engineered explicitly to conquer hot and humid weather. Opening with a crisp, rejuvenating burst of green tea and sharp citrus, it effortlessly settles into a calming, earthy base of rich vetiver and smooth cedarwood. This isn't just a fragrance—it's an invisible suit of armor that keeps you feeling fresh, composed, and undeniably premium from morning meetings to late-night lounge sessions.
                  </p>
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
            <div className={styles.notesGroup}>
              <h3 className={styles.notesGroupTitle}>Top Notes</h3>
              <div className={styles.notesGrid}>
                {topNotes.map((note) => (
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

            {/* Middle Notes */}
            <div className={styles.notesGroup}>
              <h3 className={styles.notesGroupTitle}>Middle Notes</h3>
              <div className={styles.notesGrid}>
                {middleNotes.map((note) => (
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

            {/* Base Notes */}
            <div className={styles.notesGroup}>
              <h3 className={styles.notesGroupTitle}>Base Notes</h3>
              <div className={styles.notesGrid}>
                {baseNotes.map((note) => (
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

          {/* Stable Tab Content Wrapper (prevents unmount/hydration removeChild null crash) */}
          <div className={styles.tabContentWrapper}>
            {activeTab === "performance" && (
              <div className={styles.performanceGrid}>
                {/* Card 1: Main Accords */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Main Accords</h3>
                  <div className={styles.barGroup}>
                    <div className={styles.barLabelRow}>
                      <span className={styles.accordLabel}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#a28c73"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.accordIcon}
                        >
                          <path d="M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" />
                          <path d="M3 10v6c0 3.3 4-6 9 6s9-2.7 9-6v-6" />
                          <path d="M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" />
                        </svg>
                        Woody
                      </span>
                      <span>100%</span>
                    </div>
                    <div className={styles.barOuter}>
                      <div
                        className={styles.barInner}
                        style={{ width: "100%", backgroundColor: "#a28c73" }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barLabelRow}>
                      <span className={styles.accordLabel}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#e2cc9e"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.accordIcon}
                        >
                          <path d="M12 12c2.5-4 5.5-5 7-3s0 5-3 7L12 12z" />
                          <path d="M12 12c-2.5-4-5.5-5-7-3s0 5 3 7l4-4z" />
                          <path d="M12 12c4 2.5 5 5.5 3 7s-5 0-7-3l4-4z" />
                          <path d="M12 12c-4 2.5-5 5.5-3 7s5 0 7-3l-4-4z" />
                          <circle cx="12" cy="12" r="2" fill="#e2cc9e" />
                        </svg>
                        Vanilla
                      </span>
                      <span>75%</span>
                    </div>
                    <div className={styles.barOuter}>
                      <div
                        className={styles.barInner}
                        style={{ width: "75%", backgroundColor: "#e2cc9e" }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barLabelRow}>
                      <span className={styles.accordLabel}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#b9cad7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.accordIcon}
                        >
                          <path d="M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" />
                          <path d="M14 12c1 1 1 2 0 3" />
                        </svg>
                        Balsamic
                      </span>
                      <span>60%</span>
                    </div>
                    <div className={styles.barOuter}>
                      <div
                        className={styles.barInner}
                        style={{ width: "60%", backgroundColor: "#b9cad7" }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barLabelRow}>
                      <span className={styles.accordLabel}>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#e89f65"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.accordIcon}
                        >
                          <path d="M4 18L18 4" />
                          <path d="M8 20L20 8" />
                          <path d="M6 15c-1-1-1.5-2.5-1-3.5s2-.5 3 .5l1 1" />
                          <path d="M10 19c-1-1-1.5-2.5-1-3.5s2-.5 3 .5l1 1" />
                        </svg>
                        Warm Spicy
                      </span>
                      <span>40%</span>
                    </div>
                    <div className={styles.barOuter}>
                      <div
                        className={styles.barInner}
                        style={{ width: "40%", backgroundColor: "#e89f65" }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.sourceText}>Source: M</div>
                </div>

                {/* Card 2: Best For */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Best For</h3>
                  <div className={styles.barGroup}>
                    <div className={styles.barLabelRow}>
                      <span>Winter & Autumn</span>
                      <span>85%</span>
                    </div>
                    <div className={styles.barOuter}>
                      <div
                        className={styles.barInner}
                        style={{ width: "85%", backgroundColor: "#313134" }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barLabelRow}>
                      <span>Summer & Spring</span>
                      <span>40%</span>
                    </div>
                    <div className={styles.barOuter}>
                      <div
                        className={styles.barInner}
                        style={{ width: "40%", backgroundColor: "#313134" }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barLabelRow}>
                      <span>Daytime Wear</span>
                      <span>50%</span>
                    </div>
                    <div className={styles.barOuter}>
                      <div
                        className={styles.barInner}
                        style={{ width: "50%", backgroundColor: "#313134" }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.barGroup}>
                    <div className={styles.barLabelRow}>
                      <span>Nightly Occasions</span>
                      <span>65%</span>
                    </div>
                    <div className={styles.barOuter}>
                      <div
                        className={styles.barInner}
                        style={{ width: "65%", backgroundColor: "#313134" }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.sourceText}>Source: M</div>
                </div>

                {/* Card 3: Our Take */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Our Take</h3>
                  <p className={styles.ourTakeText}>
                    "It's a dupe that performs with beast-mode."
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
