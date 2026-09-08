"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Shop", href: "/shop" },
  { label: "Event", href: "/events" },
  { label: "Library", href: "/collections" },
  { label: "Compare", href: "/compare" },
  { label: "Finder", href: "/scent-index" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Swipe-to-close touch ref for mobile drawer
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchCurrentX.current !== null) {
      const diffX = touchStartX.current - touchCurrentX.current;
      if (diffX > 50) {
        setIsMobileMenuOpen(false);
      }
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);

    // If on /shop or /collections, live-filter cards directly on the page
    if (pathname === "/shop" || pathname === "/collections") {
      window.dispatchEvent(new CustomEvent("navbar-search", { detail: val }));
      const newUrl = val.trim() ? `${pathname}?q=${encodeURIComponent(val.trim())}` : pathname;
      window.history.replaceState(null, "", newUrl);
    } else if (val.trim().length > 0) {
      // If typing on any other page, navigate to shop with the filter active
      router.push(`/shop?q=${encodeURIComponent(val.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (pathname === "/shop" || pathname === "/collections") {
      window.dispatchEvent(new CustomEvent("navbar-search", { detail: "" }));
      window.history.replaceState(null, "", pathname);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pathname !== "/shop" && pathname !== "/collections") {
      router.push(searchQuery.trim() ? `/shop?q=${encodeURIComponent(searchQuery.trim())}` : `/shop`);
    } else {
      window.dispatchEvent(new CustomEvent("navbar-search", { detail: searchQuery }));
    }
    setIsMobileMenuOpen(false);
  };

  const updateCount = () => {
    const saved = localStorage.getItem("cart-items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const total = parsed.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          setCartCount(total);
          return;
        }
      } catch (e) {
        console.error("Error reading cart count", e);
      }
    }
    setCartCount(0);
  };

  const updateWishlistCount = () => {
    const saved = localStorage.getItem("wishlist-items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistCount(parsed.length);
          return;
        }
      } catch (e) {
        console.error("Error reading wishlist count", e);
      }
    }
    setWishlistCount(0);
  };

  const updateUserPhoto = () => {
    try {
      const token = localStorage.getItem("murakkaz-token");
      const stored = localStorage.getItem("murakkaz-user") || localStorage.getItem("murakkaz_user");

      if (token && stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          const photo = parsed.photo || parsed.photoUrl || parsed.avatar || null;
          setUserPhoto(photo);
          setUserName(parsed.name || parsed.firstName || "Member");
          setIsLoggedIn(true);
          return;
        }
      }
    } catch (e) {
      console.error("Error reading user photo", e);
    }
    setUserPhoto(null);
    setUserName(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    updateCount();
    updateWishlistCount();
    updateUserPhoto();

    let lastIsScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 15;
      if (scrolled !== lastIsScrolled) {
        lastIsScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("wishlist-updated", updateWishlistCount);
    window.addEventListener("murakkaz-user-updated", updateUserPhoto);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("wishlist-updated", updateWishlistCount);
      window.removeEventListener("murakkaz-user-updated", updateUserPhoto);
    };
  }, []);

  // Sync searchQuery with URL on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const qParam = urlParams.get("q");
      if (qParam && (pathname === "/shop" || pathname === "/collections")) {
        setSearchQuery(qParam);
      } else if (pathname !== "/shop" && pathname !== "/collections") {
        setSearchQuery("");
      }
    }
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isHome = pathname === "/";
  const isWishlistActive = pathname === "/wishlist";
  const isCartActive = pathname === "/cart";
  const isAccountActive = pathname === "/account" || pathname.startsWith("/account/");

  return (
    <>
      {/* Drawer Keyframes & Search Animation */}
      <style suppressHydrationWarning>{`
        @keyframes menuStaggerIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .stagger-item-enter {
          animation: menuStaggerIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes searchDropdownFade {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .search-dropdown-enter {
          animation: searchDropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* ── Main Floating Navbar Header ── */}
      <header
        style={{
          top: "clamp(18px, 2.5vw, 32px)",
          paddingLeft: "clamp(16px, 3vw, 40px)",
          paddingRight: "clamp(16px, 3vw, 40px)",
        }}
        className="fixed left-0 right-0 w-full z-50 pointer-events-none flex justify-center items-center transition-all duration-300"
        suppressHydrationWarning
      >
        <nav
          style={{
            paddingLeft: "clamp(32px, 3.2vw, 48px)",
            paddingRight: "clamp(32px, 3.2vw, 48px)",
          }}
          className={`pointer-events-auto relative w-full max-w-[1360px] h-[58px] sm:h-[62px] select-none flex items-center justify-between rounded-[20px] transition-all duration-300 ${
            isHome && !isScrolled
              ? "bg-transparent border border-transparent shadow-none"
              : "bg-[#F5F1E8] border border-[#6B6B6B]/40 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
          }`}
          suppressHydrationWarning
        >
          {/* Mobile Hamburger Button (< 1024px) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-9 h-9 text-[#313134] hover:text-[#820011] rounded-full focus:outline-none cursor-pointer"
            aria-label="Open Navigation Drawer"
          >
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Brand Logo (Serif Text / SVG Logo) */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="hover:opacity-85 transition-opacity duration-200 flex items-center"
            >
              <span className="font-serif text-[20px] sm:text-[21px] tracking-[0.01em] text-[#2B2B2E] font-normal select-none">
                Murakkaz
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links (>= 1024px) - Balanced Center Zone */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0 flex-1 justify-center px-4 xl:px-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && (pathname?.startsWith(link.href) ?? false));
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={isActive ? { color: "#820011" } : undefined}
                    className={`font-serif-text text-[14px] xl:text-[14.5px] transition-colors duration-200 py-1 ${
                      isActive
                        ? "text-[#820011] font-semibold"
                        : "text-[#3B3B3E] hover:text-[#820011] font-normal"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Right Actions: Embedded Searchbar + Wishlist + Cart + Account */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5 shrink-0">
            {/* Minimal Luxury Direct-Filter Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              style={{ paddingLeft: "14px", paddingRight: "12px" }}
              className="relative flex items-center bg-[#ECE6DC]/80 hover:bg-[#E4DDCF] focus-within:bg-white border border-[#DDD6CA] focus-within:border-[#820011]/40 rounded-full h-[36px] gap-2 transition-all duration-200 w-[180px] xl:w-[220px] shadow-2xs"
            >
              <button
                type="submit"
                className="text-[#7A746A] hover:text-[#820011] transition-colors p-0 flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Search"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search perfumes..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent text-[#313134] placeholder-[#8A847A] text-[13px] font-sans focus:outline-none leading-none tracking-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-[#9E978C] hover:text-[#313134] transition-colors text-[11px] p-0.5 cursor-pointer flex items-center justify-center shrink-0"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-1 text-[#313134] hover:text-[#820011] hover:scale-110 transition-all duration-200 flex items-center justify-center"
              aria-label="Wishlist"
              onMouseEnter={() => setHoveredIcon("wishlist")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <svg
                className="w-5 h-5 transition-colors duration-200 pointer-events-none"
                fill={isWishlistActive ? "#820011" : "none"}
                viewBox="0 0 24 24"
                stroke={isWishlistActive || hoveredIcon === "wishlist" ? "#820011" : "#313134"}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#820011] text-white font-sans text-[8px] font-bold min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center shadow-xs pointer-events-none z-10">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link (Shopping Bag) */}
            <Link
              href="/cart"
              className="relative p-1 text-[#313134] hover:text-[#820011] hover:scale-110 transition-all duration-200 flex items-center justify-center"
              aria-label="Cart"
              onMouseEnter={() => setHoveredIcon("cart")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <svg
                className="w-5 h-5 transition-colors duration-200 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke={isCartActive || hoveredIcon === "cart" ? "#820011" : "#313134"}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="8" width="16" height="13" rx="1.8" />
                <path d="M8.5 9.5V5.5a3.5 3.5 0 017 0v4" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#820011] text-white font-sans text-[8px] font-bold min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center shadow-xs pointer-events-none z-10">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account: Profile Picture/Initial when signed in, Login Icon when not signed in */}
            {isLoggedIn ? (
              <Link
                href="/account"
                className="relative text-[#313134] hover:text-[#820011] hover:scale-105 transition-all duration-200 flex items-center justify-center rounded-full shrink-0"
                aria-label="My Account"
                title={userName ? `Account (${userName})` : "My Account"}
                onMouseEnter={() => setHoveredIcon("account")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                {userPhoto ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5A880]/70 shadow-2xs flex items-center justify-center bg-white shrink-0">
                    <img
                      src={userPhoto}
                      alt={userName || "Profile"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border border-[#C5A880]/60 bg-[#820011] text-[#FBF8F2] flex items-center justify-center text-[12.5px] font-bold shadow-2xs shrink-0">
                    {userName ? userName.trim().charAt(0).toUpperCase() : "M"}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/account"
                className="relative p-1 text-[#313134] hover:text-[#820011] hover:scale-110 transition-all duration-200 flex items-center justify-center shrink-0"
                aria-label="Sign In / Login"
                title="Sign In / Login"
                onMouseEnter={() => setHoveredIcon("login")}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <svg
                  className="w-5 h-5 transition-colors duration-200 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={hoveredIcon === "login" ? "#820011" : "#313134"}
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile Right Actions (< 1024px) */}
          <div className="flex lg:hidden items-center gap-3.5 mr-2 sm:mr-4">
            <Link href="/wishlist" className="relative p-1 text-[#313134]" aria-label="Wishlist">
              <svg className="w-5.5 h-5.5" fill={isWishlistActive ? "#820011" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#820011] text-white text-[8.5px] font-bold min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center pointer-events-none z-10">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-1 text-[#313134]" aria-label="Cart">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="8" width="16" height="13" rx="1.8" />
                <path d="M8.5 9.5V5.5a3.5 3.5 0 017 0v4" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#820011] text-white text-[8.5px] font-bold min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center pointer-events-none z-10">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <Link href="/account" className="p-0.5 text-[#313134] flex items-center justify-center shrink-0" aria-label="My Account">
                {userPhoto ? (
                  <div className="w-7.5 h-7.5 rounded-full overflow-hidden border border-[#C5A880]/70 shadow-2xs flex items-center justify-center bg-white shrink-0">
                    <img src={userPhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  </div>
                ) : (
                  <div className="w-7.5 h-7.5 rounded-full border border-[#C5A880]/60 bg-[#820011] text-[#FBF8F2] flex items-center justify-center text-[11.5px] font-bold shadow-2xs shrink-0">
                    {userName ? userName.trim().charAt(0).toUpperCase() : "M"}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/account"
                className="p-1 text-[#313134] hover:text-[#820011] transition-colors flex items-center justify-center shrink-0"
                aria-label="Sign In / Login"
                title="Sign In / Login"
              >
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* ── Left-Slide Full-Height Mobile Drawer Navigation (< 1024px) ── */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/55 backdrop-blur-xs z-50 transition-opacity duration-380 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <aside
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`fixed top-0 left-0 bottom-0 z-50 w-[90vw] sm:w-[380px] max-w-[90vw] h-full shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-all duration-380 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-y-auto lg:hidden pt-8 sm:pt-10 pb-10 bg-gradient-to-b from-[#FBF8F2] to-[#F5EEE2] text-[#313134]`}
        style={{
          transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
          paddingLeft: "24px",
          paddingRight: "24px",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.015 0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23paperNoise)'/%3E%3C/svg%3E"), linear-gradient(to bottom, #FBF8F2, #F5EEE2)`,
        }}
      >
        {/* Drawer Content Parent Container */}
        <div className="flex flex-col w-full gap-5.5 sm:gap-6">
          {/* Header Row: Perfectly Centered Murakkaz Logo + Top-Right Close (×) Button */}
          <div className="relative w-full flex items-center justify-center min-h-[44px]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-85 transition-opacity flex items-center justify-center mx-auto"
            >
              <Image
                src="/images/logo-murakkaz.svg"
                alt="Murakkaz Logo"
                width={130}
                height={44}
                className="h-9 w-auto object-contain mx-auto"
              />
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-9.5 h-9.5 rounded-full bg-white/80 border border-[#E0D5C5] text-[#313134] hover:bg-[#8C1D2E] hover:text-white transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="Close menu"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Search Bar: Direct Filtering */}
          <div className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="relative w-full h-[50px] flex items-center">
              <input
                type="text"
                placeholder="Search your perfume..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ paddingLeft: "20px", paddingRight: "48px", boxSizing: "border-box" }}
                className="w-full h-[50px] rounded-full bg-[#F3EFE6] border border-[#4A4A4C] text-[#313134] placeholder-[#8A8477] font-serif-text text-[15px] leading-[50px] focus:outline-none focus:border-[#820011] focus:bg-[#FAF6F0] transition-colors"
              />
              <button
                type="submit"
                style={{ right: "18px" }}
                className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-[#313134] hover:text-[#820011] transition-colors p-1 cursor-pointer"
                aria-label="Search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Navigation Links: Generous spacing between links */}
          <nav className="flex flex-col gap-8 sm:gap-9 mt-6 sm:mt-8 w-full items-start">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href || (link.href !== "/" && (pathname?.startsWith(link.href) ?? false));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 35}ms` }}
                  className={`stagger-item-enter relative self-start font-serif-text text-[19px] sm:text-[21px] tracking-[0.18em] uppercase transition-all duration-200 text-left py-1 group ${
                    isActive
                      ? "text-[#820011] font-bold"
                      : "text-[#313134] hover:text-[#820011] active:opacity-75 font-medium"
                  }`}
                >
                  <span className={isActive ? "text-[#820011]" : ""}>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Account Profile Section */}
          <div className="w-full mt-8 sm:mt-10 pt-6 border-t border-[#E8DFC8]/80 pb-8 flex flex-col items-center justify-center">
            {/* Account Link / Sign In */}
            {isLoggedIn ? (
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-white/70 backdrop-blur-xs border border-[#E2D5C3] rounded-2xl p-3.5 flex items-center justify-between group transition-all duration-200 hover:border-[#820011]/40 hover:bg-white active:scale-[0.99] shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {userPhoto ? (
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-[#D4C0A7] shadow-2xs flex items-center justify-center bg-white shrink-0">
                      <img src={userPhoto} alt="My Account" className="w-full h-full rounded-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#820011] text-white flex items-center justify-center text-[16px] font-bold shadow-2xs shrink-0">
                      {userName ? userName.charAt(0).toUpperCase() : "M"}
                    </div>
                  )}

                  <div className="flex flex-col min-w-0 text-left">
                    <span className="font-serif-title text-[15px] font-medium text-[#313134] group-hover:text-[#820011] transition-colors truncate">
                      {userName ? userName : "My Account"}
                    </span>
                    <span className="text-[11.5px] text-[#8A8477] tracking-wider uppercase font-serif-text">
                      Fragrance Circle Member
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#820011] text-[13px] font-medium shrink-0 pr-1">
                  <span>Profile</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ) : (
              <div className="w-full flex flex-col items-center gap-2.5">
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group w-full h-[50px] rounded-full bg-[#820011] text-white font-medium text-[13.5px] sm:text-[14px] tracking-[0.08em] uppercase shadow-[0_4px_16px_rgba(130,0,17,0.25)] flex items-center justify-center gap-2.5 hover:bg-[#6c000e] active:scale-[0.99] transition-all duration-200 select-none px-6"
                >
                  <svg className="w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="whitespace-nowrap font-medium">Sign In / Register</span>
                  <span className="text-white/80 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>

                <span className="font-serif-text text-[12px] text-[#8A8477] tracking-[0.02em] text-center">
                  Join Murakkaz Fragrance Circle
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
