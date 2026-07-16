"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import styles from "./ScrollReveal.module.css";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

export default function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (ref.current && observer) {
              observer.unobserve(ref.current);
            }
          }
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -80px 0px"
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
