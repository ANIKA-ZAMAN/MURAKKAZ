"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Shop", href: "/shop" },
  { label: "Event", href: "/events" },
  { label: "Compare", href: "/compare" },
  { label: "Finder", href: "/scent-index" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

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
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  return (
    <header className="w-full px-6 py-4 flex justify-center items-center sticky top-3 z-50 animate-fade-up" suppressHydrationWarning>
      <nav className="relative w-full max-w-[1348px] h-16 rounded-[20px] bg-[#E5DCCB]/80 backdrop-blur-md overflow-hidden select-none flex items-center justify-between px-6" suppressHydrationWarning>
        
        {/* SVG background containing visual paths of the border rect, search bar, and icons */}
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

        {/* 1. Logo - Left aligned SVG logo */}
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

        {/* 2. Menu Links - Centered and distributed evenly in HTML to close all gaps! */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0 flex-1 justify-center z-10" suppressHydrationWarning>
          {navLinks.map((link) => (
            <li key={link.label} suppressHydrationWarning>
              <Link
                href={link.href}
                suppressHydrationWarning
                className={`font-serif-text text-[13px] tracking-wide transition-colors ${
                  pathname === link.href 
                    ? "text-neutral-900 font-semibold" 
                    : "text-neutral-700 hover:text-[#c5a880] hover:font-medium"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 3. Right Section - Workable search input and icon overlays */}
        <div className="flex items-center z-10 flex-shrink-0" suppressHydrationWarning>
          {/* Spacer aligning with SVG search bar */}
          <div className="w-[160px] xl:w-[180px] h-9 relative mr-2" suppressHydrationWarning>
            <input
              type="text"
              placeholder="Search"
              className="absolute left-[15%] top-0 w-[80%] h-full border-none outline-none bg-transparent font-serif-text text-[13px] text-neutral-800 placeholder:text-transparent"
              aria-label="Search"
            />
          </div>

          {/* Interactive Icon Overlays */}
          <div className="flex items-center gap-1.5 xl:gap-2 ml-4" suppressHydrationWarning>
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              suppressHydrationWarning
              className="w-8 h-8 cursor-pointer flex items-center justify-center hover:bg-neutral-800/5 rounded-full transition-colors" 
              aria-label="Wishlist"
            />

            {/* Cart */}
            <Link 
              href="/cart" 
              suppressHydrationWarning
              className="w-8 h-8 cursor-pointer flex items-center justify-center relative hover:bg-neutral-800/5 rounded-full transition-colors" 
              aria-label="Cart"
            >
              {cartCount > 0 && (
                <span className="absolute top-[2px] right-[12px] bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link 
              href="/account"
              aria-label="Account"
              className="w-8 h-8 cursor-pointer flex items-center justify-center border-none bg-transparent outline-none hover:bg-neutral-800/5 rounded-full transition-colors text-neutral-700 hover:text-neutral-900"
              suppressHydrationWarning
            >
              <svg viewBox="1301 22 20 20" className="w-5 h-5 fill-current">
                <path d="M1304.85 37.1C1305.7 36.45 1306.65 35.9375 1307.7 35.5625C1308.75 35.1875 1309.85 35 1311 35C1312.15 35 1313.25 35.1875 1314.3 35.5625C1315.35 35.9375 1316.3 36.45 1317.15 37.1C1317.73 36.4167 1318.19 35.6417 1318.51 34.775C1318.84 33.9083 1319 32.9833 1319 32C1319 29.7833 1318.22 27.8958 1316.66 26.3375C1315.1 24.7792 1313.22 24 1311 24C1308.78 24 1306.9 24.7792 1305.34 26.3375C1303.78 27.8958 1303 29.7833 1303 32C1303 32.9833 1303.16 33.9083 1303.49 34.775C1303.81 35.6417 1304.27 36.4167 1304.85 37.1ZM1311 33C1310.02 33 1309.19 32.6625 1308.51 31.9875C1307.84 31.3125 1307.5 30.4833 1307.5 29.5C1307.5 28.5167 1307.84 27.6875 1308.51 27.0125C1309.19 26.3375 1311 26 1311 26C1311.98 26 1312.81 26.3375 1313.49 27.0125C1314.16 27.6875 1314.5 28.5167 1314.5 29.5C1314.5 30.4833 1314.16 31.3125 1313.49 31.9875C1312.81 32.6625 1311.98 33 1311 33ZM1311 42C1309.62 42 1308.32 41.7375 1307.1 41.2125C1305.88 40.6875 1304.83 39.975 1303.92 39.075C1303.02 38.175 1302.31 37.1167 1301.79 35.9C1301.26 34.6833 1301 33.3833 1301 32C1301 30.6167 1301.26 29.3167 1301.79 28.1C1302.31 26.8833 1303.02 25.825 1303.92 24.925C1304.83 24.025 1305.88 23.3125 1307.1 22.7875C1308.32 22.2625 1309.62 22 1311 22C1312.38 22 1313.68 22.2625 1314.9 22.7875C1316.12 23.3125 1317.18 24.025 1318.08 24.925C1318.98 25.825 1319.69 26.8833 1320.21 28.1C1320.74 29.3167 1321 30.6167 1321 32C1321 33.3833 1320.74 34.6833 1320.21 35.9C1319.69 37.1167 1318.98 38.175 1318.08 39.075C1317.18 39.975 1316.12 40.6875 1314.9 41.2125C1313.68 41.731 1312.38 42 1311 42Z" />
              </svg>
            </Link>
          </div>
        </div>

      </nav>
    </header>
  );
}
