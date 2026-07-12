"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-100px)] flex flex-col justify-between overflow-hidden bg-transparent py-8 select-none" suppressHydrationWarning>
      
      {/* 1. Main Huge Centered Heading */}
      <div className="w-full flex-1 flex justify-center items-center px-4 z-10 animate-fade-up" suppressHydrationWarning>
        <h1 
          className="font-serif-title font-normal tracking-[0.02em] text-center uppercase text-[#b29977] text-[13.5vw] leading-none select-none drop-shadow-sm" 
          suppressHydrationWarning
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          MURAKKAZ
        </h1>
      </div>

      {/* 2. Bottom Content Layout: Description on Left, Button Centered */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-end z-10 animate-fade-up animation-delay-200" suppressHydrationWarning>
        
        {/* Left Col: Description */}
        <div className="text-left max-w-xs" suppressHydrationWarning>
          <p 
            className="font-serif-text text-neutral-800 text-[14px] sm:text-base leading-relaxed"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          >
            Handpicked and crafted by Murkkaz, inspired by the world's most iconic fragrances.
          </p>
        </div>

        {/* Center Col: Shop Now Button */}
        <div className="flex justify-center" suppressHydrationWarning>
          <Link
            href="/shop"
            suppressHydrationWarning
            className="px-12 py-3.5 rounded-[14px] border border-[#4a4a4a] bg-transparent font-serif-text text-[15px] sm:text-[16px] text-[#4a4a4a] hover:bg-[#4a4a4a] hover:text-white transition-all duration-300 shadow-sm"
            style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          >
            Shop Now
          </Link>
        </div>

        {/* Right Col: Spacer for alignment */}
        <div className="hidden md:block" suppressHydrationWarning></div>

      </div>

    </section>
  );
}

