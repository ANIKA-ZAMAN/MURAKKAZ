"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const homeNavLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Shop", href: "/shop" },
  { label: "Event", href: "/events" },
  { label: "Library", href: "/library" },
  { label: "Compare", href: "/compare" },
  { label: "Finder", href: "/scent-index" },
  { label: "Vlog", href: "/blog" },
];

const originalNavLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Shop", href: "/shop" },
  { label: "Event", href: "/events" },
  { label: "Compare", href: "/compare" },
  { label: "Finder", href: "/scent-index" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
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

  useEffect(() => {
    setMounted(true);
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  const isHome = pathname === "/";
  const isWishlistActive = pathname === "/wishlist";
  const isCartActive = pathname === "/cart";
  const isAccountActive = pathname === "/account" || pathname.startsWith("/account/");

  if (isHome) {
    // 1. Homepage Navbar: Mockup-based alignment matching other pages, but transparent and without outer border.
    return (
      <header className="w-full px-6 py-4 flex justify-center items-center sticky top-3 z-50 bg-transparent" suppressHydrationWarning>
        <nav className="relative w-full max-w-[1348px] h-16 overflow-hidden select-none flex items-center justify-between px-6 bg-transparent" suppressHydrationWarning>
          
          {/* SVG background mockup without border */}
          <div className="absolute inset-0 z-0 pointer-events-none w-full h-full flex justify-center items-center">
            <Image
              src="/images/navbar-home.svg"
              alt="Navbar Mock"
              width={1348}
              height={64}
              priority
              className="w-full h-full object-fill"
              suppressHydrationWarning
            />
          </div>

          {/* Logo */}
          <Link 
            href="/" 
            suppressHydrationWarning
            className="hover:opacity-75 transition-opacity z-10 mr-8 flex items-center ml-3"
          >
            <Image
              src="/images/logo-murakkaz.svg"
              alt="Murakkaz Logo"
              width={116}
              height={50}
              priority
              className="h-9 w-auto object-contain"
              suppressHydrationWarning
            />
          </Link>

          {/* Links */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0 flex-1 justify-center z-10" suppressHydrationWarning>
            {homeNavLinks.map((link) => (
              <li key={link.label} suppressHydrationWarning>
                <Link
                  href={link.href}
                  suppressHydrationWarning
                  style={{ color: pathname === link.href ? "#820011" : undefined }}
                  className={`font-serif-text text-[13px] tracking-wide transition-colors ${
                    pathname === link.href 
                      ? "text-brand-maroon font-semibold" 
                      : "text-neutral-700 hover:text-brand-maroon hover:font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section search input container (percentage positioned for perfect scaling) */}
          <div 
            style={{ 
              position: "absolute", 
              left: "83.531%", 
              width: "10.386%", 
              top: "50%", 
              height: "37px", 
              transform: "translate(-50%, -50%)" 
            }} 
            className="z-10"
            suppressHydrationWarning
          >
            <form onSubmit={handleSearchSubmit} className="w-full h-full relative" suppressHydrationWarning>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`absolute left-[10%] top-[10%] w-[80%] h-[80%] border-none outline-none font-serif-text text-[13px] text-neutral-800 transition-colors rounded-full px-2 ${
                  isSearchFocused || searchQuery.length > 0
                    ? "bg-[#FAF7F2] placeholder:text-neutral-400"
                    : "bg-transparent placeholder:text-transparent"
                }`}
                aria-label="Search"
              />
            </form>
          </div>

          {/* Wishlist Link (percentage positioned for perfect scaling) */}
          <Link 
            href="/wishlist" 
            suppressHydrationWarning
            style={{ 
              position: "absolute", 
              left: "91.469%", 
              top: "50%", 
              transform: "translate(-50%, -50%)" 
            }}
            className="w-6 h-6 z-20 cursor-pointer rounded-full flex items-center justify-center" 
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
                style={{ transition: "fill 0.2s ease" }}
              />
            </svg>
          </Link>

          {/* Cart Link (percentage positioned for perfect scaling) */}
          <Link 
            href="/cart" 
            suppressHydrationWarning
            style={{ 
              position: "absolute", 
              left: "94.362%", 
              top: "50%", 
              transform: "translate(-50%, -50%)" 
            }}
            className="w-6 h-6 z-20 cursor-pointer rounded-full flex items-center justify-center" 
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
                d="M1276.67 28V26.0333C1276.67 25.4205 1276.55 24.8136 1276.31 24.2474C1276.08 23.6813 1275.73 23.1668 1275.3 22.7335C1274.87 22.3001 1274.35 21.9564 1273.79 21.7219C1273.22 21.4873 1272.61 21.3666 1272 21.3666C1271.39 21.3666 1270.78 21.4873 1270.21 21.7219C1269.65 21.9564 1269.13 22.3001 1268.7 22.7335C1268.27 23.1668 1267.92 23.6813 1267.69 24.2474C1267.45 24.8136 1267.33 25.4205 1267.33 26.0333V30.7C1267.33 30.8768 1267.4 31.0463 1267.53 31.1714C1267.82 31.3666 1268 31.3666 1268.18 31.3666C1268.35 31.2964 1268.47 31.1714 1268.6 31.0463 1268.67 30.8768 1268.67 30.7V29.3333H1274V28H1268.67V26.0333C1268.67 25.1492 1269.02 24.3014 1269.64 23.6763C1270.27 23.0512 1271.12 22.7 1272 22.7C1272.88 22.7 1273.73 23.0512 1274.36 23.6763C1274.98 24.3014 1275.33 25.1492 1275.33 26.0333V30.6666C1275.33 30.8434 1275.4 31.013 1275.53 31.138C1275.65 31.2631 1275.82 31.3333 1276 31.3333C1276.18 31.3333 1276.35 31.2631 1276.47 31.138C1276.6 31.013 1276.67 30.8434 1276.67 30.6666V29.3333H1280V41.3333H1264V29.3333H1266V28H1262.67V41.3933C1262.67 41.731 1262.8 42.0549 1263.04 42.2937C1263.28 42.5325 1263.6 42.6666 1263.94 42.6666H1280.06C1280.4 42.6666 1280.72 42.5325 1280.96 42.2937C1281.2 42.0549 1281.33 41.731 1281.33 41.3933V28H1276.67Z"  
                fill={isCartActive || hoveredIcon === "cart" ? "#820011" : "#5F5F61"}
                style={{ transition: "fill 0.2s ease" }}
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-[-3px] right-[-3px] bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Link (percentage positioned for perfect scaling) */}
          <Link 
            href="/account"
            aria-label="Account"
            style={{ 
              position: "absolute", 
              left: "97.255%", 
              top: "50%", 
              transform: "translate(-50%, -50%)" 
            }}
            className="w-6 h-6 z-20 cursor-pointer border-none bg-transparent outline-none rounded-full flex items-center justify-center"
            suppressHydrationWarning
            onMouseEnter={() => setHoveredIcon("account")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <svg 
              viewBox="1299 20 24 24" 
              className="w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M1304.85 37.1C1305.7 36.45 1306.65 35.9375 1307.7 35.5625C1308.75 35.1875 1309.85 35 1311 35C1312.15 35 1313.25 35.1875 1314.3 35.5625C1315.35 35.9375 1316.3 36.45 1317.15 37.1C1317.73 36.4167 1318.19 35.6417 1318.51 34.775C1318.84 33.9083 1319 32.9833 1319 32C1319 29.7833 1318.22 27.8958 1316.66 26.3375C1315.1 24.7792 1313.22 24 1311 24C1308.78 24 1306.9 24.7792 1305.34 26.3375C1303.78 27.8958 1303 29.7833 1303 32C1303 32.9833 1303.16 33.9083 1303.49 34.775C1303.81 35.6417 1304.27 36.4167 1304.85 37.1ZM1311 33C1310.02 33 1309.19 32.6625 1308.51 31.9875C1307.84 31.3125 1307.5 30.4833 1307.5 29.5C1307.5 28.5167 1307.84 27.6875 1308.51 27.0125C1309.19 26.3375 1310.02 26 1311 26C1311.98 26 1312.81 26.3375 1313.49 27.0125C1314.16 27.6875 1314.5 28.5167 1314.5 29.5C1314.5 30.4833 1314.16 31.3125 1313.49 31.9875C1312.81 32.6625 1311.98 33 1311 33ZM1311 42C1309.62 42 1308.32 41.7375 1307.1 41.2125C1305.88 40.6875 1304.83 39.975 1303.92 39.075C1303.02 38.175 1302.31 37.1167 1301.79 35.9C1301.26 34.6833 1301 33.3833 1301 32C1301 30.6167 1301.26 29.3167 1301.79 28.1C1302.31 26.8833 1303.02 25.825 1303.92 24.925C1304.83 24.025 1305.88 23.3125 1307.1 22.7875C1308.32 22.2625 1309.62 22 1311 22C1312.38 22 1313.68 22.2625 1314.9 22.7875C1316.12 23.3125 1317.18 24.025 1318.08 24.925C1318.98 25.825 1319.69 26.8833 1320.21 28.1C1320.74 29.3167 1321 30.6167 1321 32C1321 33.3833 1320.74 34.6833 1320.21 35.9C1319.69 37.1167 1318.98 38.175 1318.08 39.075C1317.18 39.975 1316.12 40.6875 1314.9 41.2125C1313.68 41.7375 1312.38 42 1311 42Z" 
                fill={isAccountActive || hoveredIcon === "account" ? "#820011" : "#5F5F61"}
                style={{ transition: "fill 0.2s ease" }}
              />
            </svg>
          </Link>

        </nav>
      </header>
    );
  }

  // 2. Other Pages Navbar: Bordered layout with mockup background SVG navbar-m.svg
  return (
    <header className="w-full px-6 py-4 flex justify-center items-center sticky top-3 z-50" suppressHydrationWarning>
      <nav className="relative w-full max-w-[1348px] h-16 rounded-[20px] bg-[#F5F1E8]/80 backdrop-blur-md overflow-hidden select-none flex items-center justify-between px-6" suppressHydrationWarning>
        
        {/* SVG background mockup */}
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full flex justify-center items-center">
          <Image
            src="/images/navbar-m.svg"
            alt="Navbar Mock"
            width={1348}
            height={64}
            priority
            className="w-full h-full object-fill"
            suppressHydrationWarning
          />
        </div>

        {/* Logo */}
        <Link 
          href="/" 
          suppressHydrationWarning
          className="hover:opacity-75 transition-opacity z-10 mr-8 flex items-center ml-3"
        >
          <Image
            src="/images/logo-murakkaz.svg"
            alt="Murakkaz Logo"
            width={116}
            height={50}
            priority
            className="h-9 w-auto object-contain"
            suppressHydrationWarning
          />
        </Link>

        {/* Links */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0 flex-1 justify-center z-10" suppressHydrationWarning>
          {originalNavLinks.map((link) => (
            <li key={link.label} suppressHydrationWarning>
              <Link
                href={link.href}
                suppressHydrationWarning
                style={{ color: pathname === link.href ? "#820011" : undefined }}
                className={`font-serif-text text-[13px] tracking-wide transition-colors ${
                  pathname === link.href 
                    ? "text-brand-maroon font-semibold" 
                    : "text-neutral-700 hover:text-brand-maroon hover:font-medium"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section search input container (percentage positioned for perfect scaling) */}
        <div 
          style={{ 
            position: "absolute", 
            left: "83.531%", 
            width: "10.386%", 
            top: "50%", 
            height: "37px", 
            transform: "translate(-50%, -50%)" 
          }} 
          className="z-10"
          suppressHydrationWarning
        >
          <form onSubmit={handleSearchSubmit} className="w-full h-full relative" suppressHydrationWarning>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`absolute left-[10%] top-[10%] w-[80%] h-[80%] border-none outline-none font-serif-text text-[13px] text-neutral-800 transition-colors rounded-full px-2 ${
                isSearchFocused || searchQuery.length > 0
                  ? "bg-[#FAF7F2] placeholder:text-neutral-400"
                  : "bg-transparent placeholder:text-transparent"
              }`}
              aria-label="Search"
            />
          </form>
        </div>

        {/* Wishlist Link (percentage positioned for perfect scaling) */}
        <Link 
          href="/wishlist" 
          suppressHydrationWarning
          style={{ 
            position: "absolute", 
            left: "91.469%", 
            top: "50%", 
            transform: "translate(-50%, -50%)" 
          }}
          className="w-6 h-6 z-20 cursor-pointer rounded-full flex items-center justify-center" 
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
            style={{ transition: "fill 0.2s ease" }}
          />
        </svg>
      </Link>

      {/* Cart Link (percentage positioned for perfect scaling) */}
      <Link 
        href="/cart" 
        suppressHydrationWarning
        style={{ 
          position: "absolute", 
          left: "94.362%", 
          top: "50%", 
          transform: "translate(-50%, -50%)" 
        }}
        className="w-6 h-6 z-20 cursor-pointer rounded-full flex items-center justify-center" 
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
            d="M1276.67 28V26.0333C1276.67 25.4205 1276.55 24.8136 1276.31 24.2474C1276.08 23.6813 1275.73 23.1668 1275.3 22.7335C1274.87 22.3001 1274.35 21.9564 1273.79 21.7219C1273.22 21.4873 1272.61 21.3666 1272 21.3666C1271.39 21.3666 1270.78 21.4873 1270.21 21.7219C1269.65 21.9564 1269.13 22.3001 1268.7 22.7335C1268.27 23.1668 1267.92 23.6813 1267.69 24.2474C1267.45 24.8136 1267.33 25.4205 1267.33 26.0333V30.7C1267.33 30.8768 1267.4 31.0463 1267.53 31.1714C1267.82 31.3666 1268 31.3666 1268.18 31.3666C1268.35 31.2964 1268.47 31.1714 1268.6 31.0463 1268.67 30.8768 1268.67 30.7V29.3333H1274V28H1268.67V26.0333C1268.67 25.1492 1269.02 24.3014 1269.64 23.6763C1270.27 23.0512 1271.12 22.7 1272 22.7C1272.88 22.7 1273.73 23.0512 1274.36 23.6763C1274.98 24.3014 1275.33 25.1492 1275.33 26.0333V30.6666C1275.33 30.8434 1275.4 31.013 1275.53 31.138C1275.65 31.2631 1275.82 31.3333 1276 31.3333C1276.18 31.3333 1276.35 31.2631 1276.47 31.138C1276.6 31.013 1276.67 30.8434 1276.67 30.6666V29.3333H1280V41.3333H1264V29.3333H1266V28H1262.67V41.3933C1262.67 41.731 1262.8 42.0549 1263.04 42.2937C1263.28 42.5325 1263.6 42.6666 1263.94 42.6666H1280.06C1280.4 42.6666 1280.72 42.5325 1280.96 42.2937C1281.2 42.0549 1281.33 41.731 1281.33 41.3933V28H1276.67Z" 
            fill={isCartActive || hoveredIcon === "cart" ? "#820011" : "#5F5F61"}
            style={{ transition: "fill 0.2s ease" }}
          />
        </svg>
        {cartCount > 0 && (
          <span className="absolute top-[-3px] right-[-3px] bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
            {cartCount}
          </span>
        )}
      </Link>

      {/* Account Link (percentage positioned for perfect scaling) */}
      <Link 
        href="/account"
        aria-label="Account"
        style={{ 
          position: "absolute", 
          left: "97.255%", 
          top: "50%", 
          transform: "translate(-50%, -50%)" 
        }}
        className="w-6 h-6 z-20 cursor-pointer border-none bg-transparent outline-none rounded-full flex items-center justify-center"
        suppressHydrationWarning
        onMouseEnter={() => setHoveredIcon("account")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <svg 
          viewBox="1299 20 24 24" 
          className="w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1304.85 37.1C1305.7 36.45 1306.65 35.9375 1307.7 35.5625C1308.75 35.1875 1309.85 35 1311 35C1312.15 35 1313.25 35.1875 1314.3 35.5625C1315.35 35.9375 1316.3 36.45 1317.15 37.1C1317.73 36.4167 1318.19 35.6417 1318.51 34.775C1318.84 33.9083 1319 32.9833 1319 32C1319 29.7833 1318.22 27.8958 1316.66 26.3375C1315.1 24.7792 1313.22 24 1311 24C1308.78 24 1306.9 24.7792 1305.34 26.3375C1303.78 27.8958 1303 29.7833 1303 32C1303 32.9833 1303.16 33.9083 1303.49 34.775C1303.81 35.6417 1304.27 36.4167 1304.85 37.1ZM1311 33C1310.02 33 1309.19 32.6625 1308.51 31.9875C1307.84 31.3125 1307.5 30.4833 1307.5 29.5C1307.5 28.5167 1307.84 27.6875 1308.51 27.0125C1309.19 26.3375 1310.02 26 1311 26C1311.98 26 1312.81 26.3375 1313.49 27.0125C1314.16 27.6875 1314.5 28.5167 1314.5 29.5C1314.5 30.4833 1314.16 31.3125 1313.49 31.9875C1312.81 32.6625 1311.98 33 1311 33ZM1311 42C1309.62 42 1308.32 41.7375 1307.1 41.2125C1305.88 40.6875 1304.83 39.975 1303.92 39.075C1303.02 38.175 1302.31 37.1167 1301.79 35.9C1301.26 34.6833 1301 33.3833 1301 32C1301 30.6167 1301.26 29.3167 1301.79 28.1C1302.31 26.8833 1303.02 25.825 1303.92 24.925C1304.83 24.025 1305.88 23.3125 1307.1 22.7875C1308.32 22.2625 1309.62 22 1311 22C1312.38 22 1313.68 22.2625 1314.9 22.7875C1316.12 23.3125 1317.18 24.025 1318.08 24.925C1318.98 25.825 1319.69 26.8833 1320.21 28.1C1320.74 29.3167 1321 30.6167 1321 32C1321 33.3833 1320.74 34.6833 1320.21 35.9C1319.69 37.1167 1318.98 38.175 1318.08 39.075C1317.18 39.975 1316.12 40.6875 1314.9 41.2125C1313.68 41.731 1312.38 42 1311 42Z" 
            fill={isAccountActive || hoveredIcon === "account" ? "#820011" : "#5F5F61"}
            style={{ transition: "fill 0.2s ease" }}
          />
        </svg>
      </Link>

    </nav>
  </header>
);
}
