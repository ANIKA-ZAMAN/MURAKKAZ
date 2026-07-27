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

      {/* ── Main Floating Navbar Header (Balanced 32-48px outer margins) ── */}
      <header
        className="fixed top-0 left-0 right-0 w-full z-50 pointer-events-none flex justify-center items-center pt-6 px-8 sm:px-10 lg:px-12 pb-2 transition-all duration-300"
        suppressHydrationWarning
      >
        <nav
          className={`pointer-events-auto relative w-full max-w-[1360px] h-16 select-none flex items-center justify-between px-6 sm:px-10 lg:px-14 rounded-[20px] transition-all duration-300 ${
            isHome
              ? isScrolled
                ? "bg-[#FAF6F0]/90 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.06)] border border-[rgba(120,105,85,0.18)]"
                : "bg-transparent border-none shadow-none"
              : isScrolled
                ? "bg-[#FAF6F0]/90 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.06)] border border-[rgba(120,105,85,0.18)]"
                : "bg-transparent backdrop-blur-xs border border-[rgba(120,105,85,0.18)] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
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

          {/* Logo (Aligned with left inset) */}
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
          <ul className="hidden lg:flex items-center gap-6 xl:gap-10 list-none m-0 p-0 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative font-serif-text text-[13px] font-medium tracking-[0.14em] uppercase transition-colors duration-300 py-1 after:block after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:bg-[#820011] after:transition-all after:duration-300 ease-out ${
                      isActive
                        ? "text-[#820011] font-semibold after:w-full"
                        : "text-[#313134] hover:text-[#820011] after:w-0 hover:after:w-full"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Right Actions: Wishlist + Cart + Account Avatar (Aligned with right inset & 20-24px spacing) */}
          <div className="hidden lg:flex items-center gap-5 sm:gap-6 shrink-0">
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
                <span className="absolute top-0 right-0 bg-[#820011] text-white font-sans text-[9.5px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
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
                <span className="absolute -top-0.5 -right-0.5 bg-[#820011] text-white font-sans text-[9.5px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
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
                <span className="absolute -top-1 -right-1 bg-[#820011] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
                <span className="absolute -top-1 -right-1 bg-[#820011] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ease-out lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <aside
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`fixed top-0 left-0 bottom-0 z-50 w-[320px] sm:w-[360px] max-w-[88vw] h-full shadow-2xl transition-transform duration-300 ease-out flex flex-col justify-between overflow-y-auto lg:hidden pt-safe pb-safe ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } bg-[#FAF6F0] text-[#313134]`}
      >
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Header row inside Mobile Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/logo-murakkaz.svg"
                alt="Murakkaz Logo"
                width={120}
                height={50}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-white/80 border border-[#D5C9B3] text-[#313134] hover:bg-[#820011] hover:text-white transition-all flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search bar inside Mobile Drawer */}
          <form onSubmit={handleSearchSubmit} className="relative w-full my-1">
            <input
              type="text"
              placeholder="Search fragrances, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-full bg-white/90 border border-[#D5C9B3] text-[#313134] placeholder-[#8A8477] font-serif-text text-[13px] focus:outline-none focus:border-[#820011] transition-colors"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8477]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </form>

          {/* Nav links list inside Mobile Drawer */}
          <nav className="flex flex-col gap-4 mt-2">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 45}ms` }}
                  className={`stagger-item-enter font-serif-text text-[16px] tracking-[0.14em] uppercase transition-colors py-1.5 ${
                    isActive
                      ? "text-[#820011] font-semibold scale-105"
                      : "text-[#313134] hover:text-[#820011]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info inside Mobile Drawer */}
        <div className="p-6 sm:p-8 border-t border-[#E8DFC8] bg-white/40 flex flex-col gap-4">
          <div className="flex items-center justify-between text-[#5C5346] text-[12px] font-serif-text">
            <span>© Murakkaz Extraits</span>
            <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#820011] underline">
              Account
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
