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
    <header className="w-full px-6 py-4 flex justify-center items-center sticky top-3 z-50 animate-fade-up" suppressHydrationWarning>
      <nav className="relative w-full max-w-[1348px] h-16 rounded-[20px] bg-[#E5DCCB]/80 backdrop-blur-md overflow-hidden select-none border border-[#767677]/30 shadow-sm flex items-center justify-between px-6" suppressHydrationWarning>
        
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

        {/* 1. Logo - Left aligned in HTML to match the mockup */}
        <Link 
          href="/" 
          suppressHydrationWarning
          className="font-serif-title text-[22px] font-medium text-neutral-800 tracking-wide hover:opacity-75 transition-opacity z-10 mr-8"
        >
          Murakkaz
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
                <span className="absolute top-0 right-0 bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <button 
              aria-label="Account"
              className="w-8 h-8 cursor-pointer flex items-center justify-center border-none bg-transparent outline-none hover:bg-neutral-800/5 rounded-full transition-colors"
              suppressHydrationWarning
            />
          </div>
        </div>

      </nav>
    </header>
  );
}
