"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Shop", href: "/shop" },
  { label: "Event", href: "/events" },
  { label: "Collections", href: "/collections" },
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileMenuOpen(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
      const stored = localStorage.getItem("murakkaz-user") || localStorage.getItem("murakkaz_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          const photo = parsed.photo || parsed.photoUrl || parsed.avatar || null;
          setUserPhoto(photo);
          setUserName(parsed.name || null);
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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);
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

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
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
      {/* Drawer Keyframes */}
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
      `}</style>

      {/* ── Main Floating Navbar Header (Symmetric 32-48px outer margins) ── */}
      <header
        className="fixed top-0 left-0 right-0 w-full z-50 pointer-events-none flex justify-center items-center pt-6 px-4 sm:px-8 lg:px-10 pb-2 transition-all duration-300"
        suppressHydrationWarning
      >
        <nav
          style={{
            paddingLeft: "clamp(32px, 4vw, 56px)",
            paddingRight: "clamp(32px, 4vw, 56px)",
          }}
          className={`pointer-events-auto relative w-full max-w-[1360px] h-16 select-none flex items-center justify-between rounded-[20px] transition-all duration-300 ${
            isHome
              ? isScrolled
                ? "bg-[#F5F1E8]/90 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.04)] border border-[rgba(120,105,85,0.15)]"
                : "bg-transparent border-none shadow-none"
              : "bg-[#F5F1E8] border border-[rgba(120,105,85,0.15)] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          }`}
          suppressHydrationWarning
        >
          {/* Mobile Hamburger Button (< 1024px) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-[#313134] hover:text-[#820011] rounded-full focus:outline-none cursor-pointer"
            aria-label="Open Navigation Drawer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo (Centered content container left edge) */}
          <Link
            href="/"
            className="hover:opacity-85 transition-opacity duration-300 flex items-center shrink-0"
          >
            <Image
              src="/images/logo-murakkaz.svg"
              alt="Murakkaz Logo"
              width={125}
              height={50}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav Links (>= 1024px) */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && (pathname?.startsWith(link.href) ?? false));
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={isActive ? { color: "#820011" } : undefined}
                    className={`font-serif-text text-[13.5px] tracking-[0.14em] uppercase transition-colors duration-200 py-1 ${
                      isActive
                        ? "text-[#820011] font-bold"
                        : "text-[#313134] hover:text-[#820011] font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Right Actions: Wishlist + Cart + Account Avatar (Moved inward for symmetric alignment) */}
          <div className="hidden lg:flex items-center gap-5 sm:gap-6 shrink-0 mr-2 sm:mr-4 lg:mr-6">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-1.5 text-[#313134] hover:text-[#820011] hover:scale-110 transition-all duration-200 flex items-center justify-center"
              aria-label="Wishlist"
              onMouseEnter={() => setHoveredIcon("wishlist")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <svg
                className="w-5.5 h-5.5 transition-colors duration-200 pointer-events-none"
                fill={isWishlistActive ? "#820011" : "none"}
                viewBox="0 0 24 24"
                stroke={isWishlistActive || hoveredIcon === "wishlist" ? "#820011" : "#313134"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#820011] text-white font-sans text-[8.5px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center shadow-xs pointer-events-none z-10">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link (Rectangular Shopping Bag SVG sized to match heart icon & avatar 1:1) */}
            <Link
              href="/cart"
              className="relative p-1.5 text-[#313134] hover:text-[#820011] hover:scale-110 transition-all duration-200 flex items-center justify-center"
              aria-label="Cart"
              onMouseEnter={() => setHoveredIcon("cart")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <svg
                className="w-6 h-6 transition-colors duration-200 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke={isCartActive || hoveredIcon === "cart" ? "#820011" : "#313134"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="8" width="16" height="13" rx="1.8" />
                <path d="M8.5 9.5V5.5a3.5 3.5 0 017 0v4" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#820011] text-white font-sans text-[8.5px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center shadow-xs pointer-events-none z-10">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Link (with avatar photo matching reference picture 1:1) */}
            <Link
              href="/account"
              className="relative text-[#313134] hover:text-[#820011] hover:scale-105 transition-all duration-200 flex items-center justify-center rounded-full"
              aria-label="Account"
              onMouseEnter={() => setHoveredIcon("account")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              {userPhoto ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border-1.5 border-white shadow-xs flex items-center justify-center bg-white shrink-0">
                  <img
                    src={userPhoto}
                    alt={userName || "Account Avatar"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <svg
                  className="w-5.5 h-5.5 transition-colors duration-200 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={isAccountActive || hoveredIcon === "account" ? "#820011" : "#313134"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </Link>
          </div>

          {/* Mobile Right Actions (< 1024px, Shifted left away from right edge) */}
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

            <Link href="/account" className="p-0.5 text-[#313134]" aria-label="Account">
              {userPhoto ? (
                <div className="w-7.5 h-7.5 rounded-full overflow-hidden border-1.5 border-white shadow-xs flex items-center justify-center bg-white shrink-0">
                  <img src={userPhoto} alt="Account" className="w-full h-full rounded-full object-cover" />
                </div>
              ) : (
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </Link>
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
        className={`fixed top-0 left-0 bottom-0 z-50 w-[90vw] sm:w-[380px] max-w-[90vw] h-full shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-all duration-380 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-y-auto lg:hidden pt-8 sm:pt-10 px-4 sm:px-6 pb-10 bg-gradient-to-b from-[#FBF8F2] to-[#F5EEE2] text-[#313134]`}
        style={{
          transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
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

          {/* Search Bar: 18px padding-left, 48px padding-right, 18px search icon right inset, box-border */}
          <div className="w-full">
            <form onSubmit={handleSearchSubmit} className="relative w-full h-[50px] flex items-center">
              <input
                type="text"
                placeholder="Search your perfume"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "18px", paddingRight: "48px", boxSizing: "border-box" }}
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

          {/* Navigation Links: 24px vertical gaps between links */}
          <nav className="flex flex-col gap-6 pt-1 w-full items-start">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href || (link.href !== "/" && (pathname?.startsWith(link.href) ?? false));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 35}ms` }}
                  className={`stagger-item-enter relative self-start font-serif-text text-[19px] sm:text-[21px] tracking-[0.18em] uppercase transition-all duration-200 text-left py-0.5 group ${
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
        </div>

        {/* Footer Account Section inside Mobile Drawer */}
        <div className="w-full mb-6 mt-6 flex flex-col items-center justify-center">
          {/* Account Link */}
          <Link
            href="/account"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center justify-center gap-1.5 group transition-opacity active:opacity-75"
          >
            {userPhoto ? (
              <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#D4C0A7] shadow-xs flex items-center justify-center bg-white shrink-0 group-hover:border-[#8C1D2E] transition-colors">
                <img src={userPhoto} alt="My Account" className="w-full h-full rounded-full object-cover" />
              </div>
            ) : (
              <div className="w-13 h-13 rounded-full bg-white border border-[#D4C0A7] text-[#313134] group-hover:border-[#8C1D2E] group-hover:text-[#8C1D2E] transition-colors flex items-center justify-center shadow-xs shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}

            <span className="font-serif-title text-[16px] font-medium text-[#313134] group-hover:text-[#8C1D2E] transition-colors mt-0.5">
              {userName ? userName : "My Account"}
            </span>

            <span className="font-serif-text text-[11.5px] tracking-[0.14em] uppercase text-[#8A8477] group-hover:text-[#8C1D2E] transition-colors">
              My Account →
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
