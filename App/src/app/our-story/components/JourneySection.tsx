"use client";

import { useEffect, useRef, useState } from "react";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "../../page.module.css";

export default function JourneySection() {
  const { journey } = ourStoryData;
  const sectionRef = useRef<HTMLElement>(null);
  const [isSnapped, setIsSnapped] = useState(false);
  const [activeNode, setActiveNode] = useState("01");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSnapped(true);
        } else {
          setIsSnapped(false);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNodeClick = (nodeId: string, targetId: string) => {
    setActiveNode(nodeId);
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className={styles.journeySection} aria-labelledby="journey-heading">
      <div className={styles.journeyContainer}>
        {/* Wheel Arc Animation */}
        <div className={styles.wheelWrapper}>
          <div className={`${styles.wheelArc} ${isSnapped ? styles.wheelArcSnapped : ""}`}>
            {journey.nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                className={`${styles.wheelNode} ${styles[`node${node.id}`]} ${
                  activeNode === node.id ? styles.wheelNodeActive : ""
                }`}
                onClick={() => handleNodeClick(node.id, node.targetId)}
                aria-label={`Scroll to ${node.label}`}
                title={node.label}
              >
                {node.id}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header Row */}
        <div className={styles.journeyHeaderRow}>
          <div className={styles.journeyTitleWrap}>
            <h2 id="journey-heading" className={styles.sectionHeadingLarge}>
              {journey.headingLine1}<br />{journey.headingLine2}
            </h2>
          </div>

          <div className={styles.journeyIntroText}>
            <h3 className={styles.journeyIntroTitle}>
              {journey.introTitle}
            </h3>
            <p className={styles.journeyIntroDesc}>
              {journey.introDesc}
            </p>
          </div>
        </div>

        {/* Olfactory Journey Image Banner */}
        <div className={styles.journeyBigImageWrap}>
          <div className={styles.bigImagePlaceholder} aria-label="Olfactory blending process image">
            <div className={styles.mockPhotoOverlay}>
              <span>{journey.overlayText}</span>
            </div>
          </div>
        </div>

        {/* Journey Detail Paragraphs */}
        <div className={styles.journeyDetailsRow}>
          <div className={styles.journeyDetailsCol}>
            {journey.paragraphs.map((pText, index) => (
              <p key={index} className={styles.journeyDetailParagraph}>
                {pText}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
