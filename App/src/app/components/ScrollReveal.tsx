"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import styles from "./ScrollReveal.module.css";

export type RevealVariant = "fade-up" | "scale-fade" | "slide-horizontal" | "spotlight-reveal" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
}

/**
 * ScrollReveal — smooth, performance-optimized viewport entrance animations.
 * Triggers once when the element scrolls into view with cubic-bezier(0.22, 1, 0.36, 1).
 */
export default function ScrollReveal({
  children,
  delay = 0,
  variant = "fade-up",
  className = "",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guarantee visibility across all devices & live server deployments
    setIsVisible(true);

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "250px 0px 250px 0px",
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const variantClass = variant !== "none" ? styles[variant] || styles["fade-up"] : "";

  return (
    <div
      ref={ref}
      className={`reveal ${styles.revealContainer} ${variantClass} ${
        isVisible ? `${styles.visible} visible` : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
