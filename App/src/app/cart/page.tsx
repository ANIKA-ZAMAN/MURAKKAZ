"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface CartItem {
  id: string;
  name: string;
  image: string;
  inspiredBy: string;
  selectedSize: string;
  quantity: number;
  prices: Record<string, number>;
  originalPrices?: Record<string, number>;
  selected: boolean;
}

import { productsCatalog } from "../data/products";

const initialCartItems: CartItem[] = [
  {
    id: "cart-1",
    name: productsCatalog[0]?.name || "Irish Leather",
    image: productsCatalog[0]?.image || "/images/products/irish_leather.jpg",
    inspiredBy: productsCatalog[0]?.inspiredBy ? `Inspired by ${productsCatalog[0].inspiredBy}` : `By ${productsCatalog[0]?.brand || "Murakkaz"}`,
    selectedSize: "10ml",
    quantity: 1,
    prices: {
      "6ml": 300,
      "10ml": 500,
      "30ml": 1500,
      "50ml": 2500,
    },
    selected: true,
  },
  {
    id: "cart-2",
    name: productsCatalog[1]?.name || "Baccarat Rouge 540",
    image: productsCatalog[1]?.image || "/images/products/baccarat_rouge_540.jpg",
    inspiredBy: productsCatalog[1]?.inspiredBy ? `Inspired by ${productsCatalog[1].inspiredBy}` : `By ${productsCatalog[1]?.brand || "Murakkaz"}`,
    selectedSize: "10ml",
    quantity: 1,
    prices: {
      "6ml": 300,
      "10ml": 500,
      "30ml": 1500,
      "50ml": 2500,
    },
    selected: true,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("cart-items");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          // Normalize cart item sizes/prices to avoid type issues
          const normalized = parsed.map((item: any) => {
            const hasNewSizes = item.prices && typeof item.prices === "object" && "6ml" in item.prices;
            return {
              id: item.id || `cart-${Date.now()}-${Math.random()}`,
              name: item.name || "Murakkaz Fragrance",
              image: item.image || "/images/products/vanilla_28_v2.jpg",
              inspiredBy: item.inspiredBy || `By Murakkaz`,
              selectedSize: item.selectedSize || "10ml",
              quantity: Math.max(1, Number(item.quantity) || 1),
              prices: hasNewSizes
                ? item.prices
                : {
                    "6ml": 300,
                    "10ml": 500,
                    "12ml": 500,
                    "30ml": 900,
                    "50ml": 1500,
                  },
              selected: item.selected !== undefined ? item.selected : true,
            };
          });
          setCartItems(normalized);
          return;
        }
      } catch (e) {
        console.error("Failed to parse cart items from storage", e);
      }
    }
    setCartItems([]);
  }, []);

  // Save to localStorage when state updates
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart-items", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cart-updated"));
    }
  }, [cartItems, isMounted]);

  // Toggle single item selection
  const toggleSelectItem = (id: string) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Toggle select all items
  const isAllSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
  const toggleSelectAll = () => {
    setCartItems(prev =>
      prev.map(item => ({ ...item, selected: !isAllSelected }))
    );
  };

  // Change product size
  const changeSize = (id: string, size: string) => {
    setCartItems(prev => {
      const targetItem = prev.find(item => item.id === id);
      if (!targetItem) return prev;

      const duplicateItem = prev.find(
        item => item.id !== id && item.name === targetItem.name && item.selectedSize === size
      );

      if (duplicateItem) {
        return prev
          .map(item => {
            if (item.id === duplicateItem.id) {
              return { ...item, quantity: item.quantity + targetItem.quantity };
            }
            return item;
          })
          .filter(item => item.id !== id);
      } else {
        return prev.map(item =>
          item.id === id ? { ...item, selectedSize: size } : item
        );
      }
    });
  };

  // Adjust quantity
  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculate totals
  const selectedItemsCount = cartItems.filter(item => item.selected).length;
  const totalAmount = cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.prices[item.selectedSize] || 500) * item.quantity, 0);
  const router = useRouter();

  const handleProceedToPay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedItemsCount === 0) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("murakkaz-token") : null;
    if (!token) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirect_after_login", "/checkout");
      }
      router.push("/account?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  if (!isMounted) {
    return (
      <div className={styles.page} suppressHydrationWarning>
        <main className={styles.main}>
          <h1 className={styles.title}>Your Bag</h1>
          <div style={{ padding: "4rem 0", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
            <span style={{ fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)" }}>
              Loading your bag...
            </span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Your Bag</h1>

        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Your bag is empty.</p>
            <Link href="/" className={styles.shopBtn}>Continue Shopping</Link>
          </div>
        ) : (
          <div className={styles.cartContentRow}>
            {/* Left Column: Items List */}
            <div className={styles.itemsColumn}>
              {/* Select All Row */}
              <div className={styles.selectAllRow} onClick={toggleSelectAll}>
                <span className={styles.selectCircle}>
                  {isAllSelected ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#389e0d">
                      <circle cx="12" cy="12" r="10" fill="#389e0d" />
                      <polyline points="9 11 12 14 22 4" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#767677" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                </span>
                <span className={styles.selectAllText}>Select all product</span>
              </div>

              {/* Items List */}
              <div className={styles.itemsList}>
                {cartItems.map((item) => {
                  const currentPrice = item.prices[item.selectedSize];
                  const currentOriginalPrice = item.originalPrices?.[item.selectedSize];
                  const subtotal = currentPrice * item.quantity;

                  return (
                    <div key={item.id} className={styles.itemCard}>
                      {/* Selection Checkbox on Image hover or border area */}
                      <div className={styles.cardSelectWrapper} onClick={() => toggleSelectItem(item.id)}>
                        <span className={styles.itemCheckIcon}>
                          {item.selected ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#389e0d">
                              <circle cx="12" cy="12" r="10" fill="#389e0d" />
                              <polyline points="9 11 12 14 22 4" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#767677" strokeWidth="1.5">
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          )}
                        </span>
                      </div>

                      <div className={styles.itemImageWrapper}>
                        <img src={item.image} alt={item.name} className={styles.itemImg} />
                      </div>

                      <div className={styles.itemDetails}>
                        <div className={styles.cardHeaderRow}>
                          <div>
                            <h3 className={styles.productName}>{item.name}</h3>
                            <div className={styles.inspiredBy}>{item.inspiredBy}</div>
                          </div>
                          <button 
                            className={styles.removeBtn} 
                            onClick={() => removeItem(item.id)}
                            title="Remove product"
                          >
                            ×
                          </button>
                        </div>

                        {/* Size Selector */}
                        <div className={styles.sizeSelectionRow}>
                          <span className={styles.metaLabel}>Size:</span>
                          <div className={styles.sizeTags}>
                            {(["6ml", "10ml", "30ml", "50ml"] as const).map((size) => (
                              <button
                                key={size}
                                className={`${styles.sizeTag} ${item.selectedSize === size ? styles.activeSize : ""}`}
                                onClick={() => changeSize(item.id, size)}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity controls and subtotal details */}
                        <div className={styles.quantitySubtotalRow}>
                          <div className={styles.qtyControlWrapper}>
                            <span className={styles.metaLabel}>Quantity:</span>
                            <div className={styles.qtySelector}>
                              <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>-</button>
                              <span className={styles.qtyVal}>{item.quantity}</span>
                              <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                            </div>
                          </div>

                          {/* Price & Quantity labels parallel to screenshot */}
                          <div className={styles.metaSummaryCol}>
                            <div className={styles.pricingLabels}>
                              {currentOriginalPrice && (
                                <div className={styles.itemOriginalPrice}>{currentOriginalPrice.toLocaleString()}</div>
                              )}
                              <div className={styles.itemUnitPrice}>Price: <span className={styles.priceBold}>{currentPrice.toLocaleString()}</span></div>
                            </div>
                            <div className={styles.itemQtyLabel}>Quantity: {item.quantity}</div>
                          </div>

                          <div className={styles.subtotalCol}>
                            Subtotal: <span className={styles.subtotalVal}>{subtotal.toLocaleString()}tk</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Checkout Summary Panel */}
            <div className={styles.summaryColumn}>
              <div className={styles.summaryBox}>
                <h2 className={styles.summaryTitle}>Total:</h2>
                <div className={styles.selectedCount}>
                  ({selectedItemsCount.toString().padStart(2, "0")}) product selected
                </div>
                <div className={styles.totalValue}>
                  {totalAmount.toLocaleString()}tk
                </div>
                <button 
                  type="button"
                  className={styles.processBtn} 
                  onClick={handleProceedToPay}
                  disabled={selectedItemsCount === 0}
                  style={{ opacity: selectedItemsCount === 0 ? 0.5 : 1, cursor: selectedItemsCount === 0 ? 'not-allowed' : 'pointer' }}
                >
                  Process To Pay
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Luxury Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrandCol}>
            <div className={styles.footerLogo}>
              {/* Luxury Serif Logo */}
              <span>Murakkaz</span>
            </div>
            <p className={styles.footerDesc}>
              Crafted and created by Murakkaj. Redefining luxury fragrances in Bangladesh by bringing you world-class olfactory art with beast-mode longevity, without the ridiculous designer markups.
            </p>
          </div>
          <div className={styles.footerLinksCol}>
            <div className={styles.linksRow}>
              <Link href="/">Home</Link>
              <Link href="/">Our Story</Link>
              <Link href="/">Shop</Link>
              <Link href="/events">Event</Link>
              <Link href="/">Discovery</Link>
              <Link href="/">Community</Link>
            </div>
            <div className={styles.linksSubRow}>
              <Link href="/events">Event Finder</Link>
              <Link href="/track-order">Track Order</Link>
            </div>
          </div>
          <div className={styles.footerSocialCol}>
            <div className={styles.socialIconsRow}>
              {/* Facebook Box */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z"/>
                </svg>
              </a>
              {/* Instagram Box */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="Instagram">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* YouTube Box */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="YouTube">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            <span className={styles.copyrightText}>©2026 Aeethod. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
