"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Shop", href: "/shop" },
  { label: "Event", href: "/events" },
  { label: "Library", href: "/" },
  { label: "Compare", href: "/compare" },
  { label: "Finder", href: "/scent-index" },
  { label: "Vlog", href: "/blog" },
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
    <header className="w-full px-6 py-4 flex justify-center items-center sticky top-0 z-50 animate-fade-up" suppressHydrationWarning>
      <nav className="w-full max-w-[1400px] h-16 flex items-center justify-between px-6 border border-neutral-400/30 rounded-2xl bg-[#E5DCCB]/40 backdrop-blur-md shadow-sm" suppressHydrationWarning>
        {/* Logo — Left */}
        <Link 
          href="/" 
          suppressHydrationWarning
          className="font-serif-title text-[22px] font-medium text-neutral-800 tracking-wide hover:opacity-75 transition-opacity mr-8"
        >
          Murakkaz
        </Link>

        {/* Nav Links — Center */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0 flex-1 justify-center" suppressHydrationWarning>
          {navLinks.map((link) => (
            <li key={link.label} suppressHydrationWarning>
              <Link
                href={link.href}
                suppressHydrationWarning
                className={`font-serif-text text-[13px] tracking-wide transition-colors ${
                  pathname === link.href 
                    ? "text-neutral-900 font-semibold" 
                    : "text-neutral-700 hover:text-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section — Search & Icons */}
        <div className="flex items-center gap-4 flex-shrink-0" suppressHydrationWarning>
          {/* Pill Search Bar */}
          <div className="flex items-center gap-2 px-4 h-9 rounded-full bg-neutral-800/5" suppressHydrationWarning>
            <svg 
              className="w-4 h-4 text-neutral-500 flex-shrink-0" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              type="text"
              className="border-none outline-none bg-transparent font-serif-text text-[13px] text-neutral-800 w-24 placeholder:text-neutral-400"
              placeholder="Search"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1.5" suppressHydrationWarning>
            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              suppressHydrationWarning
              className="flex items-center justify-center w-9 h-9 rounded-full text-neutral-700 hover:bg-neutral-800/5 transition-colors relative" 
              aria-label="Wishlist"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link 
              href="/cart" 
              suppressHydrationWarning
              className="flex items-center justify-center w-9 h-9 rounded-full text-neutral-700 hover:bg-neutral-800/5 transition-colors relative" 
              aria-label="Cart"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <button 
              className="flex items-center justify-center w-9 h-9 rounded-full text-neutral-700 hover:bg-neutral-800/5 transition-colors relative cursor-pointer" 
              aria-label="Account"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
