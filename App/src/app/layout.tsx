import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Lora, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Murakkaz — Luxury Perfumery & Concentrated Oils",
  description: "Experience the art of pure luxury perfumery, concentrated perfume oils, and bespoke fragrance compositions.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
};

import GlobalLayout from "./components/GlobalLayout";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import AnalyticsProvider from "./components/AnalyticsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable} ${ibmPlexSerif.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Libertinus+Serif+Display&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <Script id="hydration-fix" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const isDark = localStorage.getItem('pref-darkmode') === 'true';
                if (isDark) {
                  document.body.classList.add('dark-theme');
                }
                const isAmbient = localStorage.getItem('pref-ambient') === 'false';
                if (isAmbient) {
                  document.body.classList.add('no-ambient');
                }
              } catch (e) {}

              // Aggressively remove Next.js dev badge (N)
              const nukeDevBadge = () => {
                try {
                  const portal = document.querySelector('nextjs-portal');
                  if (portal) portal.remove();
                  const devTools = document.querySelector('#nextjs-dev-tools');
                  if (devTools) devTools.remove();
                } catch (e) {}
              };
              if (typeof window !== 'undefined') {
                window.addEventListener('DOMContentLoaded', nukeDevBadge);
                setInterval(nukeDevBadge, 150);
              }

              const ignoreAttrs = ['bis_skin_checked', 'cz-shortcut-listen', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'];
              const removeAttrs = (node) => {
                if (node.nodeType === 1) {
                  for (const attr of ignoreAttrs) {
                    if (node.hasAttribute(attr)) {
                      node.removeAttribute(attr);
                    }
                  }
                }
                let child = node.firstChild;
                while (child) {
                  removeAttrs(child);
                  child = child.nextSibling;
                }
              };
              
              // Run initial cleanup on existing DOM
              removeAttrs(document.documentElement);
              
              // Observe future changes (e.g. extension injections after load)
              const observer = new MutationObserver((mutations) => {
                nukeDevBadge();
                for (const mutation of mutations) {
                  if (mutation.type === 'attributes' && ignoreAttrs.includes(mutation.attributeName)) {
                    const target = mutation.target;
                    if (target.nodeType === 1 && target.hasAttribute(mutation.attributeName)) {
                      target.removeAttribute(mutation.attributeName);
                    }
                  } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(removeAttrs);
                  }
                }
              });
              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ignoreAttrs
              });
            })();
          `}
        </Script>
        <SmoothScrollProvider>
          <AnalyticsProvider>
            <GlobalLayout>
              {children}
            </GlobalLayout>
          </AnalyticsProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
