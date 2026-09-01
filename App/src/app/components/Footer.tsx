"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import AeethodBadge from "./AeethodBadge";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ScrollReveal variant="fade-up">
        <div className={styles.container} suppressHydrationWarning>
          <Image
            src="/images/footer_m.svg"
            alt="Murakkaz Footer"
            width={1440}
            height={372}
            className={styles.footerSvg}
            priority
          />

          {/* Footer Agency Attribution Row */}
          <div className={styles.badgeRow}>
            <AeethodBadge />
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
