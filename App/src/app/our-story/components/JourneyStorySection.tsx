"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "./JourneyStorySection.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 5 milestone beads (01 through 05)
const MILESTONE_BEADS = [
  { id: "01", index: 0 },
  { id: "02", index: 1 },
  { id: "03", index: 2 },
  { id: "04", index: 3 },
  { id: "05", index: 4 },
];

// Rail center & radius geometry matching Picture 2 (Top = 138,156, Center = 263,363, Bottom = 138,563)
const XC = 40;
const YC = 363.171;
const R = 223;
const ANGLE_SPACING_DEG = 62; // Spacious 62° arc spacing matching reference image 2 exactly

/** Convert track angle (degrees, 0° = center reading position) to SVG (X, Y) coordinates */
const getRailPos = (angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: XC + R * Math.cos(rad),
    y: YC + R * Math.sin(rad),
  };
};

export default function JourneyStorySection() {
  const { journeySections } = ourStoryData;
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const beadRefs = useRef<(SVGGElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const goToStep = (stepIndex: number) => {
    const clamped = Math.max(0, Math.min(journeySections.length - 1, stepIndex));
    setActiveIdx(clamped);
  };

  // GSAP ScrollTrigger pinning & scroll-driven step progression
  useEffect(() => {
    if (!sectionRef.current) return;

    const totalSteps = journeySections.length;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${totalSteps * 85}%`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const step = Math.min(
          totalSteps - 1,
          Math.floor(self.progress * totalSteps)
        );
        setActiveIdx((prev) => (prev !== step ? step : prev));
      },
    });

    return () => {
      trigger.kill();
    };
  }, [journeySections.length]);

  // Smooth Rail Sliding Animation: Beads glide along the fixed arc track (Spacious 62° spacing matching Picture 2)
  useEffect(() => {
    // 1. Animate all 5 beads smoothly along the fixed arc track
    MILESTONE_BEADS.forEach((bead, i) => {
      const el = beadRefs.current[i];
      if (!el) return;

      const d = i - activeIdx; // Step distance relative to center active node
      const relativeAngle = d * ANGLE_SPACING_DEG;
      const targetPos = getRailPos(relativeAngle);
      const initPos = getRailPos(i * ANGLE_SPACING_DEG - 124);

      const targetX = targetPos.x - initPos.x;
      const targetY = targetPos.y - initPos.y;

      // 3-node window visibility: d = 0 (Center), d = -1 (Top), d = +1 (Bottom)
      let targetOpacity = 0;
      let targetBlur = 6;

      if (d === 0) {
        targetOpacity = 1;
        targetBlur = 0;
      } else if (Math.abs(d) === 1) {
        targetOpacity = 0.85;
        targetBlur = 0;
      } else {
        // Outside 3-node window: fade out and blur
        targetOpacity = 0;
        targetBlur = 6;
      }

      gsap.to(el, {
        x: targetX,
        y: targetY,
        opacity: targetOpacity,
        filter: `blur(${targetBlur}px)`,
        duration: 0.65,
        ease: "power2.out",
        overwrite: true,
      });
    });

    // 2. Delayed Story Text Transition
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;

      if (i === activeIdx) {
        gsap.fromTo(
          panel,
          { opacity: 0, x: 24, y: 10 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            display: "block",
            duration: 0.55,
            delay: 0.28,
            ease: "power3.out",
            overwrite: true,
          }
        );
      } else {
        gsap.to(panel, {
          opacity: 0,
          x: i < activeIdx ? -24 : 24,
          y: -6,
          display: "none",
          duration: 0.35,
          ease: "power2.in",
          overwrite: true,
        });
      }
    });
  }, [activeIdx]);

  return (
    <div ref={sectionRef} id="journey-heading" className={styles.pinnedTimelineSection}>
      <div className={styles.stickyViewport}>
        <div className={styles.storyContainer}>
          {/* Left Column: Fixed Arc Track SVG + Sliding Milestone Beads */}
          <div className={styles.svgCol}>
            <div className={styles.curveWrapper}>
              <svg
                className={styles.halfCircleSvg}
                viewBox="0 0 381 725"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 100% Fixed, Completely Stationary Warm Taupe Arc Track */}
                <path
                  d="M-195.609 517.095C-159.752 566.539 -107.86 602.021 -48.7752 617.495C10.3099 632.969 72.9326 627.477 128.422 601.955C183.912 576.434 228.836 532.461 255.54 477.53C282.243 422.599 289.074 360.108 274.868 300.705C260.663 241.303 226.299 188.663 177.633 151.756C128.967 114.849 69.0097 95.9586 7.97694 98.3026C-53.0559 100.647 -111.388 124.08 -157.08 164.611C-202.772 205.142 -232.997 260.262 -242.605 320.579L-201.553 327.118C-193.458 276.298 -167.992 229.858 -129.495 195.709C-90.9972 161.56 -41.8503 141.817 9.57224 139.842C60.9948 137.867 111.511 153.783 152.514 184.879C193.517 215.974 222.47 260.325 234.439 310.374C246.408 360.423 240.652 413.074 218.154 459.356C195.655 505.637 157.805 542.686 111.052 564.189C64.2999 585.692 11.5379 590.319 -38.2437 577.282C-88.0253 564.244 -131.746 534.349 -161.957 492.69L-195.609 517.095Z"
                  className={styles.arcPath}
                />

                {/* 5 Milestone Beads (Spacious 62° arc spacing matching Picture 2 exactly) */}
                {MILESTONE_BEADS.map((bead, i) => {
                  const isActive = i === activeIdx;
                  const initPos = getRailPos(i * ANGLE_SPACING_DEG - 124);

                  return (
                    <g
                      key={bead.id}
                      ref={(el) => { beadRefs.current[i] = el; }}
                      className={styles.beadGroup}
                      onClick={() => goToStep(i)}
                    >
                      <circle
                        cx={initPos.x}
                        cy={initPos.y}
                        r={44}
                        className={`${styles.milestoneCircle} ${
                          isActive ? styles.activeMilestoneCircle : ""
                        }`}
                      />
                      <text
                        x={initPos.x}
                        y={initPos.y + 1}
                        className={`${styles.milestoneText} ${
                          isActive ? styles.activeMilestoneText : ""
                        }`}
                      >
                        {bead.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Column: Story Content */}
          <div className={styles.contentCol}>
            {journeySections.map((sec, i) => (
              <div
                key={sec.id}
                ref={(el) => { panelsRef.current[i] = el; }}
                className={styles.storyContentBox}
                style={{
                  display: i === 0 ? "block" : "none",
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translate(0px, 0px)" : "translate(24px, 10px)",
                }}
              >
                {sec.isHeading ? (
                  <h2 className={styles.headingTitle}>
                    {sec.headingLine1}
                    <br />
                    {sec.headingLine2}
                  </h2>
                ) : (
                  <p className={styles.storyText}>{sec.text}</p>
                )}
              </div>
            ))}

            {/* Step Indicator Dots */}
            <div className={styles.stepIndicatorRow}>
              {journeySections.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`${styles.stepDot} ${
                    activeIdx === dotIdx ? styles.stepDotActive : ""
                  }`}
                  onClick={() => goToStep(dotIdx)}
                  aria-label={`Go to story ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
