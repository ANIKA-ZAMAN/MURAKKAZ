"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import AccountDrawer from "./AccountDrawer";

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
  const [cartCount, setCartCount] = useState(0);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  if (isHome) {
    // 1. Homepage Navbar: Clean, transparent background, custom outline SVG elements and pill search input, no border/box.
    return (
      <header className="w-full px-12 md:px-20 pt-10 pb-4 flex justify-center items-center sticky top-0 z-50 animate-fade-up bg-transparent" suppressHydrationWarning>
        <nav className="w-full max-w-[1400px] select-none flex items-center justify-between bg-transparent" suppressHydrationWarning>
          
          {/* Logo - Clickable red SVG logo */}
          <Link 
            href="/" 
            suppressHydrationWarning
            className="hover:opacity-75 transition-opacity z-10 flex items-center"
          >
            <Image
              src="/images/logo-murakkaz.svg"
              alt="Murakkaz Logo"
              width={116}
              height={50}
              priority
              className="h-10 w-auto object-contain"
              suppressHydrationWarning
            />
          </Link>

          {/* Menu Links */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none m-0 p-0 flex-1 justify-center z-10" suppressHydrationWarning>
            {homeNavLinks.map((link) => (
              <li key={link.label} suppressHydrationWarning>
                <Link
                  href={link.href}
                  suppressHydrationWarning
                  className={`font-serif-text text-[14px] tracking-wide transition-colors ${
                    pathname === link.href 
                      ? "text-neutral-900 font-semibold" 
                      : "text-neutral-700 hover:text-neutral-900 hover:font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center z-10 flex-shrink-0" suppressHydrationWarning>
            {/* Pill Search Input */}
            <div className="relative flex items-center" suppressHydrationWarning>
              <input
                type="text"
                placeholder="Search"
                className="w-[160px] xl:w-[180px] h-9 pr-3 rounded-full border border-neutral-700 bg-transparent font-serif-text text-[13px] text-neutral-800 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-800 transition-colors"
                style={{ paddingLeft: "34px" }}
                aria-label="Search"
              />
              <svg
                className="absolute left-3 w-4 h-4 text-neutral-600 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Custom Outline Icons */}
            <div className="flex items-center gap-2 xl:gap-3 ml-4" suppressHydrationWarning>
              {/* Wishlist */}
              <Link 
                href="/wishlist" 
                suppressHydrationWarning
                className="w-9 h-9 cursor-pointer flex items-center justify-center hover:bg-neutral-800/5 rounded-full transition-colors" 
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </Link>

              {/* Cart */}
              <Link 
                href="/cart" 
                suppressHydrationWarning
                className="w-9 h-9 cursor-pointer flex items-center justify-center relative hover:bg-neutral-800/5 rounded-full transition-colors" 
                aria-label="Cart"
              >
                <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-[2px] right-[2px] bg-[#820011] text-white font-serif-text text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none shadow-sm" suppressHydrationWarning>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <button 
                aria-label="Account"
                className="w-9 h-9 cursor-pointer flex items-center justify-center border-none bg-transparent outline-none hover:bg-neutral-800/5 rounded-full transition-colors"
                onClick={() => setIsAccountOpen(true)}
                suppressHydrationWarning
              >
                <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

        </nav>
        {mounted && <AccountDrawer isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />}
      </header>
    );
  }

  // 2. Other Pages Navbar: Bordered layout with mockup background SVG navbar-m.svg
  return (
    <header className="w-full px-6 py-4 flex justify-center items-center sticky top-3 z-50 animate-fade-up" suppressHydrationWarning>
      <nav className="relative w-full max-w-[1348px] h-16 rounded-[20px] bg-[#E5DCCB]/80 backdrop-blur-md overflow-hidden select-none flex items-center justify-between px-6" suppressHydrationWarning>
        
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

        {/* Right Section spacer & overlay icons aligning with background SVG */}
        <div className="flex items-center z-10 flex-shrink-0" suppressHydrationWarning>
          <div className="w-[160px] xl:w-[180px] h-9 relative mr-2" suppressHydrationWarning>
            <input
              type="text"
              placeholder="Search"
              className="absolute left-[15%] top-0 w-[80%] h-full border-none outline-none bg-transparent font-serif-text text-[13px] text-neutral-800 placeholder:text-transparent"
              aria-label="Search"
            />
          </div>

          <div className="flex items-center gap-1.5 xl:gap-2 ml-4" suppressHydrationWarning>
            <Link 
              href="/wishlist" 
              suppressHydrationWarning
              className="w-8 h-8 cursor-pointer flex items-center justify-center hover:bg-neutral-800/5 rounded-full transition-colors" 
              aria-label="Wishlist"
            />

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

            <Link 
              href="/account"
              aria-label="Account"
              className="w-8 h-8 cursor-pointer flex items-center justify-center border-none bg-transparent outline-none hover:bg-neutral-800/5 rounded-full transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setIsAccountOpen(true);
              }}
              suppressHydrationWarning
            />
          </div>
        </div>

      </nav>
      {mounted && <AccountDrawer isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />}
    </header>
  );
}
