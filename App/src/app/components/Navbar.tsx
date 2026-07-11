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
    <header className="w-full px-6 py-4 flex justify-center items-center sticky top-0 z-50 animate-fade-up" suppressHydrationWarning>
      <nav className="relative w-full max-w-[1348px] h-16 rounded-[20px] bg-[#E5DCCB]/80 backdrop-blur-md overflow-hidden select-none" suppressHydrationWarning>
        
        {/* SVG background containing visual paths of links, logo, and icons */}
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

        {/* Workable overlays (aligned by percentage position relative to 1348px viewBox) */}
        <div className="absolute inset-0 z-10 w-full h-full" suppressHydrationWarning>
          
          {/* Logo overlay: Link to home "/" */}
          <Link
            href="/"
            aria-label="Home"
            className="absolute left-[1.5%] top-0 h-full w-[10%] cursor-pointer"
            suppressHydrationWarning
          />

          {/* Links overlay */}
          {/* Our Story */}
          <Link
            href="/our-story"
            className="absolute left-[20.8%] top-0 h-full w-[7%] cursor-pointer"
            suppressHydrationWarning
          />

          {/* Shop */}
          <Link
            href="/shop"
            className="absolute left-[28.5%] top-0 h-full w-[4.5%] cursor-pointer"
            suppressHydrationWarning
          />

          {/* Event */}
          <Link
            href="/events"
            className="absolute left-[34.4%] top-0 h-full w-[4.5%] cursor-pointer"
            suppressHydrationWarning
          />

          {/* Compare */}
          <Link
            href="/compare"
            className="absolute left-[47.2%] top-0 h-full w-[6.5%] cursor-pointer"
            suppressHydrationWarning
          />

          {/* Finder */}
          <Link
            href="/scent-index"
            className="absolute left-[54.8%] top-0 h-full w-[5.5%] cursor-pointer"
            suppressHydrationWarning
          />

          {/* Vlog */}
          <Link
            href="/blog"
            className="absolute left-[61.5%] top-0 h-full w-[4.5%] cursor-pointer"
            suppressHydrationWarning
          />

          {/* Search Input overlay */}
          <div className="absolute left-[78.8%] top-[20%] w-[10%] h-[60%] flex items-center" suppressHydrationWarning>
            <input
              type="text"
              placeholder="Search"
              className="w-full h-full border-none outline-none bg-transparent font-serif-text text-[13px] text-neutral-800 placeholder:text-transparent"
              aria-label="Search"
            />
          </div>

          {/* Icons overlay */}
          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="absolute left-[90.0%] top-0 h-full w-[3%] cursor-pointer flex items-center justify-center"
            suppressHydrationWarning
          />

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="absolute left-[93.0%] top-0 h-full w-[3%] cursor-pointer flex items-center justify-center"
            suppressHydrationWarning
          >
            {cartCount > 0 && (
              <span className="absolute top-[14px] right-[10%] bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <button
            aria-label="Account"
            className="absolute left-[96.0%] top-0 h-full w-[3%] cursor-pointer flex items-center justify-center border-none bg-transparent outline-none"
            suppressHydrationWarning
          />

        </div>
      </nav>
    </header>
  );
}
