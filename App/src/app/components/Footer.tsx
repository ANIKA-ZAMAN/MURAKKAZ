"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.container} suppressHydrationWarning>
        <Image
          src="/images/footer_m.svg"
          alt="Murakkaz Footer"
          width={1440}
          height={372}
          className={styles.footerSvg}
          priority
        />
      </div>
    </footer>
  );
}


