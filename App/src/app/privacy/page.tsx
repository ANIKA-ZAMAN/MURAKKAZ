import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Murakkaz Luxury Perfumes",
  description: "Privacy policy detailing how Murakkaz collects, uses, and protects customer personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#313134] py-16 sm:py-24 px-6 sm:px-12 md:px-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <span className="text-[12px] uppercase tracking-[0.2em] text-[#820011] font-medium font-serif block mb-2">
          Customer Privacy
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#2B2B2E]">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#8A8477] mt-3 font-serif-text">
          Effective Date: January 2026
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 font-serif-text text-[15px] sm:text-[16px] leading-relaxed text-[#4A4A4C]">
        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">1. Information We Collect</h2>
          <p>
            When you browse Murakkaz, place an order, or register an account, we collect necessary personal details such as your full name, shipping address, contact phone number, and email address. Payment details are processed through encrypted, compliant gateways and are never stored in raw form on our servers.
          </p>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">2. How We Use Your Information</h2>
          <p>
            We use customer information exclusively to fulfill fragrance orders, dispatch real-time Steadfast courier tracking updates, coordinate deliveries, and provide dedicated customer concierge support.
          </p>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">3. Data Protection & Confidentiality</h2>
          <p>
            Your personal information is confidential. We do not sell, rent, or trade customer data to any third parties. Access to order data is strictly restricted to operational personnel handling packing and delivery.
          </p>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">4. Cookies & Preferences</h2>
          <p>
            We use necessary and preference cookies to maintain your shopping cart, wish list, and member login session. You can manage or adjust your cookie preferences at any time using the &quot;Cookies Settings&quot; control in our boutique footer.
          </p>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 sm:p-8 border border-[#E2D5C3] shadow-xs">
          <h2 className="font-serif text-xl sm:text-2xl text-[#2B2B2E] mb-3">5. Contact Our Privacy Officer</h2>
          <p>
            If you wish to review, update, or request the deletion of your personal account details, please email us at{" "}
            <a href="mailto:re@murakkaz.com" className="text-[#820011] underline font-medium">
              re@murakkaz.com
            </a>.
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
