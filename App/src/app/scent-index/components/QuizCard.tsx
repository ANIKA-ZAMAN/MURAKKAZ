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
}

// Fixed natural-looking rotations for stationery stack effect
const stackRotations = [-1.8, 1.2, -0.6, 2.1, -1.4, 0.8, -2.5];

export default function QuizCard({
  question,
  selectedAnswers,
  onSelect,
  isTop,
  depth,
  isLeaving,
}: QuizCardProps) {
  const isSelected = (option: string): boolean => {
    if (Array.isArray(selectedAnswers)) {
      return selectedAnswers.includes(option);
    }
    return selectedAnswers === option;
  };

  // Stack styles for fanned natural look
  let cardStyle: React.CSSProperties = {};

  if (isLeaving) {
    // Animate out: lift, rotate, slide lower-left, fade
    cardStyle = {
      transform: "translate(-115%, 115%) rotate(-12deg) scale(1.02)",
      opacity: 0,
      zIndex: 20,
      pointerEvents: "none",
      transition: "transform 0.85s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease-out",
    };
  } else if (depth === 0) {
    // Active top card
    cardStyle = {
      transform: "translate(0, 0) rotate(0deg)",
      opacity: 1,
      zIndex: 10,
      pointerEvents: "auto",
    };
  } else {
    // Background stack cards
    const rotation = stackRotations[question.id - 1] || 0;
    const vOffset = depth * 8; // vertical fan out
    const hOffset = depth * 4; // slight horizontal shift
    cardStyle = {
      transform: `translate(${hOffset}px, ${vOffset}px) rotate(${rotation}deg)`,
      opacity: Math.max(0.4, 1 - depth * 0.12),
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
                  {checked && <span className={styles.checkmark}>✓</span>}
                </div>
              ) : (
                <div className={styles.radioCircle}>
                  {checked && <div className={styles.radioDot} />}
                </div>
              )}
              <span className={styles.optionLabel}>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
