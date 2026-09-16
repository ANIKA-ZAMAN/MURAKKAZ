"use client";

import { useState } from "react";
import Link from "next/link";
import AeethodBadge from "./AeethodBadge";
import styles from "./Footer.module.css";

export default function Footer() {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });
  const [cookieSavedToast, setCookieSavedToast] = useState(false);

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
      <footer className={styles.footerWrapper}>
        <div className={styles.footerContainer}>
          <div className={styles.mainGrid}>
            
            {/* 1. Left Brand & Inquiries Column */}
            <div className={styles.leftCol}>
              <span className={styles.eyebrow}>CONTACT US</span>

              <h2 className={styles.heading}>
                Have Questions?<br />
                Let’s Talk Fragrance.
              </h2>

              {/* Schedule Call Button */}
              <div className={styles.callBtnWrapper}>
                <a
                  href="https://wa.me/8801997807701?text=Hello%20Murakkaz,%20I'd%20like%20to%20schedule%20a%20call%20about%20fragrances."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.callBtn}
                  style={{ backgroundColor: "#FAF7F2", color: "#2C2D30" }}
                >
                  <span style={{ color: "#2C2D30" }}>Schedule a call now</span>
                  <span style={{ color: "#2C2D30" }} className={styles.callArrow}>→</span>
                </a>
              </div>
            </div>

            {/* 2 & 3. Right Columns (Quick Link & Information) */}
            <div className={styles.rightColsWrapper}>
              {/* Quick Link Column */}
              <div className={styles.linksCol}>
                <h3 className={styles.colHeader}>QUICK LINK</h3>
                <ul className={styles.linkList}>
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
                      <Link href={item.href} className={styles.navItem}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Information & Socials Column */}
              <div className={styles.infoCol}>
                <h3 className={styles.colHeader}>INFORMATION</h3>
                <ul className={styles.linkList}>
                  <li>
                    <Link href="/terms" className={styles.navItem}>
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className={styles.navItem}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setIsCookieModalOpen(true)}
                      className={styles.actionItem}
                    >
                      Cookies Settings
                    </button>
                  </li>
                </ul>


              </div>
            </div>

          </div>

          {/* Bottom Attribution Row */}
          <div className={styles.bottomRow}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Murakkaz. All rights reserved.
            </p>
            <div>
              <AeethodBadge />
            </div>
          </div>
        </div>
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
