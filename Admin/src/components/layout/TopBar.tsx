import React from 'react';
import styles from './TopBar.module.css';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string) => {
  const path = pathname.split('/')[1];
  if (!path) return 'Dashboard';
  return path.charAt(0).toUpperCase() + path.slice(1);
};

export const TopBar: React.FC = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <div className={styles.search}>
          <Search className={styles.searchIcon} size={16} />
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>
        <div className={styles.profile}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin User</span>
            <span className={styles.userRole}>ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
};
