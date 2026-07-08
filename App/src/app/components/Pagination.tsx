"use client";

import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.prevBtn}
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <svg
          className={styles.chevron}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Previous
      </button>

      <div className={styles.pageNumbers}>
        <button
          className={`${styles.pageNum} ${currentPage === 1 ? styles.activePage : ""}`}
          onClick={() => onPageChange?.(1)}
        >
          1
        </button>
        <button
          className={`${styles.pageNum} ${currentPage === 2 ? styles.activePage : ""}`}
          onClick={() => onPageChange?.(2)}
        >
          2
        </button>
        <span className={styles.dots}>...</span>
        <button
          className={`${styles.pageNum} ${currentPage === 8 ? styles.activePage : ""}`}
          onClick={() => onPageChange?.(8)}
        >
          8
        </button>
        <button
          className={`${styles.pageNum} ${currentPage === 9 ? styles.activePage : ""}`}
          onClick={() => onPageChange?.(9)}
        >
          9
        </button>
        <button
          className={`${styles.pageNum} ${currentPage === 10 ? styles.activePage : ""}`}
          onClick={() => onPageChange?.(10)}
        >
          10
        </button>
      </div>

      <button
        className={styles.nextBtn}
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
        <svg
          className={styles.chevron}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
