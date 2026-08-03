"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productsCatalog, fetchLiveProducts } from "../data/products";
import styles from "./page.module.css";

export interface CompareProduct {
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
  notes?: {
    top: string[];
    heart: string[];
    base: string[];
  };
}

const EXCLUDED_NAMES = new Set([
  "saffron leather",
  "royal santal 33",
  "amber elixir 10",
  "velvet oud imperial"
]);

const buildCompareList = (): CompareProduct[] => {
  const mapByName = new Map<string, CompareProduct>();

  productsCatalog
    .filter((p) => !EXCLUDED_NAMES.has(p.name.trim().toLowerCase()))
    .forEach((p) => {
      const rawNotes = p.notes || [];
      mapByName.set(p.name.toLowerCase(), {
        name: p.name,
        image: p.image || "/images/products/jade_serenity.png",
        brand: p.brand || "Murakkaz",
        inspiredBy: p.inspiredBy ? `Inspired by ${p.inspiredBy}` : p.name,
        price: "300 - 2500tk",
        rating: `${p.rating || 4.8} (${p.reviews || 120})`,
        profile: p.description || `${p.name} - ${p.family} fragrance featuring ${rawNotes.slice(0, 3).join(", ")}.`,
        longevity: p.meter ? `${p.meter} (6-8 Hours)` : "Long Lasting (6-8 Hours)",
        projection: "Moderate to Heavy",
        sweetness: "●●●○○",
        bestFor: p.occasion ? `${p.occasion} wear & special events.` : "Daily wear and special events.",
        accords: rawNotes.slice(0, 3).map((note, i) => ({
          name: note,
          value: 85 - i * 10,
        })),
        notes: {
          top: rawNotes.slice(0, 2).length ? rawNotes.slice(0, 2) : ["Bergamot", "Citrus"],
          heart: rawNotes.slice(2, 4).length ? rawNotes.slice(2, 4) : ["Warm Spices", "Floral Accord"],
          base: rawNotes.slice(4, 6).length ? rawNotes.slice(4, 6) : ["Cedarwood", "Ambergris", "Musk"],
        },
      });
    });

  return Array.from(mapByName.values());
};

const allAvailablePerfumes: CompareProduct[] = buildCompareList();

function CompareContent() {
  const searchParams = useSearchParams();
  const initialP1 = searchParams.get("p1");

  const [perfumeList, setPerfumeList] = useState<CompareProduct[]>(allAvailablePerfumes);
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

  useEffect(() => {
    fetchLiveProducts().then((liveData) => {
      if (liveData && liveData.length > 0) {
        const mapByName = new Map<string, CompareProduct>();
        
        liveData
          .filter((p) => !EXCLUDED_NAMES.has(p.name.trim().toLowerCase()))
          .forEach((p) => {
            const rawNotes = p.notes || [];
            mapByName.set(p.name.toLowerCase(), {
              name: p.name,
              image: p.image || "/images/products/jade_serenity.png",
              brand: p.brand || "Murakkaz",
              inspiredBy: p.inspiredBy ? `Inspired by ${p.inspiredBy}` : p.name,
              price: "300 - 2500tk",
              rating: `${p.rating || 4.8} (${p.reviews || 120})`,
              profile: p.description || `${p.name} - ${p.family} fragrance featuring ${rawNotes.slice(0, 3).join(", ")}.`,
              longevity: p.meter ? `${p.meter} (6-8 Hours)` : "Long Lasting (6-8 Hours)",
              projection: "Moderate to Heavy",
              sweetness: "●●●○○",
              bestFor: p.occasion ? `${p.occasion} wear & special events.` : "Daily wear and special events.",
              accords: rawNotes.slice(0, 3).map((note, i) => ({
                name: note,
                value: 85 - i * 10,
              })),
              notes: {
                top: rawNotes.slice(0, 2).length ? rawNotes.slice(0, 2) : ["Bergamot", "Citrus"],
                heart: rawNotes.slice(2, 4).length ? rawNotes.slice(2, 4) : ["Warm Spices", "Floral Accord"],
                base: rawNotes.slice(4, 6).length ? rawNotes.slice(4, 6) : ["Cedarwood", "Ambergris", "Musk"],
              },
            });
          });

        productsCatalog.forEach((p) => {
          if (!mapByName.has(p.name.toLowerCase())) {
            const rawNotes = p.notes || [];
            mapByName.set(p.name.toLowerCase(), {
              name: p.name,
              image: p.image || "/images/products/jade_serenity.png",
              brand: p.brand || "Murakkaz",
              inspiredBy: p.inspiredBy ? `Inspired by ${p.inspiredBy}` : p.name,
              price: "300 - 2500tk",
              rating: `${p.rating || 4.8} (${p.reviews || 120})`,
              profile: p.description || `${p.name} - ${p.family} fragrance featuring ${rawNotes.slice(0, 3).join(", ")}.`,
              longevity: p.meter ? `${p.meter} (6-8 Hours)` : "Long Lasting (6-8 Hours)",
              projection: "Moderate to Heavy",
              sweetness: "●●●○○",
              bestFor: p.occasion ? `${p.occasion} wear & special events.` : "Daily wear and special events.",
              accords: rawNotes.slice(0, 3).map((note, i) => ({
                name: note,
                value: 85 - i * 10,
              })),
              notes: {
                top: rawNotes.slice(0, 2).length ? rawNotes.slice(0, 2) : ["Bergamot", "Citrus"],
                heart: rawNotes.slice(2, 4).length ? rawNotes.slice(2, 4) : ["Warm Spices", "Floral Accord"],
                base: rawNotes.slice(4, 6).length ? rawNotes.slice(4, 6) : ["Cedarwood", "Ambergris", "Musk"],
              },
            });
          }
        });

        setPerfumeList(Array.from(mapByName.values()));
      }
    });
  }, []);

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
          const match = perfumeList.find(
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
      const match = perfumeList.find(
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
  }, [searchParams, perfumeList]);

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

  const filteredModalProducts = perfumeList.filter((prod) => {
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
                        {slot ? (
                          <div className={styles.notesListWrapper}>
                            <ul className={styles.notesBulletList}>
                              {slot.notes ? (
                                <>
                                  <li><strong className={styles.noteCategory}>Top:</strong> {slot.notes.top.join(", ")}</li>
                                  <li><strong className={styles.noteCategory}>Heart:</strong> {slot.notes.heart.join(", ")}</li>
                                  <li><strong className={styles.noteCategory}>Base:</strong> {slot.notes.base.join(", ")}</li>
                                </>
                              ) : (
                                <>
                                  <li><strong className={styles.noteCategory}>Top:</strong> Bergamot, Crisp Apple</li>
                                  <li><strong className={styles.noteCategory}>Heart:</strong> Lavender, Warm Spices</li>
                                  <li><strong className={styles.noteCategory}>Base:</strong> Cedarwood, Ambergris, Musk</li>
                                </>
                              )}
                            </ul>
                          </div>
                        ) : ""}
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
                      <div className={styles.cardNotesBlock}>
                        <span className={styles.cardLabel}>Fragrance Notes</span>
                        <ul className={styles.notesBulletList}>
                          {slot!.notes ? (
                            <>
                              <li><strong className={styles.noteCategory}>Top:</strong> {slot!.notes.top.join(", ")}</li>
                              <li><strong className={styles.noteCategory}>Heart:</strong> {slot!.notes.heart.join(", ")}</li>
                              <li><strong className={styles.noteCategory}>Base:</strong> {slot!.notes.base.join(", ")}</li>
                            </>
                          ) : (
                            <>
                              <li><strong className={styles.noteCategory}>Top:</strong> Bergamot, Crisp Apple</li>
                              <li><strong className={styles.noteCategory}>Heart:</strong> Lavender, Warm Spices</li>
                              <li><strong className={styles.noteCategory}>Base:</strong> Cedarwood, Ambergris</li>
                            </>
                          )}
                        </ul>
                      </div>
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
                    <div className={styles.cardNotesBlock}>
                      <span className={styles.cardLabel}>Fragrance Notes</span>
                      <ul className={styles.notesBulletList}>
                        {slot!.notes ? (
                          <>
                            <li><strong className={styles.noteCategory}>Top:</strong> {slot!.notes.top.join(", ")}</li>
                            <li><strong className={styles.noteCategory}>Heart:</strong> {slot!.notes.heart.join(", ")}</li>
                            <li><strong className={styles.noteCategory}>Base:</strong> {slot!.notes.base.join(", ")}</li>
                          </>
                        ) : (
                          <>
                            <li><strong className={styles.noteCategory}>Top:</strong> Bergamot, Crisp Apple</li>
                            <li><strong className={styles.noteCategory}>Heart:</strong> Lavender, Warm Spices</li>
                            <li><strong className={styles.noteCategory}>Base:</strong> Cedarwood, Ambergris</li>
                          </>
                        )}
                      </ul>
                    </div>
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
