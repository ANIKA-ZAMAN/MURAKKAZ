"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  mockUserProfile, 
  mockOrders, 
  mockAddresses, 
  UserProfile, 
  Address 
} from "./accountData";
import styles from "./AccountDrawer.module.css";
import { getApiBaseUrl } from "@/lib/api";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "addresses" | "settings">("dashboard");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Auth Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");

  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [registerMethod, setRegisterMethod] = useState<"email" | "phone">("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Address Editor states
  const [shippingAddress, setShippingAddress] = useState<Address>(mockAddresses.shipping);
  const [billingAddress, setBillingAddress] = useState<Address>(mockAddresses.billing);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);

  // Settings states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [consultationReminders, setConsultationReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load user session & preferences on mount
  useEffect(() => {
    const token = localStorage.getItem("murakkaz-token");
    const baseUrl = getApiBaseUrl();

    if (!token) {
      localStorage.removeItem("murakkaz-user");
      localStorage.removeItem("murakkaz_user");
      setUser(null);
    } else {
      fetch(`${baseUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid session");
          return res.json();
        })
        .then((json) => {
          if (json.data) {
            const authUser = json.data;
            const profile: UserProfile = {
              name: `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || authUser.email || authUser.phone || "Fragrance Connoisseur",
              email: authUser.email || "",
              phone: authUser.phone || "",
              memberSince: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Member",
              memberTier: authUser.memberTier || "Collector Circle",
              points: authUser.points || 100,
              photo: authUser.photo || undefined,
            };
            setUser(profile);
            localStorage.setItem("murakkaz-user", JSON.stringify(profile));
          } else {
            throw new Error("No user");
          }
        })
        .catch(() => {
          localStorage.removeItem("murakkaz-token");
          localStorage.removeItem("murakkaz-refresh-token");
          localStorage.removeItem("murakkaz-user");
          localStorage.removeItem("murakkaz_user");
          setUser(null);
        });
    }

    // Load preferences
    setSoundEnabled(localStorage.getItem("pref-sound") !== "false");
    setAmbientEnabled(localStorage.getItem("pref-ambient") !== "false");
    setNewsletterEnabled(localStorage.getItem("pref-newsletter") === "true");
    setConsultationReminders(localStorage.getItem("pref-reminders") !== "false");
    setDarkMode(localStorage.getItem("pref-darkmode") === "true");
  }, [isOpen]);

  const [authError, setAuthError] = useState<string | null>(null);
  const [registerOtpSent, setRegisterOtpSent] = useState(false);
  const [loginOtpSent, setLoginOtpSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setAuthError(null);

    const baseUrl = getApiBaseUrl();

    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json();
      if (res.ok && json.data) {
        const { user: authUser, accessToken, refreshToken } = json.data;
        const profile: UserProfile = {
          name: `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.email || "Fragrance Connoisseur",
          email: authUser.email || "",
          phone: authUser.phone || "",
          memberSince: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Member",
          memberTier: authUser.memberTier || "Collector Circle",
          points: authUser.points || 100,
          photo: authUser.photo || undefined
        };

        if (accessToken) localStorage.setItem("murakkaz-token", accessToken);
        if (refreshToken) localStorage.setItem("murakkaz-refresh-token", refreshToken);
        localStorage.setItem("murakkaz-user", JSON.stringify(profile));

        setUser(profile);
        window.dispatchEvent(new Event("murakkaz-user-updated"));
        setEmail("");
        setPassword("");
      } else {
        setAuthError(json.message || "Invalid email or password.");
      }
    } catch (err) {
      console.warn("API login error:", err);
      setAuthError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthError(null);
    const baseUrl = getApiBaseUrl();

    if (!loginOtpSent) {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/auth/email-otp/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, type: 'LOGIN' })
        });
        const json = await res.json();
        if (res.ok) {
          setLoginOtpSent(true);
        } else {
          setAuthError(json.message || "Failed to send verification email.");
        }
      } catch (err) {
        setAuthError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!otp) return;
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/auth/email-otp/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp })
        });
        const json = await res.json();
        if (res.ok && json.data) {
          const { user: authUser, accessToken, refreshToken } = json.data;
          const profile: UserProfile = {
            name: `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.email || "Fragrance Connoisseur",
            email: authUser.email || "",
            phone: authUser.phone || "",
            memberSince: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Member",
            memberTier: authUser.memberTier || "Collector Circle",
            points: authUser.points || 100,
            photo: authUser.photo || undefined
          };

          if (accessToken) localStorage.setItem("murakkaz-token", accessToken);
          if (refreshToken) localStorage.setItem("murakkaz-refresh-token", refreshToken);
          localStorage.setItem("murakkaz-user", JSON.stringify(profile));

          setUser(profile);
          setLoginOtpSent(false);
          setOtp("");
          window.dispatchEvent(new Event("murakkaz-user-updated"));
        } else {
          setAuthError(json.message || "Invalid or expired verification code.");
        }
      } catch (err) {
        setAuthError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegisterWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!registerOtpSent && password !== confirmPassword) {
      setAuthError("Passwords do not match!");
      return;
    }

    setAuthError(null);
    const baseUrl = getApiBaseUrl();

    if (!registerOtpSent) {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/auth/email-otp/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            type: 'REGISTER',
            firstName,
            lastName,
            password
          })
        });
        const json = await res.json();
        if (res.ok) {
          setRegisterOtpSent(true);
        } else {
          setAuthError(json.message || "Failed to send verification email.");
        }
      } catch (err) {
        setAuthError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!otp) return;
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/auth/email-otp/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            firstName,
            lastName,
            password
          })
        });
        const json = await res.json();
        if (res.ok && json.data) {
          const { user: authUser, accessToken, refreshToken } = json.data;
          const profile: UserProfile = {
            name: `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.email || "Valued Collector",
            email: authUser.email || "",
            phone: authUser.phone || "",
            memberSince: "New Member",
            memberTier: "Collector Circle",
            points: 100,
            photo: authUser.photo || undefined
          };

          if (accessToken) localStorage.setItem("murakkaz-token", accessToken);
          if (refreshToken) localStorage.setItem("murakkaz-refresh-token", refreshToken);
          localStorage.setItem("murakkaz-user", JSON.stringify(profile));

          setUser(profile);
          setRegisterOtpSent(false);
          setOtp("");
          window.dispatchEvent(new Event("murakkaz-user-updated"));
        } else {
          setAuthError(json.message || "Invalid or expired verification code.");
        }
      } catch (err) {
        setAuthError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("murakkaz-token");
    localStorage.removeItem("murakkaz-refresh-token");
    localStorage.removeItem("murakkaz-user");
    localStorage.removeItem("murakkaz_user");
    localStorage.removeItem("murakkaz-saved-addresses");
    sessionStorage.clear();
    setUser(null);
    window.dispatchEvent(new Event("murakkaz-user-updated"));
    onClose();
    setActiveTab("dashboard");
  };

  const togglePreference = (key: string, val: boolean, setter: (v: boolean) => void) => {
    setter(val);
    localStorage.setItem(key, String(val));
    window.dispatchEvent(new Event("preferences-updated"));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    localStorage.setItem("murakkaz-user", JSON.stringify(user));
    window.dispatchEvent(new Event("murakkaz-user-updated"));
    alert("Profile saved successfully.");
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingShipping(false);
  };

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingBilling(false);
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`} 
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        
        {/* Drawer Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {user ? "My Account" : "Access Murakkaz"}
          </h2>
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Close Account Panel"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body Scroll Content */}
        <div className={styles.content}>

          {/* UNAUTHENTICATED FORM VIEWS */}
          {!user ? (
            <div className={styles.authCard}>
              <div className={styles.authTabs}>
                <button 
                  type="button" 
                  className={`${styles.authTab} ${authMode === "login" ? styles.authActiveTab : ""}`}
                  onClick={() => {
                    setAuthMode("login");
                    setOtpSent(false);
                  }}
                >
                  Sign In
                </button>
                <button 
                  type="button" 
                  className={`${styles.authTab} ${authMode === "register" ? styles.authActiveTab : ""}`}
                  onClick={() => {
                    setAuthMode("register");
                    setOtpSent(false);
                  }}
                >
                  Register
                </button>
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", gap: "1rem" }}>
                  <div style={{ width: "24px", height: "24px", border: "2px solid rgba(130, 0, 17, 0.1)", borderTopColor: "#820011", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                  <style jsx>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                  <p style={{ fontSize: "0.8rem", color: "#767677", letterSpacing: "0.05em" }}>Verifying Scent Credentials...</p>
                </div>
              ) : authMode === "login" ? (
                <div>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
                    <button
                      type="button"
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "11px",
                        fontWeight: 500,
                        borderRadius: "4px",
                        border: loginMethod === "email" ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                        background: loginMethod === "email" ? "rgba(197, 168, 128, 0.15)" : "transparent",
                        color: loginMethod === "email" ? "var(--gold)" : "var(--foreground)",
                        cursor: "pointer"
                      }}
                      onClick={() => { setLoginMethod("email"); setLoginOtpSent(false); setAuthError(null); }}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "11px",
                        fontWeight: 500,
                        borderRadius: "4px",
                        border: loginMethod === "phone" ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                        background: loginMethod === "phone" ? "rgba(197, 168, 128, 0.15)" : "transparent",
                        color: loginMethod === "phone" ? "var(--gold)" : "var(--foreground)",
                        cursor: "pointer"
                      }}
                      onClick={() => { setLoginMethod("phone"); setLoginOtpSent(false); setAuthError(null); }}
                    >
                      ✉️ Email OTP
                    </button>
                  </div>

                  {loginMethod === "email" ? (
                    <form onSubmit={handleLogin} className={styles.form}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input 
                          type="email" 
                          required 
                          className={styles.input} 
                          placeholder="e.g. user@murakkaz.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input 
                          type="password" 
                          required 
                          className={styles.input}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <button type="submit" className={styles.btnPrimary}>
                        Access Account
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleEmailOtpLogin} className={styles.form}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input 
                          type="email" 
                          required 
                          disabled={loginOtpSent}
                          className={styles.input} 
                          placeholder="e.g. user@murakkaz.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {loginOtpSent && (
                        <div className={styles.formGroup}>
                          <label className={styles.label}>6-Digit Email Code</label>
                          <input 
                            type="text" 
                            required 
                            maxLength={6}
                            autoFocus
                            className={styles.input} 
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </div>
                      )}
                      <button type="submit" className={styles.btnPrimary}>
                        {!loginOtpSent ? "Send Email Sign In Code" : "Verify & Access Account"}
                      </button>
                      {loginOtpSent && (
                        <button
                          type="button"
                          onClick={() => setLoginOtpSent(false)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--gold)",
                            fontSize: "11px",
                            cursor: "pointer",
                            textAlign: "center",
                            marginTop: "4px"
                          }}
                        >
                          Change email address
                        </button>
                      )}
                    </form>
                  )}

                  <p className={styles.authSwitchText} style={{ marginTop: "1rem" }}>
                    Don't have an account?{" "}
                    <button 
                      type="button" 
                      className={styles.authLink} 
                      onClick={() => { setAuthMode("register"); setRegisterOtpSent(false); setAuthError(null); }}
                    >
                      Register Now
                    </button>
                  </p>
                </div>
              ) : (
                /* EMAIL REGISTRATION WITH OTP */
                <form onSubmit={handleRegisterWithOtp} className={styles.form}>
                  {!registerOtpSent ? (
                    <>
                      <div className={styles.row2Col}>
                        <input 
                          type="text" 
                          required 
                          className={styles.input} 
                          placeholder="First name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input 
                          type="text" 
                          required 
                          className={styles.input} 
                          placeholder="Last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>

                      <input 
                        type="email" 
                        required 
                        className={styles.input} 
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <div className={styles.row2Col}>
                        <input 
                          type="password" 
                          required 
                          className={styles.input} 
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <input 
                          type="password" 
                          required 
                          className={styles.input} 
                          placeholder="Confirm"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>

                      <button type="submit" className={styles.btnPrimary} style={{ textTransform: "none" }}>
                        ✉️ Verify Email & Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "12px", color: "var(--muted)", margin: "-4px 0 10px" }}>
                        Verification code sent to <strong>{email}</strong>
                      </p>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>6-Digit Email Code</label>
                        <input 
                          type="text" 
                          required 
                          maxLength={6}
                          autoFocus
                          className={styles.input} 
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <button type="submit" className={styles.btnPrimary}>
                        Verify & Complete Registration
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegisterOtpSent(false)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--gold)",
                          fontSize: "11px",
                          cursor: "pointer",
                          textAlign: "center",
                          marginTop: "4px"
                        }}
                      >
                        Change details / Resend code
                      </button>
                    </>
                  )}

                  <p className={styles.authSwitchText} style={{ marginTop: "1rem" }}>
                    Already have an account?{" "}
                    <button 
                      type="button" 
                      className={styles.authLink} 
                      onClick={() => { setAuthMode("login"); setAuthError(null); }}
                    >
                      Login
                    </button>
                  </p>
                </form>
              )}
            </div>
          ) : (
            
            /* AUTHENTICATED PANEL */
            <div>
              
              {/* Profile Card Header */}
              <div className={styles.dashboardHeader}>
                <span className={styles.userName}>Hello, {user.name}</span>
                <span className={styles.userTier}>{user.memberTier}</span>
                <span className={styles.pointsSummary}>Reward Points Balance: <strong>{user.points} pts</strong></span>
              </div>

              {/* Horizontal Tab Selector */}
              <div className={styles.tabSelector}>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "dashboard" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  Stats
                </button>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "orders" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  Orders
                </button>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "addresses" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  Addresses
                </button>
                <button 
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "settings" ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button>
              </div>

              {/* Dynamic Tab Body content */}
              <div className={styles.tabContent}>
                
                {/* SUBTAB: Dashboard summary */}
                {activeTab === "dashboard" && (
                  <div>
                    <h3 className={styles.sectionTitle}>Overview</h3>
                    <div className={styles.statGrid}>
                      <div className={styles.statCard}>
                        <span className={styles.statLabel}>Member Tier</span>
                        <span className={styles.statValue} style={{ color: "#c5a880" }}>Gold</span>
                      </div>
                      <div className={styles.statCard}>
                        <span className={styles.statLabel}>Active Orders</span>
                        <span className={styles.statValue}>1 Order</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB: Orders */}
                {activeTab === "orders" && (
                  <div>
                    <h3 className={styles.sectionTitle}>Purchases</h3>
                    <div className={styles.ordersList}>
                      {mockOrders.map((order) => (
                        <div key={order.id} className={styles.orderCard}>
                          <div className={styles.orderHeader}>
                            <div className={styles.orderMeta}>
                              <div className={styles.orderMetaGroup}>
                                <span className={styles.orderMetaLabel}>ID</span>
                                <span className={styles.orderMetaVal}>{order.id}</span>
                              </div>
                              <div className={styles.orderMetaGroup}>
                                <span className={styles.orderMetaLabel}>Total</span>
                                <span className={styles.orderMetaVal} style={{ fontWeight: 600 }}>{order.total}</span>
                              </div>
                            </div>
                            <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className={styles.orderItems}>
                            {order.items.map((item) => (
                              <div key={item.id} className={styles.orderItem}>
                                <div className={styles.itemImgWrapper}>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className={styles.itemImg}
                                  />
                                </div>
                                <div className={styles.itemDetails}>
                                  <p className={styles.itemName}>{item.name}</p>
                                  <p className={styles.itemMeta}>Qty: {item.quantity} &bull; {item.price}</p>
                                </div>
                              </div>
                            ))}

                            {order.trackingNumber && (
                              <div className={styles.trackingInfo}>
                                Track Num: <span className={styles.trackingNum}>{order.trackingNumber}</span>
                              </div>
                            )}

                            <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
                              <Link
                                href={`/track-order?orderNumber=${encodeURIComponent(order.id)}`}
                                onClick={onClose}
                                style={{
                                  fontSize: "0.78rem",
                                  color: "#820011",
                                  fontWeight: 600,
                                  textDecoration: "none",
                                }}
                              >
                                Track Delivery →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB: Addresses */}
                {activeTab === "addresses" && (
                  <div>
                    <h3 className={styles.sectionTitle}>Addresses</h3>
                    
                    {/* Shipping info */}
                    <div className={styles.addressCard}>
                      <div className={styles.addressHeader}>
                        <span className={styles.addressType}>Shipping</span>
                      </div>
                      {!isEditingShipping ? (
                        <>
                          <p className={styles.addressName}>{shippingAddress.fullName}</p>
                          <div className={styles.addressDetails}>
                            {shippingAddress.company && <p>{shippingAddress.company}</p>}
                            <p>{shippingAddress.street}</p>
                            <p>{shippingAddress.city}, {shippingAddress.zipCode}</p>
                            <p>{shippingAddress.phone}</p>
                          </div>
                          <button 
                            type="button" 
                            className={styles.btnText}
                            onClick={() => setIsEditingShipping(true)}
                          >
                            ✎ Edit Address
                          </button>
                        </>
                      ) : (
                        <form onSubmit={handleSaveShipping} className={styles.form}>
                          <div className={styles.formGroup}>
                            <input
                              type="text"
                              required
                              placeholder="Full Name"
                              className={styles.input}
                              value={shippingAddress.fullName}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <input
                              type="text"
                              required
                              placeholder="Street Address"
                              className={styles.input}
                              value={shippingAddress.street}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                            />
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button type="submit" className={styles.btnPrimary} style={{ flex: 1 }}>Save</button>
                            <button 
                              type="button" 
                              className={styles.btnPrimary} 
                              style={{ flex: 1, backgroundColor: "transparent", border: "1px solid #767677", color: "#555558" }}
                              onClick={() => setIsEditingShipping(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Billing info */}
                    <div className={styles.addressCard}>
                      <div className={styles.addressHeader}>
                        <span className={styles.addressType}>Billing</span>
                      </div>
                      {!isEditingBilling ? (
                        <>
                          <p className={styles.addressName}>{billingAddress.fullName}</p>
                          <div className={styles.addressDetails}>
                            <p>{billingAddress.street}</p>
                            <p>{billingAddress.city}, {billingAddress.zipCode}</p>
                            <p>{billingAddress.phone}</p>
                          </div>
                          <button 
                            type="button" 
                            className={styles.btnText}
                            onClick={() => setIsEditingBilling(true)}
                          >
                            ✎ Edit Address
                          </button>
                        </>
                      ) : (
                        <form onSubmit={handleSaveBilling} className={styles.form}>
                          <div className={styles.formGroup}>
                            <input
                              type="text"
                              required
                              placeholder="Full Name"
                              className={styles.input}
                              value={billingAddress.fullName}
                              onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <input
                              type="text"
                              required
                              placeholder="Street Address"
                              className={styles.input}
                              value={billingAddress.street}
                              onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                            />
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button type="submit" className={styles.btnPrimary} style={{ flex: 1 }}>Save</button>
                            <button 
                              type="button" 
                              className={styles.btnPrimary} 
                              style={{ flex: 1, backgroundColor: "transparent", border: "1px solid #767677", color: "#555558" }}
                              onClick={() => setIsEditingBilling(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                  </div>
                )}

                {/* SUBTAB: Settings */}
                {activeTab === "settings" && (
                  <div>
                    <h3 className={styles.sectionTitle}>Settings</h3>
                    
                    <form onSubmit={handleSaveProfile} className={styles.form} style={{ marginBottom: "1.5rem" }}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Profile Name</label>
                        <input 
                          type="text" 
                          className={styles.input} 
                          value={user.name} 
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                      </div>
                      <button type="submit" className={styles.btnPrimary}>
                        Save Name
                      </button>
                    </form>

                    <div className={styles.settingsSection}>
                      <h4 className={styles.sectionHeader}>Preferences</h4>
                      <div className={styles.togglesList}>
                        
                        <div className={styles.toggleRow}>
                          <div className={styles.toggleMeta}>
                            <span className={styles.toggleLabel}>Dark Theme</span>
                            <span className={styles.toggleDesc}>Toggle clean dark page background theme.</span>
                          </div>
                          <label className={styles.switch}>
                            <input 
                              type="checkbox" 
                              className={styles.switchInput}
                              checked={darkMode}
                              onChange={(e) => togglePreference("pref-darkmode", e.target.checked, setDarkMode)}
                            />
                            <span className={styles.switchSlider} />
                          </label>
                        </div>

                        <div className={styles.toggleRow}>
                          <div className={styles.toggleMeta}>
                            <span className={styles.toggleLabel}>Sound Effects</span>
                            <span className={styles.toggleDesc}>Interactive micro audio feedback on clicks.</span>
                          </div>
                          <label className={styles.switch}>
                            <input 
                              type="checkbox" 
                              className={styles.switchInput}
                              checked={soundEnabled}
                              onChange={(e) => togglePreference("pref-sound", e.target.checked, setSoundEnabled)}
                            />
                            <span className={styles.switchSlider} />
                          </label>
                        </div>

                        <div className={styles.toggleRow}>
                          <div className={styles.toggleMeta}>
                            <span className={styles.toggleLabel}>Newsletter</span>
                            <span className={styles.toggleDesc}>Exclusive information on limited batches.</span>
                          </div>
                          <label className={styles.switch}>
                            <input 
                              type="checkbox" 
                              className={styles.switchInput}
                              checked={newsletterEnabled}
                              onChange={(e) => togglePreference("pref-newsletter", e.target.checked, setNewsletterEnabled)}
                            />
                            <span className={styles.switchSlider} />
                          </label>
                        </div>

                      </div>
                    </div>

                    <button 
                      type="button" 
                      className={`${styles.btnPrimary} ${styles.logoutBtn}`}
                      onClick={handleLogout}
                      style={{ width: "100%" }}
                    >
                      Sign Out Account
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
