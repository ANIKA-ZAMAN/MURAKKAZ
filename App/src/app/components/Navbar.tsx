"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const [cartCount, setCartCount] = useState(0);
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
                className="w-8 h-8 block cursor-pointer hover:bg-neutral-800/5 rounded-full transition-colors" 
                aria-label="Wishlist"
              >
                <span className="sr-only">Wishlist</span>
              </Link>

              <Link 
                href="/cart" 
                suppressHydrationWarning
                className="w-8 h-8 block relative cursor-pointer hover:bg-neutral-800/5 rounded-full transition-colors" 
                aria-label="Cart"
              >
                <span className="sr-only">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-[2px] right-[12px] bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link 
                href="/account"
                aria-label="Account"
                className="w-8 h-8 block cursor-pointer border-none bg-transparent outline-none hover:bg-neutral-800/5 rounded-full transition-colors"
                suppressHydrationWarning
              >
                <span className="sr-only">Account</span>
              </Link>
            </div>
          </div>

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
              className="w-8 h-8 block cursor-pointer hover:bg-neutral-800/5 rounded-full transition-colors" 
              aria-label="Wishlist"
            >
              <span className="sr-only">Wishlist</span>
            </Link>

            <Link 
              href="/cart" 
              suppressHydrationWarning
              className="w-8 h-8 block relative cursor-pointer hover:bg-neutral-800/5 rounded-full transition-colors" 
              aria-label="Cart"
            >
              <span className="sr-only">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-[2px] right-[12px] bg-[#820011] text-white font-serif-text text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center pointer-events-none shadow" suppressHydrationWarning>
                  {cartCount}
                </span>
              )}
            </Link>

            <Link 
              href="/account"
              aria-label="Account"
              className="w-8 h-8 block cursor-pointer border-none bg-transparent outline-none hover:bg-neutral-800/5 rounded-full transition-colors"
              suppressHydrationWarning
            >
              <span className="sr-only">Account</span>
            </Link>
          </div>
        </div>

      </nav>
    </header>
  );
}
