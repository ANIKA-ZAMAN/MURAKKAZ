import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  subtitle
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.iconWrapper}>{icon}</div>
      </div>
      <h3 className={styles.value}>{value}</h3>
      <div className={styles.footer}>
        {change !== undefined && (
          <span
            className={`${styles.badge} ${
              isPositive ? styles.positive : isNegative ? styles.negative : styles.neutral
            }`}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
};
