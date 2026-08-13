"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable JS scroll hijacking on mobile & tablet touch devices for native 120Hz/60Hz touch scrolling and instant page transitions
    const isMobileOrTablet =
      typeof window !== "undefined" &&
      (window.innerWidth <= 1024 || "ontouchstart" in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    if (isMobileOrTablet) {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      }
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential decay smoothing
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      autoResize: true,
    });

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Pass time (converted to ms) to Lenis raf
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    // Keep standard lag smoothing to prevent scroll lock during frame drops
    gsap.ticker.lagSmoothing(1000, 16);

    // Keep Lenis scroll metrics synchronized when page content size changes dynamically
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    const handleWindowResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("load", handleWindowResize);
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

