"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import AeethodBadge from "./AeethodBadge";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });
  const [cookieSavedToast, setCookieSavedToast] = useState(false);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText("re@murakkaz.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleSaveCookies = () => {
    try {
      localStorage.setItem("murakkaz_cookie_preferences", JSON.stringify(cookieSettings));
    } catch {
      // ignore
    }
    setIsCookieModalOpen(false);
    setCookieSavedToast(true);
    setTimeout(() => setCookieSavedToast(false), 2500);
  };

  return (
    <>
      <footer className="w-full bg-[#2C2D30] text-[#F5EFEB] relative overflow-hidden select-none border-t border-white/5">
        <ScrollReveal variant="fade-up">
          <div className="max-w-[1360px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 lg:gap-8">
              
              {/* Left Column: Heading, Call CTA, Email copy */}
              <div className="flex-1 max-w-xl">
                {/* Eyebrow */}
                <span className="font-serif text-[11px] sm:text-[12px] tracking-[0.2em] uppercase text-[#C5A880]/90 font-medium block">
                  CONTRACT US
                </span>

                {/* Main Headline */}
                <h2 className="font-serif-title text-[34px] sm:text-[42px] lg:text-[48px] font-normal leading-[1.14] text-[#FAF7F2] mt-3 sm:mt-4 tracking-[-0.01em]">
                  Have Questions?<br />
                  Let’s Talk Fragrance.
                </h2>

                {/* Schedule a call now Button */}
                <div className="mt-7 sm:mt-8">
                  <a
                    href="https://wa.me/8801997807701?text=Hello%20Murakkaz,%20I'd%20like%20to%20schedule%20a%20call%20about%20fragrances."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 px-7 py-3 sm:py-3.5 rounded-full bg-[#FAF7F2] text-[#2C2D30] text-[14px] sm:text-[14.5px] font-medium tracking-[0.02em] transition-all duration-200 hover:bg-white hover:shadow-[0_4px_20px_rgba(250,247,242,0.25)] active:scale-[0.98]"
                  >
                    <span>Schedule a call now</span>
                    <span className="text-[17px] leading-none transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </a>
                </div>

                {/* Or Email Us At Section */}
                <div className="mt-8 sm:mt-10">
                  <span className="font-serif text-[11px] sm:text-[11.5px] tracking-[0.18em] uppercase text-[#9B9589] font-medium block mb-3">
                    OR EMAIL US AT
                  </span>

                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/20 bg-white/[0.04] hover:border-white/40 hover:bg-white/[0.08] transition-all duration-200 group">
                    <a
                      href="mailto:re@murakkaz.com"
                      className="text-[13.5px] sm:text-[14px] text-[#FAF7F2]/90 hover:text-white font-mono tracking-wide transition-colors"
                    >
                      re@murakkaz.com
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-[#FAF7F2]/60 hover:text-[#FAF7F2] transition-colors p-1 cursor-pointer focus:outline-none flex items-center justify-center"
                      aria-label="Copy email address"
                      title="Copy email to clipboard"
                    >
                      {copied ? (
                        <span className="text-[11.5px] text-[#C5A880] font-sans font-medium flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        <svg className="w-4 h-4 transition-transform duration-150 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Columns: Quick Link & Information */}
              <div className="grid grid-cols-2 gap-10 sm:gap-14 lg:gap-20 xl:gap-24 shrink-0 lg:pt-2">
                
                {/* Column 1: QUICK LINK */}
                <div>
                  <h3 className="font-serif text-[13.5px] sm:text-[14.5px] tracking-[0.16em] uppercase text-[#E8DFC8] font-medium mb-5 sm:mb-6">
                    QUICK LINK
                  </h3>
                  <ul className="space-y-2.5 sm:space-y-3 list-none p-0 m-0">
                    {[
                      { label: "Home", href: "/" },
                      { label: "Our Story", href: "/our-story" },
                      { label: "Shop", href: "/shop" },
                      { label: "Event", href: "/events" },
                      { label: "Library", href: "/collections" },
                      { label: "Compare", href: "/compare" },
                      { label: "Finder", href: "/scent-index" },
                      { label: "Vlog", href: "/blog" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className="font-serif-text text-[13.5px] sm:text-[14px] text-[#A69F93] hover:text-[#FAF7F2] transition-colors duration-200 block"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: INFORMATION */}
                <div>
                  <h3 className="font-serif text-[13.5px] sm:text-[14.5px] tracking-[0.16em] uppercase text-[#E8DFC8] font-medium mb-5 sm:mb-6">
                    INFORMATION
                  </h3>
                  <ul className="space-y-2.5 sm:space-y-3 list-none p-0 m-0">
                    <li>
                      <Link
                        href="/terms"
                        className="font-serif-text text-[13.5px] sm:text-[14px] text-[#A69F93] hover:text-[#FAF7F2] transition-colors duration-200 block"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy"
                        className="font-serif-text text-[13.5px] sm:text-[14px] text-[#A69F93] hover:text-[#FAF7F2] transition-colors duration-200 block"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setIsCookieModalOpen(true)}
                        className="font-serif-text text-[13.5px] sm:text-[14px] text-[#A69F93] hover:text-[#FAF7F2] transition-colors duration-200 block text-left cursor-pointer p-0 bg-transparent border-0"
                      >
                        Cookies Settings
                      </button>
                    </li>
                  </ul>

                  {/* Social Media Icons Box */}
                  <div className="mt-7 sm:mt-8">
                    <div className="inline-flex items-center gap-4 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-white/20 bg-white/[0.04]">
                      {/* Facebook */}
                      <a
                        href="https://facebook.com/murakkaz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A69F93] hover:text-[#FAF7F2] hover:scale-110 transition-all duration-200"
                        aria-label="Facebook"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5c0-.988.293-1.49 1.5-1.49H17V2.14c-.658-.088-1.704-.14-2.802-.14-3.267 0-5 1.776-5 5.2v2.31H6.198v3.98H9.198v8.01z" />
                        </svg>
                      </a>

                      {/* Instagram */}
                      <a
                        href="https://instagram.com/murakkaz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A69F93] hover:text-[#FAF7F2] hover:scale-110 transition-all duration-200"
                        aria-label="Instagram"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>

                      {/* X (formerly Twitter) */}
                      <a
                        href="https://x.com/murakkaz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A69F93] hover:text-[#FAF7F2] hover:scale-110 transition-all duration-200"
                        aria-label="X (formerly Twitter)"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>

                      {/* YouTube */}
                      <a
                        href="https://youtube.com/@murakkaz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A69F93] hover:text-[#FAF7F2] hover:scale-110 transition-all duration-200"
                        aria-label="YouTube"
                      >
                        <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Agency Attribution Row & Copyright */}
            <div className="mt-14 sm:mt-18 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[12px] text-[#8C867B] font-serif-text">
                © {new Date().getFullYear()} Murakkaz. All rights reserved.
              </p>
              <div>
                <AeethodBadge />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </footer>

      {/* Cookies Settings Modal */}
      {isCookieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FAF7F2] rounded-2xl p-6 sm:p-7 shadow-2xl border border-[#D4C0A7] text-[#313134]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
              <h4 className="font-serif text-[18px] text-[#313134] font-medium">Cookie Preferences</h4>
              <button
                type="button"
                onClick={() => setIsCookieModalOpen(false)}
                className="text-[#8A8477] hover:text-[#313134] p-1 text-[18px] cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-[13px] text-[#6A6458] mt-3 leading-relaxed font-serif-text">
              We use cookies to personalize content, understand site performance, and ensure smooth fragrance shopping.
            </p>

            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-[#E2D5C3]">
                <div>
                  <span className="text-[13.5px] font-medium block">Essential Cookies</span>
                  <span className="text-[11.5px] text-[#8A8477]">Required for cart, checkout, and security.</span>
                </div>
                <input type="checkbox" checked disabled className="accent-[#820011]" />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-[#E2D5C3] cursor-pointer">
                <div>
                  <span className="text-[13.5px] font-medium block">Performance & Analytics</span>
                  <span className="text-[11.5px] text-[#8A8477]">Helps us improve website experience.</span>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.analytics}
                  onChange={(e) => setCookieSettings({ ...cookieSettings, analytics: e.target.checked })}
                  className="accent-[#820011] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-[#E2D5C3] cursor-pointer">
                <div>
                  <span className="text-[13.5px] font-medium block">Marketing Preferences</span>
                  <span className="text-[11.5px] text-[#8A8477]">Offers tailored fragrance recommendations.</span>
                </div>
                <input
                  type="checkbox"
                  checked={cookieSettings.marketing}
                  onChange={(e) => setCookieSettings({ ...cookieSettings, marketing: e.target.checked })}
                  className="accent-[#820011] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setIsCookieModalOpen(false)}
                className="px-4 py-2 rounded-full text-[13px] text-[#6A6458] hover:text-[#313134] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCookies}
                className="px-5 py-2 rounded-full bg-[#820011] text-white text-[13px] font-medium hover:bg-[#6c000e] transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Toast */}
      {cookieSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#313134] text-[#FAF7F2] px-4 py-2.5 rounded-xl shadow-lg border border-[#C5A880]/40 text-[13px] flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>Cookie preferences saved</span>
        </div>
      )}
    </>
  );
}

