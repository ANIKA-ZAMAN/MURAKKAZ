"use client";

import { useState } from "react";
import Link from "next/link";
import AeethodBadge from "./AeethodBadge";
import styles from "./Footer.module.css";

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
      <footer className={styles.footerWrapper}>
        <div className={styles.footerContainer}>
          <div className={styles.mainGrid}>
            
            {/* 1. Left Brand & Inquiries Column */}
            <div className={styles.leftCol}>
              <span className={styles.eyebrow}>CONTRACT US</span>

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

              {/* Email Us At */}
              <div className={styles.emailSection}>
                <span className={styles.emailLabel}>OR EMAIL US AT</span>

                <div className={styles.emailPill}>
                  <a
                    href="mailto:re@murakkaz.com"
                    className={styles.emailText}
                  >
                    re@murakkaz.com
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={styles.copyBtn}
                    aria-label="Copy email address"
                    title="Copy email to clipboard"
                  >
                    {copied ? (
                      <span className={styles.copiedBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied!
                      </span>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Quick Link Column */}
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

            {/* 3. Information & Socials Column */}
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

              {/* Social Media Box */}
              <div className={styles.socialWrapper}>
                <div className={styles.socialBox}>
                  {/* Facebook */}
                  <a
                    href="https://facebook.com/murakkaz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    aria-label="Facebook"
                  >
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5c0-.988.293-1.49 1.5-1.49H17V2.14c-.658-.088-1.704-.14-2.802-.14-3.267 0-5 1.776-5 5.2v2.31H6.198v3.98H9.198v8.01z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/murakkaz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    aria-label="Instagram"
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
                    className={styles.socialIcon}
                    aria-label="X (formerly Twitter)"
                  >
                    <svg width="13.5" height="13.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@murakkaz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    aria-label="YouTube"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
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
