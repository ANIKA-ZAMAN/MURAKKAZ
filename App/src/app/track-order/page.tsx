"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { getApiBaseUrl } from "@/lib/api";

interface TrackedOrderItem {
  id: string;
  productName: string;
  productImage?: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface TrackedOrder {
  id?: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  phone: string;
  address: string;
  location: "inside-dhaka" | "outside-dhaka";
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  items: TrackedOrderItem[];
}

interface ProfileUser {
  name: string;
  email: string;
  memberTier?: string;
  photo?: string;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [profileOrders, setProfileOrders] = useState<TrackedOrder[]>([]);
  const [loadingProfileOrders, setLoadingProfileOrders] = useState(false);

  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [contactInput, setContactInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const [showManualLookup, setShowManualLookup] = useState(false);

  const fetchOrderTracking = async (orderNum: string, contact?: string) => {
    if (!orderNum || !orderNum.trim()) return;

    setLoading(true);
    setError(null);

    const cleanNum = orderNum.trim();
    const baseUrl = getApiBaseUrl();

    try {
      const query = contact && contact.trim() ? `?contact=${encodeURIComponent(contact.trim())}` : "";
      const res = await fetch(`${baseUrl}/api/orders/track/${encodeURIComponent(cleanNum)}${query}`);
      const json = await res.json();

      if (res.ok && json.status === "success" && json.data) {
        setTrackedOrder(json.data);
      } else {
        setError(json.message || "We could not find an order matching that Order ID. Please check and try again.");
        setTrackedOrder(null);
      }
    } catch (err) {
      console.error("Order tracking error:", err);
      setError("Unable to reach the server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch logged in user's profile orders
  const fetchProfileOrders = async () => {
    const token = localStorage.getItem("murakkaz-token");
    if (!token) return;

    setLoadingProfileOrders(true);
    const baseUrl = getApiBaseUrl();

    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json.data) {
        const list: TrackedOrder[] = Array.isArray(json.data) ? json.data : json.data.data || [];
        setProfileOrders(list);

        // If no explicit query param, automatically track their most recent order!
        const initialOrderNum = searchParams.get("orderNumber");
        if (!initialOrderNum && list.length > 0) {
          const latest = list[0];
          setOrderNumberInput(latest.orderNumber);
          fetchOrderTracking(latest.orderNumber);
        }
      }
    } catch (err) {
      console.warn("Could not load profile orders:", err);
    } finally {
      setLoadingProfileOrders(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("murakkaz-token");
    const savedUser = localStorage.getItem("murakkaz-user") || localStorage.getItem("murakkaz_user");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        fetchProfileOrders();
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    const initialOrderNum = searchParams.get("orderNumber");
    const initialContact = searchParams.get("contact") || "";

    if (initialOrderNum) {
      setOrderNumberInput(initialOrderNum);
      if (initialContact) setContactInput(initialContact);
      fetchOrderTracking(initialOrderNum, initialContact);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) return;

    router.push(`/track-order?orderNumber=${encodeURIComponent(orderNumberInput.trim())}${contactInput.trim() ? `&contact=${encodeURIComponent(contactInput.trim())}` : ""}`);
    fetchOrderTracking(orderNumberInput, contactInput);
  };

  const handleSelectProfileOrder = (order: TrackedOrder) => {
    setOrderNumberInput(order.orderNumber);
    router.push(`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`);
    fetchOrderTracking(order.orderNumber);
  };

  // Helper to determine step states
  const getStepStatus = (stepIndex: number, status: string) => {
    const statusMap: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 1,
      PROCESSING: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: -1,
    };

    const currentLevel = statusMap[status] ?? 0;
    if (currentLevel === -1) return "cancelled";
    if (currentLevel > stepIndex) return "completed";
    if (currentLevel === stepIndex) return "current";
    return "upcoming";
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header Title Section */}
        <div className={styles.headerSection}>
          <span className={styles.badge}>Live Delivery Tracking</span>
          <h1 className={styles.title}>Track Your Fragrance</h1>
          <p className={styles.subtitle}>
            Monitor your bespoke extraits from our scent lab to your doorstep with real-time olfactory milestones.
          </p>
        </div>

        {/* INDIVIDUAL PROFILE-BASED ORDERS BAR (If User Logged In) */}
        {user && profileOrders.length > 0 && (
          <div className={styles.profileOrdersSection}>
            <div className={styles.profileBanner}>
              <div className={styles.profileUserTag}>
                <div className={styles.userAvatarThumb}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                </div>
                <div>
                  <div className={styles.profileGreeting}>Welcome, {user.name}</div>
                  <div className={styles.profileSub}>
                    {profileOrders.length} {profileOrders.length === 1 ? "order" : "orders"} linked to your profile
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowManualLookup(!showManualLookup)}
                className={styles.manualLookupToggle}
              >
                {showManualLookup ? "Hide Manual Lookup" : "Search Another Order ID →"}
              </button>
            </div>

            <div className={styles.profileOrdersGrid}>
              {profileOrders.map((order) => {
                const isSelected = trackedOrder?.orderNumber === order.orderNumber;
                return (
                  <button
                    key={order.orderNumber || order.id}
                    type="button"
                    onClick={() => handleSelectProfileOrder(order)}
                    className={`${styles.profileOrderCard} ${isSelected ? styles.profileOrderCardActive : ""}`}
                  >
                    <div className={styles.cardTopRow}>
                      <span className={styles.orderNumText}>#{order.orderNumber}</span>
                      <span className={`${styles.statusPill} ${order.status === "DELIVERED" ? styles.statusPillDelivered : order.status === "SHIPPED" ? styles.statusPillShipped : styles.statusPillProcessing}`} style={{ fontSize: "0.72rem", padding: "3px 10px" }}>
                        {order.status}
                      </span>
                    </div>

                    <div className={styles.orderDateText}>
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>

                    <div className={styles.orderItemsSummary}>
                      {order.items?.map((i) => i.productName).join(", ") || "Murakkaz Fragrances"}
                    </div>

                    <div className={styles.cardBottomRow}>
                      <span style={{ fontSize: "0.75rem", color: "#888" }}>Total:</span>
                      <span className={styles.orderTotalText}>{order.grandTotal?.toLocaleString()}tk</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Bar Container (Always available if guest, or toggled for logged-in user) */}
        {(!user || profileOrders.length === 0 || showManualLookup) && (
          <div className={styles.searchCard}>
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="orderNumber" className={styles.inputLabel}>
                  Order ID *
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  placeholder="e.g. MRK-849201"
                  value={orderNumberInput}
                  onChange={(e) => setOrderNumberInput(e.target.value)}
                  required
                  className={styles.textInput}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="contact" className={styles.inputLabel}>
                  Phone Number / Email (Optional)
                </label>
                <input
                  id="contact"
                  type="text"
                  placeholder="e.g. 017XXXXXXXX"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  className={styles.textInput}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.trackBtn}>
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Track Package
                  </>
                )}
              </button>
            </form>

            {!user && (
              <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#666" }}>
                Tip: <Link href="/account" style={{ color: "#820011", fontWeight: 600 }}>Sign in to your account</Link> to automatically view and track all your purchases without entering order IDs.
              </div>
            )}

            {error && <div className={styles.errorBanner}>{error}</div>}
          </div>
        )}

        {/* Order Result Section */}
        {trackedOrder && (
          <div className={styles.resultSection}>
            {/* Status Header */}
            <div className={styles.statusHeaderCard}>
              <div>
                <h2 className={styles.orderHeading}>Order #{trackedOrder.orderNumber}</h2>
                <div className={styles.orderDate}>
                  Placed on {new Date(trackedOrder.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <div>
                {trackedOrder.status === "PENDING" && <span className={`${styles.statusPill} ${styles.statusPillPending}`}>● Order Received</span>}
                {trackedOrder.status === "CONFIRMED" && <span className={`${styles.statusPill} ${styles.statusPillProcessing}`}>● Confirmed</span>}
                {trackedOrder.status === "PROCESSING" && <span className={`${styles.statusPill} ${styles.statusPillProcessing}`}>● Packaging & Lab Audit</span>}
                {trackedOrder.status === "SHIPPED" && <span className={`${styles.statusPill} ${styles.statusPillShipped}`}>● Out for Delivery</span>}
                {trackedOrder.status === "DELIVERED" && <span className={`${styles.statusPill} ${styles.statusPillDelivered}`}>✓ Delivered</span>}
                {trackedOrder.status === "CANCELLED" && <span className={`${styles.statusPill} ${styles.statusPillCancelled}`}>✕ Cancelled</span>}
              </div>
            </div>

            {/* Stepper Flow */}
            {trackedOrder.status !== "CANCELLED" ? (
              <div className={styles.stepperWrapper}>
                <div className={styles.stepperGrid}>
                  {/* Step 1 */}
                  <div className={`${styles.stepItem} ${getStepStatus(0, trackedOrder.status) === "completed" ? styles.stepCompleted : getStepStatus(0, trackedOrder.status) === "current" ? styles.stepCurrent : ""}`}>
                    <div className={styles.stepIconCircle}>
                      {getStepStatus(0, trackedOrder.status) === "completed" ? "✓" : "1"}
                    </div>
                    <div className={styles.stepTitle}>Order Placed</div>
                    <div className={styles.stepDesc}>Details received in our system</div>
                  </div>

                  {/* Step 2 */}
                  <div className={`${styles.stepItem} ${getStepStatus(1, trackedOrder.status) === "completed" ? styles.stepCompleted : getStepStatus(1, trackedOrder.status) === "current" ? styles.stepCurrent : ""}`}>
                    <div className={styles.stepIconCircle}>
                      {getStepStatus(1, trackedOrder.status) === "completed" ? "✓" : "2"}
                    </div>
                    <div className={styles.stepTitle}>Confirmed</div>
                    <div className={styles.stepDesc}>Payment / COD verification</div>
                  </div>

                  {/* Step 3 */}
                  <div className={`${styles.stepItem} ${getStepStatus(2, trackedOrder.status) === "completed" ? styles.stepCompleted : getStepStatus(2, trackedOrder.status) === "current" ? styles.stepCurrent : ""}`}>
                    <div className={styles.stepIconCircle}>
                      {getStepStatus(2, trackedOrder.status) === "completed" ? "✓" : "3"}
                    </div>
                    <div className={styles.stepTitle}>In Scent Lab</div>
                    <div className={styles.stepDesc}>Packaging & Quality Audit</div>
                  </div>

                  {/* Step 4 */}
                  <div className={`${styles.stepItem} ${getStepStatus(3, trackedOrder.status) === "completed" ? styles.stepCompleted : getStepStatus(3, trackedOrder.status) === "current" ? styles.stepCurrent : ""}`}>
                    <div className={styles.stepIconCircle}>
                      {getStepStatus(3, trackedOrder.status) === "completed" || trackedOrder.status === "DELIVERED" ? "✓" : "4"}
                    </div>
                    <div className={styles.stepTitle}>Out For Delivery</div>
                    <div className={styles.stepDesc}>{trackedOrder.location === "inside-dhaka" ? "1-2 days (Dhaka)" : "2-3 days (Nationwide)"}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: "1.5rem", background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: "12px", marginBottom: "2rem", color: "#cf1322" }}>
                <strong>Order Cancelled:</strong> This order has been cancelled. If you believe this is in error or need assistance, please contact our support team.
              </div>
            )}

            {/* Details Split Columns */}
            <div className={styles.detailsGrid}>
              {/* Left Column: Ordered Items */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#820011" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  Ordered Fragrances ({trackedOrder.items.length})
                </h3>

                <div className={styles.itemsList}>
                  {trackedOrder.items.map((item) => (
                    <div key={item.id} className={styles.orderItemRow}>
                      <img
                        src={item.productImage || "/images/products/vanilla_28_v2.jpg"}
                        alt={item.productName}
                        className={styles.itemImage}
                      />
                      <div className={styles.itemMeta}>
                        <div className={styles.itemName}>{item.productName}</div>
                        <div className={styles.itemSizeQty}>
                          Size: {item.selectedSize} • Qty: {item.quantity}
                        </div>
                      </div>
                      <div className={styles.itemPrice}>
                        {item.totalPrice?.toLocaleString()}tk
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #f0ebe2" }}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>{trackedOrder.subtotal?.toLocaleString()}tk</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Delivery Fee:</span>
                    <span>{trackedOrder.deliveryCharge}tk</span>
                  </div>
                  <div className={styles.summaryTotalRow}>
                    <span>Grand Total:</span>
                    <span style={{ color: "#820011" }}>{trackedOrder.grandTotal?.toLocaleString()}tk</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer & Courier Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#820011" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Delivery Details
                  </h3>

                  <div className={styles.infoLine}>
                    <strong>Recipient:</strong> {trackedOrder.fullName}
                  </div>
                  <div className={styles.infoLine}>
                    <strong>Phone:</strong> {trackedOrder.phone}
                  </div>
                  <div className={styles.infoLine}>
                    <strong>Address:</strong> {trackedOrder.address}
                  </div>
                  <div className={styles.infoLine}>
                    <strong>Area:</strong> {trackedOrder.location === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                  </div>

                  {trackedOrder.trackingNumber && (
                    <div className={styles.courierBox}>
                      <div className={styles.courierHeading}>Courier Consignment & Tracking:</div>
                      <div className={styles.courierCode}>{trackedOrder.trackingNumber}</div>
                      {trackedOrder.trackingNumber.startsWith('STDF-') && (
                        <a
                          href={`https://steadfast.com.bd/t/${trackedOrder.trackingNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            marginTop: "6px",
                            fontSize: "0.82rem",
                            color: "#1e40af",
                            textDecoration: "underline"
                          }}
                        >
                          Track live on Steadfast Courier ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#820011" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Payment Details
                  </h3>

                  <div className={styles.infoLine}>
                    <strong>Method:</strong> {trackedOrder.paymentMethod}
                  </div>
                  <div className={styles.infoLine}>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: trackedOrder.paymentStatus === "VERIFIED" ? "#389e0d" : "#d46b08", fontWeight: 600 }}>
                      {trackedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className={styles.infoLine}>
                    <strong>Total Payable:</strong> {trackedOrder.grandTotal?.toLocaleString()}tk
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help Support Banner */}
            <div className={styles.helpActions}>
              <div className={styles.helpText}>
                <h4>Need assistance with your delivery?</h4>
                <p>Our olfactory care team is available 24/7 to answer questions regarding your order.</p>
              </div>
              <a
                href={`https://wa.me/8801997807701?text=Hello%20Murakkaz%20team,%20I%20have%20a%20question%20regarding%20my%20order%20${trackedOrder.orderNumber}`}
                target="_blank"
                rel="noreferrer"
                className={styles.supportBtn}
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span>©2026 Murakkaz Luxury Perfumes. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/shop" style={{ color: "#820011", textDecoration: "none" }}>Shop Collection</Link>
            <Link href="/our-story" style={{ color: "#820011", textDecoration: "none" }}>Our Story</Link>
            <Link href="/account" style={{ color: "#820011", textDecoration: "none" }}>My Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: "6rem 2rem", textAlign: "center", color: "#666" }}>Loading tracking portal...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
