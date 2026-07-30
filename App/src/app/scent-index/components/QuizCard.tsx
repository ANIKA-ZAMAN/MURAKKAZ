"use client";

import { ConsultationQuestion } from "../data/scentIndexData";
import styles from "./ScentIndex.module.css";

interface QuizCardProps {
  question: ConsultationQuestion;
  selectedAnswers: string | string[];
  onSelect: (option: string) => void;
  isTop: boolean;
  depth: number; // always 0 — kept for interface compatibility
  isLeaving: boolean;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
  showBackButton: boolean;
}

export default function QuizCard({
  question,
  selectedAnswers,
  onSelect,
  isTop,
  isLeaving,
  onNext,
  onBack,
  isNextDisabled,
  showBackButton,
}: QuizCardProps) {
  const isSelected = (option: string): boolean => {
    if (Array.isArray(selectedAnswers)) return selectedAnswers.includes(option);
    return selectedAnswers === option;
  };

  const isMulti = question.type === "multi";

  // The leaving card animates out absolutely over the incoming card
  const cardStyle: React.CSSProperties = isLeaving
    ? { zIndex: 20, pointerEvents: "none" }
    : {};

  return (
    <div
      className={`${styles.paperCard} ${isLeaving ? styles.leavingCard : ""}`}
      style={cardStyle}
    >
      <div
        className={`${styles.cardInnerContent} ${isTop && !isLeaving ? styles.cardContentEnter : ""}`}
        style={{ pointerEvents: isTop ? "auto" : "none" }}
      >
        {/* Header */}
        <div className={styles.cardHeader}>
          <span className={styles.cardQId}>Q.0{question.id}</span>
          <h2 className={styles.cardQuestion}>
            {question.question}
            <span className={styles.cardSelectionHint}>
              ({isMulti ? "select multiple" : "select one"})
            </span>
          </h2>
        </div>

        {/* Options */}
        <div className={(isMulti || question.options.length > 5) ? styles.multiGrid : styles.optionsList}>
          {question.options.map((option) => {
            const checked = isSelected(option);
            return (
              <button
                key={option}
                type="button"
                className={`${styles.optionBtn} ${checked ? styles.optionChecked : ""}`}
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

        {/* Navigation */}
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
