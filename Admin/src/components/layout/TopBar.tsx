import React, { useState, useEffect } from 'react';
import styles from './TopBar.module.css';
import { Search, Menu, Sun, Moon } from 'lucide-react';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('murakkaz_admin_theme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('murakkaz_admin_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className={styles.themeToggleBtn}
          title={theme === 'dark' ? 'Switch to White Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          <span className={styles.themeLabel}>{theme === 'dark' ? 'White' : 'Dark'}</span>
        </button>

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
