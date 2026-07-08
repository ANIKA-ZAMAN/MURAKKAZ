"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

interface CompareProduct {
  name: string;
  image: string;
  longevity: string;
  timing: string;
  smells: string;
}

const mockProducts: CompareProduct[] = [
  {
    name: "Jade Serenity",
    image: "/images/products/jade_serenity.png",
    longevity: "8 - 10 Hours (Very Long Lasting)",
    timing: "Day & Summer Wear",
    smells: "Fresh Bergamot, Mandarin & Cedar Wood",
  },
  {
    name: "Coral Sea",
    image: "/images/products/coral_sea.png",
    longevity: "6 - 8 Hours (Moderate to Long)",
    timing: "Spring & Casual Wear",
    smells: "Pineapple, Birch, Patchouli & Amber",
  },
  {
    name: "Magnetism",
    image: "/images/products/magnetism.png",
    longevity: "7 - 9 Hours (Long Lasting)",
    timing: "Evening & Night Wear",
    smells: "Apple, Ginger, Sage & Woody Vetiver",
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
                  <div className={styles.filledSlot}>
                    <button 
                      className={styles.removeBtn} 
                      onClick={() => handleRemoveProduct(index)}
                      title="Remove product"
                    >
                      ×
                    </button>
                    <div className={styles.imageContainer}>
                      <Image
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
                    <Image
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
              <thead>
                <tr>
                  <th>Feature</th>
                  {selectedSlots.map((slot, idx) => (
                    <th key={idx}>{slot ? slot.name : "(Empty)"}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.featureTitle}>Longevity</td>
                  {selectedSlots.map((slot, idx) => (
                    <td key={idx}>{slot ? slot.longevity : "-"}</td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureTitle}>Timing</td>
                  {selectedSlots.map((slot, idx) => (
                    <td key={idx}>{slot ? slot.timing : "-"}</td>
                  ))}
                </tr>
                <tr>
                  <td className={styles.featureTitle}>Smells Like</td>
                  {selectedSlots.map((slot, idx) => (
                    <td key={idx}>{slot ? slot.smells : "-"}</td>
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
