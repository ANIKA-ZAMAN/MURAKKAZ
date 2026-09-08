import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Murakkaz Luxury Perfumes",
  description: "Terms and conditions governing the purchase and use of Murakkaz fragrances and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#313134] py-16 sm:py-24 px-6 sm:px-12 md:px-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <span className="text-[12px] uppercase tracking-[0.2em] text-[#820011] font-medium font-serif block mb-2">
          Legal Agreement
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#2B2B2E]">
          Terms of Service
        </h1>
        <p className="text-sm text-[#8A8477] mt-3 font-serif-text">
          Last Updated: January 2026
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 font-serif-text text-[15px] sm:text-[16px] leading-relaxed text-[#4A4A4C]">
        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or purchasing from Murakkaz (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our online boutique.
          </p>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">2. Fragrance Authenticity & Quality</h2>
          <p>
            Murakkaz formulates premium extrait and artisanal fragrance interpretations using high-grade imported aroma compounds. Product descriptions, scent notes, and longevity meters represent our artistic olfactory expressions.
          </p>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">3. Orders, Pricing & Delivery</h2>
          <p>
            All prices are listed in Bangladeshi Taka (BDT). We reserve the right to modify prices or discontinue scents without prior notice. Delivery timelines within Dhaka are typically 24–48 hours, and nationwide outside Dhaka within 2–4 business days via registered courier partners (e.g. Steadfast Courier).
          </p>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">4. Return & Replacement Policy</h2>
          <p>
            Due to the hygienic nature of fine perfumery, opened or sprayed fragrance bottles cannot be returned. If a bottle arrives physically damaged or leaked in transit, notify us within 24 hours of delivery with photographic evidence for an immediate replacement.
          </p>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">5. Inquiries & Support</h2>
          <p>
            For any questions regarding your orders or these terms, please reach out to us at{" "}
            <a href="mailto:re@murakkaz.com" className="text-[#820011] underline font-medium">
              re@murakkaz.com
            </a>{" "}
            or message our concierge line on WhatsApp.
          </p>
        </section>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#820011] text-white text-[14px] font-medium hover:bg-[#6c000e] transition-colors"
        >
          ← Return to Boutique
        </Link>
      </div>
    </div>
  );
}
