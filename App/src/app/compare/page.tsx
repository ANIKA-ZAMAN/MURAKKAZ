"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productsCatalog } from "../data/products";
import styles from "./page.module.css";

interface CompareProduct {
  name: string;
  image: string;
  brand: string;
  inspiredBy: string;
  price: string;
  rating: string;
  profile: string;
  longevity: string;
  projection: string;
  sweetness: string;
  bestFor: string;
  accords: { name: string; value: number }[];
  isRecommended?: boolean;
}

const availablePerfumes: CompareProduct[] = [
  {
    name: "Dior Sauvage",
    image: "/images/products/coral_sea.png",
    brand: "Dior",
    inspiredBy: "Dior Sauvage",
    price: "৳450 – ৳6,800",
    rating: "4.8 (240)",
    profile: "Raw, sharp bergamot & Sichuan pepper opening with a powerful ambroxan trail.",
    longevity: "Strong (7-8 Hours)",
    projection: "Heavy (Room filling initially)",
    sweetness: "●○○○○ (Fresh & Spicy)",
    bestFor: "Casual hangouts, evening dates, and daily signatures.",
    accords: [
      { name: "Fresh Spicy", value: 90 },
      { name: "Amber", value: 80 },
      { name: "Citrus", value: 75 },
    ],
  },
  {
    name: "Carolina Herrera Bad Boy",
    image: "/images/products/magnetism.png",
    brand: "Carolina Herrera",
    inspiredBy: "Carolina Herrera Bad Boy",
    price: "৳480 – ৳7,000",
    rating: "4.7 (195)",
    profile: "Bold white & black pepper blended with cedarwood, tonka bean, and cocoa notes.",
    longevity: "Long Lasting (6-8 Hours)",
    projection: "Moderate to Heavy",
    sweetness: "●●●○○ (Warm & Spicy Sweet)",
    bestFor: "Night outs, winter events, and party occasions.",
    accords: [
      { name: "Warm Spicy", value: 85 },
      { name: "Cacao", value: 80 },
      { name: "Woody", value: 70 },
    ],
  },
  {
    name: "YSL Y EDP",
    image: "/images/products/jade_serenity.png",
    brand: "Yves Saint Laurent",
    inspiredBy: "YSL Y EDP",
    price: "৳500 – ৳7,200",
    rating: "4.9 (310)",
    profile: "Aromatic crisp apple, sage, and ginger leading into a smooth vetiver & amberwood dry down.",
    longevity: "Beast Mode (8+ Hours)",
    projection: "Heavy (Fills personal aura)",
    sweetness: "●●●○○ (Sweet & Aromatic)",
    bestFor: "All-year versatile signature, clubbing, and formal meetings.",
    accords: [
      { name: "Aromatic", value: 90 },
      { name: "Fruity", value: 82 },
      { name: "Woody", value: 75 },
    ],
  },
  {
    name: "Bleu de Chanel",
    image: "/images/products/hellenist.png",
    brand: "Chanel",
    inspiredBy: "Bleu de Chanel",
    price: "৳550 – ৳8,200",
    rating: "4.9 (420)",
    profile: "Timeless grapefruit, mint, and incense blended over deep cedar and sandalwood.",
    longevity: "Long Lasting (7-8 Hours)",
    projection: "Moderate (Sophisticated & Clean)",
    sweetness: "●●○○○ (Crisp & Woody)",
    bestFor: "Executive meetings, dates, and black-tie formal events.",
    accords: [
      { name: "Citrus", value: 88 },
      { name: "Woody", value: 82 },
      { name: "Smoky", value: 65 },
    ],
  },
  {
    name: "Afnan 9PM",
    image: "/images/products/coral_sea.png",
    brand: "Afnan",
    inspiredBy: "Afnan 9PM",
    price: "৳420 – ৳6,200",
    rating: "4.8 (280)",
    profile: "Irresistible apple, cinnamon, lavender, and rich vanilla trail.",
    longevity: "Beast Mode (9+ Hours)",
    projection: "Heavy",
    sweetness: "●●●●○ (Sweet & Intoxicating)",
    bestFor: "Evening parties, cool nights, and clubbing.",
    accords: [
      { name: "Vanilla", value: 90 },
      { name: "Sweet", value: 85 },
      { name: "Fruity", value: 75 },
    ],
  },
  {
    name: "JPG Ultra Male",
    image: "/images/products/magnetism.png",
    brand: "Jean Paul Gaultier",
    inspiredBy: "JPG Ultra Male",
    price: "৳580 – ৳8,500",
    rating: "4.9 (350)",
    profile: "Juicy black lavender, pear, mint, and spicy cinnamon vanilla blend.",
    longevity: "Beast Mode (10+ Hours)",
    projection: "Room Filling",
    sweetness: "●●●●● (Ultra Sweet)",
    bestFor: "Nightlife, cold winter nights, and statement entrances.",
    accords: [
      { name: "Sweet", value: 95 },
      { name: "Fruity", value: 88 },
      { name: "Vanilla", value: 85 },
    ],
  },
  {
    name: "Jade Serenity",
    image: "/images/products/jade_serenity.png",
    brand: "Creed",
    inspiredBy: "Creed Original Vetiver",
    price: "৳650 – ৳9,500",
    rating: "4.7 (180)",
    profile: "Clean, crisp green tea twist layered over fresh metallic vetiver base.",
    longevity: "Beast Mode (8+ Hours)",
    projection: "Heavy",
    sweetness: "●●○○○ (Subtle Crispness)",
    bestFor: "Office, hot summer afternoons, and high-end formal setups.",
    accords: [
      { name: "Woody", value: 80 },
      { name: "Citrus", value: 75 },
      { name: "Green", value: 70 },
    ],
    isRecommended: true,
  },
  {
    name: "Hellenist",
    image: "/images/products/hellenist.png",
    brand: "Maison Francis Kurkdjian",
    inspiredBy: "Baccarat Rouge 540",
    price: "৳750 – ৳11,000",
    rating: "4.9 (510)",
    profile: "Stunningly sweet jasmine, saffron, and ambergris crystal woods.",
    longevity: "Beast Mode (12+ Hours)",
    projection: "Enormous",
    sweetness: "●●●●○ (Sweet & Rich)",
    bestFor: "Special occasions, cold nights, and luxury gala events.",
    accords: [
      { name: "Amber", value: 95 },
      { name: "Woody", value: 85 },
      { name: "Warm Spicy", value: 75 },
    ],
  },
];

const allAvailablePerfumes: CompareProduct[] = (() => {
  const mapByName = new Map<string, CompareProduct>();
  availablePerfumes.forEach((p) => mapByName.set(p.name.toLowerCase(), p));

  productsCatalog.forEach((p) => {
    if (!mapByName.has(p.name.toLowerCase())) {
      mapByName.set(p.name.toLowerCase(), {
        name: p.name,
        image: p.image || "/images/products/jade_serenity.png",
        brand: p.brand || "Murakkaz",
        inspiredBy: p.inspiredBy || p.name,
        price: p.price || `৳${p.priceVal || 1500}`,
        rating: `${p.rating || 4.5} (${p.reviews || 120})`,
        profile: p.description || `${p.name} - ${p.family} fragrance with ${(p.notes || []).join(", ")}.`,
        longevity: p.meter ? `${p.meter} (6-8 Hours)` : "Long Lasting (6-8 Hours)",
        projection: "Moderate to Heavy",
        sweetness: "●●●○○",
        bestFor: p.occasion ? `${p.occasion} wear & special events.` : "Daily wear and special events.",
        accords: (p.notes || []).slice(0, 3).map((note, i) => ({
          name: note,
          value: 85 - i * 10,
        })),
      });
    }
  });

  return Array.from(mapByName.values());
})();

function CompareContent() {
  const searchParams = useSearchParams();
  const initialP1 = searchParams.get("p1");

  const [selectedSlots, setSelectedSlots] = useState<(CompareProduct | null)[]>([
    null,
    null,
    null,
  ]);

  const [activeSelectIndex, setActiveSelectIndex] = useState<number | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);

  const triggerAnalysis = (slots: (CompareProduct | null)[]) => {
    setIsAnalyzing(true);
    setShowComparison(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowComparison(true);
    }, 1200);
  };

  useEffect(() => {
    const p1 = searchParams.get("p1");
    const p2 = searchParams.get("p2");
    const p3 = searchParams.get("p3");

    if (p1 || p2 || p3) {
      const newSlots: (CompareProduct | null)[] = [null, null, null];
      const params = [p1, p2, p3];

      params.forEach((param, idx) => {
        if (param) {
          const match = allAvailablePerfumes.find(
            (p) =>
              p.image === param ||
              p.image.includes(param) ||
              p.name.toLowerCase().includes(param.toLowerCase()) ||
              p.inspiredBy.toLowerCase().includes(param.toLowerCase()) ||
              p.brand.toLowerCase().includes(param.toLowerCase())
          );
          if (match) {
            newSlots[idx] = match;
          }
        }
      });

      setSelectedSlots(newSlots);
      triggerAnalysis(newSlots);

      // Clean up URL parameters
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.search = "";
        window.history.replaceState({}, "", url.toString());
      }
      return;
    }

    const addId = searchParams.get("add");
    const addImage = searchParams.get("image");
    const addName = searchParams.get("name");

    if (addImage || addName || addId) {
      const match = allAvailablePerfumes.find(
        (p) =>
          (addImage && p.image === addImage) ||
          (addName && p.name.toLowerCase() === addName.toLowerCase()) ||
          (addId && p.name.toLowerCase().includes(addId.toLowerCase()))
      );

      if (match) {
        setSelectedSlots((prev) => {
          const alreadyExists = prev.some((slot) => slot?.name === match.name);
          if (alreadyExists) return prev;

          const nextSlots = [...prev];
          const emptyIdx = nextSlots.findIndex((slot) => slot === null);
          if (emptyIdx !== -1) {
            nextSlots[emptyIdx] = match;
          } else {
            nextSlots[0] = match;
          }
          return nextSlots;
        });

        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.search = "";
          window.history.replaceState({}, "", url.toString());
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (showComparison && tableRef.current) {
      setTimeout(() => {
        if (tableRef.current) {
          const navbarOffset = 110;
          const elementTop = tableRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementTop - navbarOffset,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [showComparison]);

  const handleSelectProduct = (product: CompareProduct) => {
    if (activeSelectIndex !== null) {
      const newSlots = [...selectedSlots];
      newSlots[activeSelectIndex] = product;
      setSelectedSlots(newSlots);
      setActiveSelectIndex(null);
      setShowComparison(false);
    }
  };

  const handleRemoveProduct = (index: number) => {
    const newSlots = [...selectedSlots];
    newSlots[index] = null;
    setSelectedSlots(newSlots);
    setShowComparison(false);
  };

  const handleReset = () => {
    setSelectedSlots([null, null, null]);
    setShowComparison(false);
    setIsAnalyzing(false);
  };

  const handleCompare = () => {
    if (selectedSlots.some((slot) => slot !== null)) {
      triggerAnalysis(selectedSlots);
    }
  };

  const filteredModalProducts = availablePerfumes.filter((prod) => {
    if (!modalSearchQuery) return true;
    const q = modalSearchQuery.toLowerCase();
    return (
      prod.name.toLowerCase().includes(q) ||
      prod.brand.toLowerCase().includes(q) ||
      prod.inspiredBy.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Compare Products</h1>
          <p className={styles.subtitle}>Compare products to find your best one.</p>
        </div>

        {/* Frame container using comparison frame SVG as border/background */}
        <div className={styles.compareFrame}>
          <div className={styles.slotsContainer}>
            {selectedSlots.map((slot, index) => (
              <div key={index} className={styles.slotColumn}>
                {slot ? (
                  <div className={styles.filledSlot}>
                    <button 
                      className={styles.removeBtn} 
                      onClick={() => handleRemoveProduct(index)}
                      title="Remove product"
                    >
                      ×
                    </button>
                    <div className={styles.imageContainer}>
                      <img
                        src={slot.image}
                        alt={slot.name}
                        width={260}
                        height={260}
                        className={styles.productImage}
                      />
                    </div>
                    <div className={styles.productLabel}>{slot.name}</div>
                  </div>
                ) : (
                  <div 
                    className={styles.emptySlot}
                    onClick={() => setActiveSelectIndex(index)}
                  >
                    <div className={styles.plusIcon}>+</div>
                  </div>
                )}

                {!slot && (
                  <button 
                    className={styles.addCompareBtn}
                    onClick={() => setActiveSelectIndex(index)}
                  >
                    Add to compare
                  </button>
                )}
                {slot && (
                  <button 
                    className={styles.changeCompareBtn}
                    onClick={() => setActiveSelectIndex(index)}
                  >
                    Change product
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal/Dropdown to select product */}
        {activeSelectIndex !== null && (
          <div className={styles.modalOverlay} onClick={() => { setActiveSelectIndex(null); setModalSearchQuery(""); }}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Select Product to Compare</h3>
              
              {/* Search Box */}
              <div className={styles.modalSearchWrapper}>
                <input
                  type="text"
                  placeholder="Search perfume..."
                  className={styles.modalSearchInput}
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.modalList}>
                {filteredModalProducts.map((prod) => {
                  const isAlreadySelected = selectedSlots.some(
                    (slot, idx) => idx !== activeSelectIndex && slot?.name === prod.name
                  );
                  return (
                    <div 
                      key={prod.name} 
                      className={`${styles.modalItem} ${isAlreadySelected ? styles.modalItemDisabled : ""}`}
                      onClick={() => !isAlreadySelected && handleSelectProduct(prod)}
                      style={{ 
                        opacity: isAlreadySelected ? 0.45 : 1, 
                        cursor: isAlreadySelected ? "not-allowed" : "pointer" 
                      }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        width={64}
                        height={64}
                        className={styles.modalItemImage}
                      />
                      <span>
                        {prod.name} {isAlreadySelected && " (Selected)"}
                      </span>
                    </div>
                  );
                })}

                {filteredModalProducts.length === 0 && (
                  <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#8c8c90", fontSize: "0.88rem" }}>
                    No matching perfumes found.
                  </div>
                )}
              </div>
              <button className={styles.modalCloseBtn} onClick={() => { setActiveSelectIndex(null); setModalSearchQuery(""); }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.compareBtn} onClick={handleCompare}>
            {isAnalyzing ? "Comparing..." : "Compare"}
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
        </div>
        {/* Analyzing Progress Banner */}
        {isAnalyzing && (
          <div className={styles.analyzingBanner}>
            <div className={styles.analyzingSpinner} />
            <span>Analyzing olfactory profiles, longevity & scent notes...</span>
          </div>
        )}

        {/* Comparison Table & Responsive Views */}
        {showComparison && (
          <>
            {/* Desktop Table View (> 1023px) */}
            <div ref={tableRef} className={styles.tableContainer}>
              <table className={styles.compareTable}>
                <tbody>
                  {/* Row 1: Name (Sticky Header Row) */}
                  <tr className={styles.stickyHeaderRow}>
                    <td className={styles.featureTitle}>Name</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={`${styles.productNameCell} ${slot?.isRecommended ? styles.recommendedColumn : ""}`}
                      >
                        {slot ? (
                          <div className={styles.nameHeaderContainer}>
                            {slot.isRecommended && (
                              <span className={styles.recommendedBadge}>Recommended</span>
                            )}
                            <span className={styles.productNameText}>{slot.name}</span>
                          </div>
                        ) : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 2: Brand */}
                  <tr>
                    <td className={styles.featureTitle}>Brand</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={slot?.isRecommended ? styles.recommendedColumn : ""}
                      >
                        {slot ? slot.brand : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 3: Inspired By */}
                  <tr>
                    <td className={styles.featureTitle}>Inspired By</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={slot?.isRecommended ? styles.recommendedColumn : ""}
                      >
                        {slot ? slot.inspiredBy : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 4: Price */}
                  <tr>
                    <td className={styles.featureTitle}>Price</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={slot?.isRecommended ? styles.recommendedColumn : ""}
                      >
                        {slot ? slot.price : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 5: Community Rating */}
                  <tr>
                    <td className={styles.featureTitle}>Community Rating</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={slot?.isRecommended ? styles.recommendedColumn : ""}
                      >
                        {slot ? (
                          <div className={styles.ratingWrapper}>
                            <span className={styles.starIcon}>★</span> {slot.rating}
                          </div>
                        ) : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 6: Scent Profile */}
                  <tr>
                    <td className={styles.featureTitle}>Scent Profile</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={`${styles.profileCell} ${slot?.isRecommended ? styles.recommendedColumn : ""}`}
                      >
                        {slot ? slot.profile : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 7: Longevity (Lasting Power) */}
                  <tr>
                    <td className={styles.featureTitle}>Longevity<br />(Lasting Power)</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={slot?.isRecommended ? styles.recommendedColumn : ""}
                      >
                        {slot ? slot.longevity : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 8: Projection (Scent Radius) */}
                  <tr>
                    <td className={styles.featureTitle}>Projection<br />(Scent Radius)</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={slot?.isRecommended ? styles.recommendedColumn : ""}
                      >
                        {slot ? slot.projection : ""}
                      </td>
                    ))}
                  </tr>

                  {/* Row 10: Best For */}
                  <tr>
                    <td className={styles.featureTitle}>Best For</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={`${styles.bestForCell} ${slot?.isRecommended ? styles.recommendedColumn : ""}`}
                      >
                        {slot ? slot.bestFor : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 11: Accord */}
                  <tr>
                    <td className={styles.featureTitle}>Accord</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={slot?.isRecommended ? styles.recommendedColumn : ""}
                      >
                        {slot ? (
                          <div className={styles.accordsList}>
                            {slot.accords.map((accord) => (
                              <div key={accord.name} className={styles.accordItem}>
                                <span className={styles.accordName}>{accord.name}</span>
                                <div className={styles.progressBarBg}>
                                  <div 
                                    className={styles.progressBarFill} 
                                    style={{ "--progress-width": `${accord.value}%` } as React.CSSProperties}
                                  />
                                </div>
                                <span className={styles.progressValue}>{accord.value}%</span>
                              </div>
                            ))}
                          </div>
                        ) : ""}
                      </td>
                    ))}
                  </tr>
                  {/* Row 12: Fragrance Notes */}
                  <tr>
                    <td className={styles.featureTitle}>Fragrance Notes</td>
                    {selectedSlots.map((slot, idx) => (
                      <td 
                        key={idx} 
                        className={`${styles.notesCell} ${slot?.isRecommended ? styles.recommendedColumn : ""}`}
                      >
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tablet Horizontally Scrollable Cards View (768px – 1023px) */}
            <div className={styles.tabletCardsContainer}>
              <div className={styles.tabletCardsScroll}>
                {selectedSlots.filter(Boolean).map((slot, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.compareCard} ${slot?.isRecommended ? styles.compareCardRecommended : ""}`}
                  >
                    {slot?.isRecommended && <span className={styles.cardBadge}>Recommended</span>}
                    <div className={styles.cardHeader}>
                      <img src={slot!.image} alt={slot!.name} className={styles.cardImage} />
                      <div className={styles.cardTitleBox}>
                        <h3 className={styles.cardName}>{slot!.name}</h3>
                        <span className={styles.cardBrand}>{slot!.brand}</span>
                        <span className={styles.cardPrice}>{slot!.price}</span>
                        <div className={styles.cardRating}>
                          <span className={styles.starIcon}>★</span> {slot!.rating}
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Inspired By</span>
                        <span className={styles.cardVal}>{slot!.inspiredBy}</span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Scent Profile</span>
                        <span className={styles.cardVal}>{slot!.profile}</span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Longevity</span>
                        <span className={styles.cardVal}>{slot!.longevity}</span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Projection</span>
                        <span className={styles.cardVal}>{slot!.projection}</span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Best For</span>
                        <span className={styles.cardVal}>{slot!.bestFor}</span>
                      </div>
                      {slot!.accords && slot!.accords.length > 0 && (
                        <div className={styles.cardAccordsBlock}>
                          <span className={styles.cardLabel}>Accords</span>
                          <div className={styles.accordsList}>
                            {slot!.accords.map((accord) => (
                              <div key={accord.name} className={styles.accordItem}>
                                <span className={styles.accordName}>{accord.name}</span>
                                <div className={styles.progressBarBg}>
                                  <div 
                                    className={styles.progressBarFill} 
                                    style={{ "--progress-width": `${accord.value}%` } as React.CSSProperties}
                                  />
                                </div>
                                <span className={styles.progressValue}>{accord.value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Stacked Cards View (< 768px) */}
            <div className={styles.mobileCardsContainer}>
              {selectedSlots.filter(Boolean).map((slot, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.compareCard} ${styles.mobileCompareCard} ${slot?.isRecommended ? styles.compareCardRecommended : ""}`}
                >
                  {slot?.isRecommended && <span className={styles.cardBadge}>Recommended</span>}
                  <div className={styles.cardHeader}>
                    <img src={slot!.image} alt={slot!.name} className={styles.cardImage} />
                    <div className={styles.cardTitleBox}>
                      <h3 className={styles.cardName}>{slot!.name}</h3>
                      <span className={styles.cardBrand}>{slot!.brand}</span>
                      <span className={styles.cardPrice}>{slot!.price}</span>
                      <div className={styles.cardRating}>
                        <span className={styles.starIcon}>★</span> {slot!.rating}
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Inspired By</span>
                      <span className={styles.cardVal}>{slot!.inspiredBy}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Scent Profile</span>
                      <span className={styles.cardVal}>{slot!.profile}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Longevity</span>
                      <span className={styles.cardVal}>{slot!.longevity}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Projection</span>
                      <span className={styles.cardVal}>{slot!.projection}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Best For</span>
                      <span className={styles.cardVal}>{slot!.bestFor}</span>
                    </div>
                    {slot!.accords && slot!.accords.length > 0 && (
                      <div className={styles.cardAccordsBlock}>
                        <span className={styles.cardLabel}>Accords</span>
                        <div className={styles.accordsList}>
                          {slot!.accords.map((accord) => (
                            <div key={accord.name} className={styles.accordItem}>
                              <span className={styles.accordName}>{accord.name}</span>
                              <div className={styles.progressBarBg}>
                                <div 
                                  className={styles.progressBarFill} 
                                  style={{ "--progress-width": `${accord.value}%` } as React.CSSProperties}
                                />
                              </div>
                              <span className={styles.progressValue}>{accord.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#8c8c90' }}>
        Loading comparison...
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
