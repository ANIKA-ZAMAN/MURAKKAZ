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
 * ScrollReveal — reveals children with a smooth animation when scrolled into view.
 *
 * IMPORTANT: Content is always VISIBLE by default (SSR-safe).
 * The "hidden" state is only applied client-side after mount, so if JS fails
 * or IntersectionObserver doesn't fire, content remains visible.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  variant = "fade-up",
  className = "",
}: ScrollRevealProps) {
  // Start as visible so content is never blank
  const [phase, setPhase] = useState<"idle" | "hidden" | "visible">("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("visible");
          observer.unobserve(currentRef);
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const rect = currentRef.getBoundingClientRect();
    
    // If element is below the initial fold or near viewport bottom
    if (rect.top > 100) {
      setPhase("hidden");
      observer.observe(currentRef);
    } else {
      // Element is at the top of the viewport on initial load
      setPhase("visible");
    }

    // Safety fallback: if still hidden after 2 seconds, force visible
    const fallbackTimer = setTimeout(() => {
      setPhase((prev) => (prev === "hidden" ? "visible" : prev));
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const variantClass = variant !== "none" ? styles[variant] || styles["fade-up"] : "";

  // "idle" = server render / before JS runs → fully visible, no animation classes
  // "hidden" = JS confirmed element is below viewport → apply hidden animation state
  // "visible" = element scrolled into view → apply visible animation state
  const animClass =
    phase === "idle"
      ? "" // No animation classes — content is fully visible
      : phase === "hidden"
      ? `${variantClass}` // Hidden state (opacity: 0, transform offset)
      : `${variantClass} ${styles.visible}`; // Visible state (opacity: 1, transform reset)

  return (
    <div
      ref={ref}
      className={`reveal ${styles.revealContainer} ${animClass} ${
        phase !== "hidden" ? "visible" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
