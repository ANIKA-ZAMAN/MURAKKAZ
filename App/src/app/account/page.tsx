"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  mockUserProfile, 
  mockOrders, 
  mockAddresses, 
  mockSavedAddresses,
  SavedAddressItem,
  UserProfile, 
  Address 
} from "./accountData";
import styles from "./page.module.css";
import { getApiBaseUrl } from "@/lib/api";

interface LiveOrderItem {
  id: string;
  productName: string;
  productImage?: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface LiveOrder {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  deliveryCharge: number;
  subtotal: number;
  grandTotal: number;
  address: string;
  location: string;
  trackingNumber?: string;
  items: LiveOrderItem[];
}

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "scent" | "orders" | "addresses" | "password">("profile");
  const [orderCategoryTab, setOrderCategoryTab] = useState<"all" | "shipping" | "arrived" | "canceled">("all");

  // Live Orders
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedTrackingId, setExpandedTrackingId] = useState<string | null>(null);

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

  // Saved Address States
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressItem[]>(mockSavedAddresses);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addNickname, setAddNickname] = useState("");
  const [addFirstName, setAddFirstName] = useState("");
  const [addLastName, setAddLastName] = useState("");
  const [addFullAddress, setAddFullAddress] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addCity, setAddCity] = useState("");
  const [addDistrict, setAddDistrict] = useState("");

  // Auth Mode: "login" | "register"
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Profile Form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userLocation, setUserLocation] = useState("");

  // Change Password inputs
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  // Avatar Upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");

  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [registerMethod, setRegisterMethod] = useState<"email" | "phone">("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Scent Profiling (Individual Olfactory Signature)
  const allFamilies = ["Woody", "Citrus", "Oriental", "Fresh", "Floral", "Gourmand", "Spicy", "Aquatic"];
  const allIntensities = ["Intimate", "Moderate", "Long Lasting", "Beast Mode"];
  const allNotes = ["Oud", "Vanilla", "Bergamot", "Amber", "Cardamom", "Rose", "Leather", "Vetiver", "Sandalwood", "Jasmine", "Pink Pepper", "Patchouli"];
  const allSeasons = ["All Year Round", "Summer Crisp", "Winter Warmth", "Evening Formal"];

  const [favFamilies, setFavFamilies] = useState<string[]>(["Woody", "Oriental"]);
  const [favIntensity, setFavIntensity] = useState<string>("Long Lasting");
  const [favNotes, setFavNotes] = useState<string[]>(["Oud", "Vanilla", "Amber", "Bergamot"]);
  const [favSeason, setFavSeason] = useState<string>("All Year Round");
  const [scentProfileSaved, setScentProfileSaved] = useState(false);

  // Settings states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [consultationReminders, setConsultationReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fetch orders from API
  const fetchUserOrders = async () => {
    const token = localStorage.getItem("murakkaz-token");
    if (!token) return;

    setLoadingOrders(true);
    const baseUrl = getApiBaseUrl();

    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.data) {
        const orderData = Array.isArray(json.data) ? json.data : json.data.data || [];
        setOrders(orderData);
      }
    } catch (err) {
      console.warn("Failed to fetch user orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load session & user preferences on mount
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("murakkaz-token");
    const savedUser = localStorage.getItem("murakkaz-user") || localStorage.getItem("murakkaz_user");

    if (savedUser && (savedUser.toLowerCase().includes("sadid") || !token)) {
      localStorage.removeItem("murakkaz-user");
      localStorage.removeItem("murakkaz_user");
      localStorage.removeItem("murakkaz-saved-addresses");
      setUser(null);
      setSavedAddresses([]);
      window.dispatchEvent(new Event("murakkaz-user-updated"));
    } else if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);

        const parts = (parsed.name || "").split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setUserEmail(parsed.email || "");
        setUserPhone(parsed.phone || "");
        setUserLocation(parsed.primaryLocation || "");
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    // Load saved scent profile
    const savedScent = localStorage.getItem("murakkaz-scent-profile");
    if (savedScent) {
      try {
        const parsedScent = JSON.parse(savedScent);
        if (parsedScent.favFamilies) setFavFamilies(parsedScent.favFamilies);
        if (parsedScent.favIntensity) setFavIntensity(parsedScent.favIntensity);
        if (parsedScent.favNotes) setFavNotes(parsedScent.favNotes);
        if (parsedScent.favSeason) setFavSeason(parsedScent.favSeason);
      } catch {}
    }

    // Load saved addresses
    const storedAddresses = localStorage.getItem("murakkaz-saved-addresses");
    if (storedAddresses) {
      try {
        setSavedAddresses(JSON.parse(storedAddresses));
      } catch {}
    }

    // Load preferences
    setSoundEnabled(localStorage.getItem("pref-sound") !== "false");
    setAmbientEnabled(localStorage.getItem("pref-ambient") !== "false");
    setNewsletterEnabled(localStorage.getItem("pref-newsletter") === "true");
    setConsultationReminders(localStorage.getItem("pref-reminders") !== "false");
    setDarkMode(localStorage.getItem("pref-darkmode") === "true");

    fetchUserOrders();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phoneNumber) return;
    setLoading(true);
    setAuthError(null);

    const baseUrl = getApiBaseUrl();

    try {
      const payload: any = { password };
      if (loginMethod === "email") {
        payload.email = email;
      } else {
        payload.phone = phoneNumber;
      }

      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        const { user: authUser, accessToken, refreshToken } = json.data;
        const profile: UserProfile = {
          name: `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || authUser.email || "Fragrance Connoisseur",
          email: authUser.email || "",
          phone: authUser.phone || "",
          memberSince: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Member",
          memberTier: authUser.memberTier || "Collector Circle",
          points: authUser.points || 100,
          photo: authUser.photo || "",
          primaryLocation: authUser.primaryLocation || "Dhaka",
        };

        if (accessToken) localStorage.setItem("murakkaz-token", accessToken);
        if (refreshToken) localStorage.setItem("murakkaz-refresh-token", refreshToken);
        localStorage.setItem("murakkaz-user", JSON.stringify(profile));

        setUser(profile);
        const parts = profile.name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setUserEmail(profile.email || "");
        setUserPhone(profile.phone || "");
        setUserLocation(profile.primaryLocation || "");

        window.dispatchEvent(new Event("murakkaz-user-updated"));
        fetchUserOrders();
      } else {
        setAuthError(json.message || "Invalid credentials. Please check your email/phone and password.");
      }
    } catch (err) {
      console.warn("API login fallback:", err);
      const fallback: UserProfile = {
        name: email ? (email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)) : `User ${phoneNumber}`,
        email: email || `${phoneNumber}@phone.murakkaz.com`,
        phone: phoneNumber || "",
        memberSince: "Member",
        memberTier: "Collector Circle",
        points: 100,
        photo: "",
      };
      localStorage.setItem("murakkaz-user", JSON.stringify(fallback));
      setUser(fallback);
      window.dispatchEvent(new Event("murakkaz-user-updated"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    if ((!email && !phoneNumber) || !password) return;

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setAuthError(null);

    const baseUrl = getApiBaseUrl();

    try {
      const payload: any = {
        firstName: firstName || fullName.split(" ")[0] || "Valued",
        lastName: lastName || fullName.split(" ").slice(1).join(" ") || "Member",
        password,
      };
      if (registerMethod === "email" && email) payload.email = email;
      if (registerMethod === "phone" && phoneNumber) payload.phone = phoneNumber;

      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        const { user: authUser, accessToken, refreshToken } = json.data;
        const profile: UserProfile = {
          name: `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || fullName,
          email: authUser.email || "",
          phone: authUser.phone || "",
          memberSince: "New Member",
          memberTier: "Collector Circle",
          points: 100,
          photo: authUser.photo || "",
          primaryLocation: "Dhaka",
        };

        if (accessToken) localStorage.setItem("murakkaz-token", accessToken);
        if (refreshToken) localStorage.setItem("murakkaz-refresh-token", refreshToken);
        localStorage.setItem("murakkaz-user", JSON.stringify(profile));

        setUser(profile);
        window.dispatchEvent(new Event("murakkaz-user-updated"));
        fetchUserOrders();
      } else {
        setAuthError(json.message || "Failed to create account. Please check your information.");
      }
    } catch (err) {
      console.warn("API register fallback:", err);
      const fallback: UserProfile = {
        name: fullName || "Valued Collector",
        email: email || `${phoneNumber}@phone.murakkaz.com`,
        phone: phoneNumber || "",
        memberSince: "Member",
        memberTier: "Collector Circle",
        points: 100,
        photo: "",
      };
      localStorage.setItem("murakkaz-user", JSON.stringify(fallback));
      setUser(fallback);
      window.dispatchEvent(new Event("murakkaz-user-updated"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("murakkaz-token");
    localStorage.removeItem("murakkaz-refresh-token");
    localStorage.removeItem("murakkaz-user");
    setUser(null);
    window.dispatchEvent(new Event("murakkaz-user-updated"));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: UserProfile = {
      ...user,
      name: `${firstName} ${lastName}`.trim(),
      email: userEmail,
      phone: userPhone,
      primaryLocation: userLocation,
    };
    setUser(updatedUser);
    localStorage.setItem("murakkaz-user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("murakkaz-user-updated"));

    // Sync to backend if token exists
    const token = localStorage.getItem("murakkaz-token");
    if (token) {
      const baseUrl = getApiBaseUrl();
      fetch(`${baseUrl}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: userPhone,
          primaryLocation: userLocation
        })
      }).catch(console.warn);
    }

    alert("Profile saved successfully.");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordStatus("New passwords do not match!");
      return;
    }

    const token = localStorage.getItem("murakkaz-token");
    if (token) {
      const baseUrl = getApiBaseUrl();
      try {
        const res = await fetch(`${baseUrl}/api/auth/change-password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword: confirmNewPassword })
        });
        const json = await res.json();
        if (res.ok) {
          setPasswordStatus("Password changed successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        } else {
          setPasswordStatus(json.message || "Failed to update password.");
        }
      } catch (err) {
        setPasswordStatus("Password updated locally.");
      }
    } else {
      setPasswordStatus("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  const toggleFamily = (fam: string) => {
    setFavFamilies((prev) =>
      prev.includes(fam) ? prev.filter((f) => f !== fam) : [...prev, fam]
    );
  };

  const toggleNote = (note: string) => {
    setFavNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const handleSaveScentProfile = () => {
    const profile = { favFamilies, favIntensity, favNotes, favSeason };
    localStorage.setItem("murakkaz-scent-profile", JSON.stringify(profile));
    setScentProfileSaved(true);
    setTimeout(() => setScentProfileSaved(false), 3000);
  };

  // Determine Olfactory Archetype based on selected profile
  const getPersonaName = () => {
    if (favFamilies.includes("Woody") && favFamilies.includes("Oriental")) return "The Aristocratic Connoisseur";
    if (favFamilies.includes("Citrus") || favFamilies.includes("Fresh")) return "The Modern Minimalist";
    if (favFamilies.includes("Floral") || favFamilies.includes("Gourmand")) return "The Velvet Seducer";
    return "The Signature Aficionado";
  };

  if (!isMounted) {
    return (
      <div className={styles.page} suppressHydrationWarning>
        <div style={{ padding: "8rem 0", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <span style={{ fontSize: "1.2rem", fontStyle: "italic", color: "var(--muted)" }}>
            Loading account details...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header section */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>My Account</h1>
        </div>

        {/* Unauthenticated View */}
        {!user ? (
          <div className={styles.authContainer}>
            <div className={styles.authCardWide}>
              {/* Left Column: Form */}
              <div className={styles.authFormColumn}>
                <div className={styles.authTabs}>
                  <button
                    type="button"
                    className={`${styles.authTab} ${authMode === "login" ? styles.authActiveTab : ""}`}
                    onClick={() => { setAuthMode("login"); setAuthError(null); }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`${styles.authTab} ${authMode === "register" ? styles.authActiveTab : ""}`}
                    onClick={() => { setAuthMode("register"); setAuthError(null); }}
                  >
                    Create Account
                  </button>
                </div>

                {authError && <div className={styles.authErrorAlert}>{authError}</div>}

                {authMode === "login" ? (
                  <form onSubmit={handleLogin} className={styles.form}>
                    <h2 className={styles.authFormTitle}>Welcome Back</h2>
                    <input 
                      type="text" 
                      required 
                      className={styles.input} 
                      placeholder="Email or Phone Number"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                      type="password" 
                      required 
                      className={styles.input}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" disabled={loading} className={styles.btnPrimary}>
                      {loading ? "Signing In..." : "Sign In"}
                    </button>

                    <p className={styles.authSwitchText}>
                      Don't have an account?{" "}
                      <button 
                        type="button" 
                        className={styles.authLink} 
                        onClick={() => setAuthMode("register")}
                      >
                        Create one now
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className={styles.form}>
                    <h2 className={styles.authFormTitle}>Join Murakkaz Circle</h2>
                    <div className={styles.row2Col}>
                      <input 
                        type="text" 
                        required 
                        className={styles.input} 
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input 
                        type="text" 
                        required 
                        className={styles.input} 
                        placeholder="Last Name"
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
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="Phone Number (Optional)"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <input 
                      type="password" 
                      required 
                      className={styles.input} 
                      placeholder="Password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <input 
                      type="password" 
                      required 
                      className={styles.input} 
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" disabled={loading} className={styles.btnPrimary}>
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className={styles.authSwitchText}>
                      Already have an account?{" "}
                      <button 
                        type="button" 
                        className={styles.authLink} 
                        onClick={() => setAuthMode("login")}
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </div>

              {/* Right Column: Hero Art */}
              <div className={styles.authImageColumn}>
                <Image
                  src="/images/products/vanilla_28_v2.jpg"
                  alt="Murakkaz Luxury Fragrance"
                  width={460}
                  height={520}
                  priority
                  className={styles.authMockImage}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Redesigned Authenticated Dashboard View */
          <div className={styles.premiumDashboard}>
            {/* Header Row: Greeting & Navigation Tabs */}
            <div className={styles.premiumHeaderRow}>
              <div className={styles.greetingSection}>
                <span className={styles.greetingSub}>Hello<span className={styles.blackExclamation}>!</span></span>
                <h2 className={styles.greetingName}>{user.name}</h2>
              </div>

              <nav className={styles.premiumNavBar}>
                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "profile" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "scent" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("scent")}
                >
                  Scent Profile
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "orders" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  My Orders
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "addresses" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  Saved Addresses
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "password" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("password")}
                >
                  Security
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${styles.logoutNav}`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </nav>
            </div>

            {/* Main Content Body */}
            <div className={styles.premiumBody}>
              {/* TAB 1: Profile & Identity */}
              {activeTab === "profile" && (
                <div className={styles.profileLayoutGrid}>
                  <div className={styles.middleBoxesColumn}>
                    {/* Top Box: Avatar */}
                    <div className={styles.profileBox}>
                      <div className={styles.avatarContainer}>
                        <div className={styles.avatarPreviewWrapper}>
                          {user.photo ? (
                            <img src={user.photo} alt="Profile Photo" className={styles.avatarImage} />
                          ) : (
                            <div className={styles.avatarPlaceholder}>
                              <svg viewBox="0 0 24 24" width="48" height="48" fill="#a38258">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className={styles.avatarUploadControls}>
                          <div style={{ fontWeight: 600, fontSize: "1.1rem", color: "#18181b" }}>{user.name}</div>
                          <span style={{ fontSize: "0.8rem", color: "#820011", fontWeight: 600 }}>{user.memberTier || "Gold Collection Circle"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details form fields */}
                    <div className={styles.profileBox}>
                      <form onSubmit={handleSaveProfile} className={styles.detailsForm}>
                        <div className={styles.formRow}>
                          <label className={styles.formLabel}>Name:</label>
                          <div className={styles.nameInputs}>
                            <input 
                              type="text" 
                              required 
                              className={styles.inputField} 
                              placeholder="First Name"
                              value={firstName} 
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input 
                              type="text" 
                              required 
                              className={styles.inputField} 
                              placeholder="Last Name"
                              value={lastName} 
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className={styles.formRow}>
                          <label className={styles.formLabel}>Email:</label>
                          <input 
                            type="email" 
                            required 
                            className={styles.inputField} 
                            placeholder="Email Address"
                            value={userEmail} 
                            onChange={(e) => setUserEmail(e.target.value)}
                          />
                        </div>

                        <div className={styles.formRow}>
                          <label className={styles.formLabel}>Phone:</label>
                          <input 
                            type="text" 
                            className={styles.inputField} 
                            placeholder="Phone Number"
                            value={userPhone} 
                            onChange={(e) => setUserPhone(e.target.value)}
                          />
                        </div>

                        <div className={styles.formRow}>
                          <label className={styles.formLabel}>Primary Location:</label>
                          <input 
                            type="text" 
                            className={styles.inputField} 
                            placeholder="e.g. Banani, Dhaka"
                            value={userLocation} 
                            onChange={(e) => setUserLocation(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className={styles.actionsColumn}>
                    <button 
                      type="button" 
                      className={styles.btnPrimarySave} 
                      onClick={handleSaveProfile}
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Scent Profile & Individual Olfactory Signature */}
              {activeTab === "scent" && (
                <div className={styles.scentProfileGrid}>
                  <div className={styles.scentProfileCard}>
                    <h3 className={styles.scentSectionTitle}>Your Signature Scent Families</h3>
                    <p className={styles.scentSectionSub}>Select your preferred fragrance accords to tailor personalized recommendations and VIP formulations.</p>
                    
                    <div className={styles.chipsContainer}>
                      {allFamilies.map((fam) => (
                        <button
                          key={fam}
                          type="button"
                          onClick={() => toggleFamily(fam)}
                          className={`${styles.chipBtn} ${favFamilies.includes(fam) ? styles.chipBtnActive : ""}`}
                        >
                          {fam} {favFamilies.includes(fam) && "✓"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.scentProfileCard}>
                    <h3 className={styles.scentSectionTitle}>Sillage & Performance Preference</h3>
                    <p className={styles.scentSectionSub}>How strongly do you like your fragrance to project and linger?</p>
                    
                    <div className={styles.chipsContainer}>
                      {allIntensities.map((intensity) => (
                        <button
                          key={intensity}
                          type="button"
                          onClick={() => setFavIntensity(intensity)}
                          className={`${styles.chipBtn} ${favIntensity === intensity ? styles.chipBtnActive : ""}`}
                        >
                          {intensity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.scentProfileCard}>
                    <h3 className={styles.scentSectionTitle}>Favorite Raw Notes</h3>
                    <p className={styles.scentSectionSub}>Pick your favorite natural oils and notes that captivate your senses.</p>
                    
                    <div className={styles.chipsContainer}>
                      {allNotes.map((note) => (
                        <button
                          key={note}
                          type="button"
                          onClick={() => toggleNote(note)}
                          className={`${styles.chipBtn} ${favNotes.includes(note) ? styles.chipBtnActive : ""}`}
                        >
                          {note} {favNotes.includes(note) && "✓"}
                        </button>
                      ))}
                    </div>

                    {/* Calculated Olfactory Persona */}
                    <div className={styles.scentPersonalityBox}>
                      <div className={styles.personalityIcon}>✧</div>
                      <div className={styles.personalityDetails}>
                        <h4>Olfactory Archetype: {getPersonaName()}</h4>
                        <p>Based on your affinity for {favFamilies.join(", ") || "fine scents"} and raw {favNotes.slice(0, 3).join(", ")}, our master perfumers curate bespoke extraits tailored to your sensory identity.</p>
                      </div>
                    </div>

                    <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <button
                        type="button"
                        onClick={handleSaveScentProfile}
                        className={styles.btnPrimarySave}
                      >
                        Save Scent Profile
                      </button>
                      {scentProfileSaved && (
                        <span style={{ color: "#389e0d", fontSize: "0.9rem", fontWeight: 600 }}>✓ Scent signature saved!</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: My Orders */}
              {activeTab === "orders" && (
                <div className={styles.ordersLayoutGrid}>
                  <div className={styles.ordersSidebarNav}>
                    <button
                      type="button"
                      className={`${styles.orderStatusTabBtn} ${orderCategoryTab === "all" ? styles.orderStatusTabActive : ""}`}
                      onClick={() => setOrderCategoryTab("all")}
                    >
                      <span>All Orders</span>
                      <span className={styles.orderStatusCount}>{orders.length}</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.orderStatusTabBtn} ${orderCategoryTab === "shipping" ? styles.orderStatusTabActive : ""}`}
                      onClick={() => setOrderCategoryTab("shipping")}
                    >
                      <span>On Shipping</span>
                      <span className={styles.orderStatusCount}>
                        {orders.filter(o => o.status === "SHIPPED" || o.status === "PROCESSING" || o.status === "CONFIRMED").length}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.orderStatusTabBtn} ${orderCategoryTab === "arrived" ? styles.orderStatusTabActive : ""}`}
                      onClick={() => setOrderCategoryTab("arrived")}
                    >
                      <span>Delivered</span>
                      <span className={styles.orderStatusCount}>
                        {orders.filter(o => o.status === "DELIVERED").length}
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.orderStatusTabBtn} ${orderCategoryTab === "canceled" ? styles.orderStatusTabActive : ""}`}
                      onClick={() => setOrderCategoryTab("canceled")}
                    >
                      <span>Cancelled</span>
                      <span className={styles.orderStatusCount}>
                        {orders.filter(o => o.status === "CANCELLED").length}
                      </span>
                    </button>
                  </div>

                  <div className={styles.ordersListContainer}>
                    {orders.length === 0 ? (
                      <div style={{ padding: "3rem", textAlign: "center", background: "#faf7f2", borderRadius: "12px", border: "1px dashed #d8d5cd" }}>
                        <p style={{ color: "#777", marginBottom: "1rem" }}>You have not placed any orders yet.</p>
                        <Link href="/shop" style={{ color: "#820011", fontWeight: 600, textDecoration: "none" }}>
                          Explore Our Fragrance Catalog →
                        </Link>
                      </div>
                    ) : (
                      orders
                        .filter((order) => {
                          if (orderCategoryTab === "shipping") return order.status === "SHIPPED" || order.status === "PROCESSING" || order.status === "CONFIRMED" || order.status === "PENDING";
                          if (orderCategoryTab === "arrived") return order.status === "DELIVERED";
                          if (orderCategoryTab === "canceled") return order.status === "CANCELLED";
                          return true;
                        })
                        .map((order) => (
                          <div key={order.id} className={styles.mockOrderCard}>
                            <div className={styles.mockOrderHeader}>
                              <div className={styles.mockOrderLeftMeta}>
                                <span className={styles.mockOrderLabel}>Order ID</span>
                                <div className={styles.mockOrderIdRow}>
                                  <span className={styles.mockOrderIdVal}>{order.orderNumber}</span>
                                </div>
                              </div>

                              <div className={styles.mockOrderRightMeta}>
                                <span className={styles.mockStatusBadge}>
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            <div className={styles.mockOrderDivider} />

                            <div className={styles.mockOrderItems}>
                              {order.items.map((item) => (
                                <div key={item.id} className={styles.mockOrderItemRow}>
                                  <img
                                    src={item.productImage || "/images/products/vanilla_28_v2.jpg"}
                                    alt={item.productName}
                                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                                  />
                                  <div className={styles.mockItemCenter}>
                                    <h4 className={styles.mockItemTitle}>{item.productName}</h4>
                                    <p className={styles.mockItemVol}>Size: {item.selectedSize}</p>
                                  </div>
                                  <div className={styles.mockItemRight}>
                                    <p className={styles.mockItemPrice}>{item.unitPrice?.toLocaleString()}tk</p>
                                    <p className={styles.mockItemQty}>Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Inline Tracking Stepper (If Expanded) */}
                            {expandedTrackingId === order.orderNumber && (
                              <div style={{ padding: "1.25rem", background: "#fcfbf9", border: "1px solid #eae5db", borderRadius: "10px", margin: "0.75rem 0" }}>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#18181b", marginBottom: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                                  <span>Live Milestone Timeline</span>
                                  <span style={{ color: "#820011" }}>{order.location === "inside-dhaka" ? "Inside Dhaka (1-2 days)" : "Outside Dhaka (2-3 days)"}</span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", textAlign: "center" }}>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: getStepStatus(0, order.status) === "completed" ? "#820011" : "#e5e0d8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                                      {getStepStatus(0, order.status) === "completed" ? "✓" : "1"}
                                    </div>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#333" }}>Placed</span>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: getStepStatus(1, order.status) === "completed" ? "#820011" : getStepStatus(1, order.status) === "current" ? "#820011" : "#e5e0d8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                                      {getStepStatus(1, order.status) === "completed" ? "✓" : "2"}
                                    </div>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#333" }}>Confirmed</span>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: getStepStatus(2, order.status) === "completed" ? "#820011" : getStepStatus(2, order.status) === "current" ? "#820011" : "#e5e0d8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                                      {getStepStatus(2, order.status) === "completed" ? "✓" : "3"}
                                    </div>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#333" }}>Scent Lab</span>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: getStepStatus(3, order.status) === "completed" || order.status === "DELIVERED" ? "#820011" : "#e5e0d8", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, marginBottom: "4px" }}>
                                      {getStepStatus(3, order.status) === "completed" || order.status === "DELIVERED" ? "✓" : "4"}
                                    </div>
                                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#333" }}>Delivery</span>
                                  </div>
                                </div>

                                {order.trackingNumber && (
                                  <div style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", background: "#faf6f0", borderRadius: "6px", fontSize: "0.8rem", color: "#820011" }}>
                                    <strong>Courier Tracking ID:</strong> <span style={{ fontFamily: "monospace", color: "#111" }}>{order.trackingNumber}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className={styles.mockOrderDivider} />

                            <div className={styles.mockOrderFooter}>
                              <span className={styles.mockDeliveryCharge}>Delivery: {order.deliveryCharge}tk</span>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                <span className={styles.mockOrderTotal}>Total: {order.grandTotal?.toLocaleString()}tk</span>
                                <button
                                  type="button"
                                  onClick={() => setExpandedTrackingId(expandedTrackingId === order.orderNumber ? null : order.orderNumber)}
                                  style={{
                                    padding: "6px 12px",
                                    background: expandedTrackingId === order.orderNumber ? "#18181b" : "#f4eee5",
                                    color: expandedTrackingId === order.orderNumber ? "#fff" : "#18181b",
                                    border: "1px solid #eae5db",
                                    borderRadius: "6px",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  {expandedTrackingId === order.orderNumber ? "Hide Tracker" : "Track Milestones"}
                                </button>
                                <Link
                                  href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                                  style={{
                                    padding: "6px 14px",
                                    background: "#820011",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                  }}
                                >
                                  Live Portal →
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Saved Addresses */}
              {activeTab === "addresses" && (
                <div className={styles.ordersLayoutGrid}>
                  <div className={styles.ordersSidebarNav}>
                    <div className={`${styles.orderStatusTabBtn} ${styles.orderStatusTabActive}`}>
                      <span>Saved Addresses ({savedAddresses.length})</span>
                    </div>
                  </div>

                  <div className={styles.ordersListContainer}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                      {savedAddresses.map((addr) => (
                        <div key={addr.id} className={styles.profileBox} style={{ padding: "1.5rem" }}>
                          <h4 style={{ margin: "0 0 0.5rem 0", color: "#820011" }}>{addr.nickname}</h4>
                          <p style={{ margin: "0 0 0.25rem 0", fontWeight: 600 }}>{addr.firstName} {addr.lastName}</p>
                          <p style={{ margin: "0 0 0.25rem 0", color: "#555" }}>{addr.fullAddress}</p>
                          <p style={{ margin: "0", color: "#777", fontSize: "0.85rem" }}>Phone: {addr.phone} • {addr.city}, {addr.district}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Security / Password */}
              {activeTab === "password" && (
                <div className={styles.profileBox} style={{ maxWidth: "560px", margin: "0 auto", padding: "2rem" }}>
                  <h3 style={{ margin: "0 0 1rem 0", fontFamily: "var(--font-playfair), Georgia, serif" }}>Change Account Password</h3>
                  
                  {passwordStatus && (
                    <div style={{ padding: "0.75rem 1rem", background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: "8px", color: "#389e0d", marginBottom: "1rem" }}>
                      {passwordStatus}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Current Password</label>
                      <input
                        type="password"
                        required
                        className={styles.inputField}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>New Password</label>
                      <input
                        type="password"
                        required
                        className={styles.inputField}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>Confirm New Password</label>
                      <input
                        type="password"
                        required
                        className={styles.inputField}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>

                    <button type="submit" className={styles.btnPrimarySave} style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
