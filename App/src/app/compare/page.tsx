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

const mockProducts: CompareProduct[] = productsCatalog.map((prod) => {
  let name = prod.name;
  let inspiredBy = `Inspired by ${prod.brand}`;
  let profile = prod.description;
  let longevity = prod.meter;
  let projection = "Moderate";
  let sweetness = "●●○○○";
  let bestFor = prod.occasion;
  let accords = [
    { name: "Fresh", value: 80 },
    { name: "Citrus", value: 70 },
  ];

  if (prod.image.includes("jade_serenity")) {
    name = "Jade Serenity";
    inspiredBy = "Creed Original Vetiver";
    profile = "Clean, crisp green tea twist layered over the classic fresh metallic base.";
    longevity = "Beast Mode (8+ Hours)";
    projection = "Heavy (Cuts through humid air beautifully)";
    sweetness = "●●○○○ (Subtle Crispness)";
    bestFor = "Office, hot summer afternoons, and high-end formal setups.";
    accords = [
      { name: "Woody", value: 80 },
      { name: "Vanilla", value: 65 },
      { name: "Balsamic", value: 55 },
      { name: "Warm Spicy", value: 50 },
    ];
  } else if (prod.image.includes("coral_sea")) {
    name = "Mageration";
    inspiredBy = "Dior Sauvage";
    profile = "Raw, sharp, high-concentration classic amber-spicy formulation.";
    longevity = "Strong (6-7 Hours)";
    projection = "Moderate (Creates a close personal aura)";
    sweetness = "●○○○○ (Very Dry / Spicy)";
    bestFor = "Casual hangouts, post-gym refreshes, and daily signatures.";
    accords = [
      { name: "Woody", value: 75 },
      { name: "Vanilla", value: 60 },
      { name: "Balsamic", value: 55 },
      { name: "Warm Spicy", value: 70 },
    ];
  } else if (prod.image.includes("magnetism")) {
    name = "Magnetism";
    inspiredBy = "YSL Y EDP";
    profile = "Sweet, fresh, highly aromatic ginger-apple opening with a deep woody trails.";
    longevity = "Long Lasting (7-8 Hours)";
    projection = "Heavy (Fills the room initially)";
    sweetness = "●●●○○ (Sweet & Fresh)";
    bestFor = "Clubbing, date nights, and winter evening gatherings.";
    accords = [
      { name: "Woody", value: 70 },
      { name: "Vanilla", value: 50 },
      { name: "Balsamic", value: 45 },
      { name: "Warm Spicy", value: 65 },
    ];
  } else if (prod.image.includes("hellenist")) {
    name = "Hellenist";
    inspiredBy = "Baccarat Rouge 540";
    profile = "Stunningly sweet amber profile. Highly projecting and elegant, ideal for special occasions.";
    longevity = "Long Lasting (7-8 Hours)";
    projection = "Heavy";
    sweetness = "●●●●○ (Sweet & Rich)";
    bestFor = "Special occasions, cold nights, and luxury events.";
    accords = [
      { name: "Sweet", value: 90 },
      { name: "Amber", value: 85 },
      { name: "Woody", value: 70 },
      { name: "Warm Spicy", value: 50 },
    ];
  }

  return {
    name: `${name} (Slot ${prod.id})`,
    image: prod.image,
    brand: prod.brand,
    inspiredBy,
    price: prod.price,
    rating: `${prod.rating.toFixed(1)} (${prod.reviews})`,
    profile,
    longevity,
    projection,
    sweetness,
    bestFor,
    accords,
    isRecommended: prod.id === "1",
  };
});

function CompareContent() {
  const [selectedSlots, setSelectedSlots] = useState<(CompareProduct | null)[]>([null, null, null]);
  const [activeSelectIndex, setActiveSelectIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const p1 = searchParams.get("p1");
    const p2 = searchParams.get("p2");
    const p3 = searchParams.get("p3");

    if (p1 || p2 || p3) {
      const newSlots: (CompareProduct | null)[] = [null, null, null];
      const params = [p1, p2, p3];

      params.forEach((param, idx) => {
        if (param) {
          const match = mockProducts.find(
            (p) =>
              p.image === param ||
              p.image.includes(param) ||
              p.name.toLowerCase().includes(param.toLowerCase())
          );
          if (match) {
            newSlots[idx] = match;
          }
        }
      });

      setSelectedSlots(newSlots);
      setShowComparison(true);

      // Clean up the URL parameters so they don't linger in the address bar
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
      const match = mockProducts.find(
        (p) =>
          (addImage && p.image === addImage) ||
          (addName && p.name.toLowerCase() === addName.toLowerCase())
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

        // Clean up the URL parameters so they don't linger in the address bar
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.search = "";
          window.history.replaceState({}, "", url.toString());
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (showComparison) {
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
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
  };

  const handleCompare = () => {
    if (selectedSlots.some((slot) => slot !== null)) {
      setShowComparison(true);
    }
  };

  const filteredModalProducts = mockProducts.filter((prod) => {
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
            Compare
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
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
                      {/* Left blank / empty matching the screenshot block */}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
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
