"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PremiumStats.module.css";

function CountUpNumber({ number, suffix = "", decimals = 0 }: { number: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = 0;
          const end = number;
          const duration = 3500; // Luxurious, smooth & low 3.5s duration
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ultra-smooth Ease Out Quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
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
  }, [number, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix === "★" ? (
        <span style={{ color: "#c5a880", marginLeft: "2px" }}>★</span>
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
    <section className={styles.statsSection} suppressHydrationWarning>
      <div className={styles.statsContainer}>
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={styles.statItem} 
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={styles.statNumber}>
              <CountUpNumber number={stat.number} suffix={stat.suffix} decimals={stat.decimals} />
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
