import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Lora } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Murakkaz",
  description: "Recreated UI from elements design references",
};

import SmoothScrollProvider from "./components/SmoothScrollProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable}`} suppressHydrationWarning>
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
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }} suppressHydrationWarning>
            <Navbar />
            {children}
            <Footer />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
