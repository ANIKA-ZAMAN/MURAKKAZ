"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  mockUserProfile, 
  mockOrders, 
  mockAddresses, 
  UserProfile, 
  Address 
} from "./accountData";
import styles from "./page.module.css";

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "addresses" | "settings">("dashboard");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Auth Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

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

  // Load session & user preferences on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("murakkaz-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }

    // Load preferences
    setSoundEnabled(localStorage.getItem("pref-sound") !== "false");
    setAmbientEnabled(localStorage.getItem("pref-ambient") !== "false");
    setNewsletterEnabled(localStorage.getItem("pref-newsletter") === "true");
    setConsultationReminders(localStorage.getItem("pref-reminders") !== "false");
    setDarkMode(localStorage.getItem("pref-darkmode") === "true");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Use input name or default
    const mockUser: UserProfile = {
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email,
      memberSince: "July 2026",
      memberTier: "Collector Circle",
      points: 100,
    };

    localStorage.setItem("murakkaz-user", JSON.stringify(mockUser));
    setUser(mockUser);
    
    // Clear forms
    setEmail("");
    setPassword("");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    const mockUser: UserProfile = {
      name: name,
      email: email,
      memberSince: "July 2026",
      memberTier: "Collector Circle",
      points: 100,
    };

    localStorage.setItem("murakkaz-user", JSON.stringify(mockUser));
    setUser(mockUser);
    
    // Clear forms
    setEmail("");
    setName("");
    setPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("murakkaz-user");
    setUser(null);
    setActiveTab("dashboard");
  };

  // Preference Toggle handlers
  const togglePreference = (key: string, val: boolean, setter: (v: boolean) => void) => {
    setter(val);
    localStorage.setItem(key, String(val));
    // Trigger global event if needed
    window.dispatchEvent(new Event("preferences-updated"));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    localStorage.setItem("murakkaz-user", JSON.stringify(user));
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
    <div className={styles.page}>
      <main className={styles.main}>
        
        {/* Header section */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>My Account</h1>
          {user && (
            <span className={styles.membershipTier}>
              {user.memberTier}
            </span>
          )}
        </div>

        {/* Unauthenticated View */}
        {!user ? (
          <div className={styles.authContainer}>
            <div className={styles.authCard}>
              <div className={styles.authTabs}>
                <button 
                  type="button" 
                  className={`${styles.authTab} ${authMode === "login" ? styles.authActiveTab : ""}`}
                  onClick={() => setAuthMode("login")}
                >
                  Sign In
                </button>
                <button 
                  type="button" 
                  className={`${styles.authTab} ${authMode === "register" ? styles.authActiveTab : ""}`}
                  onClick={() => setAuthMode("register")}
                >
                  Register
                </button>
              </div>

              {authMode === "login" ? (
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
                  <p className={styles.authSwitchText}>
                    Don't have an account?{" "}
                    <button 
                      type="button" 
                      className={styles.authLink} 
                      onClick={() => setAuthMode("register")}
                    >
                      Register Now
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      className={styles.input} 
                      placeholder="e.g. Sadid Chowdhury"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
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
                    Create Account
                  </button>
                  <p className={styles.authSwitchText}>
                    Already have an account?{" "}
                    <button 
                      type="button" 
                      className={styles.authLink} 
                      onClick={() => setAuthMode("login")}
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className={styles.dashboardLayout}>
            
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
              <button 
                type="button"
                className={`${styles.sidebarBtn} ${activeTab === "dashboard" ? styles.sidebarBtnActive : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <span className={styles.sidebarIcon}>📊</span>
                Dashboard
              </button>
              <button 
                type="button"
                className={`${styles.sidebarBtn} ${activeTab === "orders" ? styles.sidebarBtnActive : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <span className={styles.sidebarIcon}>📦</span>
                Order History
              </button>
              <button 
                type="button"
                className={`${styles.sidebarBtn} ${activeTab === "addresses" ? styles.sidebarBtnActive : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                <span className={styles.sidebarIcon}>📍</span>
                Addresses
              </button>
              <button 
                type="button"
                className={`${styles.sidebarBtn} ${activeTab === "settings" ? styles.sidebarBtnActive : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <span className={styles.sidebarIcon}>⚙️</span>
                Account Settings
              </button>
              <button 
                type="button"
                className={`${styles.sidebarBtn} ${styles.logoutBtn}`}
                onClick={handleLogout}
              >
                <span className={styles.sidebarIcon}>🚪</span>
                Sign Out
              </button>
            </aside>

            {/* Content Display Panels */}
            <section className={styles.contentPanel}>
              
              {/* TAB: Dashboard Summary */}
              {activeTab === "dashboard" && (
                <div>
                  <h2 className={styles.contentTitle}>Dashboard</h2>
                  <div className={styles.welcomeCard}>
                    <p className={styles.welcomeTitle}>Welcome back, {user.name}!</p>
                    <p style={{ fontSize: "0.875rem", color: "#555558" }}>
                      Manage your profile, track shipping details, and access scent configurations from one central hub.
                    </p>
                  </div>
                  <div className={styles.statGrid}>
                    <div className={styles.statCard}>
                      <span className={styles.statLabel}>Membership Tier</span>
                      <span className={styles.statValue} style={{ fontSize: "1.25rem", color: "#c5a880", fontWeight: "600", textTransform: "uppercase" }}>
                        {user.memberTier}
                      </span>
                    </div>
                    <div className={styles.statCard}>
                      <span className={styles.statLabel}>Reward Points</span>
                      <span className={styles.statValue}>{user.points} pts</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Orders History */}
              {activeTab === "orders" && (
                <div>
                  <h2 className={styles.contentTitle}>Order History</h2>
                  <div className={styles.ordersList}>
                    {mockOrders.map((order) => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div className={styles.orderMeta}>
                            <div className={styles.orderMetaGroup}>
                              <span className={styles.orderMetaLabel}>Order ID</span>
                              <span className={styles.orderMetaVal}>{order.id}</span>
                            </div>
                            <div className={styles.orderMetaGroup}>
                              <span className={styles.orderMetaLabel}>Date Placed</span>
                              <span className={styles.orderMetaVal}>{order.date}</span>
                            </div>
                            <div className={styles.orderMetaGroup}>
                              <span className={styles.orderMetaLabel}>Total Paid</span>
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
                                  width={50}
                                  height={50}
                                  className={styles.itemImg}
                                />
                              </div>
                              <div className={styles.itemDetails}>
                                <p className={styles.itemName}>{item.name}</p>
                                <p className={styles.itemMeta}>Quantity: {item.quantity} &bull; Price: {item.price}</p>
                              </div>
                            </div>
                          ))}

                          {order.trackingNumber && (
                            <div className={styles.trackingInfo}>
                              Tracking Status: Shipped via Air Express. Track Number:{" "}
                              <span className={styles.trackingNum}>{order.trackingNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Address Details */}
              {activeTab === "addresses" && (
                <div>
                  <h2 className={styles.contentTitle}>Shipping & Billing</h2>
                  <div className={styles.addressGrid}>
                    
                    {/* Shipping address info */}
                    <div className={styles.addressCard}>
                      <div className={styles.addressHeader}>
                        <span className={styles.addressType}>Shipping Address</span>
                      </div>
                      
                      {!isEditingShipping ? (
                        <>
                          <p className={styles.addressName}>{shippingAddress.fullName}</p>
                          <div className={styles.addressDetails}>
                            {shippingAddress.company && <p>{shippingAddress.company}</p>}
                            <p>{shippingAddress.street}</p>
                            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                            <p>{shippingAddress.country}</p>
                            <p style={{ marginTop: "0.5rem" }}>Phone: {shippingAddress.phone}</p>
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
                            <label className={styles.label}>Full Name</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={shippingAddress.fullName}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Street Address</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={shippingAddress.street}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>City</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={shippingAddress.city}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={shippingAddress.phone}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                            />
                          </div>
                          <div style={{ display: "flex", gap: "1rem" }}>
                            <button type="submit" className={styles.btnPrimary} style={{ flex: 1 }}>Save</button>
                            <button 
                              type="button" 
                              className={styles.btnPrimary} 
                              style={{ flex: 1, backgroundColor: "#transparent", border: "1px solid #767677", color: "#555558" }}
                              onClick={() => setIsEditingShipping(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Billing address info */}
                    <div className={styles.addressCard}>
                      <div className={styles.addressHeader}>
                        <span className={styles.addressType}>Billing Address</span>
                      </div>

                      {!isEditingBilling ? (
                        <>
                          <p className={styles.addressName}>{billingAddress.fullName}</p>
                          <div className={styles.addressDetails}>
                            <p>{billingAddress.street}</p>
                            <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                            <p>{billingAddress.country}</p>
                            <p style={{ marginTop: "0.5rem" }}>Phone: {billingAddress.phone}</p>
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
                            <label className={styles.label}>Full Name</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={billingAddress.fullName}
                              onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Street Address</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={billingAddress.street}
                              onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>City</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={billingAddress.city}
                              onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                            />
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Phone Number</label>
                            <input
                              type="text"
                              className={styles.input}
                              value={billingAddress.phone}
                              onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                            />
                          </div>
                          <div style={{ display: "flex", gap: "1rem" }}>
                            <button type="submit" className={styles.btnPrimary} style={{ flex: 1 }}>Save</button>
                            <button 
                              type="button" 
                              className={styles.btnPrimary} 
                              style={{ flex: 1, backgroundColor: "#transparent", border: "1px solid #767677", color: "#555558" }}
                              onClick={() => setIsEditingBilling(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Settings & preferences */}
              {activeTab === "settings" && (
                <div>
                  <h2 className={styles.contentTitle}>Account Settings</h2>
                  
                  <form onSubmit={handleSaveProfile} className={styles.form} style={{ marginBottom: "2.5rem" }}>
                    <h3 className={styles.sectionHeader}>Profile Details</h3>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Profile Name</label>
                      <input 
                        type="text" 
                        className={styles.input} 
                        value={user.name} 
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Email Address</label>
                      <input 
                        type="email" 
                        className={styles.input} 
                        value={user.email} 
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>
                    <button type="submit" className={styles.btnPrimary} style={{ maxWidth: "200px" }}>
                      Save Changes
                    </button>
                  </form>

                  <div className={styles.settingsSection}>
                    <h3 className={styles.sectionHeader}>Premium Preferences</h3>
                    
                    <div className={styles.togglesList}>
                      
                      {/* Toggle: Dark mode */}
                      <div className={styles.toggleRow}>
                        <div className={styles.toggleMeta}>
                          <span className={styles.toggleLabel}>Dark Aesthetics</span>
                          <span className={styles.toggleDesc}>Enable modern charcoal-black backdrop aesthetic across pages.</span>
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

                      {/* Toggle: Ambient particles */}
                      <div className={styles.toggleRow}>
                        <div className={styles.toggleMeta}>
                          <span className={styles.toggleLabel}>Ambient Particle Rendering</span>
                          <span className={styles.toggleDesc}>Render floating ambient dust particles inside headers & scent selector.</span>
                        </div>
                        <label className={styles.switch}>
                          <input 
                            type="checkbox" 
                            className={styles.switchInput}
                            checked={ambientEnabled}
                            onChange={(e) => togglePreference("pref-ambient", e.target.checked, setAmbientEnabled)}
                          />
                          <span className={styles.switchSlider} />
                        </label>
                      </div>

                      {/* Toggle: Sounds */}
                      <div className={styles.toggleRow}>
                        <div className={styles.toggleMeta}>
                          <span className={styles.toggleLabel}>Sound Effects</span>
                          <span className={styles.toggleDesc}>Play micro-feedback audio sounds when interacting with buttons.</span>
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

                      {/* Toggle: Scent Consultation reminders */}
                      <div className={styles.toggleRow}>
                        <div className={styles.toggleMeta}>
                          <span className={styles.toggleLabel}>Consultation Reminders</span>
                          <span className={styles.toggleDesc}>Receive reminders to revisit your scent preferences every season.</span>
                        </div>
                        <label className={styles.switch}>
                          <input 
                            type="checkbox" 
                            className={styles.switchInput}
                            checked={consultationReminders}
                            onChange={(e) => togglePreference("pref-reminders", e.target.checked, setConsultationReminders)}
                          />
                          <span className={styles.switchSlider} />
                        </label>
                      </div>

                      {/* Toggle: Newsletter */}
                      <div className={styles.toggleRow}>
                        <div className={styles.toggleMeta}>
                          <span className={styles.toggleLabel}>Exclusive Circle Newsletter</span>
                          <span className={styles.toggleDesc}>Get notified about new limited-edition batches and special collections.</span>
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
                </div>
              )}

            </section>
          </div>
        )}
        
      </main>
    </div>
  );
}
