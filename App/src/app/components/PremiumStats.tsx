"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PremiumStats.module.css";

function getStartValue(target: number, decimals: number): number {
  if (decimals > 0) {
    return Math.max(0, target - 0.7);
  }
  if (target >= 1000) {
    return target - 60;
  }
  if (target >= 50) {
    return Math.max(0, target - 15);
  }
  return 0;
}

function CountUpNumber({ number, suffix = "", decimals = 0 }: { number: number; suffix?: string; decimals?: number }) {
  const startVal = getStartValue(number, decimals);
  const [count, setCount] = useState(startVal);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = startVal;
          const end = number;
          const duration = 1600;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + easeProgress * (end - start);
            
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [number, hasAnimated, startVal]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix === "★" ? (
        <span style={{ color: "#c5a880", marginLeft: "3px" }}>★</span>
      ) : (
        suffix
      )}
    </span>
  );
}

export default function PremiumStats() {
  const stats = [
    { number: 25000, suffix: "+", label: "Happy Customers" },
    { number: 4.9, suffix: "★", label: "Average Rating", decimals: 1 },
    { number: 50000, suffix: "+", label: "Orders Delivered" },
    { number: 64, suffix: " Districts", label: "Nationwide Delivery" },
  ];

  return (
    <aside className={styles.bookmarkWrapper} aria-label="Key Brand Statistics" suppressHydrationWarning>
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className={styles.bookmarkCard} 
          style={{ animationDelay: `${200 + idx * 200}ms` }}
        >
          {/* Gold Ribbon Stitch Line on left */}
          <div className={styles.ribbonStitch} />
          
          <div className={styles.bookmarkContent}>
            <div className={styles.statNumber}>
              <CountUpNumber number={stat.number} suffix={stat.suffix} decimals={stat.decimals} />
            </div>
            <div className={styles.statLabel}>
              <span>{stat.label}</span>
              <span className={styles.goldDot} />
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}


