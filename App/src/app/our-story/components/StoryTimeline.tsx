"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "./StoryTimeline.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
 * SVG Arc geometry:
 * We draw a half-circle (right-side open) with radius 140, centre at (170,170).
 * The arc sweeps from -90° (top) clockwise to +90° (bottom), giving 180° visible.
 * Milestones are placed evenly along that 180°.
 * A "window" of 3 nodes is always visible; as the user scrolls,
 * the arc SVG rotates to keep the active triple centred.
 */

const SVG_SIZE = 340;
const CX = 170;
const CY = 170;
const R = 140;

/** Convert degrees to radians */
const deg2rad = (d: number) => (d * Math.PI) / 180;

/** Get point on circle at angle (degrees, 0 = top, CW positive) */
const pointOnCircle = (angleDeg: number) => {
  const rad = deg2rad(angleDeg - 90); // -90 so 0° is top
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
};

/**
 * Build an SVG arc path from startAngle to endAngle (degrees).
 * Uses the standard SVG arc command.
 */
const arcPath = (startDeg: number, endDeg: number) => {
  const start = pointOnCircle(startDeg);
  const end = pointOnCircle(endDeg);
  const sweep = endDeg - startDeg;
  const largeArc = Math.abs(sweep) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

export default function StoryTimeline() {
  const { timeline } = ourStoryData;
  const milestones = timeline.milestones;
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<SVGPathElement>(null);
  const arcGroupRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);

  // Total angular span for milestones: we use 270° (3/4 circle) so there's
  // room for the arc to rotate and always show 3 nodes in a ~120° window
  const TOTAL_SPAN = 240; // degrees used for distributing all milestones
  const NODE_SPACING = TOTAL_SPAN / (milestones.length - 1);

  // Each milestone's absolute angle on the circle (before rotation).
  // Node 0 is at 30°, rest spaced evenly.
  const BASE_START = 30;
  const nodeAngles = milestones.map((_, i) => BASE_START + i * NODE_SPACING);

  // The arc extends a bit before the first node and after the last
  const ARC_PAD = 15;
  const arcStartAngle = nodeAngles[0] - ARC_PAD;
  const arcEndAngle = nodeAngles[nodeAngles.length - 1] + ARC_PAD;

  // Full base arc path
  const baseD = arcPath(arcStartAngle, arcEndAngle);

  // For the progress arc, we calculate its length and use stroke-dasharray
  // to reveal it proportionally.
  const calcArcLength = useCallback(
    (fromDeg: number, toDeg: number) => {
      const sweep = Math.abs(toDeg - fromDeg);
      return (sweep / 360) * 2 * Math.PI * R;
    },
    []
  );

  const totalArcLength = calcArcLength(arcStartAngle, arcEndAngle);

  // Rotation offset: we rotate the whole arc group so that the active
  // milestone's node sits at the "display centre" position, which is
  // the 2nd node position (visually the middle of the 3-node window).
  // The display centre in viewport-angle terms is ~170° from top (≈ centre of the visible right-half arc).
  const DISPLAY_CENTRE_ANGLE = 20; // degrees from top where we want active node to land

  const getRotation = useCallback(
    (activeIdx: number) => {
      // We want nodeAngles[activeIdx] to appear at DISPLAY_CENTRE_ANGLE
      return DISPLAY_CENTRE_ANGLE - nodeAngles[activeIdx];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodeAngles]
  );

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Set up ScrollTrigger for each panel
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;

        ScrollTrigger.create({
          trigger: panel,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => activateMilestone(i),
          onEnterBack: () => activateMilestone(i),
        });
      });
    }, sectionRef.current);

    // Activate first milestone immediately
    activateMilestone(0);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activateMilestone = (idx: number) => {
    // 1. Rotate arc group
    if (arcGroupRef.current) {
      gsap.to(arcGroupRef.current, {
        rotation: getRotation(idx),
        transformOrigin: `${CX}px ${CY}px`,
        duration: 0.85,
        ease: "power3.out",
        overwrite: true,
      });
    }

    // 2. Animate progress arc
    if (progressRef.current) {
      const progressFraction = idx / (milestones.length - 1);
      const offset = totalArcLength * (1 - progressFraction);
      gsap.to(progressRef.current, {
        strokeDashoffset: offset,
        duration: 0.75,
        ease: "power2.out",
        overwrite: true,
      });
    }

    // 3. Update node active states
    nodeRefs.current.forEach((node, i) => {
      if (!node) return;
      if (i === idx) {
        node.classList.add(styles.nodeActive);
      } else {
        node.classList.remove(styles.nodeActive);
      }
    });

    // 4. Animate panel visibility
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      if (i === idx) {
        panel.classList.add(styles.panelVisible);
      } else {
        panel.classList.remove(styles.panelVisible);
      }
    });
  };

  return (
    <section ref={sectionRef} id="story-timeline" className={styles.timelineSection}>
      <div className={styles.timelineInner}>
        {/* ── Left: Pinned SVG Arc ── */}
        <div className={styles.timelineLeft}>
          <div className={styles.arcContainer}>
            <div className={styles.arcSvgWrap}>
              <svg
                className={styles.arcSvg}
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  ref={arcGroupRef}
                  style={{ transformOrigin: `${CX}px ${CY}px` }}
                >
                  {/* Base arc (warm gray track) */}
                  <path d={baseD} className={styles.arcBase} />

                  {/* Progress arc (vintage gold overlay) */}
                  <path
                    ref={progressRef}
                    d={baseD}
                    className={styles.arcProgress}
                    strokeDasharray={totalArcLength}
                    strokeDashoffset={totalArcLength}
                  />

                  {/* Milestone nodes */}
                  {milestones.map((ms, i) => {
                    const pos = pointOnCircle(nodeAngles[i]);
                    return (
                      <g
                        key={ms.id}
                        ref={(el) => { nodeRefs.current[i] = el; }}
                        className={`${styles.nodeGroup} ${i === 0 ? styles.nodeActive : ""}`}
                        onClick={() => {
                          activateMilestone(i);
                          panelRefs.current[i]?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }}
                      >
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={22}
                          className={styles.nodeOuterCircle}
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          className={styles.nodeText}
                        >
                          {ms.id}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* ── Right: Scrolling Content Panels ── */}
        <div className={styles.timelineRight}>
          {milestones.map((ms, i) => (
            <div
              key={ms.id}
              ref={(el) => { panelRefs.current[i] = el; }}
              className={`${styles.contentPanel} ${i === 0 ? styles.panelVisible : ""}`}
            >
              <div className={styles.panelContent}>
                {ms.heading ? (
                  <h2 className={styles.panelHeading}>{ms.heading}</h2>
                ) : (
                  <p className={styles.panelText}>{ms.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
