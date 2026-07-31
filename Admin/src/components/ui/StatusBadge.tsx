import React from 'react';
import styles from './StatusBadge.module.css';

type StatusType = 
  | 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  | 'ACTIVE' | 'DRAFT' | 'PENDING_APPROVAL';

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const className = `${styles.badge} ${styles[status.toLowerCase()] || ''}`;
  
  return (
    <span className={className}>
      {status.replace('_', ' ')}
    </span>
  );
};
