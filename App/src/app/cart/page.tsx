"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface CartItem {
  id: string;
  name: string;
  image: string;
  inspiredBy: string;
  selectedSize: "5ml" | "10ml" | "100ml";
  quantity: number;
  prices: {
    "5ml": number;
    "10ml": number;
    "100ml": number;
  };
  originalPrices?: {
    "5ml"?: number;
    "10ml"?: number;
    "100ml"?: number;
  };
  selected: boolean;
}

const initialCartItems: CartItem[] = [
  {
    id: "cart-1",
    name: "Jade Serenity",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "Inspired by Dio Savotage",
    selectedSize: "5ml",
    quantity: 1,
    prices: {
      "5ml": 1720,
      "10ml": 3100,
      "100ml": 15500,
    },
    selected: true,
  },
  {
    id: "cart-2",
    name: "Hellenist",
    image: "/images/products/magnetism.png",
    inspiredBy: "Inspired by Dio Savotage",
    selectedSize: "5ml",
    quantity: 1,
    prices: {
      "5ml": 2200,
      "10ml": 3900,
      "100ml": 19800,
    },
    originalPrices: {
      "5ml": 2920,
      "10ml": 5100,
      "100ml": 25500,
    },
    selected: true,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

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
  const changeSize = (id: string, size: "5ml" | "10ml" | "100ml") => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selectedSize: size } : item
      )
    );
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
    .reduce((sum, item) => sum + item.prices[item.selectedSize] * item.quantity, 0);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Your Chart</h1>

        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Your chart is empty.</p>
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
                            {(["5ml", "10ml", "100ml"] as const).map((size) => (
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
                <button className={styles.processBtn}>
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
              Crafted and curated by Murakkaj. Redefining luxury fragrances in Bangladesh by bringing you world-class olfactory art with beast-mode longevity, without the ridiculous designer markups.
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
              <Link href="/">Perfume Finder</Link>
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
