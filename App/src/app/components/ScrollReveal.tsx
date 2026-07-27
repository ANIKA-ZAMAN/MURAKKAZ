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

    // If the element is already in the viewport, skip the animation entirely
    const rect = currentRef.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50) {
      setPhase("visible");
      return;
    }

    // Element is below the viewport — hide it, then reveal on scroll
    setPhase("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("visible");
          observer.unobserve(currentRef);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "80px 0px 0px 0px",
      }
    );

    observer.observe(currentRef);

    // Safety fallback: if still hidden after 3 seconds, force visible
    const fallbackTimer = setTimeout(() => {
      setPhase((prev) => (prev === "hidden" ? "visible" : prev));
    }, 3000);

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
