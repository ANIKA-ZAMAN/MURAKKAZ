"use client";

import { useState } from "react";
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
}

const mockProducts: CompareProduct[] = [
  {
    name: "Jade Serenity",
    image: "/images/products/jade_serenity.png",
    brand: "Own",
    inspiredBy: "Dior Sauvage",
    price: "1,720tk",
    rating: "4.8 (250)",
    profile: "Clean, crisp green tea twist layered over the classic fresh metallic base.",
    longevity: "Beast Mode (8+ Hours)",
    projection: "Heavy (Cuts through humid air beautifully)",
    sweetness: "●●○○○ (Subtle Crispness)",
    bestFor: "Office, hot summer afternoons, and high-end formal setups.",
    accords: [
      { name: "Woody", value: 80 },
      { name: "Vanilla", value: 65 },
      { name: "Balsamic", value: 55 },
      { name: "Warm Spicy", value: 50 },
    ],
  },
  {
    name: "Mageration",
    image: "/images/products/coral_sea.png",
    brand: "After Rain",
    inspiredBy: "Dior",
    price: "1,210tk",
    rating: "3.5 (50)",
    profile: "Raw, sharp, high-concentration classic amber-spicy formulation.",
    longevity: "Strong (6-7 Hours)",
    projection: "Moderate (Creates a close personal aura)",
    sweetness: "●○○○○ (Very Dry / Spicy)",
    bestFor: "Casual hangouts, post-gym refreshes, and daily signatures.",
    accords: [
      { name: "Woody", value: 75 },
      { name: "Vanilla", value: 60 },
      { name: "Balsamic", value: 55 },
      { name: "Warm Spicy", value: 70 },
    ],
  },
  {
    name: "Magnetism",
    image: "/images/products/magnetism.png",
    brand: "Own",
    inspiredBy: "YSL Y EDP",
    price: "1,220tk",
    rating: "4.7 (120)",
    profile: "Sweet, fresh, highly aromatic ginger-apple opening with a deep woody trails.",
    longevity: "Long Lasting (7-8 Hours)",
    projection: "Heavy (Fills the room initially)",
    sweetness: "●●●○○ (Sweet & Fresh)",
    bestFor: "Clubbing, date nights, and winter evening gatherings.",
    accords: [
      { name: "Woody", value: 70 },
      { name: "Vanilla", value: 50 },
      { name: "Balsamic", value: 45 },
      { name: "Warm Spicy", value: 65 },
    ],
  },
];

export default function ComparePage() {
  const [selectedSlots, setSelectedSlots] = useState<(CompareProduct | null)[]>([null, null, null]);
  const [activeSelectIndex, setActiveSelectIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

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
                  <div className={`${styles.filledSlot} ${slot.name === "Jade Serenity" ? styles.recommendedCard : ""}`}>
                    {slot.name === "Jade Serenity" && (
                      <span className={styles.cardRecommendedBadge}>Recommended</span>
                    )}
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
                        width={180}
                        height={180}
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
          <div className={styles.modalOverlay} onClick={() => setActiveSelectIndex(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Select Product to Compare</h3>
              <div className={styles.modalList}>
                {mockProducts.map((prod) => (
                  <div 
                    key={prod.name} 
                    className={styles.modalItem}
                    onClick={() => handleSelectProduct(prod)}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      width={64}
                      height={64}
                      className={styles.modalItemImage}
                    />
                    <span>{prod.name}</span>
                  </div>
                ))}
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setActiveSelectIndex(null)}>
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
          <div className={styles.tableContainer}>
            <table className={styles.compareTable}>
              <tbody>
                {/* Row 1: Name (Sticky Header Row) */}
                <tr className={styles.stickyHeaderRow}>
                  <td className={styles.featureTitle}>Name</td>
                  {selectedSlots.map((slot, idx) => (
                    <td 
                      key={idx} 
                      className={`${styles.productNameCell} ${slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}`}
                    >
                      {slot ? (
                        <div className={styles.nameHeaderContainer}>
                          {slot.name === "Jade Serenity" && (
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
                      className={slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}
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
                      className={slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}
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
                      className={slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}
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
                      className={slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}
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
                      className={`${styles.profileCell} ${slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}`}
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
                      className={slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}
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
                      className={slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}
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
                      className={`${styles.bestForCell} ${slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}`}
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
                      className={slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}
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
                      className={`${styles.notesCell} ${slot?.name === "Jade Serenity" ? styles.recommendedColumn : ""}`}
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
