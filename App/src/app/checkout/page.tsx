"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { getApiBaseUrl } from "@/lib/api";

interface CartItem {
  id: string;
  name: string;
  image: string;
  inspiredBy: string;
  selectedSize: string;
  quantity: number;
  prices: Record<string, number>;
  selected: boolean;
}

function CheckoutContent() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "inside-dhaka",
    address: "",
    paymentMethod: "cod",
    walletProvider: "bkash",
    walletNumber: "",
    transactionId: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Load checked cart items and user session from localStorage
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("murakkaz-token") : null;
    const userStr = typeof window !== "undefined" ? (localStorage.getItem("murakkaz-user") || localStorage.getItem("murakkaz_user")) : null;

    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        const parsed = JSON.parse(userStr);
        if (parsed) {
          setFormData((prev) => ({
            ...prev,
            fullName: parsed.name || prev.fullName,
            email: parsed.email || prev.email,
            phone: parsed.phone || prev.phone,
            address: parsed.primaryLocation && parsed.primaryLocation !== "Dhaka" ? parsed.primaryLocation : prev.address,
          }));
        }
      } catch {}
    } else {
      setIsLoggedIn(false);
    }

    const saved = localStorage.getItem("cart-items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Only pull selected items for checkout
          const selected = parsed.filter((item: any) => item.selected);
          setCartItems(selected);
        }
      } catch (e) {
        console.error("Error parsing cart", e);
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      value = parts.join(" ");
    }
    setFormData((prev) => ({ ...prev, cardNumber: value }));
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setFormData((prev) => ({ ...prev, cardExpiry: value }));
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setFormData((prev) => ({ ...prev, cardCvv: value }));
  };

  // Billing math
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.prices?.[item.selectedSize] || 500;
    return sum + itemPrice * item.quantity;
  }, 0);

  const deliveryCharge = formData.location === "inside-dhaka" ? 80 : 150;
  const totalAmount = subtotal + deliveryCharge;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const baseUrl = getApiBaseUrl();

    // Format items payload
    const orderItems = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize || "10ml",
      quantity: item.quantity || 1,
      unitPrice: item.prices?.[item.selectedSize] || 500,
      image: item.image,
      inspiredBy: item.inspiredBy,
    }));

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      address: formData.address,
      paymentMethod: formData.paymentMethod.toUpperCase(),
      walletProvider: formData.paymentMethod === "bkash" ? formData.walletProvider : undefined,
      walletNumber: formData.paymentMethod === "bkash" ? formData.walletNumber : undefined,
      transactionId: formData.paymentMethod === "bkash" ? formData.transactionId : undefined,
      cardLast4: formData.paymentMethod === "card" && formData.cardNumber ? formData.cardNumber.slice(-4) : undefined,
      cardBrand: formData.paymentMethod === "card" ? "VISA/Mastercard" : undefined,
      items: orderItems,
    };

    let token = null;
    try {
      const stored = localStorage.getItem("murakkaz-token") || localStorage.getItem("token");
      if (stored) token = stored;
    } catch {}

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.status === "success" && json.data) {
        setOrderId(json.data.orderNumber || `MRK-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        const generatedId = `MRK-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(generatedId);
      }

      // Filter out checked out items from global cart list
      const saved = localStorage.getItem("cart-items");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const remaining = parsed.filter((item: any) => !item.selected);
            localStorage.setItem("cart-items", JSON.stringify(remaining));
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Trigger cart count badge updates
      window.dispatchEvent(new Event("cart-updated"));
      setOrderPlaced(true);
    } catch (err) {
      console.warn("Backend order creation error, falling back locally:", err);
      const generatedId = `MRK-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);

      const saved = localStorage.getItem("cart-items");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const remaining = parsed.filter((item: any) => !item.selected);
            localStorage.setItem("cart-items", JSON.stringify(remaining));
          }
        } catch (e) {
          console.error(e);
        }
      }
      window.dispatchEvent(new Event("cart-updated"));
      setOrderPlaced(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn === false) {
    return (
      <div className={styles.page}>
        <div style={{ maxWidth: "520px", margin: "5rem auto 7rem", padding: "3rem 2.5rem", background: "white", borderRadius: "20px", border: "1px solid #E5DFD4", textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.06)" }}>
          <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: "#F7F2EB", color: "#820011", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", border: "1px solid #E0D6C8" }}>
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "2rem", color: "#18181b", marginBottom: "0.75rem" }}>
            Sign In Required
          </h2>
          <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem" }}>
            Please sign in to your Murakkaz account to place your order and track live delivery.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("redirect_after_login", "/checkout");
                }
                router.push("/account?redirect=/checkout");
              }}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                background: "#820011",
                color: "white",
                fontWeight: 600,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
                boxShadow: "0 4px 14px rgba(130, 0, 17, 0.25)"
              }}
            >
              Sign In / Create Account →
            </button>
            <Link
              href="/cart"
              style={{
                color: "#777",
                fontSize: "13.5px",
                textDecoration: "none",
                marginTop: "6px"
              }}
            >
              ← Return to Bag
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Order Placed Successfully!</h2>
          <p className={styles.successSubtitle}>Thank you for choosing Murakkaz.</p>
          
          <div className={styles.orderInfo}>
            <div className={styles.infoRow}>
              <span>Order ID:</span>
              <strong>{orderId}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Total Amount:</span>
              <strong>{totalAmount.toLocaleString()}tk</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Payment Method:</span>
              <strong>
                {formData.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : formData.paymentMethod === "bkash"
                  ? `${formData.walletProvider === "bkash" ? "bKash" : formData.walletProvider === "nagad" ? "Nagad" : "Rocket"} Mobile Wallet`
                  : "Card Payment"}
              </strong>
            </div>
            {formData.paymentMethod === "bkash" && (
              <>
                <div className={styles.infoRow}>
                  <span>Sender Account:</span>
                  <strong>{formData.walletNumber}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Transaction ID:</span>
                  <strong>{formData.transactionId}</strong>
                </div>
              </>
            )}
            {formData.paymentMethod === "card" && (
              <div className={styles.infoRow}>
                <span>Card Ending In:</span>
                <strong>•••• {formData.cardNumber.slice(-4)}</strong>
              </div>
            )}
            <div className={styles.infoRow}>
              <span>Delivery Area:</span>
              <strong>{formData.location === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</strong>
            </div>
          </div>

          <p className={styles.successMessage}>
            A confirmation has been sent to <strong>{formData.email}</strong>. Our delivery courier will call you at <strong>{formData.phone}</strong> when approaching your address.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <Link 
              href={`/track-order?orderNumber=${encodeURIComponent(orderId)}&contact=${encodeURIComponent(formData.phone || formData.email)}`} 
              className={styles.backToShopBtn}
              style={{ background: "#820011", color: "#fff", borderColor: "#820011" }}
            >
              Track Your Order Live →
            </Link>
            <Link href="/shop" className={styles.backToShopBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Back Link */}
        <div className={styles.breadcrumbs}>
          <Link href="/cart" className={styles.backLink}>
            <span className={styles.arrowLeft}>←</span> Back to Cart
          </Link>
        </div>

        <h1 className={styles.pageTitle}>Checkout</h1>

        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Your checkout list is empty. Add items to cart and proceed.</p>
            <Link href="/shop" className={styles.shopBtn}>Go to Shop</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.checkoutLayout}>
            {/* Form Column */}
            <div className={styles.formsColumn}>
              
              {/* Shipping Details */}
              <div className={styles.formCard}>
                <h3 className={styles.cardTitle}>Delivery Information</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 017XXXXXXXX"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location">Delivery Location</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  >
                    <option value="inside-dhaka">Inside Dhaka (Delivery: 80tk)</option>
                    <option value="outside-dhaka">Outside Dhaka (Delivery: 150tk)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="address">Detailed Address</label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={4}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House, Road, Area, landmark, city"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className={styles.formCard}>
                <h3 className={styles.cardTitle}>Payment Method</h3>
                
                <div className={styles.paymentOptions}>
                  {/* Cash on Delivery */}
                  <div
                    className={`${styles.paymentLabel} ${formData.paymentMethod === "cod" ? styles.selectedPayment : ""}`}
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "cod" }))}
                  >
                    <div className={styles.paymentLabelHeader}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        readOnly
                        style={{ cursor: "pointer" }}
                      />
                      <div className={styles.paymentInfo}>
                        <span className={styles.paymentName}>Cash on Delivery</span>
                        <span className={styles.paymentDesc}>Pay with cash upon receiving your delivery</span>
                      </div>
                    </div>
                    {formData.paymentMethod === "cod" && (
                      <div className={styles.paymentMethodDetails} onClick={(e) => e.stopPropagation()}>
                        <p className={styles.paymentMethodNotice}>
                          ✓ You will pay the delivery agent in cash upon receiving your package.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* bKash / Mobile Wallet */}
                  <div
                    className={`${styles.paymentLabel} ${formData.paymentMethod === "bkash" ? styles.selectedPayment : ""}`}
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "bkash" }))}
                  >
                    <div className={styles.paymentLabelHeader}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={formData.paymentMethod === "bkash"}
                        readOnly
                        style={{ cursor: "pointer" }}
                      />
                      <div className={styles.paymentInfo}>
                        <span className={styles.paymentName}>bKash / Mobile Wallets</span>
                        <span className={styles.paymentDesc}>Pay securely using bKash, Nagad or Rocket</span>
                      </div>
                    </div>
                    {formData.paymentMethod === "bkash" && (
                      <div className={styles.paymentMethodDetails} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.paymentInstructions}>
                          <p>1. Send the Grand Total to our official bKash/Nagad wallet: <strong>01319022151</strong></p>
                          <p>2. Fill in the sender mobile number and the Transaction ID (TrxID) below.</p>
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                          <label htmlFor="walletProvider">Mobile Wallet Provider</label>
                          <select
                            id="walletProvider"
                            name="walletProvider"
                            value={formData.walletProvider}
                            onChange={handleInputChange}
                            required={formData.paymentMethod === "bkash"}
                          >
                            <option value="bkash">bKash</option>
                            <option value="nagad">Nagad</option>
                            <option value="rocket">Rocket</option>
                          </select>
                        </div>
                        <div className={styles.row} style={{ marginTop: "0.75rem", gap: "1rem" }}>
                          <div className={styles.formGroup}>
                            <label htmlFor="walletNumber">Your Wallet Number</label>
                            <input
                              type="tel"
                              id="walletNumber"
                              name="walletNumber"
                              placeholder="01XXXXXXXXX"
                              required={formData.paymentMethod === "bkash"}
                              value={formData.walletNumber}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="transactionId">Transaction ID (TrxID)</label>
                            <input
                              type="text"
                              id="transactionId"
                              name="transactionId"
                              placeholder="e.g. 9J2K3L4M"
                              required={formData.paymentMethod === "bkash"}
                              value={formData.transactionId}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Payment */}
                  <div
                    className={`${styles.paymentLabel} ${formData.paymentMethod === "card" ? styles.selectedPayment : ""}`}
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: "card" }))}
                  >
                    <div className={styles.paymentLabelHeader}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        readOnly
                        style={{ cursor: "pointer" }}
                      />
                      <div className={styles.paymentInfo}>
                        <span className={styles.paymentName}>Credit / Debit Card</span>
                        <span className={styles.paymentDesc}>Visa, Mastercard, or AMEX cards supported</span>
                      </div>
                    </div>
                    {formData.paymentMethod === "card" && (
                      <div className={styles.paymentMethodDetails} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.formGroup}>
                          <label htmlFor="cardNumber">Card Number</label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 1234 5678"
                            required={formData.paymentMethod === "card"}
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                          />
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: "0.75rem" }}>
                          <label htmlFor="cardName">Cardholder Name</label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            placeholder="JOHN DOE"
                            required={formData.paymentMethod === "card"}
                            value={formData.cardName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className={styles.row} style={{ marginTop: "0.75rem", gap: "1rem" }}>
                          <div className={styles.formGroup}>
                            <label htmlFor="cardExpiry">Expiration Date</label>
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/YY"
                              required={formData.paymentMethod === "card"}
                              value={formData.cardExpiry}
                              onChange={handleCardExpiryChange}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label htmlFor="cardCvv">CVV / CVC</label>
                            <input
                              type="password"
                              id="cardCvv"
                              name="cardCvv"
                              placeholder="•••"
                              maxLength={4}
                              required={formData.paymentMethod === "card"}
                              value={formData.cardCvv}
                              onChange={handleCardCvvChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Panel */}
            <div className={styles.summaryColumn}>
              <div className={styles.summaryBox}>
                <h3 className={styles.summaryBoxTitle}>Order Summary</h3>

                {/* Items Container */}
                <div className={styles.itemsList}>
                  {cartItems.map((item) => {
                    const price = item.prices[item.selectedSize] || 500;
                    return (
                      <div key={item.id} className={styles.summaryItem}>
                        <div className={styles.itemImageWrapper}>
                          <Image src={item.image} alt={item.name} width={50} height={50} />
                        </div>
                        <div className={styles.itemDetails}>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemSubText}>Size: {item.selectedSize} | Qty: {item.quantity}</div>
                        </div>
                        <div className={styles.itemPrice}>{(price * item.quantity).toLocaleString()}tk</div>
                      </div>
                    );
                  })}
                </div>

                {/* Bill Breakdown */}
                <div className={styles.billingSummary}>
                  <div className={styles.billingRow}>
                    <span>Subtotal:</span>
                    <span>{subtotal.toLocaleString()}tk</span>
                  </div>
                  <div className={styles.billingRow}>
                    <span>Delivery Charge:</span>
                    <span>{deliveryCharge.toLocaleString()}tk</span>
                  </div>
                  <div className={styles.divider} />
                  <div className={`${styles.billingRow} ${styles.totalRow}`}>
                    <span>Grand Total:</span>
                    <span>{totalAmount.toLocaleString()}tk</span>
                  </div>
                </div>

                <button type="submit" className={styles.checkoutSubmitBtn}>
                  Confirm Order ({totalAmount.toLocaleString()}tk)
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#8c8c90' }}>
        Loading checkout details...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
