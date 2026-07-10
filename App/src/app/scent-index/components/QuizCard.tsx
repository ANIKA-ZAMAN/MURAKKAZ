"use client";

import { ConsultationQuestion } from "../data/scentIndexData";
import styles from "./ScentIndex.module.css";

interface QuizCardProps {
  question: ConsultationQuestion;
  selectedAnswers: string | string[];
  onSelect: (option: string) => void;
  isTop: boolean;
  depth: number; // 0 = top, 1 = first underneath, etc.
  isLeaving: boolean;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
  showBackButton: boolean;
}

// Organic offsets and rotations for realistic stationery fanned stack
const stackProps = [
  { x: 0, y: 0, rot: 0 },
  { x: 5, y: 6, rot: 1.4 },
  { x: -6, y: 13, rot: -2.0 },
  { x: 4, y: 20, rot: 0.8 },
  { x: -4, y: 27, rot: -1.5 },
  { x: 6, y: 34, rot: 2.2 },
  { x: -5, y: 41, rot: -2.8 }
];

// Dynamically calculates realistic soft shadows per stack layer
const getShadowForDepth = (d: number) => {
  if (d === 0) {
    return "0 25px 50px rgba(47, 9, 9, 0.05), 0 8px 18px rgba(47, 9, 9, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.8)";
  }
  const yOffset = d * 5 + 4;
  const blur = d * 8 + 12;
  const opacity = Math.max(0.01, 0.04 - d * 0.005);
  return `0 ${yOffset}px ${blur}px rgba(47, 9, 9, ${opacity}), 0 1px 3px rgba(47, 9, 9, 0.01)`;
};

export default function QuizCard({
  question,
  selectedAnswers,
  onSelect,
  isTop,
  depth,
  isLeaving,
  onNext,
  onBack,
  isNextDisabled,
  showBackButton,
}: QuizCardProps) {
  const isSelected = (option: string): boolean => {
    if (Array.isArray(selectedAnswers)) {
      return selectedAnswers.includes(option);
    }
    return selectedAnswers === option;
  };

  // Construct stack styling properties
  let cardStyle: React.CSSProperties = {};

  if (isLeaving) {
    cardStyle = {
      zIndex: 20,
      pointerEvents: "none",
    };
  } else if (depth === 0) {
    cardStyle = {
      transform: "translate(0, 0) rotate(0deg)",
      boxShadow: getShadowForDepth(0),
      filter: "brightness(1)",
      opacity: 1,
      zIndex: 10,
      pointerEvents: "auto",
    };
  } else {
    // Background stack cards fanning out organically
    const index = Math.min(depth, stackProps.length - 1);
    const props = stackProps[index];
    const brightness = Math.max(0.88, 1 - depth * 0.02); // Simulate ambient occlusion shadow

    cardStyle = {
      transform: `translate(${props.x}px, ${props.y}px) rotate(${props.rot}deg)`,
      boxShadow: getShadowForDepth(depth),
      filter: `brightness(${brightness})`,
      opacity: 1, // Keep cards opaque to look like real, thick paper sheets
      zIndex: 10 - depth,
      pointerEvents: "none",
    };
  }

  const isMulti = question.type === "multi";

  return (
    <div
      className={`${styles.paperCard} ${isTop ? styles.topCard : ""} ${isLeaving ? styles.leavingCard : ""}`}
      style={cardStyle}
    >
      {/* 
        Wrap contents and hide when the card is underneath the stack.
        This prevents option text overlapping at the bottom of the stack while 
        animating smoothly when cards slide up.
      */}
      <div 
        className={styles.cardInnerContent}
        style={{
          opacity: (isTop || isLeaving) ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: isTop ? "auto" : "none"
        }}
      >
        <div className={styles.cardHeader}>
          <span className={styles.cardQId}>Q.0{question.id}</span>
          <h2 className={styles.cardQuestion}>{question.question}</h2>
          {isMulti && <p className={styles.cardCaption}>Select all that apply</p>}
        </div>

        <div className={isMulti ? styles.multiGrid : styles.optionsList}>
          {question.options.map((option) => {
            const checked = isSelected(option);
            return (
              <button
                key={option}
                type="button"
                className={`${styles.optionBtn} ${checked ? styles.optionChecked : ""} ${isMulti ? styles.gridBtn : ""}`}
                onClick={() => isTop && onSelect(option)}
                disabled={!isTop}
              >
                {isMulti ? (
                  <div className={styles.checkboxBox}>
                    <span className={styles.checkmark}>✓</span>
                  </div>
                ) : (
                  <div className={styles.radioCircle}>
                    <div className={styles.radioDot} />
                  </div>
                )}
                <span className={styles.optionLabel}>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons inside the card */}
        <div className={styles.cardActionsRow}>
          {showBackButton ? (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnBack}`}
              onClick={onBack}
              disabled={!isTop}
            >
              Previous
            </button>
          ) : (
            <div style={{ width: "100px" }} />
          )}

          <button
            type="button"
            className={`${styles.btn} ${styles.btnNext}`}
            onClick={onNext}
            disabled={isNextDisabled || !isTop}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
