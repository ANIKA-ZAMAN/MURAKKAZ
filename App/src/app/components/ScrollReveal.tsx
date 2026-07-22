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

export default function ScrollReveal({
  children,
  delay = 0,
  variant = "fade-up",
  className = "",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const currentRef = ref.current;

    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (currentRef && observer) {
              observer.unobserve(currentRef);
            }
          }
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -60px 0px",
        }
      );

      if (currentRef) {
        observer.observe(currentRef);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const variantClass = variant !== "none" ? styles[variant] || styles["fade-up"] : "";

  return (
    <div
      ref={ref}
      className={`reveal ${styles.revealContainer} ${variantClass} ${
        isVisible ? `visible ${styles.visible}` : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}

