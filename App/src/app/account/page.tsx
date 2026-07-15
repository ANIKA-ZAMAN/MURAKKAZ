"use client";
 
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  mockUserProfile, 
  mockOrders, 
  mockAddresses, 
  UserProfile, 
  Address 
} from "./accountData";
import styles from "./page.module.css";

const defaultUser: UserProfile = {
  name: "Sadid Bin Hasan",
  email: "sadidbinhasan@gmail.com",
  memberSince: "November 2025",
  memberTier: "Gold Collection Circle",
  points: 1250,
  photo: "/images/events/sadid.jpg",
  phone: "0178900****",
  primaryLocation: "Dhanmondi***",
};

export default function AccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "password">("profile");
  const [activeSubTab, setActiveSubTab] = useState<"basic" | "advance">("basic");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

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
  const [isMounted, setIsMounted] = useState(false);

  // Load session & user preferences on mount
  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem("murakkaz-user");
    let currentUser: UserProfile;
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        currentUser = defaultUser;
      }
    } else {
      currentUser = defaultUser;
      localStorage.setItem("murakkaz-user", JSON.stringify(defaultUser));
      // Dispatch custom event to notify Navbar on first load
      setTimeout(() => {
        window.dispatchEvent(new Event("murakkaz-user-updated"));
      }, 100);
    }
    setUser(currentUser);

    // Bind form fields
    const parts = currentUser.name.split(" ");
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setUserEmail(currentUser.email || "");
    setUserPhone(currentUser.phone || "");
    setUserLocation(currentUser.primaryLocation || "");

    // Load preferences
    setSoundEnabled(localStorage.getItem("pref-sound") !== "false");
    setAmbientEnabled(localStorage.getItem("pref-ambient") !== "false");
    setNewsletterEnabled(localStorage.getItem("pref-newsletter") === "true");
    setConsultationReminders(localStorage.getItem("pref-reminders") !== "false");
    setDarkMode(localStorage.getItem("pref-darkmode") === "true");
  }, []);

  // Synchronize document.body classes with preferences
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  useEffect(() => {
    if (ambientEnabled) {
      document.body.classList.remove("no-ambient");
    } else {
      document.body.classList.add("no-ambient");
    }
  }, [ambientEnabled]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    setTimeout(() => {
      // Use input name or default
      const mockUser: UserProfile = {
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        email: email,
        memberSince: "July 2026",
        memberTier: "Collector Circle",
        points: 100,
        photo: "/images/events/sadid.jpg",
        phone: "0178900****",
        primaryLocation: "Dhanmondi***",
      };

      localStorage.setItem("murakkaz-user", JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
      window.dispatchEvent(new Event("murakkaz-user-updated"));
      
      // Bind form fields
      setFirstName(mockUser.name.split(" ")[0]);
      setLastName(mockUser.name.split(" ").slice(1).join(" "));
      setUserEmail(mockUser.email);
      setUserPhone(mockUser.phone || "");
      setUserLocation(mockUser.primaryLocation || "");

      // Clear forms
      setEmail("");
      setPassword("");
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    if (!email || !fullName || !password) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const mockUser: UserProfile = {
        name: fullName,
        email: email,
        memberSince: "July 2026",
        memberTier: "Collector Circle",
        points: 100,
        photo: "/images/events/sadid.jpg",
        phone: "0178900****",
        primaryLocation: "Dhanmondi***",
      };

      localStorage.setItem("murakkaz-user", JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
      window.dispatchEvent(new Event("murakkaz-user-updated"));
      
      // Bind form fields
      setFirstName(mockUser.name.split(" ")[0]);
      setLastName(mockUser.name.split(" ").slice(1).join(" "));
      setUserEmail(mockUser.email);
      setUserPhone(mockUser.phone || "");
      setUserLocation(mockUser.primaryLocation || "");

      // Clear forms
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setConfirmPassword("");
    }, 800);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser: UserProfile = {
        name: "Sadid Bin Hasan",
        email: "sadidbinhasan@gmail.com",
        memberSince: "July 2026",
        memberTier: "Gold Collection Circle",
        points: 150,
        photo: "/images/events/sadid.jpg",
        phone: "0178900****",
        primaryLocation: "Dhanmondi***",
      };
      localStorage.setItem("murakkaz-user", JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
      window.dispatchEvent(new Event("murakkaz-user-updated"));

      // Bind form fields
      setFirstName("Sadid");
      setLastName("Bin Hasan");
      setUserEmail(mockUser.email);
      setUserPhone(mockUser.phone || "");
      setUserLocation(mockUser.primaryLocation || "");
    }, 1000);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    if (!otpSent) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
      }, 800);
    } else {
      if (!otp) return;
      setLoading(true);
      setTimeout(() => {
        const mockUser: UserProfile = {
          name: authMode === "register" && name ? name : `User ${phoneNumber}`,
          email: `${phoneNumber.replace(/[^0-9]/g, "")}@phone.murakkaz.com`,
          memberSince: "July 2026",
          memberTier: "Collector Circle",
          points: 100,
          photo: "/images/events/sadid.jpg",
          phone: phoneNumber,
          primaryLocation: "Dhanmondi***",
        };
        localStorage.setItem("murakkaz-user", JSON.stringify(mockUser));
        setUser(mockUser);
        setLoading(false);
        setOtpSent(false);
        setPhoneNumber("");
        setOtp("");
        setName("");
        window.dispatchEvent(new Event("murakkaz-user-updated"));

        // Bind form fields
        setFirstName(mockUser.name.split(" ")[0]);
        setLastName(mockUser.name.split(" ").slice(1).join(" "));
        setUserEmail(mockUser.email);
        setUserPhone(mockUser.phone || "");
        setUserLocation(mockUser.primaryLocation || "");
      }, 1000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("murakkaz-user");
    setUser(null);
    setActiveTab("profile");
    // Clear forms
    setFirstName("");
    setLastName("");
    setUserEmail("");
    setUserPhone("");
    setUserLocation("");
    window.dispatchEvent(new Event("murakkaz-user-updated"));
  };

  // Preference Toggle handlers
  const togglePreference = (key: string, val: boolean, setter: (v: boolean) => void) => {
    setter(val);
    localStorage.setItem(key, String(val));
    window.dispatchEvent(new Event("preferences-updated"));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
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
    alert("Profile saved successfully.");
  };

  const handleResetProfile = () => {
    if (!user) return;
    const parts = user.name.split(" ");
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setUserEmail(user.email || "");
    setUserPhone(user.phone || "");
    setUserLocation(user.primaryLocation || "");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Maximum file size is 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && user) {
          const updatedUser = { ...user, photo: event.target.result as string };
          setUser(updatedUser);
          localStorage.setItem("murakkaz-user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("murakkaz-user-updated"));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingShipping(false);
  };

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingBilling(false);
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
          {user && (
            <span className={styles.membershipTier}>
              {user.memberTier}
            </span>
          )}
        </div>

        {/* Unauthenticated View */}
        {!user ? (
          <div className={styles.authContainer}>
            <div className={styles.authCardWide}>
              
              {/* Left Column: Forms */}
              <div className={styles.authFormColumn}>
                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", gap: "1rem" }}>
                    <div style={{ width: "32px", height: "32px", border: "2px solid rgba(131, 0, 17, 0.1)", borderTopColor: "#820011", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <style jsx>{`
                      @keyframes spin {
                        to { transform: rotate(360deg); }
                      }
                    `}</style>
                    <p style={{ fontSize: "0.85rem", color: "#767677", letterSpacing: "0.05em" }}>Verifying Scent Credentials...</p>
                  </div>
                ) : authMode === "login" ? (
                  loginMethod === "email" ? (
                    /* EMAIL LOGIN */
                    <form onSubmit={handleLogin} className={styles.form}>
                      <h2 className={styles.authFormTitle}>Login</h2>
                      <input 
                        type="email" 
                        required 
                        className={styles.input} 
                        placeholder="Email"
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
                      <button type="submit" className={styles.btnPrimary} style={{ textTransform: "none" }}>
                        LogIn
                      </button>

                      <div className={styles.dividerSignUp}>or login with</div>

                      <div className={styles.socialGroup}>
                        <button type="button" onClick={handleGoogleLogin} className={styles.btnSocial}>
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                          </svg>
                          Login with Google
                        </button>
                        <button type="button" onClick={handleGoogleLogin} className={styles.btnSocial}>
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.48C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5M15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C15.96 1.04 14.76 1.66 14.05 2.5C13.45 3.2 12.92 4.3 13.07 5.57C14.17 5.65 15.3 5.01 15.97 4.17Z" />
                          </svg>
                          Login with Apple
                        </button>
                      </div>

                      <p className={styles.authSwitchText}>
                        Don't you have any account?{" "}
                        <button 
                          type="button" 
                          className={styles.authLink} 
                          onClick={() => setAuthMode("register")}
                        >
                          Sign up
                        </button>
                      </p>
                    </form>
                  ) : (
                    /* PHONE LOGIN */
                    <form onSubmit={handlePhoneSubmit} className={styles.form}>
                      <h2 className={styles.authFormTitle}>Log in</h2>
                      {!otpSent ? (
                        <div className={styles.formGroup}>
                          <input 
                            type="tel" 
                            required 
                            className={styles.input} 
                            placeholder="Phone number (e.g. +880 1712-345678)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      ) : (
                        <>
                          <p style={{ fontSize: "0.85rem", color: "#767677", marginBottom: "0.25rem" }}>
                            Verification code sent to <strong>{phoneNumber}</strong>
                          </p>
                          <input 
                            type="text" 
                            required 
                            maxLength={6}
                            className={styles.input} 
                            placeholder="Enter 6-Digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </>
                      )}
                      <button type="submit" className={styles.btnPrimary} style={{ textTransform: "none" }}>
                        {otpSent ? "Verify OTP" : "Send Verification Code"}
                      </button>

                      <div className={styles.dividerSignUp}>or log in with</div>

                      <div className={styles.socialGroup}>
                        <button type="button" onClick={() => setLoginMethod("email")} className={styles.btnSocial}>
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          Continue with Email & Password
                        </button>
                      </div>

                      <p className={styles.authSwitchText}>
                        Don't have an account?{" "}
                        <button 
                          type="button" 
                          className={styles.authLink} 
                          onClick={() => setAuthMode("register")}
                        >
                          Sign up
                        </button>
                      </p>
                    </form>
                  )
                ) : (
                  /* REGISTRATION FORM */
                  registerMethod === "email" ? (
                    /* EMAIL REGISTRATION */
                    <form onSubmit={handleRegister} className={styles.form}>
                      <h2 className={styles.authFormTitle}>Sign up</h2>
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
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <div className={styles.row2Col}>
                        <div className={styles.passwordWrapper}>
                          <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            className={styles.input} 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button 
                            type="button" 
                            className={styles.passwordToggle} 
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            ) : (
                              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required 
                          className={styles.input} 
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>

                      <button type="submit" className={styles.btnPrimary} style={{ textTransform: "none" }}>
                        Sign up
                      </button>

                      <div className={styles.dividerSignUp}>or sign up with</div>

                      <div className={styles.socialGroup}>
                        <button type="button" onClick={handleGoogleLogin} className={styles.btnSocial}>
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                          </svg>
                          Sign up with Google
                        </button>
                        <button type="button" onClick={handleGoogleLogin} className={styles.btnSocial}>
                          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.48C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5M15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C15.96 1.04 14.76 1.66 14.05 2.5C13.45 3.2 12.92 4.3 13.07 5.57C14.17 5.65 15.3 5.01 15.97 4.17Z" />
                          </svg>
                          Sign up with Apple
                        </button>
                      </div>

                      <p className={styles.authSwitchText}>
                        Already have an account?{" "}
                        <button 
                          type="button" 
                          className={styles.authLink} 
                          onClick={() => setAuthMode("login")}
                        >
                          Login
                        </button>
                      </p>
                    </form>
                  ) : (
                    /* PHONE REGISTRATION */
                    <form onSubmit={handlePhoneSubmit} className={styles.form}>
                      <h2 className={styles.authFormTitle}>Sign up</h2>
                      <div className={styles.formGroup}>
                        <input 
                          type="text" 
                          required 
                          className={styles.input} 
                          placeholder="Full Name"
                          value={name}
                          disabled={otpSent}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      {!otpSent ? (
                        <div className={styles.formGroup}>
                          <input 
                            type="tel" 
                            required 
                            className={styles.input} 
                            placeholder="Phone number (e.g. +880 1712-345678)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      ) : (
                        <>
                          <p style={{ fontSize: "0.85rem", color: "#767677", marginBottom: "0.25rem" }}>
                            Verification code sent to <strong>{phoneNumber}</strong>
                          </p>
                          <input 
                            type="text" 
                            required 
                            maxLength={6}
                            className={styles.input} 
                            placeholder="Enter 6-Digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </>
                      )}
                      <button type="submit" className={styles.btnPrimary} style={{ textTransform: "none" }}>
                        {otpSent ? "Verify OTP & Register" : "Send Verification Code"}
                      </button>

                      <div className={styles.dividerSignUp}>or sign up with</div>

                      <div className={styles.socialGroup}>
                        <button type="button" onClick={() => setRegisterMethod("email")} className={styles.btnSocial}>
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          Sign up with Email
                        </button>
                      </div>

                      <p className={styles.authSwitchText}>
                        Already have an account?{" "}
                        <button 
                          type="button" 
                          className={styles.authLink} 
                          onClick={() => setAuthMode("login")}
                        >
                          Login
                        </button>
                      </p>
                    </form>
                  )
                )}
              </div>
              
              {/* Right Column: Premium Image Mockup */}
              <div className={styles.authImageColumn}>
                <Image
                  src="/images/signup_mock_perfume.png"
                  alt="Premium Perfume in Water Ripples"
                  width={500}
                  height={600}
                  priority
                  className={styles.authMockImage}
                />
              </div>

            </div>
          </div>
        ) : (
          /* Redesigned Authenticated Dashboard View */
          <div className={styles.premiumDashboard}>
            
            {/* Header Row: Greeting (left) & Horizontal Navigation (right) */}
            <div className={styles.premiumHeaderRow}>
              <div className={styles.greetingSection}>
                <span className={styles.greetingSub}>Hello!</span>
                <h2 className={styles.greetingName}>{user.name}</h2>
              </div>

              <nav className={styles.premiumNavBar}>
                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "profile" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <svg className={styles.navIcon} viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Profile
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "orders" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <svg className={styles.navIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  My Order
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "addresses" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <svg className={styles.navIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                  Saved Address
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${activeTab === "password" ? styles.navItemActive : ""}`}
                  onClick={() => setActiveTab("password")}
                >
                  <svg className={styles.navIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Change Password
                </button>

                <button 
                  type="button" 
                  className={`${styles.navItem} ${styles.logoutNav}`}
                  onClick={handleLogout}
                >
                  <svg className={styles.navIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Logout
                </button>
              </nav>
            </div>

            {/* Main Content Body */}
            <div className={styles.premiumBody}>
              {activeTab === "profile" && (
                <div className={styles.profileLayoutGrid}>
                  
                  {/* Left Column: Sub-tabs */}
                  <div className={styles.subTabsColumn}>
                    <button 
                      type="button"
                      className={`${styles.subTabBtn} ${activeSubTab === "basic" ? styles.subTabBtnActive : ""}`}
                      onClick={() => setActiveSubTab("basic")}
                    >
                      Basic
                    </button>
                    <button 
                      type="button"
                      className={`${styles.subTabBtn} ${activeSubTab === "advance" ? styles.subTabBtnActive : ""}`}
                      onClick={() => setActiveSubTab("advance")}
                    >
                      Advance
                    </button>
                  </div>

                  {/* Middle Column: Boxes */}
                  <div className={styles.middleBoxesColumn}>
                    {activeSubTab === "basic" ? (
                      <>
                        {/* Top Box: Avatar uploading */}
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
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handlePhotoUpload} 
                                accept="image/*" 
                                style={{ display: "none" }} 
                              />
                              <button 
                                type="button" 
                                className={styles.btnSecondary} 
                                onClick={triggerFileInput}
                              >
                                Update cover
                              </button>
                              <span className={styles.uploadSubtext}>
                                Supports JPG or PNG only. Maximum file size: 2MB.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Box: Profile Details form fields */}
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
                                placeholder="Primary Location"
                                value={userLocation} 
                                onChange={(e) => setUserLocation(e.target.value)}
                              />
                            </div>

                          </form>
                        </div>
                      </>
                    ) : (
                      /* Advance subtab: Keep existing settings/preferences */
                      <div className={styles.profileBox}>
                        <h3 className={styles.boxTitle}>Premium Preferences</h3>
                        <div className={styles.togglesList}>
                          
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
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions (Save/Reset) */}
                  <div className={styles.actionsColumn}>
                    {activeSubTab === "basic" && (
                      <>
                        <button 
                          type="button" 
                          className={styles.btnPrimarySave} 
                          onClick={handleSaveProfile}
                        >
                          Save
                        </button>
                        <button 
                          type="button" 
                          className={styles.btnResetProfile} 
                          onClick={handleResetProfile}
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>

                </div>
              )}

              {/* Orders View */}
              {activeTab === "orders" && (
                <div className={styles.tabContentPanel}>
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

              {/* Addresses View */}
              {activeTab === "addresses" && (
                <div className={styles.tabContentPanel}>
                  <h2 className={styles.contentTitle}>Shipping & Billing Addresses</h2>
                  <div className={styles.addressGrid}>
                    
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
                              style={{ flex: 1, backgroundColor: "transparent", border: "1px solid #767677", color: "#555558" }}
                              onClick={() => setIsEditingShipping(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

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
                </div>
              )}

              {/* Change Password View */}
              {activeTab === "password" && (
                <div className={styles.tabContentPanel}>
                  <h2 className={styles.contentTitle}>Change Password</h2>
                  <form onSubmit={handlePasswordChange} className={styles.form} style={{ maxWidth: "500px", padding: "1rem 0" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Current Password</label>
                      <input
                        type="password"
                        required
                        className={styles.input}
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>New Password</label>
                      <input
                        type="password"
                        required
                        className={styles.input}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Confirm New Password</label>
                      <input
                        type="password"
                        required
                        className={styles.input}
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                      <button type="submit" className={styles.btnPrimary} style={{ maxWidth: "200px" }}>Save Password</button>
                      <button 
                        type="button" 
                        className={styles.btnPrimary} 
                        style={{ maxWidth: "150px", backgroundColor: "transparent", border: "1px solid #767677", color: "#555558" }}
                        onClick={() => {
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmNewPassword("");
                        }}
                      >
                        Reset
                      </button>
                    </div>
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
