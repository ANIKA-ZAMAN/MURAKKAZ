"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const homeNavLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Shop", href: "/shop" },
  { label: "Event", href: "/events" },
  { label: "Collections", href: "/collections" },
  { label: "Compare", href: "/compare" },
  { label: "Finder", href: "/scent-index" },
  { label: "Vlog", href: "/blog" },
];

const originalNavLinks = [
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
  const [mounted, setMounted] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Swipe-to-close touch ref
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
          const total = parsed.reduce((sum: number, item: any) => sum + item.quantity, 0);
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
    const savedUser = localStorage.getItem("murakkaz-user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.photo) setUserPhoto(parsed.photo);
        if (parsed.name) setUserName(parsed.name);
        setIsLoggedIn(true);
        return;
      } catch (e) {
        console.error("Error reading user info", e);
      }
    }
    setUserPhoto(null);
    setUserName(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    setMounted(true);
    updateCount();
    updateWishlistCount();
    updateUserPhoto();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  const currentNavLinks = isHome ? homeNavLinks : originalNavLinks;

  return (
    <>
      {/* Drawer Keyframes for Staggered Menu & Profile entrance */}
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
        @keyframes profileFadeUp {
          from {
            opacity: 0;
            transform: scale(0.98) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .stagger-item-enter {
          animation: menuStaggerIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stagger-profile-enter {
          animation: profileFadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.28s forwards;
        }
      `}</style>

      {/* ── Main Header ── */}
      <header 
        className={`fixed top-0 left-0 right-0 w-full transition-all duration-500 ease-out flex justify-center items-center z-50 pointer-events-auto ${
          isHome
            ? isScrolled 
              ? "py-2.5 sm:py-3 bg-[#FAF6F0]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(49,49,52,0.06)]" 
              : "py-3 sm:py-5 bg-transparent"
            : "py-2.5 sm:py-3 bg-[#FAF6F0]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(49,49,52,0.06)]"
        }`} 
        suppressHydrationWarning
      >
        <nav className="relative w-full max-w-[1400px] h-14 sm:h-18 lg:h-20 select-none flex items-center justify-between px-4 sm:px-6 bg-transparent" suppressHydrationWarning>
          
          {/* Mobile Hamburger Toggle Button (< 992px) - min 44x44px target */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-11 h-11 text-[#313134] hover:text-[#820011] active:scale-95 transition-all rounded-full focus:outline-none z-20 cursor-pointer"
            aria-label="Open Navigation Drawer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <Link 
            href="/" 
            suppressHydrationWarning
            className="hover:opacity-80 transition-opacity duration-300 z-10 flex items-center ml-1 sm:ml-3"
          >
            <Image
              src="/images/logo-murakkaz.svg"
              alt="Murakkaz Logo"
              width={130}
              height={56}
              priority
              className="h-8 sm:h-10 lg:h-11 w-auto object-contain"
              suppressHydrationWarning
            />
          </Link>

          {/* Desktop Links (>= 992px) - Untouched */}
          <ul className="hidden lg:flex items-center gap-8 xl:gap-14 list-none m-0 p-0 flex-1 justify-center z-10" suppressHydrationWarning>
            {currentNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label} suppressHydrationWarning>
                  <Link
                    href={link.href}
                    suppressHydrationWarning
                    className={`relative font-serif-text text-[13.5px] font-medium tracking-[0.16em] uppercase transition-colors duration-400 ease-out py-1.5 after:block after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:h-[1.5px] after:transition-all after:duration-500 ease-out ${
                      isActive 
                        ? "text-[#820011] after:w-full after:bg-[#820011]" 
                        : "text-[#313134] hover:text-[#C5A880] after:w-0 hover:after:w-full after:bg-[#C5A880]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Percentage-Positioned Icons (>= 992px) - Untouched */}
          <div className="hidden lg:block">
            {/* Wishlist Link */}
            <Link 
              href="/wishlist" 
              suppressHydrationWarning
              style={{ 
                position: "absolute", 
                left: "91.469%", 
                top: "50%", 
                transform: "translate(-50%, -50%)" 
              }}
              className="w-7 h-7 z-20 cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110" 
              aria-label="Wishlist"
              onMouseEnter={() => setHoveredIcon("wishlist")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <svg 
                viewBox="1221 20 24 24" 
                className="w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M1233 41L1231.55 39.7C1229.87 38.1833 1228.48 36.875 1227.38 35.775C1226.28 34.675 1225.4 33.6917 1224.75 32.825C1224.1 31.9417 1223.64 31.1333 1223.38 30.4C1223.12 29.6667 1223 28.9167 1223 28.15C1223 26.5833 1223.53 25.275 1224.58 24.225C1225.63 23.175 1226.93 22.65 1228.5 22.65C1229.37 22.65 1230.19 22.8333 1230.98 23.2C1231.76 23.5667 1232.43 24.0833 1233 24.75C1233.57 24.0833 1234.24 23.5667 1235.03 23.2C1235.81 22.8333 1236.63 22.65 1237.5 22.65C1239.07 22.65 1240.38 23.175 1241.43 24.225C1242.48 25.275 1243 26.5833 1243 28.15C1243 28.9167 1242.87 29.6667 1242.6 30.4C1242.35 31.1333 1241.9 31.9417 1241.25 32.825C1240.6 33.6917 1239.73 34.675 1238.63 35.775C1237.53 36.875 1236.13 38.1833 1234.45 39.7L1233 41ZM1233 38.3C1234.6 36.8667 1235.92 35.6417 1236.95 34.625C1237.98 33.5917 1238.8 32.7 1239.4 31.95C1240 31.1833 1240.42 30.5083 1240.65 29.925C1240.88 29.325 1241 28.7333 1241 28.15C1241 27.15 1240.67 26.3167 1240 25.65C1239.33 24.9833 1238.5 24.65 1237.5 24.65C1236.72 24.65 1235.99 24.875 1235.33 25.325C1234.66 25.7583 1234.2 26.3167 1233.95 27H1232.05C1231.8 26.3167 1231.34 25.7583 1230.68 25.325C1230.01 24.875 1229.28 24.65 1228.5 24.65C1227.5 24.65 1226.67 24.9833 1226 25.65C1225.33 26.3167 1225 27.15 1225 28.15C1225 28.7333 1225.12 29.325 1225.35 29.925C1225.58 30.5083 1226 31.1833 1226.6 31.95C1227.2 32.7 1228.02 33.5917 1229.05 34.625C1230.08 35.6417 1231.4 36.8667 1233 38.3Z" 
                  fill={isWishlistActive || hoveredIcon === "wishlist" ? "#820011" : "#5F5F61"}
                  style={{ transition: "fill 0.25s ease" }}
                />
              </svg>
            </Link>

            {/* Cart Link */}
            <Link 
              href="/cart" 
              suppressHydrationWarning
              style={{ 
                position: "absolute", 
                left: "94.362%", 
                top: "50%", 
                transform: "translate(-50%, -50%)" 
              }}
              className="w-7 h-7 z-20 cursor-pointer rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110" 
              aria-label="Cart"
              onMouseEnter={() => setHoveredIcon("cart")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <svg 
                viewBox="1260 20 24 24" 
                className="w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M1276.67 28V26.0333C1276.67 25.4205 1276.55 24.8136 1276.31 24.2474C1276.08 23.6813 1275.73 23.1668 1275.3 22.7335C1274.87 22.3001 1274.35 21.9564 1273.79 21.7219C1273.22 21.4873 1272.61 21.3666 1272 21.3666C1271.39 21.3666 1270.78 21.4873 1270.21 21.7219C1269.65 21.9564 1269.13 22.3001 1268.7 22.7335C1268.27 23.1668 1267.92 23.6813 1267.69 24.2474C1267.45 24.8136 1267.33 25.4205 1267.33 26.0333V30.7C1267.33 30.8768 1267.4 31.0463 1267.53 31.1714C1267.65 31.2964 1267.82 31.3666 1268 31.3666C1268.18 31.3666 1268.35 31.2964 1268.47 31.1714C1268.6 31.0463 1268.67 30.8768 1268.67 30.7V29.3333H1274V28H1268.67V26.0333C1268.67 25.1492 1269.02 24.3014 1269.64 23.6763C1270.27 23.0512 1271.12 22.7 1272 22.7C1272.88 22.7 1273.73 23.0512 1274.36 23.6763C1274.98 24.3014 1275.33 25.1492 1275.33 26.0333V30.6666C1275.33 30.8434 1275.4 31.013 1275.53 31.138C1275.65 31.2631 1275.82 31.3333 1276 31.3333C1276.18 31.3333 1276.35 31.2631 1276.47 31.138C1276.6 31.013 1276.67 30.8434 1276.67 30.6666V29.3333H1280V41.3333H1264V29.3333H1266V28H1262.67V41.3933C1262.67 41.731 1262.8 42.0549 1263.04 42.2937C1263.28 42.5325 1263.6 42.6666 1263.94 42.6666H1280.06C1280.4 42.6666 1280.72 42.5325 1280.96 42.2937C1281.2 42.0549 1281.33 41.731 1281.33 41.3933V28H1276.67Z"  
                  fill={isCartActive || hoveredIcon === "cart" ? "#820011" : "#5F5F61"}
                  style={{ transition: "fill 0.25s ease" }}
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-[-3px] right-[-3px] bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link 
              href="/account"
              aria-label="Account"
              style={{ 
                position: "absolute", 
                left: "97.255%", 
                top: "50%", 
                transform: "translate(-50%, -50%)" 
              }}
              className="w-7 h-7 z-20 cursor-pointer border-none bg-transparent outline-none rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110"
              suppressHydrationWarning
              onMouseEnter={() => setHoveredIcon("account")}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt="Account" 
                  className="w-full h-full rounded-full object-cover border border-solid border-gray-300"
                />
              ) : (
                <svg 
                  viewBox="1299 20 24 24" 
                  className="w-full h-full pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M1304.85 37.1C1305.7 36.45 1306.65 35.9375 1307.7 35.5625C1308.75 35.1875 1309.85 35 1311 35C1312.15 35 1313.25 35.1875 1314.3 35.5625C1315.35 35.9375 1316.3 36.45 1317.15 37.1C1317.73 36.4167 1318.19 35.6417 1318.51 34.775C1318.84 33.9083 1319 32.9833 1319 32C1319 29.7833 1318.22 27.8958 1316.66 26.3375C1315.1 24.7792 1313.22 24 1311 24C1308.78 24 1306.9 24.7792 1305.34 26.3375C1303.78 27.8958 1303 29.7833 1303 32C1303 32.9833 1303.16 33.9083 1303.49 34.775C1303.81 35.6417 1304.27 36.4167 1304.85 37.1ZM1311 33C1310.02 33 1309.19 32.6625 1308.51 31.9875C1307.84 31.3125 1307.5 30.4833 1307.5 29.5C1307.5 28.5167 1307.84 27.6875 1308.51 27.0125C1309.19 26.3375 1310.02 26 1311 26C1311.98 26 1312.81 26.3375 1313.49 27.0125C1314.16 27.6875 1314.5 28.5167 1314.5 29.5C1314.5 30.4833 1314.16 31.3125 1313.49 31.9875C1312.81 32.6625 1311.98 33 1311 33ZM1311 42C1309.62 42 1308.32 41.7375 1307.1 41.2125C1305.88 40.6875 1304.83 39.975 1303.92 39.075C1303.02 38.175 1302.31 37.1167 1301.79 35.9C1301.26 34.6833 1301 33.3833 1301 32C1301 30.6167 1301.26 29.3167 1301.79 28.1C1302.31 26.8833 1303.02 25.825 1303.92 24.925C1304.83 24.025 1305.88 23.3125 1307.1 22.7875C1308.32 22.2625 1309.62 22 1311 22C1312.38 22 1313.68 22.2625 1314.9 22.7875C1316.12 23.3125 1317.18 24.025 1318.08 24.925C1318.98 25.825 1319.69 26.8833 1320.21 28.1C1320.74 29.3167 1321 30.6167 1321 32C1321 33.3833 1320.74 34.6833 1320.21 35.9C1319.69 37.1167 1318.98 38.175 1318.08 39.075C1317.18 39.975 1316.12 40.6875 1314.9 41.2125C1313.68 41.731 1312.38 42 1311 42Z" 
                    fill={isAccountActive || hoveredIcon === "account" ? "#820011" : "#5F5F61"}
                    style={{ transition: "fill 0.25s ease" }}
                  />
                </svg>
              )}
            </Link>
          </div>

          {/* Mobile Right Icons Container (< 992px) - min 44x44px touch target */}
          <div className="flex lg:hidden items-center gap-3.5 sm:gap-5 z-20">
            {/* Mobile Wishlist Icon */}
            <Link 
              href="/wishlist" 
              className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 transition-all" 
              aria-label="Wishlist"
            >
              <svg viewBox="1221 20 24 24" className="w-5.5 h-5.5" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M1233 41L1231.55 39.7C1229.87 38.1833 1228.48 36.875 1227.38 35.775C1226.28 34.675 1225.4 33.6917 1224.75 32.825C1224.1 31.9417 1223.64 31.1333 1223.38 30.4C1223.12 29.6667 1223 28.9167 1223 28.15C1223 26.5833 1223.53 25.275 1224.58 24.225C1225.63 23.175 1226.93 22.65 1228.5 22.65C1229.37 22.65 1230.19 22.8333 1230.98 23.2C1231.76 23.5667 1232.43 24.0833 1233 24.75C1233.57 24.0833 1234.24 23.5667 1235.03 23.2C1235.81 22.8333 1236.63 22.65 1237.5 22.65C1239.07 22.65 1240.38 23.175 1241.43 24.225C1242.48 25.275 1243 26.5833 1243 28.15C1243 28.9167 1242.87 29.6667 1242.6 30.4C1242.35 31.1333 1241.9 31.9417 1241.25 32.825C1240.6 33.6917 1239.73 34.675 1238.63 35.775C1237.53 36.875 1236.13 38.1833 1234.45 39.7L1233 41ZM1233 38.3C1234.6 36.8667 1235.92 35.6417 1236.95 34.625C1237.98 33.5917 1238.8 32.7 1239.4 31.95C1240 31.1833 1240.42 30.5083 1240.65 29.925C1240.88 29.325 1241 28.7333 1241 28.15C1241 27.15 1240.67 26.3167 1240 25.65C1239.33 24.9833 1238.5 24.65 1237.5 24.65C1236.72 24.65 1235.99 24.875 1235.33 25.325C1234.66 25.7583 1234.2 26.3167 1233.95 27H1232.05C1231.8 26.3167 1231.34 25.7583 1230.68 25.325C1230.01 24.875 1229.28 24.65 1228.5 24.65C1227.5 24.65 1226.67 24.9833 1226 25.65C1225.33 26.3167 1225 27.15 1225 28.15C1225 28.7333 1225.12 29.325 1225.35 29.925C1225.58 30.5083 1226 31.1833 1226.6 31.95C1227.2 32.7 1228.02 33.5917 1229.05 34.625C1230.08 35.6417 1231.4 36.8667 1233 38.3Z" 
                  fill={isWishlistActive ? "#820011" : "#5F5F61"}
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#820011] text-white font-serif-text text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Cart Icon */}
            <Link 
              href="/cart" 
              className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 transition-all" 
              aria-label="Cart"
            >
              <svg viewBox="1260 20 24 24" className="w-5.5 h-5.5" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M1276.67 28V26.0333C1276.67 25.4205 1276.55 24.8136 1276.31 24.2474C1276.08 23.6813 1275.73 23.1668 1275.3 22.7335C1274.87 22.3001 1274.35 21.9564 1273.79 21.7219C1273.22 21.4873 1272.61 21.3666 1272 21.3666C1271.39 21.3666 1270.78 21.4873 1270.21 21.7219C1269.65 21.9564 1269.13 22.3001 1268.7 22.7335C1268.27 23.1668 1267.92 23.6813 1267.69 24.2474C1267.45 24.8136 1267.33 25.4205 1267.33 26.0333V30.7C1267.33 30.8768 1267.4 31.0463 1267.53 31.1714C1267.65 31.2964 1267.82 31.3666 1268 31.3666C1268.18 31.3666 1268.35 31.2964 1268.47 31.1714C1268.6 31.0463 1268.67 30.8768 1268.67 30.7V29.3333H1274V28H1268.67V26.0333C1268.67 25.1492 1269.02 24.3014 1269.64 23.6763C1270.27 23.0512 1271.12 22.7 1272 22.7C1272.88 22.7 1273.73 23.0512 1274.36 23.6763C1274.98 24.3014 1275.33 25.1492 1275.33 26.0333V30.6666C1275.33 30.8434 1275.4 31.013 1275.53 31.138C1275.65 31.2631 1275.82 31.3333 1276 31.3333C1276.18 31.3333 1276.35 31.2631 1276.47 31.138C1276.6 31.013 1276.67 30.8434 1276.67 30.6666V29.3333H1280V41.3333H1264V29.3333H1266V28H1262.67V41.3933C1262.67 41.731 1262.8 42.0549 1263.04 42.2937C1263.28 42.5325 1263.6 42.6666 1263.94 42.6666H1280.06C1280.4 42.6666 1280.72 42.5325 1280.96 42.2937C1281.2 42.0549 1281.33 41.731 1281.33 41.3933V28H1276.67Z"  
                  fill={isCartActive ? "#820011" : "#5F5F61"}
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#820011] text-white font-serif-text text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Account Icon */}
            <Link 
              href="/account" 
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 transition-all" 
              aria-label="Account"
            >
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt="Account" 
                  className="w-6 h-6 rounded-full object-cover border border-solid border-gray-300"
                />
              ) : (
                <svg viewBox="1299 20 24 24" className="w-5.5 h-5.5" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M1304.85 37.1C1305.7 36.45 1306.65 35.9375 1307.7 35.5625C1308.75 35.1875 1309.85 35 1311 35C1312.15 35 1313.25 35.1875 1314.3 35.5625C1315.35 35.9375 1316.3 36.45 1317.15 37.1C1317.73 36.4167 1318.19 35.6417 1318.51 34.775C1318.84 33.9083 1319 32.9833 1319 32C1319 29.7833 1318.22 27.8958 1316.66 26.3375C1315.1 24.7792 1313.22 24 1311 24C1308.78 24 1306.9 24.7792 1305.34 26.3375C1303.78 27.8958 1303 29.7833 1303 32C1303 32.9833 1303.16 33.9083 1303.49 34.775C1303.81 35.6417 1304.27 36.4167 1304.85 37.1ZM1311 33C1310.02 33 1309.19 32.6625 1308.51 31.9875C1307.5 31.3125 1307.5 30.4833 1307.5 29.5C1307.5 28.5167 1307.84 27.6875 1308.51 27.0125C1309.19 26.3375 1310.02 26 1311 26C1311.98 26 1312.81 26.3375 1313.49 27.0125C1314.16 27.6875 1314.5 28.5167 1314.5 29.5C1314.5 30.4833 1314.16 31.3125 1313.49 31.9875C1312.81 32.6625 1311.98 33 1311 33ZM1311 42C1309.62 42 1308.32 41.7375 1307.1 41.2125C1305.88 40.6875 1304.83 39.975 1303.92 39.075C1303.02 38.175 1302.31 37.1167 1301.79 35.9C1301.26 34.6833 1301 33.3833 1301 32C1301 30.6167 1301.26 29.3167 1301.79 28.1C1302.31 26.8833 1303.02 25.825 1303.92 24.925C1304.83 24.025 1305.88 23.3125 1307.1 22.7875C1308.32 22.2625 1309.62 22 1311 22C1312.38 22 1313.68 22.2625 1314.9 22.7875C1316.12 23.3125 1317.18 24.025 1318.08 24.925C1318.98 25.825 1319.69 26.8833 1320.21 28.1C1320.74 29.3167 1320.74 34.6833 1320.21 35.9C1319.69 37.1167 1318.98 38.175 1318.08 39.075C1317.18 39.975 1316.12 40.6875 1314.9 41.2125C1313.68 41.731 1312.38 42 1311 42Z" 
                    fill={isAccountActive ? "#820011" : "#5F5F61"}
                  />
                </svg>
              )}
            </Link>
          </div>

        </nav>
      </header>

      {/* ── Left-Slide Full-Height Mobile Drawer Navigation (< 992px) ── */}
      {/* Backdrop Overlay with 320ms Fade */}
      <div 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-320 ease-out lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Drawer Box (320ms cubic-bezier transition + swipe-to-close touch handlers + 24px px-6 grid system) */}
      <aside 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`fixed top-0 left-0 bottom-0 z-50 w-[320px] sm:w-[360px] max-w-[88vw] h-full shadow-2xl transition-transform duration-320 ease-out flex flex-col justify-between overflow-y-auto lg:hidden pt-safe pb-safe ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          background: "linear-gradient(180deg, #FAF6F0 0%, #F4ECE1 100%)",
          borderRight: "1px solid rgba(184, 150, 92, 0.25)"
        }}
        aria-label="Mobile Navigation Drawer"
      >
        <div>
          {/* Top Header Row: Logo Centered in Exact Middle & Close Button Absolute Right (48-56px luxury top padding) */}
          <div className="relative flex items-center justify-center w-full px-6 pt-12 sm:pt-14 pb-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="inline-block mx-auto">
              <Image
                src="/images/logo-murakkaz.svg"
                alt="Murakkaz Logo"
                width={140}
                height={55}
                priority
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>
            
            {/* Animated Close Button: Absolute Right */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute right-6 top-12 sm:top-14 w-11 h-11 flex items-center justify-center text-[#313134] hover:text-[#820011] hover:rotate-90 active:scale-95 rounded-full transition-all duration-300 cursor-pointer bg-white/80 border border-[#B8965C]/30 shadow-xs"
              aria-label="Close Navigation Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar Container (Generous 32-40px top margin & 48-64px bottom margin) */}
          <div className="px-6 mt-8 sm:mt-10 mb-12 sm:mb-16">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search perfumes, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-13 pl-10 sm:pl-11 pr-11 rounded-2xl border border-[#B8965C]/40 bg-white/95 text-[#313134] font-serif-text text-[13.5px] leading-normal outline-none focus:border-[#820011] focus:ring-2 focus:ring-[#820011]/15 transition-all placeholder:text-[#7E7569] shadow-xs"
                style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
              />
              <button
                type="submit"
                onClick={handleSearchSubmit}
                className="absolute right-2.5 w-9 h-9 flex items-center justify-center text-[#313134] hover:text-[#820011] active:scale-95 cursor-pointer rounded-lg hover:bg-[#B8965C]/10 transition-all"
                aria-label="Submit Search"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

          {/* Drawer Nav Links: Positioned significantly lower with 48-64px top space from search bar */}
          <div className="flex-1 flex flex-col justify-start items-center pt-12 sm:pt-16 pb-8 w-full">
            <ul className="flex flex-col items-center justify-start w-full list-none m-0 p-0 gap-6 sm:gap-7.5 text-center px-6">
              {currentNavLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <li 
                    key={link.label} 
                    className={`w-full text-center ${isMobileMenuOpen ? "stagger-item-enter" : "opacity-0"}`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`inline-block font-serif-text text-[15.5px] sm:text-[17px] font-medium tracking-[0.18em] uppercase transition-all duration-300 py-1.5 px-4 ${
                        isActive 
                          ? "text-[#820011] font-semibold scale-105" 
                          : "text-[#313134] hover:text-[#820011] hover:scale-105"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

          {/* Centered Profile Section in lower-middle of drawer (around 70–75% height) */}
          <div className="mt-8 mb-6 sm:mt-10 sm:mb-8 w-full flex flex-col items-center justify-center text-center px-6">
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`group flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 active:scale-97 ${
                isMobileMenuOpen ? "stagger-profile-enter" : "opacity-0"
              }`}
            >
              {/* 56–64px Circular Avatar Centered */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#B8965C] overflow-hidden flex items-center justify-center bg-[#820011] text-white font-serif font-bold text-lg sm:text-xl shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300 mx-auto">
                {isLoggedIn && userPhoto ? (
                  <img src={userPhoto} alt="User Profile" className="w-full h-full object-cover" />
                ) : isLoggedIn && userName ? (
                  <span>{userName.charAt(0).toUpperCase()}</span>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#FAF6F0] text-[#820011]">
                    <svg className="w-6.5 h-6.5 sm:w-7 sm:h-7 text-[#820011]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 16px Spacing: User Name / Welcome Title */}
              <h3 className="mt-4 font-serif-text text-[15.5px] sm:text-[17px] font-semibold tracking-wide text-[#313134] group-hover:text-[#820011] transition-colors text-center">
                {isLoggedIn && userName ? userName : isLoggedIn ? "My Account" : "Welcome to Murakkaz"}
              </h3>

              {/* 6px Spacing: View Profile Link or Sign In / Create Account Buttons */}
              <div className="mt-1.5 font-serif-text text-[11.5px] sm:text-[12px] text-[#7E7569] tracking-wider text-center">
                {isLoggedIn ? (
                  <span className="inline-flex items-center gap-1 text-[#7E7569] group-hover:text-[#820011] transition-colors">
                    <span>View Profile</span>
                    <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-[#7E7569]">
                    <span className="text-[#820011] font-medium hover:underline">Sign In</span>
                    <span className="text-[#B8965C]">•</span>
                    <span className="text-[#820011] font-medium hover:underline">Create Account</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

        {/* Tiny Centered Footer Pinned to Very Bottom */}
        <div className="pb-4 pt-1 text-center w-full mt-auto">
          <p className="font-serif-text text-[9.5px] text-[#7E7569]/60 tracking-widest uppercase">
            Murakkaz © Fine Extraits de Parfum
          </p>
        </div>
      </aside>
    </>
  );
}
