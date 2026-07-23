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

// 180° Semi-circle rail geometry: Center at (0, 363.171), Radius = 220px
const XC = 0;
const YC = 363.171;
const R = 220;
const ANGLE_SPACING_DEG = 58; // Spacious angle matching Picture 2

/** Convert track angle (degrees, 0° = center reading position) to SVG (X, Y) coordinates */
const getRailPos = (angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round((XC + R * Math.cos(rad)) * 1000) / 1000,
    y: Math.round((YC + R * Math.sin(rad)) * 1000) / 1000,
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
      end: `+=${totalSteps * 100}%`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const step = Math.min(
          totalSteps - 1,
          Math.floor(self.progress * totalSteps * 0.999)
        );
        setActiveIdx((prev) => (prev !== step ? step : prev));
      },
    });

    return () => {
      trigger.kill();
    };
  }, [journeySections.length]);

  // Sequential Clean Text Transition: Outgoing text clears out COMPLETELY first before incoming text appears
  useEffect(() => {
    // 1. Animate all 5 beads smoothly along the 180° semi-circle arc
    MILESTONE_BEADS.forEach((bead, i) => {
      const el = beadRefs.current[i];
      if (!el) return;

      const d = i - activeIdx; // Step distance relative to center active node
      const relativeAngle = d * ANGLE_SPACING_DEG;
      const targetPos = getRailPos(relativeAngle);
      const initPos = getRailPos(i * ANGLE_SPACING_DEG - 116);

      const targetX = targetPos.x - initPos.x;
      const targetY = targetPos.y - initPos.y;

      let targetOpacity = 0;
      let targetBlur = 6;

      if (d === 0) {
        targetOpacity = 1;
        targetBlur = 0;
      } else if (Math.abs(d) === 1) {
        targetOpacity = 0.85;
        targetBlur = 0;
      } else {
        targetOpacity = 0;
        targetBlur = 6;
      }

      gsap.to(el, {
        x: targetX,
        y: targetY,
        opacity: targetOpacity,
        filter: `blur(${targetBlur}px)`,
        duration: 0.55,
        ease: "power2.out",
        overwrite: true,
      });
    });

    // 2. Sequential Clean Text Transition (Zero text overlap / ghosting)
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;

      const isCurrent = i === activeIdx;

      if (isCurrent) {
        // Incoming text: waits for outgoing text to clear out completely (0.2s), then smoothly fades & glides in
        gsap.fromTo(
          panel,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.35,
            delay: 0.2, // Clean delay so previous text is 100% gone
            ease: "power2.out",
            overwrite: true,
          }
        );
      } else {
        // Outgoing text: quickly & cleanly fades out with zero overlap
        gsap.to(panel, {
          opacity: 0,
          y: -10,
          pointerEvents: "none",
          duration: 0.18,
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
          {/* Left Column: 180° Semi-Circle Arc SVG (Flush at Page Edge) + Sliding Beads */}
          <div className={styles.svgCol}>
            <div className={styles.curveWrapper}>
              <svg
                className={styles.halfCircleSvg}
                viewBox="0 0 320 725"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 180° Perfect Semi-Circle Arc Path: Ends Flush at Left Edge (X = 0) */}
                <path
                  d="M 0 120.671
                     A 242.5 242.5 0 0 1 242.5 363.171
                     A 242.5 242.5 0 0 1 0 605.671
                     L 0 560.671
                     A 197.5 197.5 0 0 0 197.5 363.171
                     A 197.5 197.5 0 0 0 0 165.671
                     Z"
                  className={styles.arcPath}
                />

                {/* 5 Milestone Beads Sliding Along 180° Semi-Circle Rail */}
                {MILESTONE_BEADS.map((bead, i) => {
                  const isActive = i === activeIdx;
                  const initPos = getRailPos(i * ANGLE_SPACING_DEG - 116);

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
                        r={42}
                        className={`${styles.milestoneCircle} ${
                          isActive ? styles.activeMilestoneCircle : ""
                        }`}
                      />
                      {isActive && (
                        <path
                          d={`M ${initPos.x + 39} ${initPos.y - 11} L ${initPos.x + 58} ${initPos.y} L ${initPos.x + 39} ${initPos.y + 11} Z`}
                          className={styles.pointyPointer}
                        />
                      )}
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

          {/* Right Column: Story Content Grid Stack */}
          <div className={styles.contentCol}>
            {journeySections.map((sec, i) => (
              <div
                key={sec.id}
                ref={(el) => { panelsRef.current[i] = el; }}
                className={styles.storyContentBox}
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateY(0px)" : "translateY(12px)",
                  pointerEvents: i === 0 ? "auto" : "none",
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
