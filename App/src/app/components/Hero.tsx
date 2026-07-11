"use client";

import Link from "next/link";
import Image from "next/image";


// Separated Mock Data for easy replacement
export const heroData = {
  title: "Murakkaz",
  subheading: {
    prefix: "Luxury Inspired ",
    highlight: "Fragrances.",
    suffix: "Without The Luxury Price Tag"
  },
  description: "Handpicked and crafted by Murkkaz, inspired by the world's most iconic fragrances.",
  ctas: [
    { label: "Shop Collection", href: "/shop", isPrimary: true },
    { label: "Explore Scents", href: "/scent-index", isPrimary: false }
  ],
  perfumeImage: "/images/perfume-placeholder.png",
  perfumeAlt: "Murakkaz YSL Y Perfume Bottle"
};

export default function Hero() {
  const { title, subheading, description, ctas, perfumeImage, perfumeAlt } = heroData;

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-transparent py-8 md:py-12 select-none" suppressHydrationWarning>
      {/* 1. Main Huge Centered Heading */}
      <div className="w-full flex justify-center items-center px-4 mt-2 mb-10 md:mb-16 z-10 animate-fade-up" suppressHydrationWarning>
        <h1 className="font-serif-title font-bold tracking-[0.05em] text-center uppercase text-neutral-800 text-[10.5vw] leading-none select-none drop-shadow-sm" suppressHydrationWarning>
          {title}
        </h1>
      </div>

      {/* 2. Content Grid (Left and Right Columns) */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 z-10" suppressHydrationWarning>
        
        {/* Left Column: Heading, Description, CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-6 md:space-y-8 animate-fade-up animation-delay-200" suppressHydrationWarning>
          <h2 className="font-serif-title text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.15] font-medium text-neutral-800 tracking-tight" suppressHydrationWarning>
            {subheading.prefix}
            <span className="text-[#c5a880] italic">{subheading.highlight}</span>
            <br />
            {subheading.suffix}
          </h2>
          
          <p className="font-serif-text text-neutral-600 text-base sm:text-lg max-w-lg leading-relaxed" suppressHydrationWarning>
            {description}
          </p>

        </div>

        {/* Right Column: Large gold background circle SVG */}
        <div className="lg:col-span-6 relative flex justify-end items-end h-[400px] sm:h-[500px] lg:h-[600px] w-full animate-fade-up animation-delay-400" suppressHydrationWarning>
          <div className="absolute right-0 bottom-0 w-[120%] lg:w-[135%] h-auto z-0 translate-x-[5%] translate-y-[5%]" suppressHydrationWarning>
            <Image
              src="/images/hero-circle.svg"
              alt="Hero Circle"
              width={805}
              height={492}
              priority
              className="w-full h-auto object-contain object-right-bottom"
              suppressHydrationWarning
            />
          </div>



        </div>

      </div>
    </section>
  );
}
