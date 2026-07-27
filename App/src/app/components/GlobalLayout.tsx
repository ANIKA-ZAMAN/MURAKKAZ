"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const [paddingTop, setPaddingTop] = useState(116);

  const isHome = pathname === "/";

  useEffect(() => {
    const updatePadding = () => {
      if (headerRef.current) {
        const headerEl = headerRef.current.querySelector("header") || headerRef.current;
        const rect = headerEl.getBoundingClientRect();
        const gap = 36;
        const calculatedPadding = Math.round(rect.height + gap);
        if (calculatedPadding > 0) {
          setPaddingTop(calculatedPadding);
        }
      }
    };

    updatePadding();

    let resizeObserver: ResizeObserver | null = null;
    if (headerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updatePadding();
      });
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("resize", updatePadding);

    return () => {
      window.removeEventListener("resize", updatePadding);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }} suppressHydrationWarning>
      <div ref={headerRef} className="w-full">
        <Navbar />
      </div>

      <main 
        style={{ paddingTop: isHome ? "0px" : `${paddingTop}px` }} 
        className="flex-1 w-full transition-[padding-top] duration-200 ease-out" 
        suppressHydrationWarning
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
