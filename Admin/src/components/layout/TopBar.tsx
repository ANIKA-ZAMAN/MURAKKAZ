import React from 'react';
import styles from './TopBar.module.css';
import { Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname: string) => {
  const path = pathname.split('/')[1];
  if (!path) return 'Dashboard';
  return path.charAt(0).toUpperCase() + path.slice(1);
};

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className={styles.topbar}>
      <div className={styles.headerLeft}>
        {onToggleSidebar && (
          <button className={styles.hamburgerBtn} onClick={onToggleSidebar} aria-label="Toggle navigation">
            <Menu size={22} />
          </button>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>

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
