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

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4" suppressHydrationWarning>
            {ctas.map((cta) => (
              <Link 
                key={cta.label}
                href={cta.href} 
                suppressHydrationWarning
                style={
                  cta.isPrimary
                    ? { color: "#E5DCCB", backgroundColor: "#313134" }
                    : { color: "#313134", borderColor: "rgba(49, 49, 52, 0.35)" }
                }
                className={
                  cta.isPrimary
                    ? "px-9 py-4 transition-all duration-300 font-serif-text text-[11px] rounded-full tracking-[0.18em] uppercase font-medium border border-transparent hover:border-luxury-gold/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    : "px-9 py-4 border transition-all duration-300 font-serif-text text-[11px] rounded-full tracking-[0.18em] uppercase font-medium hover:bg-neutral-800/5 hover:-translate-y-0.5 active:translate-y-0"
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Large gold background circle & perfume bottle image */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center h-[400px] sm:h-[500px] lg:h-[600px] w-full animate-fade-up animation-delay-400" suppressHydrationWarning>
          
          {/* Gold Circle Graphic & Rings */}
          <div className="absolute right-[-10%] bottom-[-15%] w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] lg:w-[550px] lg:h-[550px] rounded-full bg-gradient-to-tr from-[#a38258] via-[#c5a880] to-[#e4d3b8] shadow-2xl opacity-90" suppressHydrationWarning>
            {/* Concentric Gold Ring 1 (Inner Outermost) */}
            <div className="absolute -inset-6 border border-[#c5a880]/50 rounded-full pointer-events-none scale-102" suppressHydrationWarning></div>
            
            {/* Concentric Gold Ring 2 (Outer Outermost) */}
            <div className="absolute -inset-12 border border-[#c5a880]/30 rounded-full pointer-events-none scale-105" suppressHydrationWarning></div>

            {/* Concentric Gold Ring 3 (Delicate Offset) */}
            <div className="absolute -inset-18 border border-[#c5a880]/15 rounded-full pointer-events-none scale-108 -translate-x-4 -translate-y-4" suppressHydrationWarning></div>
          </div>



        </div>

      </div>
    </section>
  );
}
